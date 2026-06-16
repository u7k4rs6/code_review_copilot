/* Initial mock data for the inbox — mirrors the real API shapes */
const INITIAL_PRS = [
  {
    id: 214, title: "Add user lookup endpoint", repo: "brixdorf/api", branch: "feat/user-lookup",
    base: "main", author: "dmitri", changed: 4, additions: 86, deletions: 12,
    status: "reviewed", risk: "medium", score: 7, findings: 7, updated: "6m",
  },
  {
    id: 209, title: "Cache diff parser results in Redis", repo: "brixdorf/api", branch: "perf/diff-cache",
    base: "main", author: "lena", changed: 3, additions: 142, deletions: 30,
    status: "reviewing", risk: null, score: null, findings: null, updated: "now",
  },
  {
    id: 207, title: "Bump express to 4.19.2", repo: "brixdorf/api", branch: "chore/express-bump",
    base: "main", author: "renovate", changed: 1, additions: 3, deletions: 3,
    status: "reviewed", risk: "low", score: 9, findings: 1, updated: "1h",
  },
  {
    id: 203, title: "Refactor GitHub client retries", repo: "brixdorf/api", branch: "fix/gh-retries",
    base: "main", author: "marco", changed: 2, additions: 54, deletions: 41,
    status: "reviewed", risk: "high", score: 4, findings: 9, updated: "3h",
  },
  {
    id: 198, title: "Add rate-limit middleware", repo: "brixdorf/api", branch: "feat/rate-limit",
    base: "main", author: "dmitri", changed: 2, additions: 71, deletions: 0,
    status: "queued", risk: null, score: null, findings: null, updated: "5h",
  },
];

const MOCK_REVIEW_DATA = {
  findings: [
    { id: "f1", severity: "security", filename: "src/routes/user.js", line: 42, issue: "User input is concatenated directly into the SQL query.", why: "Allows SQL injection if req.params.id is attacker-controlled.", fix: "db.query('SELECT * FROM users WHERE id = ?', [id])", explanation: "Parameterized queries keep data separate from SQL syntax, so input can never change the query's structure." },
    { id: "f2", severity: "bug", filename: "src/routes/user.js", line: 58, issue: "Missing null check before accessing user.profile.email.", why: "Throws a TypeError when the user has no profile, returning a 500 instead of a 404.", fix: "if (!user?.profile) return res.status(404).json({ error: 'Not found' });", explanation: "Optional chaining and an early return handle the absent-profile case cleanly." },
    { id: "f3", severity: "performance", filename: "src/routes/user.js", line: 71, issue: "User roles are fetched inside a loop (N+1 queries).", why: "Each user triggers a separate roles query; a 100-user response makes 100 round-trips.", fix: "Batch with a single WHERE user_id IN (...) query, then group in memory.", explanation: "Collapsing N queries into one keeps response time flat as the result set grows." },
    { id: "f4", severity: "security", filename: "src/modules/auth.js", line: 19, issue: "JWT is verified without checking the algorithm.", why: "An attacker can forge a token using the 'none' algorithm if it is not pinned.", fix: "jwt.verify(token, secret, { algorithms: ['HS256'] })", explanation: "Pinning the algorithm prevents downgrade attacks against token verification." },
    { id: "f5", severity: "suggestion", filename: "src/modules/auth.js", line: 33, issue: "Magic number 3600 used for token TTL.", why: "Unlabeled constants make the intent unclear and easy to mistype elsewhere.", fix: "const TOKEN_TTL_SECONDS = 60 * 60;", explanation: "A named constant documents the value and centralizes future changes." },
    { id: "f6", severity: "style", filename: "src/routes/user.js", line: 12, issue: "Inconsistent quote style — mixes single and double quotes.", why: "Diverges from the project's Prettier config and adds noise to diffs.", fix: "Run `npx prettier --write src/routes/user.js`.", explanation: "Consistent formatting keeps reviews focused on logic, not whitespace." },
    { id: "f7", severity: "suggestion", filename: "src/routes/user.js", line: 88, issue: "Response shape is not validated before sending.", why: "Downstream clients can break silently if a field is renamed.", fix: "Validate with a schema (e.g. zod) before res.json(payload).", explanation: "A response schema turns silent contract drift into a loud, catchable error." },
  ],
  riskSummary: {
    qualityScore: 7, riskLevel: "medium", mergeRecommendation: "Needs work",
    highRiskChanges: [
      "src/routes/user.js — unparameterized SQL in the lookup query",
      "src/modules/auth.js — JWT verified without a pinned algorithm",
    ],
    rationale: "Two security findings in the auth and user paths must be resolved before merge. The remaining items are a null-safety bug and stylistic suggestions that won't block once the SQL and JWT issues are fixed.",
  },
};

/* Per-PR review data keyed by id — all reviewed mock PRs share the same demo data */
const INITIAL_REVIEW_DATA = { 214: MOCK_REVIEW_DATA, 207: MOCK_REVIEW_DATA, 203: MOCK_REVIEW_DATA };

function App() {
  const Icon = window.CRCIcon;
  const NS = window.CodeReviewCopilotDesignSystem_1910d8;
  const { IconButton } = NS;

  const [prs, setPrs] = React.useState(INITIAL_PRS);
  const [reviewData, setReviewData] = React.useState(INITIAL_REVIEW_DATA);
  const [route, setRoute] = React.useState("inbox");
  const [nav, setNav] = React.useState("inbox");
  const [pr, setPr] = React.useState(null);
  const [dialog, setDialog] = React.useState(false);

  const openPR = (p) => {
    if (p.status === "queued" || p.status === "reviewing") return;
    setPr(p);
    setRoute("workspace");
  };

  const completeReview = (result) => {
    setDialog(false);
    const info = result.pr || {};
    const newId = Date.now();
    const newPR = {
      id: newId,
      title: info.pullNumber ? `PR #${info.pullNumber}` : "New Review",
      repo: info.owner && info.repo ? `${info.owner}/${info.repo}` : "unknown/repo",
      branch: "feature-branch",
      base: "main",
      author: "you",
      changed: result.reviewComments ? result.reviewComments.length : 0,
      additions: 0,
      deletions: 0,
      status: "reviewed",
      risk: result.riskSummary ? result.riskSummary.riskLevel : "medium",
      score: result.riskSummary ? result.riskSummary.qualityScore : 5,
      findings: result.reviewComments ? result.reviewComments.length : 0,
      updated: "now",
    };
    setPrs((prev) => [newPR, ...prev]);
    setReviewData((prev) => ({
      ...prev,
      [newId]: {
        findings: result.reviewComments || [],
        riskSummary: result.riskSummary || {},
      },
    }));
    setPr(newPR);
    setRoute("workspace");
  };

  return (
    <div className="crc-app" data-theme="dark">
      <Sidebar
        route={nav}
        onRoute={(r) => { setNav(r); if (r === "inbox") setRoute("inbox"); }}
        onNewReview={() => setDialog(true)}
        counts={{ inbox: prs.length }}
      />
      <main className="crc-main">
        <div className="crc-topbar">
          <h1>{route === "workspace" ? "Review" : "Reviews"}</h1>
          <div className="crc-topbar__spacer" />
          <div className="crc-search">
            <Icon name="search" size={15} />
            <input placeholder="Search pull requests…" />
          </div>
          <IconButton label="Notifications"><Icon name="bell" size={17} /></IconButton>
        </div>
        <div className="crc-scroll">
          {route === "inbox" && <PRInbox prs={prs} onOpen={openPR} />}
          {route === "workspace" && pr && (
            <ReviewWorkspace pr={pr} findingsData={reviewData[pr.id]} onBack={() => setRoute("inbox")} />
          )}
        </div>
      </main>
      {dialog && <NewReviewDialog onClose={() => setDialog(false)} onComplete={completeReview} />}
    </div>
  );
}
window.CRCApp = App;
