const SEV_COLORS = {
  bug: "var(--sev-bug)", security: "var(--sev-security)", performance: "var(--sev-perf)",
  style: "var(--sev-style)", suggestion: "var(--sev-suggest)",
};

const MOCK_DIFF = [
  { type: "hunk", text: "@@ -38,10 +38,14 @@ export async function getUser(req, res) {" },
  { type: "context", n: 38, c: "export async function getUser(req, res) {" },
  { type: "context", n: 39, c: "  const { id } = req.params;" },
  { type: "context", n: 40, c: "" },
  { type: "remove", n: 41, c: "  const q = `SELECT * FROM users WHERE id = ${id}`;", flag: true },
  { type: "remove", n: 42, c: "  const rows = await db.query(q);" },
  { type: "add",    n: 41, c: "  const q = 'SELECT * FROM users WHERE id = ?';" },
  { type: "add",    n: 42, c: "  const rows = await db.query(q, [id]);" },
  { type: "context", n: 43, c: "  const user = rows[0];" },
  { type: "add",    n: 44, c: "  if (!user?.profile) return res.status(404).json({ error: 'Not found' });", flag: true },
  { type: "context", n: 45, c: "  return res.json(serialize(user));" },
  { type: "context", n: 46, c: "}" },
];

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
        <div className="crc-finding__ico" style={{ background: "var(--brand-soft)", color: "var(--brand-on-soft)", width: 30, height: 30, borderRadius: "var(--radius-md)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <Icon name="sparkles" size={16} />
        </div>
        <div className="crc-bot__txt">
          <b>Reviewed by Copilot</b>
          <span>gemini-2.5-flash · just now</span>
        </div>
      </div>
    </div>
  );
}

function DiffView({ findings }) {
  const NS = window.CodeReviewCopilotDesignSystem_1910d8;
  const Icon = window.CRCIcon;
  const { DiffLine, FindingCard } = NS;
  const firstFinding = (findings || [])[0];
  return (
    <div className="crc-diffwrap">
      <div className="crc-diff-file">
        <Icon name="file-code" size={14} style={{ color: "var(--text-muted)" }} />
        {firstFinding ? firstFinding.filename : "src/routes/review.js"}
      </div>
      <div className="crc-diff" style={{ borderRadius: "0 0 var(--radius-md) var(--radius-md)", marginTop: -8 }}>
        {MOCK_DIFF.map((l, i) =>
          l.type === "hunk"
            ? <div className="crc-diff__hunk" key={i}>{l.text}</div>
            : <DiffLine key={i} type={l.type} lineNumber={l.n} content={l.c} flagged={l.flag} />
        )}
      </div>
      {firstFinding && <FindingCard className="crc-inline-finding" {...firstFinding} />}
    </div>
  );
}

function ReviewWorkspace({ pr, onBack, findingsData }) {
  const Icon = window.CRCIcon;
  const NS = window.CodeReviewCopilotDesignSystem_1910d8;
  const { Button, Tabs, FindingCard } = NS;

  const findings = (findingsData && findingsData.findings) || [];
  const riskSummary = (findingsData && findingsData.riskSummary) || {};

  const [tab, setTab] = React.useState("findings");
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
          <span className="crc-ws__num">#{pr.id}</span>
          <div className="crc-ws__actions">
            <Button variant="secondary" leftIcon={<Icon name="rotate-cw" size={15} />}>Re-run</Button>
            <Button variant="primary" leftIcon={<Icon name="git-merge" size={15} />}>Approve &amp; merge</Button>
          </div>
        </div>
        <div className="crc-ws__chips">
          <span className="crc-chip"><Icon name="git-branch" size={13} />{pr.branch || "feature"}</span>
          <Icon name="arrow-right" size={13} style={{ color: "var(--text-subtle)" }} />
          <span className="crc-chip"><Icon name="git-branch" size={13} />{pr.base || "main"}</span>
          <span className="crc-chip"><Icon name="file-diff" size={13} />{pr.changed || 0} files</span>
          <span className="crc-chip" style={{ color: "var(--diff-add-line)" }}>+{pr.additions || 0}</span>
          <span className="crc-chip" style={{ color: "var(--diff-del-line)" }}>&minus;{pr.deletions || 0}</span>
        </div>
      </div>

      <div className="crc-ws">
        <div>
          <Tabs value={tab} onChange={setTab} items={[
            { value: "findings", label: "Findings", count: findings.length, icon: <Icon name="message-square" size={15} /> },
            { value: "diff", label: "Diff", count: pr.changed || 0, icon: <Icon name="file-diff" size={15} /> },
          ]} />

          {tab === "findings" && (
            <>
              <div className="crc-filters" style={{ marginTop: 14 }}>
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
            </>
          )}

          {tab === "diff" && <DiffView findings={findings} />}
        </div>

        <RiskSummaryRail riskSummary={riskSummary} />
      </div>
    </>
  );
}
window.ReviewWorkspace = ReviewWorkspace;
