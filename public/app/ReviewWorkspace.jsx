const SEV_COLORS = {
  bug: "var(--sev-bug)", security: "var(--sev-security)", performance: "var(--sev-perf)",
  style: "var(--sev-style)", suggestion: "var(--sev-suggest)",
};

function RiskSummaryRail({ riskSummary }) {
  const Icon = window.CRCIcon;
  const NS = window.CodeReviewCopilotDesignSystem_1910d8;
  const { ScoreMeter, RiskPill, VerdictStamp } = NS;
  const r = riskSummary || {};
  const highRisk = r.highRiskChanges || [];

  return (
    <div className="crc-rail">
      <div className="crc-summary">
        <div className="crc-summary__h">
          <Icon name="gauge" size={16} style={{ color: "var(--text-muted)" }} />
          <b>Risk summary</b>
          <span style={{ marginLeft: "auto" }}><RiskPill level={r.riskLevel || "low"} /></span>
        </div>
        <div className="crc-summary__b">
          <ScoreMeter score={r.qualityScore || 0} size="lg" />
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 10px" }}>
            <VerdictStamp verdict={r.mergeRecommendation || "Needs work"} />
          </div>
          {highRisk.length > 0 && (
            <div>
              <div className="crc-summary__label">High-risk changes</div>
              {highRisk.map((c, i) => {
                const [file, rest] = c.split(" — ");
                return (
                  <div className="crc-hr" key={i}>
                    <Icon name="circle-alert" size={13} style={{ color: "var(--sev-bug)", marginTop: 1, flex: "none" }} />
                    <span><code>{file}</code>{rest ? ` — ${rest}` : ""}</span>
                  </div>
                );
              })}
            </div>
          )}
          {r.rationale && (
            <div>
              <div className="crc-summary__label">Rationale</div>
              <p className="crc-rationale">{r.rationale}</p>
            </div>
          )}
        </div>
      </div>
      <div className="crc-bot">
        <div style={{ background: "var(--brand-soft)", color: "var(--brand-on-soft)", width: 30, height: 30, borderRadius: "var(--radius-md)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <Icon name="sparkles" size={16} />
        </div>
        <div className="crc-bot__txt">
          <b>Reviewed by Copilot</b>
          <span>gemini-2.5-flash-lite · just now</span>
        </div>
      </div>
    </div>
  );
}

function ReviewWorkspace({ pr, onBack, findingsData }) {
  const Icon = window.CRCIcon;
  const NS = window.CodeReviewCopilotDesignSystem_1910d8;
  const { FindingCard } = NS;

  const findings = (findingsData && findingsData.findings) || [];
  const riskSummary = (findingsData && findingsData.riskSummary) || {};

  const [filter, setFilter] = React.useState("all");
  const [dismissed, setDismissed] = React.useState({});

  const counts = findings.reduce((a, f) => (a[f.severity] = (a[f.severity] || 0) + 1, a), {});
  const visible = findings.filter((f) => filter === "all" || f.severity === filter);
  const order = ["security", "bug", "performance", "style", "suggestion"];

  return (
    <>
      <div className="crc-ws__head">
        <div className="crc-ws__crumb">
          <button onClick={onBack}>
            <Icon name="chevron-right" size={14} style={{ transform: "rotate(180deg)" }} /> Reviews
          </button>
        </div>
        <div className="crc-ws__titlerow">
          <Icon name="git-pull-request" size={22} style={{ color: "var(--signal-400)" }} />
          <span className="crc-ws__title">{pr.title}</span>
        </div>
        <div className="crc-ws__chips">
          <span className="crc-chip"><Icon name="git-pull-request" size={13} />{pr.repo}</span>
          <span className="crc-chip"><Icon name="message-square" size={13} />{findings.length} findings</span>
        </div>
      </div>

      <div className="crc-ws">
        <div>
          <div className="crc-filters">
            <button className={"crc-filter" + (filter === "all" ? " crc-filter--active" : "")} onClick={() => setFilter("all")}>
              All <span className="n">{findings.length}</span>
            </button>
            {order.filter((s) => counts[s]).map((s) => (
              <button key={s} className={"crc-filter" + (filter === s ? " crc-filter--active" : "")} onClick={() => setFilter(s)}>
                <span className="dot" style={{ background: SEV_COLORS[s] }} />
                <span style={{ textTransform: "capitalize" }}>{s}</span> <span className="n">{counts[s]}</span>
              </button>
            ))}
          </div>
          <div className="crc-findings">
            {visible.length === 0 && (
              <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                No findings for this filter.
              </div>
            )}
            {visible.map((f, i) => (
              <FindingCard key={f.id || i} {...f} dismissed={!!dismissed[f.id || i]}
                onDismiss={() => setDismissed((d) => ({ ...d, [f.id || i]: !d[f.id || i] }))} />
            ))}
          </div>
        </div>

        <RiskSummaryRail riskSummary={riskSummary} />
      </div>
    </>
  );
}
window.ReviewWorkspace = ReviewWorkspace;
