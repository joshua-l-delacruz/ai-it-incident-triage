# Contributing

Focused fixes, deterministic test cases, documentation corrections and safe workflow improvements are welcome.

## Reports

Include reproducible steps, expected behavior, actual behavior and sanitized evidence. Use fictional incidents only. Never post credentials, access tokens, personal information, employer or customer data, private ticket text, tenant URLs or production logs.

Security issues must be reported privately according to [SECURITY.md](SECURITY.md).

## Pull requests

- Keep each change narrow and explain how it was verified.
- Run `npm run check` before submitting.
- Preserve the deterministic priority floor, visible `ai_status` and human-review gates.
- Do not add real credentials, tenant-specific identifiers or integrations that appear configured when they are only examples.
- Document any change to data handling, external model use, retention or escalation behavior.
