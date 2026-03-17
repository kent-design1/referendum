"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────── */
type ArgumentType     = "pro" | "con";
type ArgumentStrength = "strong" | "moderate";
type ArgumentCategory = "Economic" | "Environmental" | "Social" | "Governance" | "Legal";

interface QuickTakeArgument {
    id:         string;
    type:       ArgumentType;
    title:      string;
    body:       string;
    category:   ArgumentCategory;
    strength:   ArgumentStrength;
    sourceId?:  string;
    upvotes:    number;
    contested?: boolean;
}

interface QuickTakeMeta {
    title:         string;
    voteDate:      string;
    highlightedOn: string[];
    proWeight:     number;   // 0–100
}

/* ─────────────────────────────────────────────────────────────
   MOCK DATA — swap MOCK_ARGUMENTS + MOCK_META for API response
   ───────────────────────────────────────────────────────────── */
const MOCK_META: QuickTakeMeta = {
    title:         "Initiative for a Federal Climate Investment Fund",
    voteDate:      "9 Jun 2025",
    highlightedOn: ["cost risk", "implementation safeguards"],
    proWeight:     54,
};

const MOCK_ARGUMENTS: QuickTakeArgument[] = [
    /* PRO */
    {
        id: "p1", type: "pro", strength: "strong", category: "Environmental",
        title: "Closes Switzerland's Paris Agreement gap",
        body:  "Current policy puts Switzerland 18% short of its 2030 NDC target. The fund directly addresses the investment shortfall identified by BAFU and fills the financing gap that voluntary measures have failed to close.",
        sourceId: "S2", upvotes: 91,
    },
    {
        id: "p2", type: "pro", strength: "strong", category: "Governance",
        title: "Long-term planning security for cantons",
        body:  "Removes year-to-year budget uncertainty, enabling multi-year decarbonisation projects with the confidence municipalities currently lack. Several cantonal energy directors have cited this as the single most impactful change.",
        sourceId: "S1", upvotes: 84,
    },

    /* CON */
    {
        id: "c1", type: "con", strength: "strong", category: "Economic",
        title: "CHF 2B annual cost lacks fiscal offset",
        body:  "The Federal Finance Administration notes no earmarked revenue source, creating structural budget pressure or requiring a new payroll levy. Without a clear funding mechanism, the figure competes with healthcare, education and infrastructure.",
        sourceId: "S1", upvotes: 78,
    },
    {
        id: "c2", type: "con", strength: "strong", category: "Legal",
        title: "Bypasses cantonal constitutional competencies",
        body:  "The Conference of Cantonal Governments argues the fund centralises decisions assigned to cantons by Art. 74 & 89. Accepting a federal override here sets a precedent that could be applied to other cantonal policy areas.",
        sourceId: "S6", upvotes: 65,
    },
];

const CATEGORY_ICONS: Record<ArgumentCategory, string> = {
    Economic: "📊", Environmental: "🌱", Social: "🤝", Governance: "🏛️", Legal: "⚖️",
};

/* ─────────────────────────────────────────────────────────────
   ROOT COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function QuickTake() {
    const pros = MOCK_ARGUMENTS.filter((a) => a.type === "pro");
    const cons = MOCK_ARGUMENTS.filter((a) => a.type === "con");

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [votedIds,   setVotedIds]   = useState<Set<string>>(new Set());

    function toggleExpand(id: string) {
        setExpandedId((prev) => (prev === id ? null : id));
    }

    function toggleVote(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        setVotedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    return (
        <div className="qt-shell">

            {/* ── Header ──────────────────────────────────────── */}
            <div className="qt-header">
                <div className="qt-header-left">
          <span className="qt-eyebrow">
            <span className="qt-eyebrow-dot" />
            Quick take
          </span>
                    <p className="qt-desc">
                        Key trade-offs on{" "}
                        {MOCK_META.highlightedOn.map((h, i) => (
                            <span key={h}>
                <strong className="qt-hl">{h}</strong>
                                {i < MOCK_META.highlightedOn.length - 1 ? " and " : ""}
              </span>
                        ))}
                        {" "}— based on your priority profile.
                    </p>
                </div>
                <span className="qt-count-pill">{MOCK_ARGUMENTS.length} points</span>
            </div>

            {/* ── Community weight bar ────────────────────────── */}
            <div className="qt-weight">
                <div className="qt-weight-labels">
                    <span className="qt-wl-pro">For {MOCK_META.proWeight}%</span>
                    <span className="qt-wl-mid">Community weight</span>
                    <span className="qt-wl-con">Against {100 - MOCK_META.proWeight}%</span>
                </div>
                <div className="qt-weight-track">
                    <div className="qt-weight-fill" style={{ width: `${MOCK_META.proWeight}%` }} />
                    <div className="qt-weight-mid-line" />
                </div>
            </div>

            {/* ── Two-column grid ─────────────────────────────── */}
            <div className="qt-columns">
                <Column
                    side="pro"
                    args={pros}
                    expandedId={expandedId}
                    votedIds={votedIds}
                    onExpand={toggleExpand}
                    onVote={toggleVote}
                />
                <div className="qt-divider" aria-hidden="true" />
                <Column
                    side="con"
                    args={cons}
                    expandedId={expandedId}
                    votedIds={votedIds}
                    onExpand={toggleExpand}
                    onVote={toggleVote}
                />
            </div>

            {/* ── Footer ──────────────────────────────────────── */}
            <div className="qt-footer">
                <div className="qt-footer-dot" aria-hidden="true" />
                <p className="qt-footer-text">
                    AI-generated summary · not a voting recommendation · mock data
                </p>
                <button className="qt-footer-btn">
                    Full arguments
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M2 5h6M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4"
                              strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* ── Scoped styles ───────────────────────────────── */}
            <style>{`

        /* Shell */
        .qt-shell {
          display: flex; flex-direction: column;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        /* Header */
        .qt-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 0.75rem;
          padding: 0.875rem 1rem 0.75rem;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .qt-header-left { display: flex; flex-direction: column; gap: 4px; }

        .qt-eyebrow {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--color-text-muted);
        }

        .qt-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--yellow); flex-shrink: 0;
          animation: qt-pulse 2.4s ease-in-out infinite;
        }

        @keyframes qt-pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }

        .qt-desc { font-size: 0.78rem; color: var(--color-text-secondary); line-height: 1.6; margin: 0; }
        .qt-hl   { font-weight: 700; color: var(--color-text-primary); }

        .qt-count-pill {
          flex-shrink: 0; align-self: flex-start;
          display: inline-flex; align-items: center;
          padding: 3px 9px; border-radius: var(--radius-full);
          font-size: 0.62rem; font-weight: 700;
          background: var(--background-muted); color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle); white-space: nowrap;
        }

        /* Weight bar */
        .qt-weight {
          display: flex; flex-direction: column; gap: 5px;
          padding: 0.625rem 1rem;
          background: var(--color-surface-raised);
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .qt-weight-labels { display: flex; justify-content: space-between; font-size: 0.62rem; font-weight: 700; }
        .qt-wl-pro  { color: var(--color-pro); }
        .qt-wl-con  { color: var(--color-con); }
        .qt-wl-mid  { color: var(--color-text-tertiary); font-weight: 500; }

        .qt-weight-track {
          position: relative; height: 6px;
          border-radius: var(--radius-full);
          background: var(--color-con-bg); overflow: visible;
        }

        .qt-weight-fill {
          position: absolute; inset: 0 auto 0 0;
          border-radius: var(--radius-full);
          background: linear-gradient(90deg, var(--color-pro), color-mix(in srgb, var(--color-pro) 55%, var(--yellow)));
          transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .qt-weight-mid-line {
          position: absolute; top: -2px; bottom: -2px; left: 50%;
          width: 2px; background: var(--color-surface); z-index: 1; border-radius: 1px;
        }

        /* Columns grid */
        .qt-columns { display: grid; grid-template-columns: 1fr 1px 1fr; }
        .qt-divider { background: var(--color-border-subtle); margin: 0.75rem 0; }

        /* Column shell */
        .qt-col { display: flex; flex-direction: column; padding: 0.75rem; gap: 0.5rem; }

        .qt-col-head {
          display: flex; align-items: center; gap: 5px; margin-bottom: 2px;
        }

        .qt-col-icon {
          width: 18px; height: 18px; border-radius: 50%;
          display: grid; place-items: center;
          font-size: 0.65rem; font-weight: 800; flex-shrink: 0; line-height: 1;
        }

        .qt-col-icon-pro { background: var(--yellow); color: var(--yellow-ink); }
        .qt-col-icon-con { background: var(--background-muted); color: var(--color-text-secondary); border: 1px solid var(--color-border); }

        .qt-col-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; flex: 1; }
        .qt-col-pro .qt-col-label { color: var(--yellow-ink); }
        .qt-col-con .qt-col-label { color: var(--color-text-muted); }

        .qt-col-badge {
          font-size: 0.56rem; font-weight: 700;
          padding: 1px 5px; border-radius: var(--radius-full); border: 1px solid;
        }

        .qt-badge-pro { background: var(--yellow-light); color: var(--yellow-dark); border-color: var(--yellow-mid); }
        .qt-badge-con { background: var(--color-con-bg); color: var(--color-con); border-color: var(--color-con-border); }

        .qt-col-list { display: flex; flex-direction: column; gap: 5px; }

        /* ── Argument card ────────────────────────────── */
        .qt-arg-card {
          display: flex; flex-direction: column;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          overflow: hidden; cursor: pointer;
          transition: border-color 0.14s ease, box-shadow 0.14s ease;
          outline: none;
        }

        .qt-arg-card:focus-visible { box-shadow: 0 0 0 2px var(--yellow); }

        .qt-arg-pro-card {
          background: var(--yellow-light);
          border-color: color-mix(in srgb, var(--yellow) 35%, transparent);
        }

        .qt-arg-con-card {
          background: var(--color-surface-raised);
          border-color: var(--color-border-subtle);
        }

        .qt-arg-pro-card:hover { border-color: var(--yellow-mid); box-shadow: 0 2px 8px color-mix(in srgb, var(--yellow) 12%, transparent); }
        .qt-arg-con-card:hover { border-color: var(--color-border); box-shadow: 0 2px 8px color-mix(in srgb, var(--color-accent) 6%, transparent); }

        /* Top stripe */
        .qt-stripe { height: 2px; flex-shrink: 0; }
        .qt-stripe-strong-pro   { background: linear-gradient(90deg, var(--yellow-dark), var(--yellow)); }
        .qt-stripe-moderate-pro { background: linear-gradient(90deg, var(--yellow), color-mix(in srgb, var(--yellow) 30%, transparent)); }
        .qt-stripe-strong-con   { background: linear-gradient(90deg, var(--color-con), color-mix(in srgb, var(--color-con) 30%, transparent)); }
        .qt-stripe-moderate-con { background: linear-gradient(90deg, color-mix(in srgb, var(--color-con) 45%, transparent), transparent); }

        /* Card inner body */
        .qt-arg-inner { display: flex; flex-direction: column; gap: 4px; padding: 7px 9px 5px; }

        .qt-arg-tags { display: flex; align-items: center; gap: 3px; flex-wrap: wrap; }

        .qt-arg-cat {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 1px 5px; border-radius: var(--radius-full);
          font-size: 0.55rem; font-weight: 600;
          background: var(--background-muted); color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle);
        }

        .qt-arg-strength-dots { font-size: 0.55rem; font-weight: 700; color: var(--color-text-tertiary); letter-spacing: 1px; }

        .qt-arg-contested-tag {
          display: inline-flex; align-items: center;
          padding: 1px 5px; border-radius: var(--radius-full);
          font-size: 0.54rem; font-weight: 700;
          background: var(--yellow-light); color: var(--yellow-dark);
          border: 1px solid var(--yellow-mid);
        }

        .qt-arg-title { font-size: 0.76rem; font-weight: 700; line-height: 1.3; margin: 0; }
        .qt-arg-pro-card .qt-arg-title { color: var(--yellow-ink); }
        .qt-arg-con-card .qt-arg-title { color: var(--color-text-primary); }

        .qt-arg-body-text { font-size: 0.72rem; line-height: 1.58; margin: 0; }
        .qt-arg-body-collapsed { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .qt-arg-body-expanded  { display: block; }
        .qt-arg-pro-card .qt-arg-body-text { color: var(--yellow-dark); }
        .qt-arg-con-card .qt-arg-body-text { color: var(--color-text-secondary); }

        /* Card footer */
        .qt-arg-foot {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 9px 6px;
        }

        .qt-src {
          display: flex; align-items: center; gap: 3px;
          font-size: 0.57rem; color: var(--color-text-tertiary);
        }

        .qt-src-id { font-weight: 800; color: var(--color-text-secondary); }

        .qt-upvote {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 2px 7px; border-radius: var(--radius-full);
          border: 1px solid var(--color-border-subtle); background: var(--color-surface);
          font-size: 0.6rem; font-weight: 700; color: var(--color-text-muted);
          cursor: pointer; transition: all 0.12s ease;
        }

        .qt-upvote:hover { background: var(--color-pro-bg); border-color: var(--color-pro-border); color: var(--color-pro); }
        .qt-upvote-on    { background: var(--color-pro-bg) !important; border-color: var(--color-pro) !important; color: var(--color-pro) !important; }

        .qt-expand-hint {
          font-size: 0.57rem; font-weight: 600; color: var(--color-text-tertiary);
          margin-left: auto; transition: color 0.12s ease;
        }

        .qt-arg-card:hover .qt-expand-hint { color: var(--color-text-muted); }

        /* Footer */
        .qt-footer {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          border-top: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
        }

        .qt-footer-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--yellow); flex-shrink: 0;
          animation: qt-pulse 2.4s ease-in-out infinite;
        }

        .qt-footer-text { flex: 1; font-size: 0.61rem; color: var(--color-text-muted); margin: 0; }

        .qt-footer-btn {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.68rem; font-weight: 700;
          color: var(--color-text-muted); background: none; border: none;
          padding: 0; cursor: pointer; transition: color 0.14s ease; white-space: nowrap;
        }

        .qt-footer-btn:hover { color: var(--yellow-dark); }
        .qt-footer-btn svg   { transition: transform 0.18s ease; }
        .qt-footer-btn:hover svg { transform: translateX(2px); }

        /* Responsive */
        @media (max-width: 480px) {
          .qt-columns { grid-template-columns: 1fr; }
          .qt-divider  { height: 1px; width: auto; margin: 0 0.75rem; }
        }
      `}</style>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   COLUMN sub-component
   ───────────────────────────────────────────────────────────── */
function Column({
                    side, args, expandedId, votedIds, onExpand, onVote,
                }: {
    side:       ArgumentType;
    args:       QuickTakeArgument[];
    expandedId: string | null;
    votedIds:   Set<string>;
    onExpand:   (id: string) => void;
    onVote:     (id: string, e: React.MouseEvent) => void;
}) {
    const isPro = side === "pro";

    return (
        <div className={`qt-col qt-col-${side}`}>
            <div className="qt-col-head">
                <span className={`qt-col-icon qt-col-icon-${side}`}>{isPro ? "↑" : "↓"}</span>
                <span className="qt-col-label">{isPro ? "For" : "Against"}</span>
                <span className={`qt-col-badge ${isPro ? "qt-badge-pro" : "qt-badge-con"}`}>{args.length}</span>
            </div>
            <div className="qt-col-list">
                {args.map((arg) => (
                    <ArgCard
                        key={arg.id}
                        arg={arg}
                        expanded={expandedId === arg.id}
                        voted={votedIds.has(arg.id)}
                        onExpand={() => onExpand(arg.id)}
                        onVote={(e) => onVote(arg.id, e)}
                    />
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   ARG CARD sub-component
   ───────────────────────────────────────────────────────────── */
function ArgCard({
                     arg, expanded, voted, onExpand, onVote,
                 }: {
    arg:      QuickTakeArgument;
    expanded: boolean;
    voted:    boolean;
    onExpand: () => void;
    onVote:   (e: React.MouseEvent) => void;
}) {
    const isPro = arg.type === "pro";

    return (
        <div
            className={`qt-arg-card ${isPro ? "qt-arg-pro-card" : "qt-arg-con-card"}`}
            onClick={onExpand}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            onKeyDown={(e) => e.key === "Enter" && onExpand()}
        >
            {/* Strength stripe */}
            <div className={`qt-stripe qt-stripe-${arg.strength}-${isPro ? "pro" : "con"}`} />

            {/* Inner body */}
            <div className="qt-arg-inner">
                <div className="qt-arg-tags">
                    <span className="qt-arg-cat">{CATEGORY_ICONS[arg.category]} {arg.category}</span>
                    <span className="qt-arg-strength-dots">{arg.strength === "strong" ? "●●" : "●○"}</span>
                    {arg.contested && <span className="qt-arg-contested-tag">⚠ Disputed</span>}
                </div>

                <p className="qt-arg-title">{arg.title}</p>

                <p className={`qt-arg-body-text ${expanded ? "qt-arg-body-expanded" : "qt-arg-body-collapsed"}`}>
                    {arg.body}
                </p>
            </div>

            {/* Footer */}
            <div className="qt-arg-foot" onClick={(e) => e.stopPropagation()}>
                {arg.sourceId && (
                    <span className="qt-src">📄 <span className="qt-src-id">{arg.sourceId}</span></span>
                )}
                <button
                    className={`qt-upvote ${voted ? "qt-upvote-on" : ""}`}
                    onClick={onVote}
                    aria-label={voted ? "Remove upvote" : "Upvote this argument"}
                >
                    ↑ {arg.upvotes + (voted ? 1 : 0)}
                </button>
                <span className="qt-expand-hint">{expanded ? "▲ less" : "▼ more"}</span>
            </div>
        </div>
    );
}