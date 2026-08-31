# Security

This repository contains sanitized demonstration data only. Never submit real passwords, tokens, personal data, employer data, customer data, or confidential incident details to the example webhook.

- Store API keys in the n8n credential manager, not in workflow JSON or `.env` files committed to Git.
- Protect production webhooks with authentication, TLS, rate limits, and restricted network access.
- Treat AI output as a recommendation. A human remains responsible for access changes, account actions, severity declarations, and escalation decisions.
- Review data-retention and approved-AI policies before sending incident text to an external model.

Report vulnerabilities privately through GitHub's security-advisory feature after the repository is published.

