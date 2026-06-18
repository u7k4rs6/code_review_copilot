function StatusChip({ status }) {
  const map = {
    reviewed: ["reviewed", "Reviewed"],
    reviewing: ["reviewing", "Reviewing…"],
    queued: ["queued", "Queued"],
  };
  const [cls, label] = map[status] || map.queued;
  return (
    <span className={"crc-status crc-status--" + cls}>
      {status === "reviewing"
        ? <span className="crc-spinner" style={{ fontSize: 11, color: "currentColor" }} />
        : <span className="d" style={{ background: "currentColor" }} />}
      {label}
    </span>
  );
}

function PRRow({ pr, onOpen }) {
  const Icon = window.CRCIcon;
  const NS = window.CodeReviewCopilotDesignSystem_1910d8;
  const { RiskPill, Avatar } = NS;
  return (
    <div className="crc-prrow" onClick={() => onOpen(pr)}>
      <div className="crc-prrow__t">
        <span className="crc-prrow__ic"><Icon name="git-pull-request" size={18} /></span>
        <div className="crc-prrow__meta">
          <div className="crc-prrow__title">{pr.title}</div>
          <div className="crc-prrow__sub">
            <span>{pr.repo} #{pr.id}</span>
            <span><span className="add">+{pr.additions}</span> <span className="del">&minus;{pr.deletions}</span></span>
          </div>
        </div>
      </div>
      <div className="crc-prrow__cell"><Avatar name={pr.author} size="xs" /> {pr.author}</div>
      <div>{pr.status === "reviewed" ? <RiskPill level={pr.risk} /> : <StatusChip status={pr.status} />}</div>
      <div className="crc-prrow__cell">
        {pr.findings != null
          ? <><Icon name="message-square" size={14} /> {pr.findings} findings</>
          : <span style={{ color: "var(--text-subtle)" }}>&mdash;</span>}
      </div>
      <div className="crc-prrow__updated">{formatPRDate(pr.updated)}</div>
    </div>
  );
}

function PRInbox({ prs, onOpen }) {
  return (
    <div className="crc-page">
      <div className="crc-inbox">
        {prs.map((pr) => <PRRow key={pr.id} pr={pr} onOpen={onOpen} />)}
      </div>
    </div>
  );
}
window.PRInbox = PRInbox;

function formatPRDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

