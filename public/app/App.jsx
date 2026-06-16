function App() {
  const Icon = window.CRCIcon;
  const NS = window.CodeReviewCopilotDesignSystem_1910d8;
  const { IconButton } = NS;

  const [prs, setPrs] = React.useState([]);
  const [reviewData, setReviewData] = React.useState({});
  const [route, setRoute] = React.useState("inbox");
  const [pr, setPr] = React.useState(null);
  const [dialog, setDialog] = React.useState(false);

  const openPR = (p) => {
    setPr(p);
    setRoute("workspace");
  };

  const completeReview = (result) => {
    setDialog(false);
    const info = result.pr || {};
    const newId = Date.now();
    const newPR = {
      id: newId,
      title: info.pullNumber ? `${info.owner}/${info.repo} #${info.pullNumber}` : "New Review",
      repo: info.owner && info.repo ? `${info.owner}/${info.repo}` : "unknown/repo",
      branch: "—",
      base: "main",
      author: info.owner || "—",
      changed: 0,
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
        route={route === "inbox" ? "inbox" : "inbox"}
        onRoute={(r) => { if (r === "inbox") setRoute("inbox"); }}
        onNewReview={() => setDialog(true)}
        counts={{ inbox: prs.length }}
      />
      <main className="crc-main">
        <div className="crc-topbar">
          <h1>{route === "workspace" ? "Review" : "Reviews"}</h1>
          <div className="crc-topbar__spacer" />
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
