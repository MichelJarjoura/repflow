export type JsonRecord = Record<string, unknown>;
export type ApiRequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

const tokenKey = "repflow_session_token";
const configuredApiUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
const apiBaseUrl = configuredApiUrl
  ? configuredApiUrl.endsWith("/api")
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : "/api";

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

export function getSessionToken() {
  return sessionStorage.getItem(tokenKey);
}

export function storeSessionToken(token: string | undefined) {
  if (token) sessionStorage.setItem(tokenKey, token);
}

export function clearSessionToken() {
  sessionStorage.removeItem(tokenKey);
}

export function asRecord(value: unknown): JsonRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

export function readString(record: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

export function messageFromPayload(payload: unknown, fallback: string) {
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

function getUrl(path: string) {
  return `${apiBaseUrl}/${path.replace(/^\//, "")}`;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getSessionToken();
  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(getUrl(path), {
      ...options,
      headers,
      body:
        options.body === undefined
          ? undefined
          : options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body),
      credentials: "omit",
    });
  } catch {
    throw new ApiError(
      "The backend API could not be reached. Set VITE_API_BASE_URL or run the local API proxy.",
      0,
    );
  }

  const text = await response.text();
  let payload: unknown;
  try {
    payload = text ? JSON.parse(text) : undefined;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    throw new ApiError(
      messageFromPayload(payload, "The request could not be completed."),
      response.status,
      payload,
    );
  }
  return payload as T;
}
