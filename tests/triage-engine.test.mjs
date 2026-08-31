import test from "node:test";
import assert from "node:assert/strict";
import { triageIncident } from "../src/triage-engine.mjs";

test("classifies a password-reset loop as identity and access", () => {
  const result = triageIncident({ incident_id: "INC-001", description: "User cannot access Microsoft 365 after a password reset; Outlook repeatedly asks for credentials." });
  assert.equal(result.category, "Identity & Access");
  assert.equal(result.priority, "P3");
  assert.equal(result.escalation_team, "IAM Support");
});

test("routes a suspected compromise to P1 security review", () => {
  const result = triageIncident({ description: "Active ransomware alert and suspected data leak on a managed laptop." });
  assert.equal(result.category, "Security");
  assert.equal(result.priority, "P1");
  assert.equal(result.human_review_required, true);
});

test("raises broad outages to P2", () => {
  const result = triageIncident({ description: "VPN is unavailable for all users at the Manila site." });
  assert.equal(result.category, "Network");
  assert.equal(result.priority, "P2");
});

test("rejects unusably short incident text", () => {
  assert.throws(() => triageIncident({ description: "broken" }), /at least 10/);
});

