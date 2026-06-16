function NewReviewDialog({ onClose, onComplete }) {
  const Icon = window.CRCIcon;
  const NS = window.CodeReviewCopilotDesignSystem_1910d8;
  const { Button, Input, IconButton } = NS;

  const [url, setUrl] = React.useState("");
  const [stage, setStage] = React.useState("form"); // form | scanning | error
  const [step, setStep] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [apiResult, setApiResult] = React.useState(null);

  const steps = [
    "Fetching pull request diff",
    "Parsing changed files",
    "Analyzing with Gemini",
    "Scoring risk & posting review",
  ];

  // Start API call and animation when scanning begins
  React.useEffect(() => {
    if (stage !== "scanning") return;

    const controller = new AbortController();

    fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prUrl: url }),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => { throw new Error(e.error || `Server error ${res.status}`); });
        return res.json();
      })
      .then((data) => setApiResult(data))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStage("error");
      });

    return () => controller.abort();
  }, [stage]);

  // Advance animation steps
  React.useEffect(() => {
    if (stage !== "scanning" || step >= steps.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 750);
    return () => clearTimeout(t);
  }, [stage, step]);

  // Complete when both animation is done AND API has responded
  React.useEffect(() => {
    if (stage !== "scanning") return;
    if (step >= steps.length && apiResult) {
      const t = setTimeout(() => onComplete(apiResult), 400);
      return () => clearTimeout(t);
    }
  }, [step, apiResult, stage]);

  const handleRun = () => {
    if (!url.trim()) return;
    setStage("scanning");
    setStep(0);
    setApiResult(null);
    setError(null);
  };

  return (
    <div className="crc-scrim" onClick={stage === "form" ? onClose : undefined}>
      <div className="crc-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="crc-dialog__h">
          <Icon name="sparkles" size={17} style={{ color: "var(--brand)" }} />
          <b>New review</b>
          {stage === "form" && (
            <span className="x">
              <IconButton label="Close" onClick={onClose}><Icon name="x" size={16} /></IconButton>
            </span>
          )}
        </div>

        {stage === "form" && (
          <>
            <div className="crc-dialog__b">
              <Input
                label="Pull request URL"
                mono
                leadingIcon={<Icon name="git-pull-request" size={15} />}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repo/pull/123"
              />
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                Copilot fetches the diff, analyzes each change with Gemini, and posts inline findings plus a risk summary back to the PR.
              </p>
            </div>
            <div className="crc-dialog__f">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button variant="primary" leftIcon={<Icon name="sparkles" size={15} />} onClick={handleRun} disabled={!url.trim()}>
                Run review
              </Button>
            </div>
          </>
        )}

        {stage === "scanning" && (
          <div className="crc-scan">
            <div className="crc-scan__ring" />
            <div>
              <b>Copilot is reviewing…</b><br />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                {url.match(/github\.com\/([^/]+\/[^/]+\/pull\/\d+)/)?.[1] || url}
              </span>
            </div>
            <div className="crc-scan__steps">
              {steps.map((s, i) => (
                <div key={i} className={"crc-scan__step" + (i < step ? " crc-scan__step--done" : "")}>
                  {i < step
                    ? <span className="ok"><Icon name="check" size={14} /></span>
                    : i === step
                      ? <span className="crc-spinner" style={{ fontSize: 13 }} />
                      : <span style={{ width: 14, height: 14, borderRadius: "50%", border: "1.5px solid var(--border-strong)", flex: "none", display: "inline-block" }} />}
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "error" && (
          <div className="crc-scan">
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "color-mix(in srgb, var(--sev-bug) 15%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="circle-alert" size={24} style={{ color: "var(--sev-bug)" }} />
            </div>
            <div>
              <b style={{ color: "var(--text-strong)" }}>Review failed</b><br />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{error}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" onClick={onClose}>Close</Button>
              <Button variant="secondary" onClick={() => { setStage("form"); setError(null); }}>Try again</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
window.NewReviewDialog = NewReviewDialog;
