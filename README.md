# REPFLOW

> **A social fitness platform for athletes who want to log meaningful training, share progress, discover training partners, and build momentum together.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-MIT-16A34A)](LICENSE)

REPFLOW is a full-stack social fitness experience built around a simple idea: training progress is more motivating when it is visible, measurable, and shared with the right people. Athletes can log workouts, publish progress posts, join communities, take part in collective challenges, discover other members, and follow the people who inspire them.

The repository contains the **React frontend**. It is designed to work with the companion ASP.NET Core and MongoDB backend while keeping the frontend independently maintainable through a Clean Architecture approach.

## Contents

| Section                                       | Description                                                    |
| --------------------------------------------- | -------------------------------------------------------------- |
| [Product capabilities](#product-capabilities) | What athletes can do in REPFLOW today.                         |
| [Technology](#technology)                     | Frontend stack and engineering tools.                          |
| [Architecture](#architecture)                 | Clean Architecture layers and dependency rules.                |
| [Getting started](#getting-started)           | Local setup, environment variables, and scripts.               |
| [Backend integration](#backend-integration)   | API assumptions and local development connection.              |
| [Repository standards](#repository-standards) | Quality checks, contribution workflow, and security reporting. |

## Product capabilities

REPFLOW combines a social feed with practical training workflows. The product intentionally keeps challenges inside communities rather than isolating them in a separate destination.

| Area           | Current capability                                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication | JWT-backed registration, sign in, sign out, verification, password-reset flows, and session restoration.                                                             |
| Feed           | Global post discovery, media publishing, likes, focused comment conversations, real author identities, and author-owned post deletion.                               |
| Workouts       | A local-first quick logger with visible field labels, optional feed sharing, history deletion, derived personal records, volume, streak, and consistency statistics. |
| Communities    | Community discovery, creation, membership, community feeds, collective challenges, contribution tracking, and creator-only moderation controls.                      |
| Explore        | Exact username discovery, athlete profile navigation, follow state, real publisher identities, and readable post previews.                                           |
| Profiles       | Authenticated profile data, published posts, athlete statistics, local training summaries, and public athlete profile views.                                         |

> **Local-first workouts:** the active backend may not expose session and exercise routes in every environment. Workout logs therefore remain useful immediately by persisting per-user in the browser, while all derived statistics update instantly.

## Technology

The frontend is implemented as a TypeScript-first web application with an API-backed social domain and an explicit separation between product features and infrastructure.

| Concern                     | Technology                                                   |
| --------------------------- | ------------------------------------------------------------ |
| UI                          | React 19, TypeScript, Tailwind CSS 4, Radix UI, Lucide icons |
| Routing and server state    | TanStack Router, TanStack Start, TanStack Query              |
| Build and local development | Vite 7, Node.js 22                                           |
| API integration             | Fetch-based JSON client with bearer-token authentication     |
| Code quality                | ESLint, Prettier, TypeScript, GitHub Actions                 |
| Backend companion           | ASP.NET Core, MongoDB, JWT authentication                    |

## Architecture

The frontend follows a practical Clean Architecture model. The goal is to keep business rules and UI behavior stable while allowing the backend, browser persistence, or presentation layer to evolve independently.

```text
src/
├── app/                 # Composition: auth provider, configuration, runtime, styles
├── domain/              # Framework-independent business entities and calculations
├── application/         # Repository ports and application-wide contracts
├── infrastructure/      # HTTP client, repositories, DTO mapping, local persistence
├── features/            # Feature application hooks and presentation components
└── shared/              # Reusable layout and UI primitives
```

> **Dependency rule:** presentation components call feature application hooks and actions. Application code coordinates use cases. Infrastructure owns endpoint paths, browser storage, and API data-transfer shapes. Domain code imports no React, HTTP, storage, or UI libraries.

For a detailed migration map and maintenance rules, see [the Clean Architecture guide](docs/clean-architecture.md).

## Getting started

### Prerequisites

| Requirement | Recommended version                                                                 |
| ----------- | ----------------------------------------------------------------------------------- |
| Node.js     | 22 LTS or newer                                                                     |
| npm         | 10 or newer                                                                         |
| Backend API | Optional for UI work; required for account, social, community, and follow workflows |

### Install and run

```bash
# Clone the repository
 git clone https://github.com/MichelJarjoura/repflow.git
 cd repflow

# Install exact dependencies
 npm ci

# Configure the local API target
 cp .env.example .env.local

# Start the development server
 npm run dev
```

The frontend is served on `http://localhost:8080` by default. When working against the companion backend locally, run it separately on `http://localhost:5024`.

### Environment configuration

Copy `.env.example` into `.env.local` and select the API strategy that matches your environment.

| Variable                                | Purpose                                                                       | Example                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `VITE_API_PROXY_TARGET`                 | Vite development proxy target.                                                | `http://localhost:5024`                                    |
| `VITE_API_BASE_URL`                     | Explicit backend origin or API root; use when not relying on the local proxy. | `https://api.example.com` or `https://api.example.com/api` |
| `VITE_ENABLE_OPTIONAL_BACKEND_FEATURES` | Enables routes that are not exposed in all backend environments.              | `false`                                                    |

```dotenv
# .env.local
VITE_API_PROXY_TARGET=http://localhost:5024
VITE_ENABLE_OPTIONAL_BACKEND_FEATURES=false
```

## Backend integration

REPFLOW uses header-based JWT authentication. After a successful sign in, the frontend stores the returned access token in `sessionStorage` and sends it as a bearer token on protected requests.

| Workflow        | Primary endpoint          |
| --------------- | ------------------------- |
| Register        | `POST /api/Auth/register` |
| Sign in         | `POST /api/Auth/login`    |
| Sign out        | `POST /api/Auth/logout`   |
| Current athlete | `GET /api/Users/{id}`     |
| Global feed     | `GET /api/Posts`          |
| Create post     | `POST /api/Posts`         |
| Communities     | `/api/Community/*`        |
| Challenges      | `/api/Challenge/*`        |
| Follows         | `/api/Follows/*`          |

The frontend accommodates known backend route gaps by gating optional experiences and retaining local workout functionality. Backend behavior and frontend compatibility decisions are documented in [backend-readonly-findings.md](docs/backend-readonly-findings.md).

## Repository standards

Every production change should pass formatting, linting, and a production build before review.

```bash
# Format source files
npm run format

# Run lint rules
npm run lint

# Produce a production build
npm run build

# Run the full local verification sequence
npm run check
```

| Document                                         | Purpose                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)               | Local workflow, branch convention, pull-request expectations, and architecture rules. |
| [SECURITY.md](SECURITY.md)                       | Responsible process for reporting security issues.                                    |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)         | Community expectations for contributors and participants.                             |
| [GitHub issue templates](.github/ISSUE_TEMPLATE) | Structured bug and feature reporting.                                                 |

## Roadmap

The project is actively evolving. Near-term work is focused on reliable backend workout synchronization, broader athlete discovery once a directory endpoint exists, richer community moderation, and automated end-to-end test coverage.

## Contributing

Contributions and feedback are welcome. Please begin with [CONTRIBUTING.md](CONTRIBUTING.md), keep changes focused, and follow the architectural dependency rules described above.

## Security

Please do **not** report vulnerabilities through public issues. Follow the private reporting process in [SECURITY.md](SECURITY.md).

## License

This project is licensed under the [MIT License](LICENSE).

---

Built with a focus on consistent training, meaningful social accountability, and maintainable engineering.
