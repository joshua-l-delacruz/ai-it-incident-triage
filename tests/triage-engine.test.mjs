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


test("rejects string booleans rather than silently escalating them", () => {
  assert.throws(() => triageIncident({
    description: "User cannot sign in to Outlook", business_critical: "false"
  }), /business_critical must be a boolean/);
  assert.equal(triageIncident({
    description: "User cannot sign in to Outlook", business_critical: false
  }).priority, "P3");
});

test("requires review for security keywords even in negated or mixed context", () => {
  const result = triageIncident({ description: "No malware detected; user requests password help" });
  assert.equal(result.category, "Security");
  assert.equal(result.human_review_required, true);
});

test("rejects malformed incident fields", () => {
  for (const input of [null, [], "incident", {description: 12345},
    {description: "x".repeat(4001)},
    {description: "Cannot access Outlook", affected_users: "25"},
    {description: "Cannot access Outlook", affected_users: -1},
    {description: "Cannot access Outlook", affected_users: 1.5},
    {description: "Cannot access Outlook", affected_users: Infinity},
    {description: "Cannot access Outlook", affected_users: 1000001},
    {description: "Cannot access Outlook", short_description: 42},
    {description: "Cannot access Outlook", business_critical: null}]) {
    assert.throws(() => triageIncident(input));
  }
});

test("accepts documented input limits and keeps critical outages at P1", () => {
  assert.equal(triageIncident({description: "x".repeat(4000), affected_users: 1000000}).priority, "P2");
  assert.equal(triageIncident({
    description: "VPN service down for all users", affected_users: 48, business_critical: true
  }).priority, "P1");
});
