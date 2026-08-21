# Contributing to REPFLOW

Thank you for contributing to REPFLOW. The project is designed as a social fitness platform with a frontend architecture that prioritizes clear feature boundaries, predictable data flow, and safe integration with the companion backend.

## Development workflow

Begin from the latest `main` branch, create a focused branch, and keep every pull request limited to one cohesive objective. Do not modify the backend repository from this frontend repository.

| Step                 | Command or expectation       |
| -------------------- | ---------------------------- |
| Install dependencies | `npm ci`                     |
| Configure the app    | `cp .env.example .env.local` |
| Run locally          | `npm run dev`                |
| Format               | `npm run format`             |
| Lint                 | `npm run lint`               |
| Build                | `npm run build`              |
| Full validation      | `npm run check`              |

Use meaningful branch names such as `feat/community-search`, `fix/feed-media`, `refactor/profile-query`, or `docs/project-readme`.

## Architectural rules

REPFLOW uses a practical Clean Architecture model. These rules are required for all new implementation work.

| Layer                                        | Responsibility                                                                               | Allowed dependencies                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `domain/`                                    | Business entities, value types, and deterministic calculations.                              | TypeScript only.                                          |
| `application/` and `features/*/application/` | Query orchestration, use cases, actions, and repository ports.                               | Domain contracts and infrastructure implementations.      |
| `infrastructure/`                            | API paths, HTTP calls, backend DTO mapping, authentication storage, and browser persistence. | Domain and application contracts.                         |
| `features/*` presentation                    | React pages, components, dialogs, and styling.                                               | Feature application modules, domain types, and shared UI. |
| `app/`                                       | Providers, routing composition, runtime configuration, and global styles.                    | Application and presentation entry points.                |

> **Never add endpoint strings, `fetch` calls, localStorage access, backend DTOs, or HTTP error checks directly to a presentation component.** Add or extend an infrastructure repository, expose the behavior through a feature application action or hook, and then consume it in the UI.

## Pull-request expectations

A pull request should explain the user-facing change, identify validation performed, and call out any backend constraint or API dependency. Include screenshots or a short recording for visual changes when practical. Update documentation whenever setup, architecture, API expectations, or behavior changes.

| Pull-request section | What to include                                          |
| -------------------- | -------------------------------------------------------- |
| Summary              | The problem and the solution in plain language.          |
| Scope                | The frontend feature areas affected.                     |
| Validation           | Exact commands executed and any manual test scenario.    |
| Backend notes        | Required endpoint changes or known route limitations.    |
| Visual evidence      | Screenshot or recording for UI changes, when applicable. |

## Commit messages

Use concise Conventional Commit-style prefixes to make project history readable.

```text
feat: add athlete profile follow state
fix: handle unavailable user search
refactor: extract community application actions
docs: improve local setup guidance
chore: update repository automation
```

## Reporting bugs and proposing features

Use the repository issue templates. A high-quality report includes reproducible steps, expected behavior, actual behavior, environment details, and relevant screenshots or console output with sensitive values removed.

## Security and sensitive data

Never commit secrets, JWTs, `.env.local`, production URLs with embedded credentials, personal data, or customer content. Report security issues privately as described in [SECURITY.md](SECURITY.md).

## Code of conduct

All project participants are expected to follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Be constructive, respectful, and precise in technical discussions.
