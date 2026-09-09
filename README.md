# IT Incident Triage & Decision Support

[![CI](https://github.com/joshua-l-delacruz/ai-it-incident-triage/actions/workflows/ci.yml/badge.svg)](https://github.com/joshua-l-delacruz/ai-it-incident-triage/actions/workflows/ci.yml)

An operations-focused n8n portfolio project that turns a sanitized incident submission into a structured, explainable triage recommendation. I designed the deterministic safety baseline to work without AI, then added optional AI enrichment without surrendering priority controls, escalation accountability, or human review.

**[Try the deterministic browser demo](https://joshuadelacruz.solutions/incident-triage/demo/)** · **[Read the case study](https://joshuadelacruz.solutions/incident-triage/)**

![AI-assisted incident triage workflow](https://joshuadelacruz.solutions/assets/images/ai-incident-triage-workflow.svg)

> **Project status:** the repository, workflows, tests and documentation are complete. No live n8n instance, OpenAI credential, ticketing platform, spreadsheet, email, Teams or Slack integration is included or claimed.

## Operational outcome

- **Designed** two importable workflow modes: a credential-free deterministic baseline and an optional AI-assisted path.
- **Implemented** explainable category, service, P1-P4 priority, escalation-team, initial-action, and human-review outputs.
- **Validated** four sanitized incident scenarios and four automated rule tests covering identity, security, outage, and invalid-input behavior.
- **Preserved** a deterministic priority floor so optional AI cannot silently lower a baseline P1/P2 decision.

These are controlled PoC counts. They do not claim production ticket volume, time saved, response-time improvement, or incident reduction.

## What it demonstrates

- Workflow analysis: intake, validation, classification, prioritization and routing
- IT operations knowledge: identity, endpoint, network, security and application incidents
- Decision support: constrained optional AI output, deterministic fallback and human-review gates
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

## Production-readiness boundary

| Area | Current PoC evidence | Required before production |
| --- | --- | --- |
| Architecture | Deterministic baseline, optional enrichment, and human-review gate are separated | Authenticate intake and approve environment-specific ownership and data flow |
| Logging and monitoring | Structured output and explicit `ai_status` make decisions inspectable | Add correlation-aware audit logs, workflow health, queue, error, latency, and review-backlog alerts |
| Failure handling | Baseline works without an external AI dependency; invalid input fails clearly | Add bounded retries, error workflow, dead-letter handling, idempotency, and recovery tests |
| Backup and recovery | Workflows and test artifacts are versioned in Git | Back up n8n configuration and credentials securely; define and test restore objectives |
| Security boundaries | Sanitized inputs, credential-manager guidance, allow-listed output, priority floor, and human approval | Add authentication, authorization, retention rules, privacy review, secret rotation, and downstream least privilege |
| CI validation | JSON validation plus four automated baseline tests | Add import, integration, provider-failure, deployment, and rollback checks |
| Expected load | Four controlled scenarios; no load claim | Measure webhook concurrency, queue behavior, external quotas, and response targets |
| Limitations and runbooks | Missing integrations and operator responsibilities are explicit | Approve operating, escalation, recovery, and incident-management runbooks with named owners |

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

