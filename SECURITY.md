# Security policy

## Supported version

Security fixes are applied to the current `main` branch.

This repository contains sanitized demonstration data only. Never submit real passwords, tokens, personal data, employer data, customer data, or confidential incident details to the example webhook.

- Store API keys in the n8n credential manager, not in workflow JSON or `.env` files committed to Git.
- Protect production webhooks with authentication, TLS, rate limits, and restricted network access.
- Treat AI output as a recommendation. A human remains responsible for access changes, account actions, severity declarations, and escalation decisions.
- Review data-retention and approved-AI policies before sending incident text to an external model.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting feature under **Security → Advisories → Report a vulnerability**. Do not open a public issue containing exploitable details or sensitive data.

Useful reports include validation bypasses, unsafe workflow exports, prompt-injection paths that escape the documented advisory boundary, secret exposure and cases where AI output can override the deterministic priority floor or required human review.

