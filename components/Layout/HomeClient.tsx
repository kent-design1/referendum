"use client";

import { useState, useEffect, useRef } from "react";
import ReferendumCard from "@/components/Referendum/ReferendumCard";
import ChatAssistant from "@/components/Sidebar/ChatAssistant";
import DeliberationInsights from "@/components/Sidebar/DeliberationInsights";
import SourcesPanel from "@/components/Sidebar/SourcesPanel";
import Badge from "@/components/UI_Primitives/Badge";
import type { TabId } from "@/lib/types";

/* ── Coming soon ─────────────────────────────────────────── */
function ComingSoon({ tab }: { tab: string }) {
    return (
        <div className="card flex flex-col items-center justify-center gap-4 p-16 text-center" style={{ minHeight: "320px" }}>
            <div style={{
                width: 44, height: 44,
                borderRadius: "var(--radius-lg)",
                background: "var(--yellow-light)",
                border: "1px solid color-mix(in srgb, var(--yellow) 35%, transparent)",
                display: "grid", placeItems: "center",
            }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3v6M9 13v.5" stroke="var(--yellow-dark)" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <div>
                <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                    {tab} — coming soon
                </p>
                <p className="text-sm" style={{ color: "var(--foreground-4)", maxWidth: 300, lineHeight: 1.6 }}>
                    This section is part of the next development sprint.
                </p>
            </div>
            <Badge value="In progress" variant="yellow" />
        </div>
    );
}

/* ── Scroll to top ───────────────────────────────────────── */
function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="btn btn-primary"
            style={{
                position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50,
                width: 40, height: 40, padding: 0,
                display: "grid", placeItems: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 10V3M3 6l3.5-3.5L10 6" stroke="var(--yellow)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}

/* ── Page title bar ──────────────────────────────────────── */
function PageTitleBar() {
    return (
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
            <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-subtle" style={{ fontSize: "0.72rem" }}>Upcoming votes</span>
                    <span className="text-subtle" style={{ fontSize: "0.72rem" }}>›</span>
                    <span className="text-yellow" style={{ fontSize: "0.72rem", fontWeight: 500 }}>
            Initiative for a Climate Fund
          </span>
                </div>
                <h1 style={{ fontSize: "1.15rem", margin: 0, letterSpacing: "-0.02em" }}>
                    Initiative for a Climate Fund
                </h1>
                <p className="text-subtle mt-1" style={{ fontSize: "0.8rem" }}>
                    Federal popular initiative · Vote date: Sun, 9 Jun (example)
                </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                <Badge value="Mock data" variant="default" />
                <Badge value="Overview" variant="yellow" />
            </div>
        </div>
    );
}

/* ── Home client shell ───────────────────────────────────── */
export default function HomeClient() {
    const [activeTab, setActiveTab]       = useState<TabId>("overview");
    const headerRef                       = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(108);

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        const obs = new ResizeObserver(([entry]) =>
            setHeaderHeight(entry.contentRect.height)
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <>


            {/*
        <main> intentionally has NO centering classes here.
        The global `main { mx-auto container }` in globals.css
        handles centering for ALL <main> elements.
        Only add what the global rule does NOT already provide.
      */}
            <main id="main-content" className="flex-1 pt-6 pb-12">

                {/*
          Inner centering div — explicit max-width + auto margins.
          This guarantees centering regardless of flex/block context
          and works with both Tailwind v3 and v4 container behaviour.
        */}
                <div className="w-full max-w-7xl mx-auto px-5 sm:px-10">

                    <PageTitleBar />

                    {/*
            Grid: grid-cols-1 on mobile, two columns on lg+.
            NO inline style — Tailwind breakpoint classes work
            only when they aren't overridden by a style attribute.
          */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_352px] gap-5 items-start">

                        {/* Left column — tab content */}
                        <section className="min-w-0">
                            {activeTab === "overview"   && <ReferendumCard />}
                            {activeTab === "arguments"  && <ComingSoon tab="Arguments" />}
                            {activeTab === "discussion" && <ComingSoon tab="Citizen Discussion" />}
                        </section>

                        {/* Right column — sticky sidebar */}
                        <aside
                            className="flex flex-col gap-4 w-full overflow-y-auto min-h-screen"
                            style={{
                                position:       "sticky",
                                top:            `calc(${headerHeight}px + 1.25rem)`,
                                maxHeight:      `calc(100dvh - ${headerHeight}px - 2.5rem)`,
                                scrollbarWidth: "thin",
                            }}
                        >
                            <ChatAssistant />
                            <SourcesPanel />
                        </aside>
                    </div>
                    <div className="flex flex-row gap-4 w-full overflow-y-auto">
                        {/*<DeliberationInsights />*/}

                    </div>

                </div>
            </main>
            <ScrollToTop />
        </>
    );
}