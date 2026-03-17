"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────── */
type ReactionType  = "agree" | "disagree" | "question";
type PostStance    = "pro" | "con" | "neutral";
type PostCategory  = "Personal experience" | "Economic concern" | "Environmental" | "Legal / rights" | "Governance" | "Other";

interface PostAuthor { initials: string; canton: string; verified: boolean; }

interface Reply {
    id:           string;
    author:       PostAuthor;
    body:         string;
    timestamp:    string;
    reactions:    Record<ReactionType, number>;
    stance:       PostStance;
    sourceLabel?: string;
}

interface DiscussionPost {
    id:           string;
    author:       PostAuthor;
    body:         string;
    timestamp:    string;
    stance:       PostStance;
    category:     PostCategory;
    reactions:    Record<ReactionType, number>;
    replies:      Reply[];
    pinned?:      boolean;
    sourceLabel?: string;
}

type SortMode   = "top" | "recent" | "contested";
type FilterMode = "all" | "pro" | "con" | "neutral";

/* ─────────────────────────────────────────────────────────────
   MOCK DATA — swap with API later
   ───────────────────────────────────────────────────────────── */
const MOCK_POSTS: DiscussionPost[] = [
    {
        id: "p1",
        author: { initials: "KM", canton: "ZH", verified: true },
        body: "As a solar installer in Zürich, I can confirm the current subsidy queue is 18–24 months long. A dedicated fund would cut that dramatically — our team can't take on more projects because financing approval is too slow.",
        timestamp: "2h ago",
        stance: "pro",
        category: "Personal experience",
        reactions: { agree: 94, disagree: 6, question: 11 },
        pinned: true,
        replies: [
            {
                id: "r1a",
                author: { initials: "PF", canton: "BE", verified: false },
                body: "Same situation in Bern — installers are backlogged and customers are cancelling. The planning horizon issue is real.",
                timestamp: "1h 40m ago",
                stance: "pro",
                reactions: { agree: 32, disagree: 1, question: 3 },
            },
            {
                id: "r1b",
                author: { initials: "TS", canton: "SG", verified: false },
                body: "Anecdotes don't substitute for structural analysis. The queue could be cleared with faster permitting, not a CHF 2B fund.",
                timestamp: "55m ago",
                stance: "con",
                reactions: { agree: 18, disagree: 14, question: 7 },
            },
        ],
    },
    {
        id: "p2",
        author: { initials: "MN", canton: "GE", verified: true },
        body: "The implementation safeguards section of the initiative text is worryingly thin. Federal Council gets full discretion over allocation criteria via ordinance. That's a constitutional shortcut that could lead to political favouritism in fund disbursements.",
        timestamp: "4h ago",
        stance: "con",
        category: "Legal / rights",
        reactions: { agree: 71, disagree: 12, question: 23 },
        sourceLabel: "Initiative text, Art. 5",
        replies: [
            {
                id: "r2a",
                author: { initials: "LB", canton: "VD", verified: false },
                body: "This is the strongest counter-argument I've seen. An independent oversight board should be a minimum requirement before anyone on either side votes.",
                timestamp: "3h ago",
                stance: "neutral",
                reactions: { agree: 41, disagree: 3, question: 5 },
            },
        ],
    },
    {
        id: "p3",
        author: { initials: "SR", canton: "BS", verified: false },
        body: "I'm genuinely undecided. The climate case is clear but the federalism concern raised by the cantonal governments conference is legitimate. Does anyone have the actual legal opinion from the Federal Council on whether this conflicts with Art. 89?",
        timestamp: "5h ago",
        stance: "neutral",
        category: "Governance",
        reactions: { agree: 58, disagree: 4, question: 47 },
        replies: [
            {
                id: "r3a",
                author: { initials: "AW", canton: "ZH", verified: true },
                body: "The Federal Council Botschaft (pp. 34–41) addresses Art. 89 directly. Short version: they argue the fund is constitutional as a subsidiary mechanism, but the legal opinion was split internally.",
                timestamp: "4h 20m ago",
                stance: "neutral",
                reactions: { agree: 53, disagree: 2, question: 8 },
                sourceLabel: "Federal Botschaft, 2024",
            },
        ],
    },
    {
        id: "p4",
        author: { initials: "HC", canton: "TI", verified: false },
        body: "Voted no on every major environmental initiative in the last decade and I'm voting yes on this one. The OECD minimum tax model showed that when you give the Federal Council a specific mandate with a fiscal instrument, they actually execute. The vague Climate Act wasn't enough.",
        timestamp: "6h ago",
        stance: "pro",
        category: "Governance",
        reactions: { agree: 86, disagree: 22, question: 14 },
        replies: [],
    },
    {
        id: "p5",
        author: { initials: "RV", canton: "AG", verified: false },
        body: "My electricity bill already increased 38% in two years. The Seco estimate of CHF 120–180 additional per household per year is probably conservative. Working families in my commune cannot absorb this. We need climate action but the cost distribution in this initiative is regressive.",
        timestamp: "7h ago",
        stance: "con",
        category: "Economic concern",
        reactions: { agree: 63, disagree: 29, question: 18 },
        replies: [
            {
                id: "r5a",
                author: { initials: "FK", canton: "ZH", verified: true },
                body: "The initiative includes a hardship rebate mechanism for low-income households (Art. 7). The net effect for the bottom two income quintiles is actually cost-neutral per the EPFL modelling.",
                timestamp: "6h 10m ago",
                stance: "pro",
                reactions: { agree: 35, disagree: 21, question: 12 },
                sourceLabel: "EPFL Energy Study, 2024",
            },
            {
                id: "r5b",
                author: { initials: "RV", canton: "AG", verified: false },
                body: "That rebate is means-tested at household level and requires a separate application. Uptake on similar schemes in Switzerland has historically been under 40%.",
                timestamp: "5h 50m ago",
                stance: "con",
                reactions: { agree: 28, disagree: 9, question: 6 },
            },
        ],
    },
    {
        id: "p6",
        author: { initials: "YD", canton: "FR", verified: false },
        body: "Quick fact-check: supporters are citing 59% polling support. That figure comes from a single Tamedia poll with a 1,200-person sample taken in March. SRG's larger poll (n=3,500) shows 51% support with a ±2.5% margin. It's genuinely too close to call.",
        timestamp: "9h ago",
        stance: "neutral",
        category: "Other",
        reactions: { agree: 112, disagree: 8, question: 31 },
        sourceLabel: "SRG poll, April 2025",
        replies: [],
    },
    {
        id: "p7",
        author: { initials: "JO", canton: "NE", verified: false },
        body: "The counter-proposal (voluntary corporate targets) is the more sensible path. Mandatory public fund vs. industry-led innovation — the Swiss economy has historically outperformed on the latter. Why change the model for climate specifically?",
        timestamp: "11h ago",
        stance: "con",
        category: "Economic concern",
        reactions: { agree: 45, disagree: 38, question: 19 },
        replies: [],
    },
];

/* ─────────────────────────────────────────────────────────────
   CONFIG
   ───────────────────────────────────────────────────────────── */
const STANCE_CFG: Record<PostStance, { label: string; bg: string; text: string; border: string; dot: string }> = {
    pro:     { label: "For",     bg: "var(--color-pro-bg)",     text: "var(--color-pro)",          border: "var(--color-pro-border)",  dot: "var(--color-pro)"          },
    con:     { label: "Against", bg: "var(--color-con-bg)",     text: "var(--color-con)",          border: "var(--color-con-border)",  dot: "var(--color-con)"          },
    neutral: { label: "Neutral", bg: "var(--background-muted)", text: "var(--color-text-muted)",  border: "var(--color-border)",      dot: "var(--color-text-tertiary)" },
};

const RX_ICONS: Record<ReactionType, string> = { agree: "👍", disagree: "👎", question: "❓" };

const CAT_ICONS: Record<PostCategory, string> = {
    "Personal experience": "💬",
    "Economic concern":    "📊",
    "Environmental":       "🌱",
    "Legal / rights":      "⚖️",
    "Governance":          "🏛️",
    "Other":               "📌",
};

const AVATAR_PALETTES = [
    { bg: "#e0f2fe", text: "#0369a1" },
    { bg: "#fef9c3", text: "#854d0e" },
    { bg: "#dcfce7", text: "#166534" },
    { bg: "#fce7f3", text: "#9d174d" },
    { bg: "#ede9fe", text: "#5b21b6" },
    { bg: "#ffedd5", text: "#9a3412" },
];

function avatarColor(initials: string) {
    const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) ?? 0)) % AVATAR_PALETTES.length;
    return AVATAR_PALETTES[idx];
}

function totalRx(r: Record<ReactionType, number>) { return r.agree + r.disagree + r.question; }

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */
export default function CitizenDiscussion() {
    const [sort,   setSort]   = useState<SortMode>("top");
    const [filter, setFilter] = useState<FilterMode>("all");
    const [search, setSearch] = useState("");

    const visible = MOCK_POSTS
        .filter((p) => filter === "all" || p.stance === filter)
        .filter((p) => !search || p.body.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === "top")       return totalRx(b.reactions) - totalRx(a.reactions);
            if (sort === "contested") return b.reactions.disagree - a.reactions.disagree;
            return 0;
        });

    const proCnt = MOCK_POSTS.filter((p) => p.stance === "pro").length;
    const conCnt = MOCK_POSTS.filter((p) => p.stance === "con").length;
    const allRx  = MOCK_POSTS.reduce((s, p) => s + totalRx(p.reactions), 0);

    return (
        <div className="cd-page">

            {/* ── Hero ──────────────────────────────────────────── */}
            <div className="cd-hero">
                <div className="cd-hero-left">
                    <p className="cd-eyebrow"><span className="cd-eyebrow-dot" />Citizen Discussion</p>
                    <p className="cd-subtitle">
                        Citizens sharing perspectives, sources, and lived experience.
                        All posts moderated for respectful discourse.
                    </p>
                </div>

                <div className="cd-stats">
                    <Stat value={MOCK_POSTS.length} label="Posts"       />
                    <div className="cd-stat-div" />
                    <Stat value={proCnt}           label="For"         accent="pro"    />
                    <div className="cd-stat-div" />
                    <Stat value={conCnt}           label="Against"     accent="con"    />
                    <div className="cd-stat-div" />
                    <Stat value="84%"              label="Respectful"  accent="yellow" />
                    <div className="cd-stat-div" />
                    <Stat value={allRx}            label="Reactions"   />
                </div>
            </div>

            {/* ── Toolbar ───────────────────────────────────────── */}
            <div className="cd-toolbar">
                <div className="cd-search-shell">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                        <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M8.5 8.5l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    <input
                        className="cd-search-input"
                        placeholder="Search discussions…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search posts"
                    />
                    {search && (
                        <button className="cd-search-clear" onClick={() => setSearch("")} aria-label="Clear">✕</button>
                    )}
                </div>

                <div className="cd-seg-group">
                    {(["all","pro","con","neutral"] as FilterMode[]).map((f) => (
                        <button key={f} onClick={() => setFilter(f)} className={`cd-seg-btn ${filter === f ? "cd-seg-active" : ""}`}>
                            {f === "all" ? "All" : f === "pro" ? "For" : f === "con" ? "Against" : "Neutral"}
                        </button>
                    ))}
                </div>

                <div className="cd-seg-group">
                    {(["top","recent","contested"] as SortMode[]).map((s) => (
                        <button key={s} onClick={() => setSort(s)} className={`cd-seg-btn ${sort === s ? "cd-seg-active" : ""}`}>
                            {s === "top" ? "↑ Top" : s === "recent" ? "🕐 Recent" : "⚡ Contested"}
                        </button>
                    ))}
                </div>
            </div>

            {search && (
                <p className="cd-result-note">{visible.length} result{visible.length !== 1 ? "s" : ""} for "{search}"</p>
            )}

            {/* ── Posts ─────────────────────────────────────────── */}
            <div className="cd-posts">
                {visible.length === 0 ? (
                    <div className="cd-empty">
                        <p className="cd-empty-title">No posts match your filters</p>
                        <p className="cd-empty-sub">Try adjusting the search or filter above</p>
                    </div>
                ) : (
                    visible.map((post) => <PostCard key={post.id} post={post} />)
                )}
            </div>

            {/* ── Sign-in CTA ───────────────────────────────────── */}
            <div className="cd-cta">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="cd-cta-avatar">?</div>
                    <p className="cd-cta-text">Share your perspective — Sign in to participate.</p>
                </div>
                <button className="cd-cta-btn">Sign in to post</button>
            </div>

            <p className="cd-footnote">
                Mock data · Posts are illustrative · Replace with API fetch when backend is ready
            </p>

            {/* ── Styles ────────────────────────────────────────── */}
            <style>{`
        .cd-page { display: flex; flex-direction: column; gap: 1.125rem; }

        /* Hero */
        .cd-hero {
          display: flex; flex-wrap: wrap; align-items: flex-start;
          justify-content: space-between; gap: 1rem;
        }
        .cd-hero-left { display: flex; flex-direction: column; gap: 4px; }
        .cd-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--color-text-muted); margin: 0;
        }
        .cd-eyebrow-dot {
          width: 6px; height: 6px; border-radius: var(--radius-full);
          background: var(--yellow); flex-shrink: 0;
        }
        .cd-title {
          font-size: clamp(1rem, 3vw, 1.35rem); font-weight: 800;
          letter-spacing: -0.025em; color: var(--color-text-primary);
          margin: 0; line-height: 1.2;
        }
        .cd-subtitle {
          font-size: 0.78rem; color: var(--color-text-muted);
          line-height: 1.6; margin: 0; max-width: 440px;
        }

        /* Stats */
        .cd-stats {
          display: flex; align-items: center;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          overflow: hidden; flex-shrink: 0;
        }
        .cd-stat {
          display: flex; flex-direction: column; align-items: center;
          gap: 1px; padding: 0.625rem 0.875rem;
        }
        .cd-stat-value {
          font-size: 1.05rem; font-weight: 800;
          letter-spacing: -0.03em; color: var(--color-text-primary); line-height: 1;
        }
        .cd-stat-value-pro    { color: var(--color-pro); }
        .cd-stat-value-con    { color: var(--color-con); }
        .cd-stat-value-yellow { color: var(--yellow-dark); }
        .cd-stat-label {
          font-size: 0.58rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--color-text-muted);
        }
        .cd-stat-div {
          width: 1px; height: 26px;
          background: var(--color-border-subtle); flex-shrink: 0;
        }

        /* Toolbar */
        .cd-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; }

        .cd-search-shell {
          display: flex; align-items: center; gap: 7px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 5px 10px; flex: 1; min-width: 160px;
          transition: border-color 0.15s, box-shadow 0.15s;
          color: var(--color-text-tertiary);
        }
        .cd-search-shell:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 8%, transparent);
        }
        .cd-search-input {
          flex: 1; background: none; border: none; outline: none;
          font-size: 0.8rem; color: var(--color-text-primary); min-width: 0;
        }
        .cd-search-input::placeholder { color: var(--color-text-tertiary); }
        .cd-search-clear {
          background: none; border: none; font-size: 0.65rem;
          color: var(--color-text-tertiary); cursor: pointer; padding: 0 2px;
          transition: color 0.12s;
        }
        .cd-search-clear:hover { color: var(--color-text-secondary); }

        .cd-seg-group {
          display: flex; gap: 2px; background: var(--background-muted);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md); padding: 3px;
        }
        .cd-seg-btn {
          padding: 4px 10px; border-radius: var(--radius-sm); border: none;
          background: none; font-size: 0.7rem; font-weight: 600;
          color: var(--color-text-muted); cursor: pointer;
          transition: all 0.12s ease; white-space: nowrap;
        }
        .cd-seg-btn:hover { background: var(--color-surface); color: var(--color-text-secondary); }
        .cd-seg-active {
          background: var(--color-surface) !important;
          color: var(--color-text-primary) !important;
          box-shadow: var(--shadow-card);
        }

        .cd-result-note { font-size: 0.72rem; color: var(--color-text-muted); margin: 0; }

        /* Post list */
        .cd-posts { display: flex; flex-direction: column; gap: 0.5rem; }

        /* Empty */
        .cd-empty {
          text-align: center; padding: 3rem 1rem;
          background: var(--color-surface);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-lg);
        }
        .cd-empty-title { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0 0 4px; }
        .cd-empty-sub   { font-size: 0.78rem; color: var(--color-text-muted); margin: 0; }

        /* ── Post card ─────────────────────────────────────── */
        .cd-post {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .cd-post:hover {
          border-color: color-mix(in srgb, var(--color-accent) 25%, var(--color-border));
          box-shadow: 0 4px 16px 0 color-mix(in srgb, var(--color-accent) 7%, transparent);
        }
        .cd-post-pinned { border-color: color-mix(in srgb, var(--yellow) 45%, var(--color-border)); }
        .cd-post-pinned:hover { border-color: var(--yellow-mid); }
        .cd-pin-stripe { height: 2.5px; background: linear-gradient(90deg, var(--yellow-dark), var(--yellow)); }

        .cd-post-inner { padding: 0.875rem; display: flex; flex-direction: column; gap: 0.625rem; }

        /* Top row */
        .cd-post-top { display: flex; align-items: flex-start; gap: 9px; }
        .cd-avatar {
          width: 32px; height: 32px;
          border-radius: var(--radius-md);
          display: grid; place-items: center;
          font-size: 0.65rem; font-weight: 800;
          flex-shrink: 0; letter-spacing: 0.02em;
        }
        .cd-post-meta { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .cd-post-meta-top { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; }
        .cd-author-name { font-size: 0.7rem; font-weight: 700; color: var(--color-text-primary); }
        .cd-canton-badge {
          display: inline-flex; align-items: center;
          padding: 1px 6px; border-radius: var(--radius-full);
          font-size: 0.58rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; background: var(--background-muted);
          color: var(--color-text-muted); border: 1px solid var(--color-border-subtle);
        }
        .cd-verified {
          display: inline-flex; align-items: center; gap: 2px;
          padding: 1px 6px; border-radius: var(--radius-full);
          font-size: 0.55rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; background: var(--yellow-light);
          color: var(--yellow-dark); border: 1px solid var(--yellow-mid);
        }
        .cd-stance-dot {
          width: 5px; height: 5px; border-radius: 50%;
          display: inline-block; flex-shrink: 0;
        }
        .cd-stance-badge {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 1px 7px; border-radius: var(--radius-full);
          font-size: 0.58rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; border: 1px solid;
        }
        .cd-post-time {
          font-size: 0.62rem; color: var(--color-text-tertiary);
          margin-left: auto; white-space: nowrap; flex-shrink: 0;
        }
        .cd-post-cat {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 0.6rem; font-weight: 600; color: var(--color-text-muted);
        }
        .cd-pinned-tag {
          margin-left: 6px; font-size: 0.55rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em; color: var(--yellow-dark);
        }

        /* Body */
        .cd-post-body {
          font-size: 0.84rem; color: var(--color-text-secondary);
          line-height: 1.7; margin: 0;
        }
        .cd-source-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border-radius: var(--radius-full);
          font-size: 0.62rem; font-weight: 600;
          background: var(--background-muted); color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle); width: fit-content;
        }

        /* Reactions */
        .cd-reactions {
          display: flex; align-items: center; gap: 4px;
          padding-top: 6px; border-top: 1px solid var(--color-border-subtle);
          flex-wrap: wrap;
        }
        .cd-rx-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: var(--radius-full);
          border: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
          font-size: 0.68rem; font-weight: 600;
          color: var(--color-text-muted); cursor: pointer;
          transition: all 0.12s ease; user-select: none;
        }
        .cd-rx-btn:hover {
          background: var(--yellow-light);
          border-color: var(--yellow-mid); color: var(--yellow-ink);
        }
        .cd-rx-btn.active {
          background: var(--yellow-light);
          border-color: var(--yellow); color: var(--yellow-ink);
          font-weight: 700;
        }
        .cd-replies-btn {
          margin-left: auto;
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: var(--radius-full);
          border: 1px solid var(--color-border-subtle);
          background: none; font-size: 0.68rem; font-weight: 600;
          color: var(--color-text-muted); cursor: pointer;
          transition: all 0.12s ease; white-space: nowrap;
        }
        .cd-replies-btn:hover { background: var(--color-surface-raised); color: var(--color-text-secondary); }
        .cd-replies-arrow { transition: transform 0.18s ease; display: inline-block; }

        /* Reply thread */
        .cd-replies {
          margin-top: 2px;
          border-top: 1px solid var(--color-border-subtle);
          padding-top: 0.625rem;
          display: flex; flex-direction: column; gap: 0.5rem;
          padding-left: 0.625rem;
          border-left: 2px solid var(--color-border-subtle);
          margin-left: 0.375rem;
        }
        .cd-reply {
          display: flex; flex-direction: column; gap: 5px;
          padding: 0.5rem 0.75rem;
          background: var(--color-surface-raised);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle);
          transition: border-color 0.12s;
        }
        .cd-reply:hover { border-color: var(--color-border); }
        .cd-reply-top { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
        .cd-reply-avatar {
          width: 22px; height: 22px; border-radius: var(--radius-sm);
          display: grid; place-items: center;
          font-size: 0.55rem; font-weight: 800; flex-shrink: 0;
        }
        .cd-reply-name { font-size: 0.65rem; font-weight: 700; color: var(--color-text-primary); }
        .cd-reply-time { font-size: 0.58rem; color: var(--color-text-tertiary); margin-left: auto; }
        .cd-reply-body { font-size: 0.78rem; color: var(--color-text-secondary); line-height: 1.65; margin: 0; }
        .cd-reply-source { font-size: 0.6rem; color: var(--color-text-tertiary); font-weight: 500; }
        .cd-reply-rxrow { display: flex; gap: 6px; }
        .cd-reply-rx { font-size: 0.62rem; color: var(--color-text-tertiary); font-weight: 600; }

        /* CTA */
        .cd-cta {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; padding: 0.875rem 1rem;
          background: var(--yellow-light);
          border: 1px solid var(--yellow-mid);
          border-radius: var(--radius-md);
        }
        .cd-cta-avatar {
          width: 32px; height: 32px; border-radius: var(--radius-md);
          background: var(--background-muted);
          border: 1.5px dashed var(--color-border);
          display: grid; place-items: center;
          font-size: 0.9rem; color: var(--color-text-tertiary); flex-shrink: 0;
        }
        .cd-cta-text { font-size: 0.8rem; color: var(--yellow-ink); font-weight: 500; margin: 0; }
        .cd-cta-btn {
          flex-shrink: 0; padding: 6px 14px; border-radius: var(--radius-md);
          background: var(--yellow); border: 1px solid color-mix(in srgb, var(--yellow) 70%, transparent);
          color: var(--yellow-ink); font-size: 0.78rem; font-weight: 700;
          cursor: pointer; transition: all 0.15s ease; white-space: nowrap;
        }
        .cd-cta-btn:hover { background: var(--yellow-dark); color: #fff; transform: translateY(-1px); }

        .cd-footnote {
          font-size: 0.68rem; color: var(--color-text-tertiary); text-align: center;
          margin: 0; padding-top: 0.75rem; border-top: 1px solid var(--color-border-subtle);
        }

        /* Responsive */
        @media (max-width: 560px) {
          .cd-hero    { flex-direction: column; }
          .cd-stats   { width: 100%; overflow-x: auto; }
          .cd-toolbar { flex-direction: column; align-items: stretch; }
          .cd-cta     { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────────────────────── */
function Stat({ value, label, accent }: {
    value: string | number; label: string; accent?: "pro" | "con" | "yellow";
}) {
    return (
        <div className="cd-stat">
            <span className={`cd-stat-value${accent ? ` cd-stat-value-${accent}` : ""}`}>{value}</span>
            <span className="cd-stat-label">{label}</span>
        </div>
    );
}

function PostCard({ post }: { post: DiscussionPost }) {
    const [open,  setOpen]  = useState(post.pinned ?? false);
    const [myRx,  setMyRx]  = useState<ReactionType | null>(null);
    const [counts, setCounts] = useState({ ...post.reactions });
    const sc      = STANCE_CFG[post.stance];
    const palette = avatarColor(post.author.initials);

    function react(type: ReactionType) {
        setCounts((prev) => {
            const n = { ...prev };
            if (myRx === type) { n[type] = Math.max(0, n[type] - 1); setMyRx(null); }
            else {
                if (myRx) n[myRx] = Math.max(0, n[myRx] - 1);
                n[type]++;
                setMyRx(type);
            }
            return n;
        });
    }

    return (
        <div className={`cd-post${post.pinned ? " cd-post-pinned" : ""}`}>
            {post.pinned && <div className="cd-pin-stripe" />}

            <div className="cd-post-inner">
                {/* Top */}
                <div className="cd-post-top">
                    <div className="cd-avatar" style={{ background: palette.bg, color: palette.text }} aria-hidden="true">
                        {post.author.initials}
                    </div>
                    <div className="cd-post-meta">
                        <div className="cd-post-meta-top">
                            <span className="cd-author-name">Citizen</span>
                            <span className="cd-canton-badge">{post.author.canton}</span>
                            {post.author.verified && <span className="cd-verified">✓ Verified</span>}
                            <span className="cd-stance-badge" style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                <span className="cd-stance-dot" style={{ background: sc.dot }} />
                                {sc.label}
              </span>
                            <span className="cd-post-time">{post.timestamp}</span>
                        </div>
                        <span className="cd-post-cat">
              {CAT_ICONS[post.category]} {post.category}
                            {post.pinned && <span className="cd-pinned-tag">📌 Pinned</span>}
            </span>
                    </div>
                </div>

                {/* Body */}
                <p className="cd-post-body">{post.body}</p>
                {post.sourceLabel && <span className="cd-source-pill">📎 {post.sourceLabel}</span>}

                {/* Reactions */}
                <div className="cd-reactions">
                    {(["agree","disagree","question"] as ReactionType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => react(type)}
                            className={`cd-rx-btn${myRx === type ? " active" : ""}`}
                            aria-label={`${type} (${counts[type]})`}
                        >
                            {RX_ICONS[type]} <span style={{ fontWeight: 700 }}>{counts[type]}</span>
                        </button>
                    ))}
                    {post.replies.length > 0 && (
                        <button className="cd-replies-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
                            <span className="cd-replies-arrow" style={{ transform: open ? "rotate(90deg)" : "none" }}>›</span>
                            {post.replies.length} repl{post.replies.length === 1 ? "y" : "ies"}
                        </button>
                    )}
                </div>

                {/* Replies */}
                {open && post.replies.length > 0 && (
                    <div className="cd-replies">
                        {post.replies.map((r) => <ReplyCard key={r.id} reply={r} />)}
                    </div>
                )}
            </div>
        </div>
    );
}

function ReplyCard({ reply }: { reply: Reply }) {
    const sc      = STANCE_CFG[reply.stance];
    const palette = avatarColor(reply.author.initials);
    return (
        <div className="cd-reply">
            <div className="cd-reply-top">
                <div className="cd-reply-avatar" style={{ background: palette.bg, color: palette.text }} aria-hidden="true">
                    {reply.author.initials}
                </div>
                <span className="cd-reply-name">Citizen</span>
                <span className="cd-canton-badge" style={{ fontSize: "0.55rem" }}>{reply.author.canton}</span>
                <span className="cd-stance-badge" style={{ background: sc.bg, color: sc.text, borderColor: sc.border, fontSize: "0.55rem", padding: "1px 5px" }}>
          {sc.label}
        </span>
                {reply.sourceLabel && <span className="cd-reply-source">📎 {reply.sourceLabel}</span>}
                <span className="cd-reply-time">{reply.timestamp}</span>
            </div>
            <p className="cd-reply-body">{reply.body}</p>
            <div className="cd-reply-rxrow">
                {(["agree","disagree","question"] as ReactionType[]).map((t) => (
                    <span key={t} className="cd-reply-rx">{RX_ICONS[t]} {reply.reactions[t]}</span>
                ))}
            </div>
        </div>
    );
}