# IT Incident Triage & Decision Support

[![CI](https://github.com/joshua-l-delacruz/ai-it-incident-triage/actions/workflows/ci.yml/badge.svg)](https://github.com/joshua-l-delacruz/ai-it-incident-triage/actions/workflows/ci.yml)

Turn a fictional IT incident into an explainable category, P1–P4 priority, suggested routing and initial checks. Import the n8n baseline without an external AI credential, or inspect the reference engine locally. An optional AI-assisted workflow preserves the baseline priority and human-review requirements.\n\nUse this proof of concept to learn and adapt triage rules. It does not grant access, perform remediation or replace an incident owner.

**[Explore the separate Cloudflare automation demo](https://joshuadelacruz.solutions/incident-triage/automation/)** · **[Read the case study](https://joshuadelacruz.solutions/incident-triage/)**

![AI-assisted incident triage workflow](https://joshuadelacruz.solutions/assets/images/ai-incident-triage-workflow.svg)

> **Demo boundary:** The linked website is a separate Cloudflare implementation. Its page describes Workers AI processing and D1 storage of incident metadata; it is not a browser-local execution of this n8n workflow. Use fictional data only and review that implementation before submitting anything. This repository does not establish its retention or authorization guarantees.\n\n> **Project status:** the repository, workflows, tests and documentation are complete. No live n8n instance, OpenAI credential, ticketing platform, spreadsheet, email, Teams or Slack integration is included or claimed.

## Operational outcome

- **Designed** two importable workflow modes: a credential-free deterministic baseline and an optional AI-assisted path.
- **Implemented** explainable category, service, P1-P4 priority, escalation-team, initial-action, and human-review outputs.
- **Validated** four sanitized incident scenarios and reference-engine and exported-workflow Code-node regression tests covering identity, security, outage, and invalid-input behavior.
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

This validates the JSON artifacts, tests the reference baseline, and executes the exported Code-node JavaScript locally for parity and review-floor checks. It does not import a workflow into n8n or prove connectivity to n8n, OpenAI, Cloudflare, a ticketing platform or a notification service.

## Production-readiness boundary

| Area | Current PoC evidence | Required before production |
| --- | --- | --- |
| Architecture | Deterministic baseline, optional enrichment, and human-review gate are separated | Authenticate intake and approve environment-specific ownership and data flow |
| Logging and monitoring | Structured output and explicit `ai_status` make decisions inspectable | Add correlation-aware audit logs, workflow health, queue, error, latency, and review-backlog alerts |
| Failure handling | Baseline works without an external AI dependency; invalid input fails clearly | Add bounded retries, error workflow, dead-letter handling, idempotency, and recovery tests |
| Backup and recovery | Workflows and test artifacts are versioned in Git | Back up n8n configuration and credentials securely; define and test restore objectives |
| Security boundaries | Sanitized inputs, credential-manager guidance, allow-listed output, priority floor, and human approval | Add authentication, authorization, retention rules, privacy review, secret rotation, and downstream least privilege |
| CI validation | JSON validation plus reference-engine and exported Code-node parity tests | Add import, integration, provider-failure, deployment, and rollback checks |
| Expected load | Four controlled scenarios; no load claim | Measure webhook concurrency, queue behavior, external quotas, and response targets |
| Limitations and runbooks | Missing integrations and operator responsibilities are explicit | Approve operating, escalation, recovery, and incident-management runbooks with named owners |

## Input contract and heuristic limits

- `description`: required string, 10–4,000 characters after trimming.
- `short_description`: optional string, at most 200 characters.
- `affected_users`: optional integer from 1 to 1,000,000, default 1.
- `business_critical`: optional JSON boolean, default false. Strings such as `"false"` are rejected.
- Keyword rules do not understand negation or context reliably. Security-classified incidents always require human review, including mixed or negated reports.
- `confidence` is a fixed heuristic indicator, not a calibrated probability. Review every recommendation before acting.

## Maintenance roadmap

- Verify import and execution against a documented n8n version.
- Add reproducible integration checks and release artifacts.
- Improve ambiguous and mixed-signal examples without weakening review boundaries.
- Keep the reference engine and exported workflow logic aligned through regression tests.

Focused contributions to these tasks are welcome; see CONTRIBUTING.md. No paid support or production availability commitment is offered.

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

