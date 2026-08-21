# REPFLOW Frontend Clean Architecture

## Purpose

This document defines the enforced architectural direction for the REPFLOW frontend. The objective is to preserve the existing React experience while separating **business concepts**, **application orchestration**, **external API mechanics**, and **visual presentation**. The backend remains a read-only external dependency.

> **Dependency rule:** source code may depend inward only. Presentation depends on application contracts; application depends on domain contracts; infrastructure implements application ports and may depend on HTTP details. Domain code must not import React, React Query, browser storage, or HTTP code.

| Layer                      | Responsibility                                                                                           | May depend on                                  | Must not depend on                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| `domain/`                  | Stable business entities and value types such as athletes, posts, communities, challenges, and workouts. | TypeScript only.                               | React, React Query, HTTP, localStorage, UI components. |
| `application/`             | Use-case contracts, query keys, feature actions, and state orchestration.                                | `domain/`, repository ports.                   | HTTP request construction, visual markup.              |
| `infrastructure/`          | HTTP transport, API DTO mapping, repository implementations, browser persistence.                        | `domain/`, `application/` ports, browser APIs. | Presentation components.                               |
| `features/*/presentation/` | Routes, pages, components, dialogs, and Tailwind styles.                                                 | Application hooks/use cases and domain types.  | Raw HTTP transport and backend DTOs.                   |
| `app/`                     | Composition root: routing, providers, global navigation, and application startup.                        | Presentation entry points.                     | Feature-internal implementation details.               |

## Target module map

```text
src/
├── app/                         # Composition root and application-wide configuration
├── domain/                      # Framework-independent business types
│   ├── athlete/
│   ├── community/
│   ├── social/
│   └── workout/
├── application/                 # Repository ports and cross-feature use-case contracts
│   ├── ports/
│   └── query-keys/
├── infrastructure/              # HTTP and browser-local implementations
│   ├── http/
│   ├── repositories/
│   └── persistence/
├── features/                    # Feature-scoped application and presentation code
│   ├── auth/
│   ├── communities/
│   ├── explore/
│   ├── feed/
│   ├── profile/
│   └── workouts/
└── shared/                      # Reusable UI primitives and layout only
```

## Migration decisions

The previous `core/api/repflow.ts` file combines unrelated backend DTOs and endpoint calls. It is being replaced by focused infrastructure repositories. Each repository maps backend response shapes into domain entities before data reaches a component. This prevents API naming, optional fields, and endpoint paths from leaking into presentation code.

| Previous coupling                                         | Replacement boundary                                                          | Presentation-facing result                                     |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `core/api/client.ts` used directly by UI layers.          | `infrastructure/http/apiClient.ts`.                                           | UI handles application errors, not request construction.       |
| `core/api/repflow.ts` contains all feature APIs and DTOs. | Focused repositories for athletes, posts, communities, follows, and training. | UI receives domain entities instead of backend-prefixed types. |
| Feature components call API functions directly.           | Feature application hooks and actions.                                        | Components only render state and invoke named use cases.       |
| Local workout logic mixes persistence and calculations.   | Workout domain calculations plus local-workout persistence adapter.           | Statistics remain deterministic and reusable.                  |

## Acceptance criteria

The refactor is complete when the following conditions are true. The build must pass, no user-facing feature is removed, presentation components no longer import raw HTTP transport, API paths are owned by infrastructure repositories, and the architecture document remains aligned with the codebase.

| Verification                                      | Expected outcome                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Typecheck, lint, and production build             | Pass without warnings introduced by the refactor.                                    |
| Feed, Explore, Communities, Profile, and Workouts | Preserve existing visible behavior.                                                  |
| Domain modules                                    | Contain no React, browser, or endpoint imports.                                      |
| Infrastructure repositories                       | Contain backend DTOs, mapping, and endpoint calls.                                   |
| Presentation modules                              | Depend on feature application modules or domain types rather than raw API transport. |

## Incremental migration policy

The codebase is migrated in behavior-preserving vertical slices. A complete rewrite would add unnecessary risk to working authentication, community moderation, workout statistics, social posts, and Explore navigation. Each slice is validated before the next begins, and the old path is removed only after all consumers have moved to its new architectural boundary.

## Implemented migration map

The migration has been completed as a vertical-slice refactor rather than a behavior-changing rewrite. Existing API routes, JWT behavior, React Query keys, local workout data, and user-facing flows remain intact; only ownership of those concerns has moved to the correct layer.

| Area | Domain | Application | Infrastructure | Presentation result |
|---|---|---|---|---|
| Authentication | `domain/athlete/authenticatedUser.ts` | Global session composition in `app/auth/`. | `infrastructure/repositories/authRepository.ts`. | Auth modal, navigation, and route guards consume the app auth context. |
| Feed and comments | `domain/social/social.ts`. | `features/feed/application/useFeed.ts` and `postActions.ts`. | `socialRepository.ts`. | Feed, composer, comment dialog, deletion, and author resolution do not import transport modules. |
| Communities | `domain/community/community.ts`. | `features/communities/application/`. | `communityRepository.ts`. | Community discovery, posts, challenges, and moderation use application hooks. |
| Profiles and follows | `domain/athlete/athlete.ts`. | `features/profile/application/`. | `athleteRepository.ts` and `trainingRepository.ts`. | Profile pages, athlete profiles, and follow controls use profile application actions. |
| Workouts | `domain/workout/`. | `features/workouts/application/`. | `localWorkoutStore.ts`. | Logger, history deletion, calendar, and statistics use the workout application hook. |
| Explore | Athlete and social domain contracts. | `features/explore/application/useExploreAthletes.ts`. | Athlete repository. | Search, publisher identity, and profile navigation do not reach into HTTP code. |

## Verified dependency checks

The following checks are part of the final refactor verification. Feature presentation files have no direct imports from `infrastructure/`; legacy `core/api` and `core/auth` paths have been removed; and domain modules have no imports of React, TanStack Query, `fetch`, or `localStorage`. The production build, linting, formatting, and whitespace validation must pass before changes are merged.

> **Maintenance rule:** add a new backend endpoint in an infrastructure repository first, expose it through a feature application action or hook second, and only then consume that action or hook from a route or component. Do not introduce endpoint strings or HTTP errors into presentation code.
