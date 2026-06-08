"use client";

import { useEffect, useState } from "react";
import { useSearchParams }     from "next/navigation";
import Link                    from "next/link";

import ReferendumCard    from "@/components/Referendum/ReferendumCard";
import ArgumentsPanel    from "@/components/tabs/Arguments";
import CitizenDiscussion from "@/components/tabs/Citizen_Discussion";
import SourcesPanel      from "@/components/Sidebar/SourcesPanel";
import VoteSwitcher      from "@/components/tabs/VoteSwitcher";
import FloatingChat      from "@/components/UI_Primitives/Floatingchat";
import Badge             from "@/components/UI_Primitives/Badge";
import { MOCK_VOTE_OPTIONS}    from "@/components/tabs/VoteSwitcher";
import type { TabId }    from "@/lib/types";
import type { VoteOption, VoteType } from "@/components/tabs/VoteSwitcher";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────────────────────── */
const VALID_TABS: TabId[] = ["overview", "arguments", "discussion"];

const TAB_LABELS: Record<TabId, string> = {
    overview:   "Overview",
    arguments:  "Arguments",
    discussion: "Citizen Discussion",
};

const TYPE_CONFIG: Record<VoteType, { label: string; bg: string; text: string; border: string }> = {
    "initiative":       { label: "Federal Initiative",  bg: "var(--yellow-light)",     text: "var(--yellow-dark)",      border: "var(--yellow-mid)"          },
    "counter-proposal": { label: "Counter-proposal",    bg: "var(--color-pro-bg)",      text: "var(--color-pro)",        border: "var(--color-pro-border)"    },
    "referendum":       { label: "Referendum",           bg: "var(--background-muted)", text: "var(--color-text-muted)", border: "var(--color-border-subtle)" },
};

/* ─────────────────────────────────────────────────────────────
   SCROLL-TO-TOP
   ───────────────────────────────────────────────────────────── */
function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const h = () => setVisible(window.scrollY > 380);
        window.addEventListener("scroll", h, { passive: true });
        return () => window.removeEventListener("scroll", h);
    }, []);

    if (!visible) return null;

    return (
        <button
            className="hc-scroll-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
        >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M6.5 10V3M3 6l3.5-3.5L10 6"
                      stroke="var(--yellow)" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}

/* ─────────────────────────────────────────────────────────────
   TITLE BAR
   ───────────────────────────────────────────────────────────── */
function TitleBar({ vote, activeTab }: { vote: VoteOption; activeTab: TabId }) {
    const t = TYPE_CONFIG[vote.type];
    return (
        <div className="hc-titlebar">
            <div className="hc-titlebar-left">

                {/* Breadcrumb */}
                <nav className="hc-breadcrumb" aria-label="Breadcrumb">
                    <Link href="/votes" className="hc-bc-link">Upcoming votes</Link>
                    <span className="hc-bc-sep" aria-hidden="true">›</span>
                    <span className="hc-bc-cur">{vote.shortTitle}</span>
                </nav>

                {/* Heading */}
                <h1 className="hc-heading">{vote.title}</h1>

                {/* Meta pills */}
                <div className="hc-meta">
          <span className="hc-type-pill"
                style={{ background: t.bg, color: t.text, borderColor: t.border }}>
            {t.label}
          </span>
                    <span className="hc-meta-date">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="9" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M4 1v2M7 1v2M1 5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
                        {vote.voteDate}
          </span>
                    {vote.status === "open" && (
                        <span className="hc-open-pill">
              <span className="hc-open-dot" aria-hidden="true" />
              Voting open
            </span>
                    )}
                    {vote.status !== undefined && (
                        <span className="hc-poll-hint">
              Polling {vote.status}% for
            </span>
                    )}
                </div>
            </div>

            <div className="hc-titlebar-right">
                <span className="hc-tab-badge">{TAB_LABELS[activeTab]}</span>
                <span className="hc-mock-badge">Mock data</span>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   HOME CLIENT
   ───────────────────────────────────────────────────────────── */
export default function HomeClient() {
    const searchParams = useSearchParams();

    /* Active vote — read from ?vote=, fallback to first */
    const rawVoteId  = searchParams.get("vote") ?? MOCK_VOTE_OPTIONS[0].id;
    const activeVote = MOCK_VOTE_OPTIONS.find((v) => v.id === rawVoteId) ?? MOCK_VOTE_OPTIONS[0];

    /* Active tab — read from ?tab=, fallback to overview */
    const rawTab    = searchParams.get("tab") ?? "overview";
    const activeTab = (VALID_TABS.includes(rawTab as TabId) ? rawTab : "overview") as TabId;

    /* Sticky header height — used to offset the sidebar */
    const [headerHeight, setHeaderHeight] = useState(108);

    useEffect(() => {
        const el = document.querySelector("header");
        if (!el) return;
        const obs = new ResizeObserver(([e]) => setHeaderHeight(e.contentRect.height));
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <main id="main-content" className="hc-main">
                <div className="hc-container">

                    {/* Title bar re-renders on every ?vote= change */}
                    <TitleBar vote={activeVote} activeTab={activeTab} />

                    <div className="hc-grid">

                        {/* ── Left: tab panels ──────────────────────── */}
                        <section className="hc-content" aria-label="Referendum detail">
                            {activeTab === "overview"   && <ReferendumCard     />}
                            {activeTab === "arguments"  && <ArgumentsPanel     />}
                            {activeTab === "discussion" && <CitizenDiscussion   />}
                        </section>

                        {/* ── Right: sticky sidebar ─────────────────── */}
                        <aside
                            className="hc-sidebar"
                            aria-label="Sidebar"
                            style={{
                                top:       `calc(${headerHeight}px + 1.25rem)`,
                                maxHeight: `calc(100dvh - ${headerHeight}px - 2.5rem)`,
                            }}
                        >
                            {/*
                1. VoteSwitcher — toggle between the 3 ballot initiatives.
                   Writes ?vote=<id>; left panel updates reactively.
              */}
                            <VoteSwitcher />

                            {/*
                2. Sources — cited references for all claims.
              */}
                            {/*<SourcesPanel />*/}
                        </aside>
                    </div>

                </div>
            </main>

            {/*
        FloatingChat lives outside the grid so it renders
        as a fixed overlay over the entire page.
        It is NOT in the sidebar — the button is in the
        bottom-right corner, the panel expands above it.
      */}
            <FloatingChat />

            {/*
        ScrollToTop sits at bottom-left to avoid clashing
        with the FloatingChat button at bottom-right.
      */}
            <ScrollToTop />

            {/* ── Scoped page styles ──────────────────────────── */}
            <style>{`

        .hc-main {
          flex: 1;
          padding-top: 1.5rem;
          padding-bottom: 4rem;
        }

        .hc-container {
          width: 100%; max-width: 80rem; margin: 0 auto;
          padding: 0 1.25rem;
        }

        @media (min-width: 640px) { .hc-container { padding: 0 2.5rem; } }

        /* ── Title bar ──────────────────────────────── */
        .hc-titlebar {
          display: flex; align-items: flex-start;
          justify-content: space-between; flex-wrap: wrap;
          gap: 0.75rem; margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .hc-titlebar-left { display: flex; flex-direction: column; gap: 0.375rem; }

        .hc-breadcrumb { display: flex; align-items: center; gap: 5px; }

        .hc-bc-link {
          font-size: 0.72rem; color: var(--color-text-muted); text-decoration: none;
          transition: color 0.13s ease;
        }
        .hc-bc-link:hover { color: var(--yellow-dark); }

        .hc-bc-sep { font-size: 0.72rem; color: var(--color-text-tertiary); }

        .hc-bc-cur { font-size: 0.72rem; font-weight: 500; color: var(--yellow-dark); }

        .hc-heading {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          font-weight: 800; letter-spacing: -0.025em;
          color: var(--color-text-primary); margin: 0; line-height: 1.25;
        }

        .hc-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

        .hc-type-pill {
          display: inline-flex; align-items: center;
          padding: 2px 8px; border-radius: var(--radius-full);
          font-size: 0.63rem; font-weight: 700; border: 1px solid;
        }

        .hc-meta-date {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.7rem; color: var(--color-text-muted); font-weight: 500;
        }

        .hc-open-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 7px; border-radius: var(--radius-full);
          font-size: 0.62rem; font-weight: 700;
          background: var(--yellow-light); color: var(--yellow-dark);
          border: 1px solid var(--yellow-mid);
        }

        .hc-open-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--yellow-dark);
          animation: hc-pulse 2s ease-in-out infinite;
        }

        @keyframes hc-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

        .hc-poll-hint { font-size: 0.62rem; font-weight: 500; color: var(--color-text-tertiary); }

        .hc-titlebar-right { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }

        .hc-tab-badge {
          display: inline-flex; align-items: center;
          padding: 3px 9px; border-radius: var(--radius-full);
          font-size: 0.63rem; font-weight: 700;
          background: var(--yellow-light); color: var(--yellow-dark);
          border: 1px solid var(--yellow-mid);
        }

        .hc-mock-badge {
          display: inline-flex; align-items: center;
          padding: 3px 9px; border-radius: var(--radius-full);
          font-size: 0.63rem; font-weight: 600;
          background: var(--background-muted); color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle);
        }

        /* ── Grid ─────────────────────────────────────── */
        .hc-grid {
          display: grid; grid-template-columns: 1fr;
          gap: 1.25rem; align-items: start;
        }

        @media (min-width: 1024px) {
          .hc-grid { grid-template-columns: 1fr 336px; }
        }

        .hc-content { min-width: 0; }

        .hc-sidebar {
          display: flex; flex-direction: column;
          gap: 1rem; width: 100%;
          overflow-y: auto; scrollbar-width: thin;
          scrollbar-color: var(--color-border) transparent;
          position: sticky;
        }

        .hc-sidebar::-webkit-scrollbar       { width: 3px; }
        .hc-sidebar::-webkit-scrollbar-track { background: transparent; }
        .hc-sidebar::-webkit-scrollbar-thumb {
          background: var(--color-border); border-radius: var(--radius-full);
        }

        @media (max-width: 1023px) {
          .hc-sidebar { position: static; max-height: none !important; }
        }

        /* ── Scroll-to-top ────────────────────────────── */
        .hc-scroll-btn {
          position: fixed;
          /* Left side so it doesn't overlap FloatingChat on the right */
          bottom: 1.75rem; left: 1.75rem; z-index: 50;
          width: 38px; height: 38px;
          border-radius: var(--radius-md);
          background: var(--color-accent); border: none;
          cursor: pointer; display: grid; place-items: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.14);
          transition: transform 0.14s ease, box-shadow 0.14s ease;
        }

        .hc-scroll-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        }
      `}</style>
        </>
    );
}