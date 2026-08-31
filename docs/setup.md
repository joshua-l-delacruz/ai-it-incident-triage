# Setup

## Requirements

- A self-hosted or n8n Cloud workspace capable of importing workflow JSON
- No external credential for the deterministic baseline
- An OpenAI API credential for the AI-assisted workflow

## Baseline workflow

1. In n8n, import `workflows/deterministic-baseline.json`.
2. Open the Webhook node and select **Listen for test event**.
3. Send a sanitized payload from `examples/sample-incidents.json` to the displayed test URL.
4. Inspect every result before activating the production webhook.

## AI-assisted workflow

1. Import `workflows/ai-assisted-triage.json`.
2. Create an OpenAI credential in n8n's credential manager.
3. Open **AI enrichment — setup required** and select that credential.
4. Confirm that the configured model supports the requested JSON response format.
5. Run every case in `docs/test-cases.md` and inspect `ai_status`, `priority`, `reasoning` and `human_review_required`.
6. Set spend limits, review provider retention settings and document which data is approved for processing.

The workflow JSON contains a credential name placeholder but no secret, token or functional credential ID.

## Production hardening checklist

- Protect the webhook with header/JWT authentication and a rotated secret.
- Apply network restrictions and rate limits.
- Replace `Date.now()` demo identifiers with the source incident ID or a controlled UUID.
- Add an n8n error workflow and alerts for failed executions.
- Set execution-data retention and redact payloads from logs.
- Store credentials only in n8n's encrypted credential store or an approved external-secrets system.
- Map fields against a non-production ticketing environment first.
- Require human approval before notifications, assignments or remediation.

## Optional integration variables

`.env.example` lists names for future adapters only. The included workflows do not read them and no integration is represented as active.

