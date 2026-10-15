import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { triageIncident } from "../src/triage-engine.mjs";

const workflow = name => JSON.parse(readFileSync(new URL("../workflows/" + name, import.meta.url), "utf8"));
const baseline = workflow("deterministic-baseline.json");
const ai = workflow("ai-assisted-triage.json");
const execute = (workflow, node, input) => {
  const code = workflow.nodes.find(n => n.name === node).parameters.jsCode;
  return new Function("$json", code)({body: input})[0].json;
};
const samples = JSON.parse(readFileSync(new URL("../examples/sample-incidents.json", import.meta.url), "utf8"));
const cases = [...samples,
  {incident_id: "MIXED", description: "No malware detected; user requests password help"},
  {incident_id: "GENERAL", description: "Printer prints a blank sheet"}];

test("exported baseline Code node matches the reference engine", () => {
  for (const input of cases) assert.deepEqual(
    execute(baseline, "Validate and triage", input),
    triageIncident(input)
  );
});

test("AI intake shares the validated priority and review floor", () => {
  for (const input of cases) {
    const expected = triageIncident(input);
    const actual = execute(ai, "Validate and set priority floor", input);
    assert.equal(actual.baseline_priority, expected.priority);
    assert.equal(actual.baseline_human_review_required, expected.human_review_required);
    assert.equal(actual.security_signal, expected.category === "Security");
  }
});

test("both exported intake nodes reject string booleans and invalid counts", () => {
  for (const input of [
    {description: "User cannot sign in to Outlook", business_critical: "false"},
    {description: "User cannot sign in to Outlook", affected_users: "25"},
    {description: "User cannot sign in to Outlook", affected_users: -1},
    {description: "x".repeat(4001)}
  ]) {
    assert.throws(() => execute(baseline, "Validate and triage", input));
    assert.throws(() => execute(ai, "Validate and set priority floor", input));
  }
});

test("AI output cannot drop the priority or security-review floor", () => {
  const code = ai.nodes.find(n => n.name === "Validate AI output").parameters.jsCode;
  const run = new Function("$json", "$", code);
  for (const input of cases) {
    const floor = execute(ai, "Validate and set priority floor", input);
    const response = {choices: [{message: {content: JSON.stringify({
      priority: "P4", category: "Application", confidence: 1
    })}}]};
    const actual = run(response, () => ({first: () => ({json: floor})}))[0].json;
    const rank = {P1: 1, P2: 2, P3: 3, P4: 4};
    assert.ok(rank[actual.priority] <= rank[floor.baseline_priority]);
    if (floor.baseline_human_review_required) assert.equal(actual.human_review_required, true);
  }
});
