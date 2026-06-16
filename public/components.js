/* ============================================================
   Code Review Copilot — Design System Components
   All components exposed on window.CodeReviewCopilotDesignSystem_1910d8
   ============================================================ */

/* ===== Avatar ===== */
(function() {
  const id = "crc-avatar-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-avatar { --_s: 28px; display: inline-flex; align-items: center; justify-content: center;
      width: var(--_s); height: var(--_s); flex: none; border-radius: var(--radius-pill); overflow: hidden;
      background: var(--surface-inset); color: var(--text-body); font-family: var(--font-sans);
      font-size: calc(var(--_s) * 0.4); font-weight: var(--weight-semibold); letter-spacing: -0.01em;
      border: 1px solid var(--border-subtle); user-select: none; }
    .crc-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .crc-avatar--xs { --_s: 20px; }
    .crc-avatar--sm { --_s: 24px; }
    .crc-avatar--lg { --_s: 36px; }
    .crc-avatar--xl { --_s: 48px; }
    .crc-avatar--bot { background: var(--brand-soft); color: var(--brand-on-soft);
      border-color: color-mix(in srgb, var(--brand) 35%, transparent); }
    `;
    document.head.appendChild(el);
  }
})();

function _initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ src, name = "", size = "md", bot = false, className = "", ...rest }) {
  const cls = ["crc-avatar", size !== "md" ? `crc-avatar--${size}` : "", bot ? "crc-avatar--bot" : "", className].filter(Boolean).join(" ");
  return <span className={cls} title={name} {...rest}>{src ? <img src={src} alt={name} /> : _initials(name)}</span>;
}

/* ===== Badge ===== */
(function() {
  const id = "crc-badge-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-badge { display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 8px;
      font-family: var(--font-sans); font-size: var(--text-2xs); font-weight: var(--weight-semibold);
      letter-spacing: 0.01em; border-radius: var(--radius-pill); border: 1px solid transparent;
      white-space: nowrap; line-height: 1; }
    .crc-badge svg { width: 11px; height: 11px; }
    .crc-badge--dot::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: none; }
    .crc-badge--neutral { background: var(--surface-inset); color: var(--text-muted); border-color: var(--border); }
    .crc-badge--brand { background: var(--brand-soft); color: var(--brand-on-soft); }
    .crc-badge--solid { background: var(--brand); color: var(--text-on-brand); }
    .crc-badge--outline { background: transparent; color: var(--text-body); border-color: var(--border-strong); }
    .crc-badge--count { font-family: var(--font-mono); font-feature-settings: "tnum"; padding: 0 7px; }
    `;
    document.head.appendChild(el);
  }
})();

function Badge({ children, variant = "neutral", dot = false, count = false, className = "", ...rest }) {
  const cls = ["crc-badge", `crc-badge--${variant}`, dot ? "crc-badge--dot" : "", count ? "crc-badge--count" : "", className].filter(Boolean).join(" ");
  return <span className={cls} {...rest}>{children}</span>;
}

/* ===== Button ===== */
(function() {
  const id = "crc-button-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-btn { --_h: 36px; --_px: 15px; --_fs: var(--text-sm);
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      height: var(--_h); padding: 0 var(--_px); font-family: var(--font-sans); font-size: var(--_fs);
      font-weight: var(--weight-bold); letter-spacing: -0.005em; border-radius: var(--radius-md);
      border: var(--border-width-strong) solid var(--ink-950); cursor: pointer; white-space: nowrap;
      user-select: none; box-shadow: var(--shadow-hard-sm);
      transition: background-color var(--dur-fast) var(--ease-standard),
                  color var(--dur-fast) var(--ease-standard),
                  transform var(--dur-instant) var(--ease-out),
                  box-shadow var(--dur-instant) var(--ease-out); }
    .crc-btn:hover:not(:disabled) { transform: translate(-1px, -1px); box-shadow: var(--shadow-hard); }
    .crc-btn:active:not(:disabled) { transform: translate(3px, 3px); box-shadow: none; }
    .crc-btn:focus-visible { outline: none; box-shadow: var(--shadow-hard-sm), var(--ring-focus); }
    .crc-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
    .crc-btn svg { width: 1em; height: 1em; flex: none; }
    .crc-btn--sm { --_h: 30px; --_px: 11px; --_fs: var(--text-xs); }
    .crc-btn--lg { --_h: 46px; --_px: 22px; --_fs: var(--text-md); gap: 10px; }
    .crc-btn--block { width: 100%; }
    .crc-btn--primary { background: var(--brand); color: var(--ink-950); }
    .crc-btn--primary:hover:not(:disabled) { background: var(--brand-hover); }
    .crc-btn--primary:active:not(:disabled) { background: var(--brand-press); }
    .crc-btn--secondary { background: var(--surface-raised); color: var(--text-strong); }
    .crc-btn--secondary:hover:not(:disabled) { background: var(--surface-hover); }
    .crc-btn--ghost { background: transparent; color: var(--text-body); border-color: transparent; box-shadow: none; }
    .crc-btn--ghost:hover:not(:disabled) { background: var(--surface-hover); color: var(--text-strong); transform: none; box-shadow: none; }
    .crc-btn--ghost:active:not(:disabled) { transform: scale(0.97); box-shadow: none; }
    .crc-btn--danger { background: var(--sev-bug); color: #fff; }
    .crc-btn--danger:hover:not(:disabled) { background: color-mix(in srgb, var(--sev-bug) 88%, #000); }
    .crc-btn__spin { width: 1em; height: 1em; border-radius: 50%; border: 2px solid currentColor;
      border-right-color: transparent; animation: crc-btn-spin 0.6s linear infinite; opacity: 0.9; }
    @keyframes crc-btn-spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(el);
  }
})();

function Button({ children, variant = "primary", size = "md", leftIcon = null, rightIcon = null, loading = false, fullWidth = false, disabled = false, type = "button", className = "", ...rest }) {
  const cls = ["crc-btn", `crc-btn--${variant}`, size !== "md" ? `crc-btn--${size}` : "", fullWidth ? "crc-btn--block" : "", className].filter(Boolean).join(" ");
  return (
    <button type={type} className={cls} disabled={disabled || loading} {...rest}>
      {loading ? <span className="crc-btn__spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

/* ===== Card ===== */
(function() {
  const id = "crc-card-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-card { display: flex; flex-direction: column; background: var(--surface);
      border: var(--border-width-strong) solid var(--ink-950); border-radius: var(--radius-lg);
      box-shadow: var(--shadow-hard-sm); overflow: hidden; }
    .crc-card--flat { box-shadow: none; border-color: var(--border); }
    .crc-card--raised { box-shadow: var(--shadow-hard); }
    .crc-card--interactive { cursor: pointer;
      transition: box-shadow var(--dur-instant) var(--ease-out), transform var(--dur-instant) var(--ease-out); }
    .crc-card--interactive:hover { box-shadow: var(--shadow-hard); transform: translate(-2px, -2px); }
    .crc-card--interactive:active { box-shadow: var(--shadow-hard-xs); transform: translate(1px, 1px); }
    .crc-card__header { padding: 14px 16px; border-bottom: 1.5px solid var(--ink-950); display: flex; align-items: center; gap: 10px; }
    .crc-card__body { padding: 16px; }
    .crc-card__footer { padding: 12px 16px; border-top: 1.5px solid var(--ink-950); background: var(--surface-sunken); display: flex; align-items: center; gap: 10px; }
    .crc-card__title { font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--text-strong); letter-spacing: -0.01em; }
    `;
    document.head.appendChild(el);
  }
})();

function Card({ children, elevation = "default", interactive = false, className = "", ...rest }) {
  const cls = ["crc-card", elevation === "flat" ? "crc-card--flat" : "", elevation === "raised" ? "crc-card--raised" : "", interactive ? "crc-card--interactive" : "", className].filter(Boolean).join(" ");
  return <div className={cls} {...rest}>{children}</div>;
}
function CardHeader({ children, className = "", ...rest }) { return <div className={`crc-card__header ${className}`} {...rest}>{children}</div>; }
function CardBody({ children, className = "", ...rest }) { return <div className={`crc-card__body ${className}`} {...rest}>{children}</div>; }
function CardFooter({ children, className = "", ...rest }) { return <div className={`crc-card__footer ${className}`} {...rest}>{children}</div>; }
function CardTitle({ children, className = "", ...rest }) { return <div className={`crc-card__title ${className}`} {...rest}>{children}</div>; }

/* ===== IconButton ===== */
(function() {
  const id = "crc-iconbutton-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-iconbtn { --_s: 34px; display: inline-flex; align-items: center; justify-content: center;
      width: var(--_s); height: var(--_s); padding: 0; border-radius: var(--radius-md);
      border: 1px solid transparent; background: transparent; color: var(--text-muted); cursor: pointer;
      transition: var(--transition-colors), transform var(--dur-instant) var(--ease-out); }
    .crc-iconbtn:hover:not(:disabled) { background: var(--surface-hover); color: var(--text-strong); }
    .crc-iconbtn:active:not(:disabled) { transform: scale(0.92); }
    .crc-iconbtn:focus-visible { outline: none; box-shadow: var(--ring-focus); }
    .crc-iconbtn:disabled { opacity: 0.4; cursor: not-allowed; }
    .crc-iconbtn svg { width: 1.05em; height: 1.05em; }
    .crc-iconbtn--sm { --_s: 28px; border-radius: var(--radius-sm); font-size: var(--text-sm); }
    .crc-iconbtn--lg { --_s: 42px; font-size: var(--text-lg); }
    .crc-iconbtn--solid { background: var(--surface); border-color: var(--border); color: var(--text-body); }
    .crc-iconbtn--solid:hover:not(:disabled) { border-color: var(--border-strong); }
    .crc-iconbtn--active { background: var(--brand-soft); color: var(--brand-on-soft); }
    `;
    document.head.appendChild(el);
  }
})();

function IconButton({ children, size = "md", variant = "ghost", active = false, disabled = false, label, className = "", ...rest }) {
  const cls = ["crc-iconbtn", size !== "md" ? `crc-iconbtn--${size}` : "", variant === "solid" ? "crc-iconbtn--solid" : "", active ? "crc-iconbtn--active" : "", className].filter(Boolean).join(" ");
  return <button type="button" className={cls} disabled={disabled} aria-label={label} title={label} {...rest}>{children}</button>;
}

/* ===== Spinner ===== */
(function() {
  const id = "crc-spinner-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-spinner { display: inline-block; width: 1em; height: 1em; flex: none; border-radius: 50%;
      border: 2px solid color-mix(in srgb, currentColor 28%, transparent);
      border-top-color: currentColor; color: var(--brand); animation: crc-spinner-rot 0.62s linear infinite; }
    @keyframes crc-spinner-rot { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .crc-spinner { animation-duration: 1.4s; } }
    `;
    document.head.appendChild(el);
  }
})();

function Spinner({ size = 16, className = "", style = {}, ...rest }) {
  return <span className={`crc-spinner ${className}`} style={{ fontSize: typeof size === "number" ? `${size}px` : size, ...style }} role="status" aria-label="Loading" {...rest} />;
}

/* ===== Input ===== */
(function() {
  const id = "crc-input-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-field { display: flex; flex-direction: column; gap: 6px; }
    .crc-field__label { font-size: var(--text-2xs); font-weight: var(--weight-bold); color: var(--text-body);
      font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; }
    .crc-field__hint { font-size: var(--text-xs); color: var(--text-muted); }
    .crc-field__hint--error { color: var(--sev-bug); }
    .crc-input-wrap { display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 12px;
      background: var(--surface-raised); border: var(--border-width-strong) solid var(--ink-950);
      border-radius: var(--radius-md);
      transition: box-shadow var(--dur-instant) var(--ease-out), transform var(--dur-instant) var(--ease-out); }
    .crc-input-wrap:focus-within { box-shadow: var(--shadow-hard-sm); transform: translate(-1px,-1px); }
    .crc-input-wrap--error { border-color: var(--sev-bug); }
    .crc-input-wrap--error:focus-within { box-shadow: 3px 3px 0 var(--sev-bug); }
    .crc-input-wrap--sm { height: 32px; padding: 0 10px; }
    .crc-input-wrap--mono .crc-input { font-family: var(--font-mono); }
    .crc-input-wrap__icon { color: var(--text-muted); display: inline-flex; }
    .crc-input-wrap__icon svg { width: 15px; height: 15px; }
    .crc-input { flex: 1; min-width: 0; border: none; background: transparent; outline: none;
      font-family: var(--font-sans); font-size: var(--text-sm); color: var(--text-strong); }
    .crc-input::placeholder { color: var(--text-subtle); }
    .crc-input:disabled { cursor: not-allowed; }
    .crc-input-wrap:has(.crc-input:disabled) { opacity: 0.55; background: var(--surface-sunken); }
    `;
    document.head.appendChild(el);
  }
})();

function Input({ label, hint, error, leadingIcon = null, trailingIcon = null, size = "md", mono = false, id, className = "", ...rest }) {
  const wrapCls = ["crc-input-wrap", size === "sm" ? "crc-input-wrap--sm" : "", mono ? "crc-input-wrap--mono" : "", error ? "crc-input-wrap--error" : ""].filter(Boolean).join(" ");
  return (
    <div className={`crc-field ${className}`}>
      {label && <label className="crc-field__label" htmlFor={id}>{label}</label>}
      <div className={wrapCls}>
        {leadingIcon && <span className="crc-input-wrap__icon">{leadingIcon}</span>}
        <input id={id} className="crc-input" {...rest} />
        {trailingIcon && <span className="crc-input-wrap__icon">{trailingIcon}</span>}
      </div>
      {(error || hint) && <span className={`crc-field__hint ${error ? "crc-field__hint--error" : ""}`}>{error || hint}</span>}
    </div>
  );
}

/* ===== Tabs ===== */
(function() {
  const id = "crc-tabs-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-tabs { display: flex; align-items: center; gap: 2px; border-bottom: 2px solid var(--ink-950); }
    .crc-tab { position: relative; display: inline-flex; align-items: center; gap: 7px;
      padding: 10px 13px; border: none; background: transparent; cursor: pointer;
      font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--weight-bold);
      text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted);
      transition: var(--transition-colors); white-space: nowrap; }
    .crc-tab:hover { color: var(--text-strong); }
    .crc-tab:focus-visible { outline: none; box-shadow: var(--ring-focus); }
    .crc-tab svg { width: 15px; height: 15px; }
    .crc-tab--active { color: var(--text-strong); }
    .crc-tab--active::after { content: ""; position: absolute; left: 4px; right: 4px; bottom: -2px; height: 3px; background: var(--brand); }
    .crc-tab__count { font-family: var(--font-mono); font-size: var(--text-2xs); font-weight: var(--weight-bold);
      padding: 1px 6px; border-radius: var(--radius-xs); border: 1px solid var(--border);
      background: var(--surface-inset); color: var(--text-muted); }
    .crc-tab--active .crc-tab__count { background: var(--brand); color: var(--ink-950); border-color: var(--ink-950); }
    `;
    document.head.appendChild(el);
  }
})();

function Tabs({ items = [], value, onChange, className = "", ...rest }) {
  return (
    <div className={`crc-tabs ${className}`} role="tablist" {...rest}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button key={it.value} role="tab" aria-selected={active} className={`crc-tab ${active ? "crc-tab--active" : ""}`} onClick={() => onChange && onChange(it.value)}>
            {it.icon}{it.label}
            {it.count != null && <span className="crc-tab__count">{it.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ===== SeverityBadge ===== */
(function() {
  const id = "crc-severity-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-sev { display: inline-flex; align-items: center; gap: 5px; height: 21px; padding: 0 8px 0 7px;
      font-family: var(--font-mono); font-size: var(--text-2xs); font-weight: var(--weight-bold);
      letter-spacing: 0.08em; text-transform: uppercase; line-height: 1; border-radius: var(--radius-xs);
      border: 1.5px solid var(--_c); white-space: nowrap; }
    .crc-sev__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--_c); flex: none; }
    .crc-sev svg { width: 11px; height: 11px; }
    .crc-sev--soft { background: var(--_soft); color: var(--_c); }
    .crc-sev--solid { background: var(--_c); color: var(--ink-950); border-color: var(--ink-950); }
    .crc-sev--outline { background: transparent; color: var(--_c); }
    .crc-sev--solid .crc-sev__dot { background: var(--ink-950); }
    `;
    document.head.appendChild(el);
  }
})();

const SEV_MAP = {
  bug:         { label: "Bug",         c: "var(--sev-bug)",     soft: "var(--sev-bug-soft)" },
  security:    { label: "Security",    c: "var(--sev-security)",soft: "var(--sev-security-soft)" },
  performance: { label: "Performance", c: "var(--sev-perf)",    soft: "var(--sev-perf-soft)" },
  style:       { label: "Style",       c: "var(--sev-style)",   soft: "var(--sev-style-soft)" },
  suggestion:  { label: "Suggestion",  c: "var(--sev-suggest)", soft: "var(--sev-suggest-soft)" },
};

function SeverityBadge({ severity = "suggestion", tone = "soft", showDot = true, className = "", ...rest }) {
  const s = SEV_MAP[severity] || SEV_MAP.suggestion;
  return (
    <span className={`crc-sev crc-sev--${tone} ${className}`} style={{ "--_c": s.c, "--_soft": s.soft }} {...rest}>
      {showDot && <span className="crc-sev__dot" />}
      {s.label}
    </span>
  );
}

/* ===== DiffLine ===== */
(function() {
  const id = "crc-diffline-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-diff { font-family: var(--font-mono); font-size: var(--text-sm);
      line-height: var(--leading-code); border-radius: var(--radius-md); overflow: hidden;
      border: 1px solid var(--border-subtle); background: var(--surface); }
    .crc-diffline { display: grid; grid-template-columns: 44px 16px 1fr; align-items: stretch; }
    .crc-diffline__num { text-align: right; padding: 0 8px; color: var(--text-subtle);
      background: var(--diff-gutter); border-right: 1px solid var(--border-subtle);
      font-size: var(--text-xs); user-select: none; font-variant-numeric: tabular-nums; }
    .crc-diffline__sign { text-align: center; user-select: none; opacity: 0.85; }
    .crc-diffline__code { padding: 0 10px; white-space: pre; overflow-x: auto; color: var(--text-body); scrollbar-width: none; }
    .crc-diffline__code::-webkit-scrollbar { height: 0; display: none; }
    .crc-diffline--add { background: var(--diff-add-bg); }
    .crc-diffline--add .crc-diffline__sign { color: var(--diff-add-line); }
    .crc-diffline--add .crc-diffline__code { color: var(--diff-add-text); }
    .crc-diffline--add .crc-diffline__num { background: color-mix(in srgb, var(--diff-add-line) 14%, transparent); }
    .crc-diffline--remove { background: var(--diff-del-bg); }
    .crc-diffline--remove .crc-diffline__sign { color: var(--diff-del-line); }
    .crc-diffline--remove .crc-diffline__code { color: var(--diff-del-text); }
    .crc-diffline--remove .crc-diffline__num { background: color-mix(in srgb, var(--diff-del-line) 13%, transparent); }
    .crc-diffline--flag { box-shadow: inset 2px 0 0 var(--brand); }
    .crc-diff__hunk { padding: 2px 12px; font-size: var(--text-xs); color: var(--text-muted);
      background: var(--surface-sunken); border-bottom: 1px solid var(--border-subtle); }
    `;
    document.head.appendChild(el);
  }
})();

const _SIGN = { add: "+", remove: "-", context: "" };

function DiffLine({ type = "context", lineNumber, content = "", flagged = false, className = "", ...rest }) {
  return (
    <div className={`crc-diffline crc-diffline--${type} ${flagged ? "crc-diffline--flag" : ""} ${className}`} {...rest}>
      <span className="crc-diffline__num">{lineNumber ?? ""}</span>
      <span className="crc-diffline__sign">{_SIGN[type]}</span>
      <span className="crc-diffline__code">{content}</span>
    </div>
  );
}

/* ===== FindingCard ===== */
(function() {
  const id = "crc-finding-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-finding { display: flex; gap: 13px; padding: 14px 16px 14px 14px;
      background: var(--surface); border: var(--border-width-strong) solid var(--ink-950);
      border-left: 6px solid var(--_c); border-radius: var(--radius-md); position: relative;
      box-shadow: var(--shadow-hard-sm);
      transition: box-shadow var(--dur-instant) var(--ease-out), transform var(--dur-instant) var(--ease-out); }
    .crc-finding:hover { box-shadow: var(--shadow-hard); transform: translate(-1px, -1px); }
    .crc-finding--dismissed { opacity: 0.5; box-shadow: none; }
    .crc-finding__ico { width: 32px; height: 32px; flex: none; border-radius: var(--radius-sm);
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--_c); color: var(--ink-950); border: 1.5px solid var(--ink-950); }
    .crc-finding__ico svg { width: 17px; height: 17px; }
    .crc-finding__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
    .crc-finding__head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .crc-finding__loc { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted);
      background: var(--surface-inset); padding: 2px 7px; border-radius: var(--radius-xs); border: 1px solid var(--border); }
    .crc-finding__loc b { color: var(--text-strong); font-weight: var(--weight-bold); }
    .crc-finding__issue { font-size: var(--text-md); font-weight: var(--weight-bold);
      color: var(--text-strong); line-height: var(--leading-snug); letter-spacing: -0.01em; }
    .crc-finding__row { font-size: var(--text-sm); color: var(--text-body); line-height: var(--leading-snug); }
    .crc-finding__row > b { color: var(--text-strong); font-weight: var(--weight-bold); }
    .crc-finding__fix { display: flex; gap: 8px; align-items: flex-start;
      background: var(--code-bg); border-radius: var(--radius-sm); padding: 9px 11px; }
    .crc-finding__fix code { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--code-text); }
    .crc-finding__fixlabel { color: var(--acid-400); font-weight: var(--weight-bold); flex: none; font-size: var(--text-2xs);
      font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.1em; padding-top: 2px; }
    .crc-finding__explain { font-family: var(--font-serif); font-style: italic; font-size: var(--text-md);
      color: var(--text-muted); border-left: 2px solid var(--_c); padding-left: 11px; line-height: 1.3; }
    .crc-finding__actions { display: flex; gap: 4px; align-items: flex-start; }
    .crc-finding__act { width: 28px; height: 28px; border-radius: var(--radius-sm); border: none;
      background: transparent; color: var(--text-subtle); cursor: pointer; display: inline-flex;
      align-items: center; justify-content: center; transition: var(--transition-colors); }
    .crc-finding__act:hover { background: var(--surface-hover); color: var(--text-strong); }
    .crc-finding__act svg { width: 15px; height: 15px; }
    `;
    document.head.appendChild(el);
  }
})();

const _SEV_META = {
  bug:         { c: "var(--sev-bug)",     soft: "var(--sev-bug-soft)" },
  security:    { c: "var(--sev-security)",soft: "var(--sev-security-soft)" },
  performance: { c: "var(--sev-perf)",    soft: "var(--sev-perf-soft)" },
  style:       { c: "var(--sev-style)",   soft: "var(--sev-style-soft)" },
  suggestion:  { c: "var(--sev-suggest)", soft: "var(--sev-suggest-soft)" },
};

function _SevIcon({ severity }) {
  const wrap = (children) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
  switch (severity) {
    case "bug": return wrap(<><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></>);
    case "security": return wrap(<><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></>);
    case "performance": return wrap(<><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></>);
    case "style": return wrap(<><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></>);
    default: return wrap(<><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></>);
  }
}

function FindingCard({ severity = "suggestion", filename, line, issue, why, fix, explanation, dismissed = false, onDismiss, className = "", ...rest }) {
  const m = _SEV_META[severity] || _SEV_META.suggestion;
  return (
    <div className={`crc-finding ${dismissed ? "crc-finding--dismissed" : ""} ${className}`} style={{ "--_c": m.c, "--_soft": m.soft }} {...rest}>
      <span className="crc-finding__ico"><_SevIcon severity={severity} /></span>
      <div className="crc-finding__main">
        <div className="crc-finding__head">
          <SeverityBadge severity={severity} />
          {filename && <span className="crc-finding__loc">{filename}{line != null && <b>:{line}</b>}</span>}
        </div>
        {issue && <div className="crc-finding__issue">{issue}</div>}
        {why && <div className="crc-finding__row"><b>Why it matters:</b> {why}</div>}
        {fix && <div className="crc-finding__fix"><span className="crc-finding__fixlabel">Fix</span><code>{fix}</code></div>}
        {explanation && <div className="crc-finding__explain">{explanation}</div>}
      </div>
      {onDismiss && (
        <div className="crc-finding__actions">
          <button className="crc-finding__act" onClick={onDismiss} title="Dismiss" aria-label="Dismiss finding">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* ===== RiskPill ===== */
(function() {
  const id = "crc-riskpill-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-risk { display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px 0 8px;
      font-family: var(--font-mono); font-size: var(--text-2xs); font-weight: var(--weight-bold);
      letter-spacing: 0.06em; text-transform: uppercase; border-radius: var(--radius-xs);
      border: 1.5px solid var(--_c); line-height: 1; background: var(--_soft); color: var(--_c); }
    .crc-risk__ico { display: inline-flex; }
    .crc-risk__ico svg { width: 13px; height: 13px; }
    .crc-risk--bare { background: transparent; border-color: transparent; padding-left: 0; padding-right: 0; }
    `;
    document.head.appendChild(el);
  }
})();

const _RISK = {
  low:    { c: "var(--risk-low)",    soft: "color-mix(in srgb, var(--risk-low) 13%, transparent)" },
  medium: { c: "var(--risk-medium)", soft: "color-mix(in srgb, var(--risk-medium) 15%, transparent)" },
  high:   { c: "var(--risk-high)",   soft: "color-mix(in srgb, var(--risk-high) 14%, transparent)" },
};

function _RiskIcon({ level }) {
  const shield = "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z";
  const inner = { low: <path d="m9 12 2 2 4-4" />, medium: <><path d="M12 8v4" /><path d="M12 16h.01" /></>, high: <><path d="m14.5 9.5-5 5" /><path d="m9.5 9.5 5 5" /></> }[level];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={shield} />{inner}</svg>;
}

function RiskPill({ level = "low", showIcon = true, bare = false, className = "", ...rest }) {
  const r = _RISK[level] || _RISK.low;
  return (
    <span className={`crc-risk ${bare ? "crc-risk--bare" : ""} ${className}`} style={{ "--_c": r.c, "--_soft": r.soft }} {...rest}>
      {showIcon && <span className="crc-risk__ico"><_RiskIcon level={level} /></span>}
      <span className="crc-risk__label">{level} risk</span>
    </span>
  );
}

/* ===== ScoreMeter ===== */
(function() {
  const id = "crc-score-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-score { display: flex; flex-direction: column; gap: 8px; }
    .crc-score__top { display: flex; align-items: baseline; gap: 7px; white-space: nowrap; }
    .crc-score__val { font-family: var(--font-mono); font-weight: var(--weight-bold);
      font-size: var(--text-3xl); color: var(--text-strong); letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums; line-height: 0.9; }
    .crc-score__den { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text-muted); }
    .crc-score__label { margin-left: auto; font-family: var(--font-mono); font-size: var(--text-2xs);
      font-weight: var(--weight-bold); color: var(--ink-950); background: var(--_c); padding: 3px 7px;
      border-radius: var(--radius-xs); text-transform: uppercase; letter-spacing: 0.08em; align-self: center; }
    .crc-score__track { display: flex; gap: 3px; }
    .crc-score__seg { flex: 1; height: 8px; border-radius: 1px; background: var(--surface-inset); border: 1px solid var(--border); }
    .crc-score__seg--on { background: var(--_c); border-color: var(--_c); }
    .crc-score--lg .crc-score__val { font-size: var(--text-5xl); }
    .crc-score--lg .crc-score__seg { height: 10px; }
    `;
    document.head.appendChild(el);
  }
})();

function _scoreColor(score) {
  if (score >= 8) return { c: "var(--risk-low)", label: "strong" };
  if (score >= 5) return { c: "var(--risk-medium)", label: "fair" };
  return { c: "var(--risk-high)", label: "weak" };
}

function ScoreMeter({ score = 0, total = 10, size = "md", showLabel = true, className = "", ...rest }) {
  const s = Math.max(0, Math.min(total, score));
  const { c, label } = _scoreColor(s);
  return (
    <div className={`crc-score ${size === "lg" ? "crc-score--lg" : ""} ${className}`} style={{ "--_c": c }} {...rest}>
      <div className="crc-score__top">
        <span className="crc-score__val">{s}</span>
        <span className="crc-score__den">/ {total}</span>
        {showLabel && <span className="crc-score__label">{label}</span>}
      </div>
      <div className="crc-score__track" role="meter" aria-valuenow={s} aria-valuemin={0} aria-valuemax={total}>
        {Array.from({ length: total }).map((_, i) => <span key={i} className={`crc-score__seg ${i < s ? "crc-score__seg--on" : ""}`} />)}
      </div>
    </div>
  );
}

/* ===== VerdictStamp ===== */
(function() {
  const id = "crc-stamp-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style"); el.id = id;
    el.textContent = `
    .crc-stamp { display: inline-flex; flex-direction: column; align-items: center; gap: 2px;
      padding: 7px 14px 6px; border: 3px solid var(--_c); border-radius: var(--radius-sm);
      color: var(--_c); background: color-mix(in srgb, var(--_c) 8%, transparent);
      transform: rotate(-7deg); position: relative; user-select: none;
      box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--_c) 45%, transparent); }
    .crc-stamp__v { font-family: var(--font-mono); font-weight: var(--weight-bold);
      font-size: var(--text-lg); text-transform: uppercase; letter-spacing: 0.12em; line-height: 1; }
    .crc-stamp__sub { font-family: var(--font-mono); font-size: 8px; font-weight: var(--weight-bold);
      text-transform: uppercase; letter-spacing: 0.3em; opacity: 0.75; }
    .crc-stamp--sm { padding: 5px 10px 4px; border-width: 2.5px; transform: rotate(-6deg); }
    .crc-stamp--sm .crc-stamp__v { font-size: var(--text-sm); }
    .crc-stamp--flat { transform: none; }
    `;
    document.head.appendChild(el);
  }
})();

const _VERDICT = {
  "Safe to merge": { c: "var(--risk-low)" },
  "Needs work":    { c: "var(--risk-medium)" },
  "Do not merge":  { c: "var(--risk-high)" },
};

function VerdictStamp({ verdict = "Needs work", size = "md", rotate = true, className = "", ...rest }) {
  const v = _VERDICT[verdict] || _VERDICT["Needs work"];
  const cls = ["crc-stamp", size === "sm" ? "crc-stamp--sm" : "", rotate ? "" : "crc-stamp--flat", className].filter(Boolean).join(" ");
  return (
    <span className={cls} style={{ "--_c": v.c }} {...rest}>
      <span className="crc-stamp__sub">Copilot verdict</span>
      <span className="crc-stamp__v">{verdict}</span>
    </span>
  );
}

/* ===== Export namespace ===== */
window.CodeReviewCopilotDesignSystem_1910d8 = {
  Avatar, Badge, Button, Card, CardHeader, CardBody, CardFooter, CardTitle,
  IconButton, Spinner, Input, Tabs,
  DiffLine, FindingCard, RiskPill, ScoreMeter, SeverityBadge, VerdictStamp,
};
