import { readFile, writeFile, mkdir, appendFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";
import { triageIncident } from "../src/triage-engine.mjs";

const mode = process.argv[2];
const root = resolve(process.argv[3] ?? ".");
if (mode === "prepare") {
  await mkdir(join(root, "inputs"), {recursive: true});
  await mkdir(join(root, "data"), {recursive: true});
  const workflows = [];
  for (const [name, id] of [
    ["deterministic-baseline.json", "TriageBaselineAudit"],
    ["ai-assisted-triage.json", "TriageAIAudit"]
  ]) {
    const workflow = JSON.parse(await readFile(new URL("../workflows/" + name, import.meta.url), "utf8"));
    workflow.id = id;
    workflows.push(workflow);
  }
  await writeFile(join(root, "inputs/workflows.json"), JSON.stringify(workflows));
  console.log("Prepared both original workflows with isolated test IDs.");
} else if (mode === "test") {
  const base = "http://127.0.0.1:5689";
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try {
      const response = await fetch(base + "/healthz", {signal: AbortSignal.timeout(2000)});
      if (response.ok) { ready = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  assert.ok(ready, "n8n did not become healthy within the startup window");
  const samples = JSON.parse(await readFile(new URL("../examples/sample-incidents.json", import.meta.url), "utf8"));
  samples.push({incident_id: "MIXED", description: "No malware detected; user requests password help"});
  for (const input of samples) {
    const response = await fetch(base + "/webhook/it-incident-triage-demo", {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify(input), signal: AbortSignal.timeout(30000)
    });
    const text = await response.text();
    assert.equal(response.status, 200, text);
    assert.deepEqual(JSON.parse(text), triageIncident(input));
    console.log("PASS webhook: " + input.incident_id);
  }
  for (const input of [
    {description: "User cannot sign in to Outlook", business_critical: "false"},
    {description: "User cannot sign in to Outlook", affected_users: "25"},
    {description: "broken"}
  ]) {
    const response = await fetch(base + "/webhook/it-incident-triage-demo", {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify(input), signal: AbortSignal.timeout(30000)
    });
    const text = await response.text();
    assert.ok(response.status >= 400, "Invalid input accepted: " + text);
    console.log("PASS rejection: " + response.status);
  }
  const summary = "## n8n integration\n\nBoth workflow artifacts imported into n8n 2.43.6. The original baseline webhook passed five valid fictional submissions and rejected three invalid submissions. Optional AI execution was not tested; no provider credentials or calls were used.\n";
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
} else {
  throw new Error("Usage: node scripts/n8n-integration.mjs prepare|test TEST_DIRECTORY");
}
