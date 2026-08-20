import {
  ApiError,
  apiRequest,
  asRecord,
  clearSessionToken,
  getSessionToken,
  readString,
  storeSessionToken,
} from "./client";

export type AuthenticatedUser = {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  emailVerified?: boolean;
};

export type RegisterInput = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type VerifyEmailInput = {
  email: string;
  token: string;
};

export type ResetPasswordInput = {
  email: string;
  token: string;
  password: string;
};

type JwtClaims = Record<string, unknown>;

type BackendUser = {
  id?: string;
  username?: string;
  email?: string;
  profilePictureUrl?: string;
};

function decodeToken(token: string): JwtClaims | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    const json = decodeURIComponent(
      Array.from(decoded)
        .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    const claims = JSON.parse(json);
    return asRecord(claims) ?? null;
  } catch {
    return null;
  }
}

function claim(claims: JwtClaims, keys: string[]) {
  for (const key of keys) {
    const value = claims[key];
    if (typeof value === "string" && value) return value;
  }
  return Object.entries(claims).find(([key, value]) => {
    const normalized = key.toLowerCase();
    return (
      typeof value === "string" &&
      keys.some((candidate) => normalized.endsWith(candidate.toLowerCase()))
    );
  })?.[1] as string | undefined;
}

function userFromToken(token: string): AuthenticatedUser | null {
  const claims = decodeToken(token);
  if (!claims) return null;
  const id = claim(claims, ["sub", "nameidentifier"]);
  const email = claim(claims, ["email"]);
  const username = claim(claims, ["unique_name", "name"]);
  const name = username ?? email?.split("@")[0];
  if (!id || !name) return null;

  return {
    id,
    name,
    username: username?.startsWith("@") ? username : `@${username ?? name}`,
    email,
    emailVerified: true,
  };
}

function userFromBackend(user: BackendUser, fallback: AuthenticatedUser): AuthenticatedUser {
  const username = user.username ?? fallback.username.replace(/^@/, "");
  return {
    id: user.id ?? fallback.id,
    name: username,
    username: username.startsWith("@") ? username : `@${username}`,
    email: user.email ?? fallback.email,
    avatar: user.profilePictureUrl,
    emailVerified: true,
  };
}

function extractToken(payload: unknown) {
  const root = asRecord(payload);
  if (!root) return undefined;
  return readString(root, ["token", "Token", "accessToken", "access_token", "jwt"]);
}

export { ApiError, clearSessionToken };

export const authApi = {
  async register(input: RegisterInput) {
    await apiRequest<unknown>("Auth/register", {
      method: "POST",
      body: {
        username: input.username.replace(/^@/, ""),
        email: input.email,
        password: input.password,
      },
    });
    return null;
  },

  async login(input: LoginInput) {
    const payload = await apiRequest<unknown>("Auth/login", { method: "POST", body: input });
    const token = extractToken(payload);
    if (!token)
      throw new ApiError("The backend did not return an authentication token.", 500, payload);
    storeSessionToken(token);
    const user = userFromToken(token);
    if (!user)
      throw new ApiError("The authentication token did not contain a valid user identity.", 500);
    return user;
  },

  async me(): Promise<AuthenticatedUser | null> {
    const token = getSessionToken();
    if (!token) return null;
    const tokenUser = userFromToken(token);
    if (!tokenUser) {
      clearSessionToken();
      return null;
    }

    try {
      const profile = await apiRequest<BackendUser>(`Users/${tokenUser.id}`);
      return userFromBackend(profile, tokenUser);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 404))
        return tokenUser;
      throw error;
    }
  },

  async verifyEmail(input: VerifyEmailInput) {
    return apiRequest<unknown>("Auth/verify-email", {
      method: "POST",
      body: { token: input.token },
    });
  },

  async forgotPassword(email: string) {
    return apiRequest<unknown>("Auth/forgot-password", { method: "POST", body: { email } });
  },

  async resetPassword(input: ResetPasswordInput) {
    return apiRequest<unknown>("Auth/reset-password", {
      method: "POST",
      body: { token: input.token, newPassword: input.password },
    });
  },

  async testProtected() {
    return apiRequest<unknown>("Auth/test-protected");
  },

  async logout() {
    try {
      await apiRequest<unknown>("Auth/logout", { method: "POST" });
    } finally {
      clearSessionToken();
    }
  },
};
