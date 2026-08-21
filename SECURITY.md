# Security Policy

## Supported scope

Security reports are welcome for the REPFLOW frontend repository. This includes client-side authentication handling, authorization-sensitive UI behavior, API request handling, dependency risks, accidental exposure of secrets, and unsafe data storage practices.

| Area                                                    | In scope                                                   |
| ------------------------------------------------------- | ---------------------------------------------------------- |
| Frontend authentication                                 | Yes                                                        |
| JWT handling and API request headers                    | Yes                                                        |
| Client-side access-control behavior                     | Yes                                                        |
| Dependency vulnerabilities                              | Yes                                                        |
| Accidental secrets or credentials in repository history | Yes                                                        |
| Companion backend source code                           | No; report in the backend repository or to its maintainers |

## Reporting a vulnerability

Please do **not** open a public GitHub issue for a suspected vulnerability. Instead, contact the repository owner privately through GitHub with the subject line `REPFLOW Security Report`.

A useful report includes a concise description, affected file or feature, reproduction steps or proof of concept, impact assessment, and suggested mitigation if available. Do not include real user data, active access tokens, passwords, or credentials in the report.

## Response process

The project owner will review a report, confirm the scope, assess impact, and coordinate remediation. Public disclosure should wait until a fix is available or the owner has agreed to a disclosure timeline.

## Security expectations for contributors

Never commit `.env.local`, access tokens, passwords, production credentials, private API URLs containing secrets, or personally identifiable user content. Keep authentication tokens in the approved client session mechanism, and route all network access through the infrastructure layer described in [docs/clean-architecture.md](docs/clean-architecture.md).
