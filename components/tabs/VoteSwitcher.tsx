"use client";

import { useRouter, useSearchParams } from "next/navigation";

/* ─────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────── */
export type VoteType = "initiative" | "referendum" | "counter-proposal";

export interface VoteOption {
    id:       string;
    type:     VoteType;
    title:    string;
    shortTitle: string;
    voteDate: string;
    status:   "open" | "upcoming";
    isHighProfile?: boolean;
}

/* ─────────────────────────────────────────────────────────────
   MOCK DATA — replace with API fetch later
   ───────────────────────────────────────────────────────────── */
export const MOCK_VOTE_OPTIONS: VoteOption[] = [
    {
        id:         "fed-2025-06-01",
        type:       "initiative",
        title:      "Initiative for a Federal Climate Investment Fund",
        shortTitle: "Climate Fund",
        voteDate:   "9 Jun 2025",
        status:     "open",
        isHighProfile: true,
    },
    {
        id:         "fed-2025-06-02",
        type:       "counter-proposal",
        title:      "Counter-proposal: Voluntary Corporate Emission Targets",
        shortTitle: "Corporate Emissions",
        voteDate:   "9 Jun 2025",
        status:     "open",
    },
    {
        id:         "fed-2025-09-01",
        type:       "referendum",
        title:      "Expanding Residential Rental Protections",
        shortTitle: "Tenancy Reform",
        voteDate:   "21 Sep 2025",
        status:     "upcoming",
    },
    {
        id:         "fed-2025-09-02",
        type:       "initiative",
        title:      "Highway Network Expansion — National Roads Act",
        shortTitle: "Highway Expansion",
        voteDate:   "21 Sep 2025",
        status:     "upcoming",
    },
];

/* ─────────────────────────────────────────────────────────────
   TYPE CONFIG
   ───────────────────────────────────────────────────────────── */
const TYPE_CONFIG: Record<VoteType, { label: string; bg: string; text: string; border: string }> = {
    "initiative":       { label: "Initiative",        bg: "var(--yellow-light)",  text: "var(--yellow-dark)",  border: "var(--yellow-mid)"         },
    "referendum":       { label: "Referendum",        bg: "var(--background-muted)", text: "var(--color-text-muted)", border: "var(--color-border-subtle)" },
    "counter-proposal": { label: "Counter-proposal",  bg: "var(--color-pro-bg)",  text: "var(--color-pro)",    border: "var(--color-pro-border)"   },
};

/* ─────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function VoteSwitcher() {
    const router       = useRouter();
    const searchParams = useSearchParams();
    const activeVoteId = searchParams.get("vote") ?? MOCK_VOTE_OPTIONS[0].id;

    /* Group by vote date */
    const grouped = MOCK_VOTE_OPTIONS.reduce<Record<string, VoteOption[]>>((acc, v) => {
        if (!acc[v.voteDate]) acc[v.voteDate] = [];
        acc[v.voteDate].push(v);
        return acc;
    }, {});

    function switchVote(id: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("vote", id);
        /*
          Keep the current tab when switching votes so the user
          stays on e.g. "Arguments" while comparing two initiatives.
        */
        router.push(`/?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="vs-shell">

            {/* Header */}
            <div className="vs-header">
                <span className="vs-eyebrow">On the ballot</span>
                <span className="vs-count">{MOCK_VOTE_OPTIONS.length} votes</span>
            </div>

            {/* Groups */}
            {Object.entries(grouped).map(([date, votes]) => (
                <div key={date} className="vs-group">

                    <div className="vs-date-row">
                        <span className="vs-date-dot" />
                        <span className="vs-date">{date}</span>
                        <span className="vs-date-badge">
              {votes.some(v => v.status === "open") ? "Open" : "Upcoming"}
            </span>
                    </div>

                    <div className="vs-options">
                        {votes.map((vote) => {
                            const typeCfg  = TYPE_CONFIG[vote.type];
                            const isActive = vote.id === activeVoteId;

                            return (
                                <button
                                    key={vote.id}
                                    onClick={() => switchVote(vote.id)}
                                    className={`vs-option ${isActive ? "vs-option-active" : ""}`}
                                    aria-pressed={isActive}
                                >
                                    {/* Active indicator */}
                                    <span className={`vs-option-bar ${isActive ? "vs-option-bar-active" : ""}`} />

                                    {/* Content */}
                                    <div className="vs-option-content">
                                        <div className="vs-option-top">
                      <span
                          className="vs-type-pill"
                          style={{ background: typeCfg.bg, color: typeCfg.text, borderColor: typeCfg.border }}
                      >
                        {typeCfg.label}
                      </span>
                                            {vote.isHighProfile && (
                                                <span className="vs-hot-pill">⚡ Featured</span>
                                            )}
                                        </div>

                                        <p className="vs-option-title">{vote.shortTitle}</p>
                                    </div>

                                    {/* Arrow */}
                                    <svg
                                        className={`vs-option-arrow ${isActive ? "vs-option-arrow-active" : ""}`}
                                        width="11" height="11" viewBox="0 0 11 11" fill="none"
                                        aria-hidden="true"
                                    >
                                        <path d="M2 5.5h7M5.5 2l4 3.5-4 3.5"
                                              stroke="currentColor" strokeWidth="1.4"
                                              strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Footer link */}
            <div className="vs-footer">
                <a href="/votes" className="vs-all-link">
                    View all upcoming votes
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M2 5h6M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4"
                              strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
            </div>

            {/* Scoped styles */}
            <style>{`
        .vs-shell {
          display: flex; flex-direction: column;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        /* Header */
        .vs-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 1rem 0.625rem;
          border-bottom: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
        }

        .vs-eyebrow {
          font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--color-text-muted);
        }

        .vs-count {
          font-size: 0.62rem; font-weight: 600;
          padding: 2px 7px; border-radius: var(--radius-full);
          background: var(--background-muted); color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle);
        }

        /* Groups */
        .vs-group {
          display: flex; flex-direction: column;
          border-bottom: 1px solid var(--color-border-subtle);
          padding: 0.625rem 0;
        }

        .vs-group:last-of-type { border-bottom: none; }

        /* Date row */
        .vs-date-row {
          display: flex; align-items: center; gap: 6px;
          padding: 0 1rem 0.375rem;
        }

        .vs-date-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--yellow); flex-shrink: 0;
          animation: vs-pulse 2.2s ease-in-out infinite;
        }

        @keyframes vs-pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }

        .vs-date {
          font-size: 0.7rem; font-weight: 700;
          color: var(--color-text-primary); flex: 1;
          letter-spacing: -0.01em;
        }

        .vs-date-badge {
          font-size: 0.58rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; padding: 1px 6px;
          border-radius: var(--radius-full);
          background: var(--yellow-light); color: var(--yellow-dark);
          border: 1px solid var(--yellow-mid);
        }

        /* Options */
        .vs-options { display: flex; flex-direction: column; gap: 2px; padding: 0 0.5rem; }

        .vs-option {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 8px; border-radius: var(--radius-md);
          background: none; border: 1px solid transparent;
          cursor: pointer; text-align: left;
          transition: all 0.13s ease; width: 100%;
        }

        .vs-option:hover {
          background: var(--color-surface-raised);
          border-color: var(--color-border-subtle);
        }

        .vs-option-active {
          background: var(--yellow-light) !important;
          border-color: var(--yellow-mid) !important;
        }

        /* Left active bar */
        .vs-option-bar {
          width: 3px; height: 28px; border-radius: 2px;
          background: var(--color-border-subtle); flex-shrink: 0;
          transition: background 0.13s ease;
        }

        .vs-option-bar-active { background: var(--yellow-dark); }

        /* Option content */
        .vs-option-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }

        .vs-option-top { display: flex; align-items: center; gap: 4px; }

        .vs-type-pill {
          display: inline-flex; align-items: center;
          padding: 1px 6px; border-radius: var(--radius-full);
          font-size: 0.58rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
          border: 1px solid;
        }

        .vs-hot-pill {
          font-size: 0.56rem; font-weight: 700;
          padding: 1px 5px; border-radius: var(--radius-full);
          background: var(--yellow-light); color: var(--yellow-dark);
          border: 1px solid var(--yellow-mid);
        }

        .vs-option-title {
          font-size: 0.75rem; font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.3; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .vs-option-active .vs-option-title { color: var(--yellow-ink); }

        /* Arrow */
        .vs-option-arrow {
          flex-shrink: 0; color: var(--color-text-tertiary);
          opacity: 0; transform: translateX(-3px);
          transition: opacity 0.13s ease, transform 0.13s ease;
        }

        .vs-option:hover .vs-option-arrow { opacity: 1; transform: translateX(0); }
        .vs-option-arrow-active { opacity: 1 !important; transform: translateX(0) !important; color: var(--yellow-dark) !important; }

        /* Footer */
        .vs-footer {
          padding: 0.625rem 1rem;
          border-top: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
        }

        .vs-all-link {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.7rem; font-weight: 600;
          color: var(--color-text-muted); text-decoration: none;
          transition: color 0.13s ease;
        }

        .vs-all-link:hover { color: var(--yellow-dark); }

        .vs-all-link svg { transition: transform 0.18s ease; }
        .vs-all-link:hover svg { transform: translateX(2px); }
      `}</style>
        </div>
    );
}