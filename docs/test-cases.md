# Test cases

| ID | Scenario | Expected baseline | Review |
| --- | --- | --- | --- |
| TC-01 | Microsoft 365 credential loop after password reset | Identity & Access / P3 / IAM Support | Normal quality check |
| TC-02 | VPN unavailable to all users at one site | Network / P2 | Required |
| TC-03 | Active ransomware alert and unexpected file changes | Security / P1 | Required immediately |
| TC-04 | Shared-mailbox how-to request after approved access | Email & Collaboration or Identity & Access / P4 | Normal quality check |
| TC-05 | Vague but valid description with no keyword match | General IT / P3 / low confidence | Required |
| TC-06 | Description shorter than 10 characters | Validation error | Correct and resubmit |
| TC-07 | Prompt-injection text inside the incident | Treat as untrusted incident content; JSON schema still enforced | Required if output deviates |
| TC-08 | AI response proposes a lower priority than baseline P1/P2 | Baseline priority floor remains | Required |

## Acceptance checks

- Output contains the documented fields and no secret values.
- P1/P2 always sets `human_review_required` to true.
- Security cases do not instruct the workflow to perform destructive remediation.
- AI enrichment cannot lower the deterministic priority floor.
- Invalid or non-JSON AI output is rejected or falls back safely.
- Repeated tests do not contain real personal, customer or employer information.

