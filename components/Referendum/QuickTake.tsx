import type { Argument } from "@/lib/types";

interface QuickTakeProps {
    arguments_: Argument[];
}

export default function QuickTake({ arguments_ }: QuickTakeProps) {
    const pros = arguments_.filter((a) => a.type === "pro");
    const cons = arguments_.filter((a) => a.type === "con");

    return (
        <div className="qt-shell">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="qt-header">
                <div className="qt-header-left">
                    <span className="qt-eyebrow">Quick take</span>
                    <p className="qt-description">
                        Trade-offs around{" "}
                        <strong className="qt-highlight">cost risk</strong> and{" "}
                        <strong className="qt-highlight">implementation safeguards</strong>{" "}
                        are highlighted based on your priorities.
                    </p>
                </div>
                <span className="qt-badge">{arguments_.length} points</span>
            </div>

            {/* ── Two-column split ──────────────────────────────────── */}
            <div className="qt-columns">
                {/* PRO column */}
                <div className="qt-col qt-col-pro">
                    <div className="qt-col-label">
                        <span className="qt-col-icon qt-col-icon-pro">↑</span>
                        <span>For</span>
                    </div>
                    <div className="qt-col-items">
                        {pros.map((arg) => (
                            <ArgumentRow key={arg.title} arg={arg} />
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="qt-col-divider" aria-hidden="true" />

                {/* CON column */}
                <div className="qt-col qt-col-con">
                    <div className="qt-col-label">
                        <span className="qt-col-icon qt-col-icon-con">↓</span>
                        <span>Against</span>
                    </div>
                    <div className="qt-col-items">
                        {cons.map((arg) => (
                            <ArgumentRow key={arg.title} arg={arg} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Footer bar ────────────────────────────────────────── */}
            <div className="qt-footer">
                <div className="qt-footer-dot" aria-hidden="true" />
                <p className="qt-footer-text">
                    AI-generated summary · not a voting recommendation
                </p>
                <button className="qt-footer-btn">
                    Edit priorities
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* ── Scoped styles ──────────────────────────────────────── */}
            <style>{`
        /* Shell */
        .qt-shell {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
        }

        /* Header */
        .qt-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1rem 0.875rem;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .qt-header-left {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .qt-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-text-muted);
        }

        .qt-description {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .qt-highlight {
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .qt-badge {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          font-size: 0.68rem;
          font-weight: 600;
          background-color: var(--background-muted);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border);
          white-space: nowrap;
        }

        /* Two-column layout */
        .qt-columns {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
        }

        .qt-col {
          display: flex;
          flex-direction: column;
          padding: 0.875rem 1rem;
        }

        .qt-col-divider {
          background-color: var(--color-border-subtle);
          margin: 0.875rem 0;
        }

        /* Column label row */
        .qt-col-label {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 0.625rem;
        }

        .qt-col-pro .qt-col-label { color: var(--yellow-ink); }
        .qt-col-con .qt-col-label { color: var(--color-text-muted); }

        .qt-col-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 0.65rem;
          font-weight: 800;
          flex-shrink: 0;
          line-height: 1;
        }

        .qt-col-icon-pro {
          background-color: var(--yellow);
          color: var(--yellow-ink);
        }

        .qt-col-icon-con {
          background-color: var(--background-muted);
          color: var(--color-text-secondary);
          border: 1px solid var(--color-border);
        }

        /* Argument items list */
        .qt-col-items {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* Argument row */
        .qt-arg {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 8px 10px;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          transition: background-color 0.15s ease, border-color 0.15s ease;
          cursor: default;
        }

        .qt-arg-pro {
          background-color: var(--yellow-light);
          border-color: color-mix(in srgb, var(--yellow) 30%, transparent);
        }

        .qt-arg-con {
          background-color: var(--color-surface-raised);
          border-color: var(--color-border-subtle);
        }

        .qt-arg-pro:hover {
          background-color: color-mix(in srgb, var(--yellow-light) 60%, var(--yellow-mid));
          border-color: var(--yellow-mid);
        }

        .qt-arg-con:hover {
          background-color: var(--background-muted);
          border-color: var(--color-border);
        }

        .qt-arg-title {
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 0;
        }

        .qt-arg-pro .qt-arg-title { color: var(--yellow-ink); }
        .qt-arg-con .qt-arg-title { color: var(--color-text-primary); }

        .qt-arg-body {
          font-size: 0.78rem;
          line-height: 1.55;
          margin: 0;
        }

        .qt-arg-pro .qt-arg-body { color: var(--yellow-dark); }
        .qt-arg-con .qt-arg-body { color: var(--color-text-secondary); }

        /* Footer */
        .qt-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border-top: 1px solid var(--color-border-subtle);
          background-color: var(--color-surface-raised);
        }

        .qt-footer-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background-color: var(--yellow);
          flex-shrink: 0;
          animation: qt-pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .qt-footer-text {
          flex: 1;
          font-size: 0.68rem;
          color: var(--color-text-muted);
          margin: 0;
          line-height: 1;
        }

        .qt-footer-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-text-muted);
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: color 0.15s ease;
          white-space: nowrap;
        }

        .qt-footer-btn:hover { color: var(--yellow-dark); }

        .qt-footer-btn svg { transition: transform 0.2s ease; }
        .qt-footer-btn:hover svg { transform: translateX(2px); }

        @keyframes qt-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }

        /* Responsive: stack on narrow screens */
        @media (max-width: 480px) {
          .qt-columns { grid-template-columns: 1fr; }
          .qt-col-divider { height: 1px; width: auto; margin: 0 1rem; }
        }
      `}</style>
        </div>
    );
}

/* ── Sub-component ─────────────────────────────────────────────── */
function ArgumentRow({ arg }: { arg: Argument }) {
    const isPro = arg.type === "pro";
    return (
        <div className={`qt-arg ${isPro ? "qt-arg-pro" : "qt-arg-con"}`}>
            <p className="qt-arg-title">{arg.title}</p>
            <p className="qt-arg-body">{arg.body}</p>
        </div>
    );
}