function Sidebar({ route, onRoute, onNewReview, counts }) {
  const Icon = window.CRCIcon;
  const NS = window.CodeReviewCopilotDesignSystem_1910d8;
  const { Button, Avatar } = NS;

  const item = (id, icon, label, count) => (
    <button className={"crc-navitem" + (route === id ? " crc-navitem--active" : "")} onClick={() => onRoute(id)}>
      <Icon name={icon} size={17} />
      <span>{label}</span>
      {count != null && <span className="crc-navitem__count">{count}</span>}
    </button>
  );

  return (
    <aside className="crc-side">
      <div className="crc-side__brand">
        <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
          <rect x="0.5" y="0.5" width="39" height="39" rx="10" fill="#12A06E" />
          <path d="M11.5 20.6L17 26L28.5 13.5" stroke="#FCFFFE" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11.6" cy="13.4" r="1.7" fill="#FCFFFE" fillOpacity="0.92" />
        </svg>
        <b>Copilot</b>
      </div>
      <div className="crc-side__new">
        <Button variant="primary" fullWidth leftIcon={<Icon name="plus" size={15} />} onClick={onNewReview}>
          New review
        </Button>
      </div>
      <nav className="crc-nav">
        {item("inbox", "inbox", "Reviews", counts.inbox)}
      </nav>
      <div className="crc-side__user">
        <Avatar name="User" size="sm" />
        <div>
          <b style={{ display: "block", lineHeight: 1.2 }}>User</b>
        </div>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;
