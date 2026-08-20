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

type JsonRecord = Record<string, unknown>;
type ApiRequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

const tokenKey = "repflow_session_token";
const configuredApiUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
const defaultApiUrl = import.meta.env.DEV ? "http://localhost:5024/api" : "/api";
const apiBaseUrl = configuredApiUrl
  ? configuredApiUrl.endsWith("/api")
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : defaultApiUrl;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken() {
  return sessionStorage.getItem(tokenKey);
}

function storeToken(token: string | undefined) {
  if (token) sessionStorage.setItem(tokenKey, token);
}

export function clearSessionToken() {
  sessionStorage.removeItem(tokenKey);
}

function apiUrl(path: string) {
  return `${apiBaseUrl}/Auth/${path}`;
}

function asRecord(value: unknown): JsonRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function readString(record: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function extractToken(payload: unknown) {
  const root = asRecord(payload);
  const data = root ? (asRecord(root.data) ?? root) : null;
  return data ? readString(data, ["token", "accessToken", "access_token", "jwt"]) : undefined;
}

function extractUser(payload: unknown): AuthenticatedUser | null {
  const root = asRecord(payload);
  if (!root) return null;
  const nested = asRecord(root.user) ?? asRecord(root.data);
  const source = nested ?? root;
  const id = readString(source, ["id", "userId", "user_id", "sub"]);
  const email = readString(source, ["email", "emailAddress"]);
  const rawUsername = readString(source, ["username", "userName", "handle"]);
  const name =
    readString(source, ["name", "fullName", "displayName"]) ?? rawUsername ?? email?.split("@")[0];

  if (!id || !name) return null;

  return {
    id,
    name,
    username: rawUsername
      ? rawUsername.startsWith("@")
        ? rawUsername
        : `@${rawUsername}`
      : `@${name.replace(/\s+/g, "").toLowerCase()}`,
    email,
    avatar: readString(source, [
      "avatar",
      "avatarUrl",
      "profileImageUrl",
      "profilePictureUrl",
      "imageUrl",
    ]),
    emailVerified: source.emailVerified === true || source.isEmailVerified === true,
  };
}

function errorMessage(payload: unknown, fallback: string) {
  const root = asRecord(payload);
  if (!root) return fallback;
  const direct = readString(root, ["message", "error", "title", "detail"]);
  if (direct) return direct;
  const errors = asRecord(root.errors);
  if (errors) {
    const first = Object.values(errors)
      .flat()
      .find((value) => typeof value === "string");
    if (typeof first === "string") return first;
  }
  return fallback;
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: "omit",
    });
  } catch {
    throw new ApiError(
      "We could not reach the authentication service. Check VITE_API_BASE_URL and your network connection.",
      0,
    );
  }

  const text = await response.text();
  let payload: unknown = undefined;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      errorMessage(payload, "The request could not be completed."),
      response.status,
      payload,
    );
  }

  return payload as T;
}

export const authApi = {
  async register(input: RegisterInput) {
    const payload = await request<unknown>("register", {
      method: "POST",
      body: {
        name: input.name,
        fullName: input.name,
        username: input.username.replace(/^@/, ""),
        userName: input.username.replace(/^@/, ""),
        email: input.email,
        password: input.password,
      },
    });
    storeToken(extractToken(payload));
    return extractUser(payload);
  },

  async login(input: LoginInput) {
    const payload = await request<unknown>("login", { method: "POST", body: input });
    storeToken(extractToken(payload));
    const user = extractUser(payload);
    return user ?? authApi.me();
  },

  async me() {
    const payload = await request<unknown>("me");
    const user = extractUser(payload);
    if (!user)
      throw new ApiError(
        "The authentication service returned an unexpected user profile.",
        500,
        payload,
      );
    return user;
  },

  async verifyEmail(input: VerifyEmailInput) {
    return request<unknown>("verify-email", { method: "POST", body: input });
  },

  async forgotPassword(email: string) {
    return request<unknown>("forgot-password", { method: "POST", body: { email } });
  },

  async resetPassword(input: ResetPasswordInput) {
    return request<unknown>("reset-password", {
      method: "POST",
      body: {
        email: input.email,
        token: input.token,
        password: input.password,
        newPassword: input.password,
      },
    });
  },

  async testProtected() {
    return request<unknown>("test-protected");
  },

  async logout() {
    try {
      await request<unknown>("logout", { method: "POST" });
    } finally {
      clearSessionToken();
    }
  },
};
