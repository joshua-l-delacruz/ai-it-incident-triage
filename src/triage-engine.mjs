const RULES = [
  { category: "Security", service: "Security Operations", pattern: /ransomware|malware|phishing|compromis|suspicious login|data leak/i },
  { category: "Identity & Access", service: "Microsoft 365 / Identity", pattern: /password|sign[ -]?in|login|mfa|authenticat|account lock|access denied|credential/i },
  { category: "Network", service: "Network Connectivity", pattern: /vpn|wifi|wi-fi|network|dns|internet|latency|packet loss/i },
  { category: "Endpoint", service: "Managed Endpoint", pattern: /laptop|desktop|blue screen|bsod|device|intune|disk|cpu/i },
  { category: "Application", service: "Business Application", pattern: /application|app |website|portal|error 5\d\d|crash/i },
  { category: "Email & Collaboration", service: "Microsoft 365", pattern: /outlook|email|mailbox|teams|sharepoint|onedrive/i }
];

const ACTIONS = {
  "Security": ["Preserve available evidence", "Isolate affected assets when authorized", "Escalate to the security response team"],
  "Identity & Access": ["Verify the user's identity through the approved process", "Check account, license and authentication state", "Review recent password or MFA changes and active sessions"],
  "Network": ["Confirm scope and affected locations", "Collect connection, DNS and VPN status", "Compare with monitoring and known outages"],
  "Endpoint": ["Record device and operating-system details", "Check management and health status", "Collect relevant error messages and logs"],
  "Application": ["Confirm application, environment and exact error", "Check service health and recent changes", "Reproduce safely and capture timestamps"],
  "Email & Collaboration": ["Check Microsoft 365 service health", "Confirm account, license and client state", "Compare web and desktop client behavior"],
  "General IT": ["Confirm impact, scope and start time", "Collect exact errors and recent changes", "Check known issues before assignment"]
};

export function triageIncident(input = {}) {
  const description = String(input.description ?? "").trim();
  if (description.length < 10) throw new Error("description must contain at least 10 characters");

  const combined = `${input.short_description ?? ""} ${description}`.trim();
  const matched = RULES.find((rule) => rule.pattern.test(combined));
  const category = matched?.category ?? "General IT";
  const service = matched?.service ?? "Service Desk";
  const affectedUsers = Number.isFinite(Number(input.affected_users)) ? Math.max(1, Number(input.affected_users)) : 1;
  const businessCritical = Boolean(input.business_critical);
  const securitySignal = /ransomware|data leak|compromis|active attack/i.test(combined);
  const totalOutage = /all users|company[- ]wide|site[- ]wide|complete outage|service down/i.test(combined);

  let priority = "P3";
  if (securitySignal || (businessCritical && totalOutage)) priority = "P1";
  else if (totalOutage || affectedUsers >= 25 || businessCritical) priority = "P2";
  else if (/request|how do i|information/i.test(combined)) priority = "P4";

  const confidence = matched ? 0.82 : 0.55;
  const escalationTeam = category === "Security" ? "Security Operations" : category === "Identity & Access" ? "IAM Support" : category === "Network" ? "Network Operations" : "Service Desk / Application Owner";

  return {
    schema_version: "1.0",
    incident_id: String(input.incident_id ?? `DEMO-${Date.now()}`),
    short_description: String(input.short_description ?? description.slice(0, 90)),
    category,
    service,
    priority,
    confidence,
    reasoning: `Rule-based baseline matched ${category}; priority reflects stated scope, criticality and security indicators.`,
    initial_actions: ACTIONS[category],
    escalation_team: escalationTeam,
    human_review_required: priority === "P1" || priority === "P2" || confidence < 0.7,
    ai_status: "not_used",
    data_notice: "Sanitized demonstration data only; human validation required."
  };
}

