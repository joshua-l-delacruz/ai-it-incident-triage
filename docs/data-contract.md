# Data contract

## Input

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `incident_id` | string | No | Source identifier; a demo ID is generated if omitted |
| `short_description` | string | No | Short summary |
| `description` | string | Yes | Minimum 10 characters; sanitized incident text only |
| `affected_users` | number | No | Defaults to 1 |
| `business_critical` | boolean | No | Defaults to false |

## Output

| Field | Meaning |
| --- | --- |
| `category` | Allow-listed incident category |
| `service` | Likely affected service |
| `priority` | P1-P4 recommendation, not a final declaration |
| `confidence` | Workflow confidence from 0 to 1 |
| `reasoning` | Short explainable rationale |
| `initial_actions` | Safe investigation steps, not automated remediation |
| `escalation_team` | Suggested owning team |
| `human_review_required` | Review gate based on impact, risk or confidence |
| `ai_status` | `not_used`, `enriched`, or a validation/failure status |

## Priority guide

- **P1:** active major security indicator or critical complete outage; immediate human review
- **P2:** broad or business-critical impact; urgent human review
- **P3:** limited incident with a workaround or contained impact
- **P4:** service request, information request or low-impact issue

Organizations must replace this demonstration guide with their approved impact/urgency matrix.

