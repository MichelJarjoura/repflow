## Summary

Describe the problem addressed and the outcome delivered.

## Scope

| Area                             | Change |
| -------------------------------- | ------ |
| Frontend feature or layer        |        |
| User-facing behavior             |        |
| Documentation                    |        |
| Backend dependency or limitation |        |

## Validation

- [ ] `npm run format`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] I manually tested the relevant user flow.
- [ ] I updated documentation where behavior, setup, or architecture changed.

## Visual evidence

Attach screenshots or a short recording for UI changes when practical.

## Architecture checklist

- [ ] Presentation code does not call endpoints, `fetch`, or browser storage directly.
- [ ] New API behavior is owned by an infrastructure repository and exposed through an application action or hook.
- [ ] Domain code remains free of framework and infrastructure imports.

## Reviewer notes

Call out migration risks, backend constraints, follow-up work, or decisions that need review.
