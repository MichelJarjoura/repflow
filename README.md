# REPFLOW

REPFLOW is a fitness social experience for logging progress, sharing training, and organizing around communities. The current frontend includes a community hub, collective challenges, community posts, and API-backed authentication flows.

## Run locally

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set `VITE_API_BASE_URL` to the backend origin or API root. Both values below are valid:

```dotenv
VITE_API_BASE_URL=https://api.example.com
# or
VITE_API_BASE_URL=https://api.example.com/api
```

The frontend will call `/api/Auth/*` when the value is an origin and will not duplicate `/api` when it is already included.

## Authentication integration

The authentication client lives in `src/core/api/auth.ts`. It uses a bearer token returned by the JSON login/register response and sends that token in the `Authorization` header for protected requests. A returned token is stored only in `sessionStorage`, not persistent browser storage.

| Backend endpoint                 | Frontend flow                                   | Request body expected by the frontend                     |
| -------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| `POST /api/Auth/register`        | Create account                                  | `{ name, fullName, username, userName, email, password }` |
| `GET /api/Auth/me`               | Restore/verify session                          | No body                                                   |
| `POST /api/Auth/login`           | Sign in                                         | `{ email, password }`                                     |
| `POST /api/Auth/verify-email`    | Verify email                                    | `{ email, token }`                                        |
| `POST /api/Auth/forgot-password` | Request password reset                          | `{ email }`                                               |
| `POST /api/Auth/reset-password`  | Set a new password                              | `{ email, token, password, newPassword }`                 |
| `GET /api/Auth/test-protected`   | Available in the API client for session testing | No body                                                   |
| `POST /api/Auth/logout`          | End session                                     | No body                                                   |

The client accepts these common response shapes:

```json
{ "token": "...", "user": { "id": "...", "name": "...", "username": "..." } }
```

```json
{ "accessToken": "...", "data": { "id": "...", "fullName": "...", "userName": "..." } }
```

The backend is configured for header-based JWT authentication. For cross-origin deployment, add the exact frontend origin to `Cors:AllowedOrigins` and allow the `Authorization` request header.

> The exact server response DTO was not provided. The client normalizes common `user`, `data`, `token`, and `accessToken` response fields. If the backend uses a different schema, adjust only the normalization functions in `src/core/api/auth.ts`.

## Communities

The **Communities** tab replaces a standalone challenges destination. It supports discovery, creation, membership, community feeds, group challenges, joining challenges, and adding challenge contributions. Community data is intentionally persisted in browser storage while community API endpoints are not yet specified. Authentication, however, is no longer mocked and is driven by the backend API above.

Community state is now accessed through React Query in `src/features/communities/communityQueries.ts`. When community endpoints are ready, replace only that temporary browser-storage adapter with API calls; the existing query keys and mutations will keep the page API unchanged. The UI data model already separates communities, posts, challenges, memberships, and contributions.

## Quality checks

```bash
npm run lint
npm run build
```
