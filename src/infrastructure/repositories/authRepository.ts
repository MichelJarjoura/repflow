import type {
  AuthenticatedUser,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCommand,
  VerifyEmailCommand,
} from "@/domain/athlete/authenticatedUser";
import {
  ApiError,
  apiRequest,
  asRecord,
  clearSessionToken,
  getSessionToken,
  readString,
  storeSessionToken,
} from "@/infrastructure/http/apiClient";

type JwtClaims = Record<string, unknown>;
type AthleteDto = { id?: string; username?: string; email?: string; profilePictureUrl?: string };

function decodeToken(token: string): JwtClaims | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    return (
      asRecord(
        JSON.parse(
          decodeURIComponent(
            Array.from(decoded)
              .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`)
              .join(""),
          ),
        ),
      ) ?? null
    );
  } catch {
    return null;
  }
}

function claim(claims: JwtClaims, keys: string[]) {
  for (const key of keys) {
    const value = claims[key];
    if (typeof value === "string" && value) return value;
  }
  return Object.entries(claims).find(
    ([key, value]) =>
      typeof value === "string" &&
      keys.some((candidate) => key.toLowerCase().endsWith(candidate.toLowerCase())),
  )?.[1] as string | undefined;
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

function userFromBackend(user: AthleteDto, fallback: AuthenticatedUser): AuthenticatedUser {
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
  return root
    ? readString(root, ["token", "Token", "accessToken", "access_token", "jwt"])
    : undefined;
}

export const authRepository = {
  async register(input: RegisterCredentials) {
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
  async login(input: LoginCredentials) {
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
      return userFromBackend(await apiRequest<AthleteDto>(`Users/${tokenUser.id}`), tokenUser);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 404))
        return tokenUser;
      throw error;
    }
  },
  verifyEmail(input: VerifyEmailCommand) {
    return apiRequest<unknown>("Auth/verify-email", {
      method: "POST",
      body: { token: input.token },
    });
  },
  forgotPassword(email: string) {
    return apiRequest<unknown>("Auth/forgot-password", { method: "POST", body: { email } });
  },
  resetPassword(input: ResetPasswordCommand) {
    return apiRequest<unknown>("Auth/reset-password", {
      method: "POST",
      body: { token: input.token, newPassword: input.password },
    });
  },
  testProtected: () => apiRequest<unknown>("Auth/test-protected"),
  async logout() {
    try {
      await apiRequest<unknown>("Auth/logout", { method: "POST" });
    } finally {
      clearSessionToken();
    }
  },
};

export { ApiError, clearSessionToken };
