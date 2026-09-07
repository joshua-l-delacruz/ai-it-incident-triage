# AI-Assisted IT Incident Triage

[![CI](https://github.com/joshua-l-delacruz/ai-it-incident-triage/actions/workflows/ci.yml/badge.svg)](https://github.com/joshua-l-delacruz/ai-it-incident-triage/actions/workflows/ci.yml)

An n8n portfolio project that turns a sanitized incident submission into a structured, explainable triage recommendation. It combines a deterministic safety baseline with optional AI enrichment while keeping priority and escalation decisions reviewable by a person.

**[Try the deterministic browser demo](https://joshuadelacruz.solutions/incident-triage/demo/)** · **[Read the case study](https://joshuadelacruz.solutions/incident-triage/)**

![AI-assisted incident triage workflow](https://joshuadelacruz.solutions/assets/images/ai-incident-triage-workflow.svg)

> **Project status:** the repository, workflows, tests and documentation are complete. No live n8n instance, OpenAI credential, ticketing platform, spreadsheet, email, Teams or Slack integration is included or claimed.

## What it demonstrates

- Workflow analysis: intake, validation, classification, prioritization and routing
- IT operations knowledge: identity, endpoint, network, security and application incidents
- Responsible AI: constrained output, deterministic fallback and human-review gates
- Operational documentation: data contract, architecture, setup guide and test cases
- Secret hygiene: credentials remain in n8n's credential manager and out of source control

## Workflow modes

| Workflow | Runs without external credentials | Purpose |
| --- | --- | --- |
| `workflows/deterministic-baseline.json` | Yes | Importable rule-based triage baseline and webhook response |
| `workflows/ai-assisted-triage.json` | No | Adds OpenAI JSON enrichment; requires an n8n OpenAI credential |

The baseline is intentionally useful on its own. The AI-assisted version does not silently pretend an AI call succeeded: its output includes `ai_status`, and setup is required before activation.

## Quick start

1. Import `workflows/deterministic-baseline.json` into n8n.
2. Open the Webhook node and use its n8n test URL.
3. POST one object from `examples/sample-incidents.json`.
4. Confirm the result, then test the P1, P2, P3 and P4 cases in `docs/test-cases.md`.
5. To enable AI enrichment, import the AI-assisted workflow and attach an OpenAI credential in n8n. Follow `docs/setup.md`.

Example request:

```json
{
  "incident_id": "INC-DEMO-001",
  "short_description": "Microsoft 365 sign-in loop",
  "description": "User cannot access Microsoft 365 after a password reset. Outlook repeatedly asks for credentials.",
  "affected_users": 1,
  "business_critical": false
}
```

Expected baseline fields:

```json
{
  "category": "Identity & Access",
  "service": "Microsoft 365 / Identity",
  "priority": "P3",
  "escalation_team": "IAM Support",
  "human_review_required": false,
  "ai_status": "not_used"
}
```

## Repository map

```text
workflows/   Importable n8n workflow JSON
src/         Testable reference implementation of baseline rules
examples/    Sanitized incident payloads
docs/        Architecture, setup, data contract and test cases
tests/       Automated baseline tests
scripts/     Repository validation utilities
```

## Validation

```text
npm run check
```

This validates the JSON artifacts and tests the reference baseline. It does not prove connectivity to n8n, OpenAI, a ticketing platform or a notification service.

## Safety boundaries

- Use only sanitized, authorized incident data.
- Never send passwords, tokens, recovery codes, private keys or sensitive employer/customer data.
- AI output is advisory. A person approves P1/P2 declarations, account changes and security actions.
- Add authentication, rate limiting, retention controls and approved logging before production use.
- See `SECURITY.md` and `docs/architecture.md`.

## Optional integrations not configured

Google Sheets, ServiceNow/Jira, email and Teams/Slack are documented extension points. They are deliberately absent from the runnable workflows because no credentials, tenant URLs, tables, channels or field mappings were provided.

## Contributing

Focused fixes, test cases and documentation improvements are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request. Use fictional or sanitized incident data only; report exploitable issues privately according to [SECURITY.md](SECURITY.md).

## License

MIT

