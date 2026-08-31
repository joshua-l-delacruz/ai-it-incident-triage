# Architecture

## Processing path

```text
Sanitized incident payload
          |
          v
     n8n Webhook
          |
          v
Validate + normalize input
          |
          v
Deterministic safety baseline
  category / priority / actions
          |
          +----------------------+
          |                      |
          | baseline workflow    | AI-assisted workflow
          v                      v
   Structured response     OpenAI JSON enrichment
                                  |
                                  v
                         Validate + constrain output
                                  |
                                  v
                         Human-review decision gate
                                  |
                                  v
                           Structured response
```

## Design decisions

### Deterministic baseline first

Common indicators produce an explainable category, service, priority and escalation recommendation before any external AI call. This supplies a usable fallback and prevents an LLM from being the only severity control.

### Constrained AI role

AI may improve the summary, reasoning and initial-action wording. It may not lower a baseline P1/P2 recommendation, execute remediation, change access, isolate a device or notify a third party. Output is parsed as JSON and restricted to known categories and priorities.

### Human review

Review is required for P1/P2, security indicators, low confidence and any validation failure. The workflow is a decision-support demonstration, not an autonomous incident-response system.

## Trust boundaries

| Boundary | Main control |
| --- | --- |
| Caller to webhook | Add n8n authentication, TLS, rate limiting and allow-listing before production |
| Incident text to AI provider | Sanitization, approved-data policy, minimum necessary fields and provider retention review |
| AI output to workflow | JSON parsing, allow-listed values, priority floor and human-review gate |
| Workflow to downstream tools | Dedicated credentials, least privilege, explicit field mappings and audit logging |

## Failure behavior

- Invalid input returns a clear validation error.
- The deterministic workflow has no external dependency.
- The AI-assisted workflow requires a configured credential and must be tested before activation.
- A production adaptation should add an explicit error workflow, bounded retries, dead-letter handling and operational alerting.

## Optional extension points

These are designs, not configured integrations:

- ServiceNow or Jira: create/update a draft incident after field mapping and approval.
- Google Sheets: append sanitized demo results for portfolio testing only.
- Email or Teams/Slack: notify a controlled test recipient/channel for P1/P2 review.
- Knowledge base: retrieve approved troubleshooting articles and include citations.

