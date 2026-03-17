"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { languages, userPreferences } from "@/constants";

/* ─────────────────────────────────────────────────────────────
   ROUTE MAP
   Map each nav label to its Next.js route.
   ───────────────────────────────────────────────────────────── */
const NAV_LINKS: { label: string; href: string }[] = [
    { label: "Home",               href: "/"          },
    { label: "Upcoming Votes",     href: "/upcoming_votes"     },
    { label: "Referendum History", href: "/referendum_history"     },
    { label: "My Canton",          href: "/canton"    },
];

/*
  Tabs are sub-sections of the referendum detail page (/).
  We drive them with a `?tab=` search param so the URL is bookmarkable
  and the header can read the active tab without any prop from the page.
*/
const TABS: { id: string; label: string }[] = [
    { id: "overview",   label: "Overview"            },
    { id: "arguments",  label: "Arguments"           },
    { id: "discussion", label: "Citizen Discussion"  },
];

/* ── Stand types ─────────────────────────────────────────────── */
type StandType = "yes" | "no" | "undecided";

const STAND_CLASSES: Record<StandType, {
    text: string; bg: string; border: string; dot: string; pill: string;
}> = {
    yes:       { text: "text-success",  bg: "bg-success-bg",  border: "border-success/20",  dot: "bg-success",  pill: "bg-success text-white"  },
    no:        { text: "text-error",    bg: "bg-error-bg",    border: "border-error/20",    dot: "bg-error",    pill: "bg-error text-white"    },
    undecided: { text: "text-warning",  bg: "bg-warning-bg",  border: "border-warning/20",  dot: "bg-warning",  pill: "bg-warning text-white"  },
};

function useProjectedStand() {
    const env      = userPreferences.find((p) => p.label === "Environment")?.value              ?? 50;
    const economy  = userPreferences.find((p) => p.label === "Economic stability")?.value       ?? 50;
    const autonomy = userPreferences.find((p) => p.label === "Autonomy / local control")?.value ?? 50;
    const social   = userPreferences.find((p) => p.label === "Social cohesion")?.value          ?? 50;

    const proScore = env * 0.45 + social * 0.25 + autonomy * 0.15 + (100 - economy) * 0.15;
    const conScore = economy * 0.45 + (100 - env) * 0.3 + autonomy * 0.15 + (100 - social) * 0.1;

    if (proScore > conScore + 8) return { type: "yes"       as StandType, label: "Lean Yes",  score: Math.round(proScore) };
    if (conScore > proScore + 8) return { type: "no"        as StandType, label: "Lean No",   score: Math.round(conScore) };
    return                              { type: "undecided" as StandType, label: "Undecided", score: 50 };
}

/* ── Logo ─────────────────────────────────────────────────────── */
function Logo() {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="9" fill="var(--foreground)" />
            <rect x="15" y="7"  width="6" height="22" rx="2" fill="var(--yellow)" />
            <rect x="7"  y="15" width="22" height="6"  rx="2" fill="var(--yellow)" />
            <circle cx="9"  cy="9"  r="1.5" fill="var(--yellow)" opacity="0.35" />
            <circle cx="27" cy="9"  r="1.5" fill="var(--yellow)" opacity="0.35" />
            <circle cx="9"  cy="27" r="1.5" fill="var(--yellow)" opacity="0.35" />
            <circle cx="27" cy="27" r="1.5" fill="var(--yellow)" opacity="0.35" />
        </svg>
    );
}

/* ── Language switcher ────────────────────────────────────────── */
function LanguageSwitcher({ activeLang, onChange }: { activeLang: string; onChange: (l: string) => void }) {
    return (
        <div className="flex gap-[2px] rounded-[var(--radius-md)] border border-border bg-background-muted p-[3px]">
            {languages.map((lang) => {
                const active = activeLang === lang;
                return (
                    <button
                        key={lang}
                        onClick={() => onChange(lang)}
                        className={`cursor-pointer rounded-[var(--radius-sm)] border-none px-2 py-[3px] text-[0.66rem] font-semibold tracking-widest transition-all duration-200
              ${active
                            ? "bg-yellow text-yellow-ink"
                            : "bg-transparent text-foreground-4 hover:text-foreground-2"
                        }`}
                    >
                        {lang}
                    </button>
                );
            })}
        </div>
    );
}

/* ── Stand chip ───────────────────────────────────────────────── */
function StandChip({ type, label, score }: { type: StandType; label: string; score: number }) {
    const [open, setOpen] = useState(false);
    const ref             = useRef<HTMLDivElement>(null);
    const cls             = STAND_CLASSES[type];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative hidden md:block">
            <button
                onClick={() => setOpen(!open)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-[var(--radius-md)] border px-[10px] py-[5px] text-[0.72rem] font-semibold transition-all duration-200 hover:opacity-85
          ${cls.text} ${cls.bg} ${cls.border}`}
            >
                <span className={`inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full ${cls.dot}`} />
                {label}
                <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
                >
                    <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                    <div className="border-b border-border px-4 py-3">
                        <p className="text-label mb-1">Your projected stand</p>
                        <p className="text-[0.78rem] leading-snug text-foreground-3">Based on your current priority settings</p>
                    </div>
                    <div className="flex flex-col gap-2 p-3">
                        {userPreferences.map((pref) => (
                            <div key={pref.label}>
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-[0.72rem] text-foreground-3">{pref.label}</span>
                                    <span className="text-[0.7rem] font-semibold text-foreground-2">{pref.value}</span>
                                </div>
                                <div className="h-1 w-full overflow-hidden rounded-full bg-background-muted">
                                    <div
                                        className="h-full rounded-full bg-yellow transition-[width] duration-500"
                                        style={{ width: `${pref.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-3 pb-3">
                        <div className={`flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2 ${cls.bg}`}>
                            <span className={`text-[0.75rem] font-semibold ${cls.text}`}>Overall: {label}</span>
                            <span className={`text-[0.7rem] opacity-75 ${cls.text}`}>{score}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── User menu ────────────────────────────────────────────────── */
function UserMenu({ isSignedIn, onSignIn, onSignOut }: {
    isSignedIn: boolean;
    onSignIn:   () => void;
    onSignOut:  () => void;
}) {
    const [open, setOpen] = useState(false);
    const ref             = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    if (!isSignedIn) {
        return (
            <button
                onClick={onSignIn}
                className="btn btn-primary btn-sm hidden items-center gap-1.5 transition-all duration-200 hover:-translate-y-px md:inline-flex"
            >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <circle cx="5.5" cy="3.5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M1 10c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Sign in
            </button>
        );
    }

    return (
        <div ref={ref} className="relative hidden md:block">
            <button
                onClick={() => setOpen(!open)}
                className={`flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border-none px-2 py-1 pl-1 transition-all duration-200
          ${open ? "bg-background-muted" : "bg-transparent hover:bg-background-muted"}`}
            >
                <div className="grid h-7 w-7 place-items-center rounded-full bg-yellow text-[0.65rem] font-bold text-yellow-ink">
                    LA
                </div>
                <span className="text-[0.78rem] font-medium text-foreground-2">Latifa</span>
                <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
                >
                    <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground-4" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[200px] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                    <div className="border-b border-border px-4 py-3">
                        <p className="text-[0.82rem] font-semibold text-foreground">Latifa A.</p>
                        <p className="mt-px text-[0.72rem] text-foreground-4">Canton: Bern · EN</p>
                    </div>
                    <div className="flex flex-col gap-0.5 p-1.5">
                        {[
                            { label: "My Profile",    href: "/profile"  },
                            { label: "My Canton",     href: "/canton"   },
                            { label: "Vote History",  href: "/history"  },
                            { label: "Settings",      href: "/settings" },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="block w-full rounded-[var(--radius-md)] px-3 py-[7px] text-left text-[0.8rem] text-foreground-2 no-underline transition-all duration-150 hover:bg-background-muted hover:text-foreground"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="border-t border-border p-1.5">
                        <button
                            onClick={() => { onSignOut(); setOpen(false); }}
                            className="w-full cursor-pointer rounded-[var(--radius-md)] border-none bg-transparent px-3 py-[7px] text-left text-[0.8rem] text-error transition-all duration-150 hover:bg-error-bg"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   HEADER
   ───────────────────────────────────────────────────────────── */
export default function Header() {
    const pathname      = usePathname();
    const searchParams  = useSearchParams();
    const activeTab     = searchParams.get("tab") ?? "overview";

    const [activeLang,  setActiveLang]  = useState("EN");
    const [mobileOpen,  setMobileOpen]  = useState(false);
    const [scrolled,    setScrolled]    = useState(false);
    const [isSignedIn,  setIsSignedIn]  = useState(false);
    const stand = useProjectedStand();

    /* Close mobile menu on route change */
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* Only show the tabs bar on the home route */
    const showTabs = pathname === "/";

    return (
        <header
            className={` top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl transition-all duration-300
        ${scrolled ? "shadow-[0_2px_28px_rgba(0,0,0,0.08)]" : "shadow-none"}`}
        >
            {/* ── Top bar ───────────────────────────────────────── */}
            <div className="page-container flex items-center justify-between gap-4 py-3">

                {/* Logo → home */}
                <Link href="/" className="group flex shrink-0 items-center gap-3 no-underline">
                    <div className="transition-transform duration-200 group-hover:scale-95 group-hover:rotate-3">
                        <Logo />
                    </div>
                    <div className="flex flex-col leading-tight">
            <span className="text-[0.84rem] font-bold tracking-[-0.015em] text-foreground transition-colors duration-200 group-hover:text-yellow-dark">
              Swiss Referendum
            </span>
                        <span className="mt-[2px] flex items-center gap-1.5">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-yellow-dark">
                smartinfo
              </span>
              <span className="inline-block h-[5px] w-[5px] animate-pulse rounded-full bg-success" />
            </span>
                    </div>
                </Link>

                {/* Desktop nav — Link-based */}
                <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
                    {NAV_LINKS.map(({ label, href }) => {
                        /*
                          Active when:
                          - exact match for "/" (home)
                          - pathname starts with href for all other routes
                        */
                        const active =
                            href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(href);

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`relative overflow-hidden rounded-[var(--radius-md)] px-4 py-2 text-[0.8rem] no-underline transition-colors duration-200
                  before:absolute before:inset-0 before:-z-10 before:rounded-[var(--radius-md)] before:bg-yellow-light
                  before:origin-left before:scale-x-0 before:transition-transform before:duration-200 before:content-['']
                  hover:before:scale-x-100 hover:text-yellow-dark
                  ${active ? "font-semibold text-yellow-dark" : "font-medium text-foreground-3"}`}
                            >
                                {label}
                                {active && (
                                    <span className="absolute bottom-1 left-1/2 block h-[2px] w-[55%] -translate-x-1/2 rounded-full bg-yellow" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right cluster */}
                <div className="flex shrink-0 items-center gap-2">
                    <StandChip type={stand.type} label={stand.label} score={stand.score} />
                    <div className="mx-0.5 hidden h-5 w-px self-center bg-border-strong lg:block" />
                    <div className="hidden sm:block">
                        <LanguageSwitcher activeLang={activeLang} onChange={setActiveLang} />
                    </div>
                    <div className="mx-0.5 hidden h-5 w-px self-center bg-border-strong sm:block" />
                    <UserMenu
                        isSignedIn={isSignedIn}
                        onSignIn={() => setIsSignedIn(true)}
                        onSignOut={() => setIsSignedIn(false)}
                    />

                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                        className="grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-[var(--radius-md)] border border-border bg-transparent text-foreground-3 transition-all duration-150 hover:border-yellow-mid hover:bg-yellow-light md:hidden"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                            {mobileOpen
                                ? <path d="M3 3l10 10M13 3L3 13" />
                                : <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Mobile drawer ─────────────────────────────────── */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex flex-col gap-1 border-t border-border bg-background-subtle px-4 pb-5 pt-3">

                    <p className="text-label mb-2 px-2">Navigation</p>

                    {NAV_LINKS.map(({ label, href }) => {
                        const active =
                            href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(href);

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] text-left text-[0.875rem] no-underline transition-all duration-150
                  hover:bg-yellow-light hover:pl-[18px] hover:text-yellow-dark
                  ${active
                                    ? "border-l-[3px] border-yellow bg-yellow-light pl-3 font-semibold text-yellow-dark"
                                    : "border-l-[3px] border-transparent px-3 font-normal text-foreground-2"
                                }`}
                            >
                                {label}
                                {active && <span className="badge badge-yellow ml-auto">active</span>}
                            </Link>
                        );
                    })}

                    <div className="divider my-3" />

                    {/* Stand chip — mobile */}
                    <div className={`mb-1 flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2.5 ${STAND_CLASSES[stand.type].bg} border ${STAND_CLASSES[stand.type].border}`}>
                        <div className="flex flex-col gap-0.5">
                            <span className={`text-label ${STAND_CLASSES[stand.type].text}`}>Your projected stand</span>
                            <span className={`text-[0.82rem] font-bold ${STAND_CLASSES[stand.type].text}`}>{stand.label}</span>
                        </div>
                        <span className={`rounded-full px-[10px] py-1 text-[0.72rem] font-bold ${STAND_CLASSES[stand.type].pill}`}>
              {stand.score}%
            </span>
                    </div>

                    {/* Bottom row */}
                    <div className="mt-1 flex items-center justify-between gap-3 px-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[0.7rem] text-foreground-4">Language</span>
                            <LanguageSwitcher activeLang={activeLang} onChange={setActiveLang} />
                        </div>
                        {isSignedIn ? (
                            <button
                                onClick={() => setIsSignedIn(false)}
                                className="btn btn-outline btn-sm text-error"
                            >
                                Sign out
                            </button>
                        ) : (
                            <button onClick={() => setIsSignedIn(true)} className="btn btn-primary btn-sm">
                                Sign in
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Tabs bar (home only) ───────────────────────────── */}
            {showTabs && (
                <div className="border-t border-border bg-background-subtle">
                    <div className="page-container flex items-center gap-1 py-2">

                        {/* Next vote indicator */}
                        <div className="mr-3 hidden shrink-0 items-center gap-1.5 sm:flex">
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                            <span className="text-[0.68rem] font-medium text-foreground-4">Next vote: 9 Jun</span>
                        </div>
                        <div className="mr-2 hidden h-4 w-px self-center bg-border-strong sm:block" />

                        {/* Tabs — Link with ?tab= search param */}
                        <div className="flex flex-wrap gap-1">
                            {TABS.map((tab) => {
                                const active = activeTab === tab.id;
                                return (
                                    <Link
                                        key={tab.id}
                                        href={`/?tab=${tab.id}`}
                                        /*
                                          Use replace:true so tab switches don't pile up in history.
                                          The scroll={false} prevents the page jumping to the top.
                                        */
                                        replace
                                        scroll={false}
                                        className={`tab relative overflow-hidden border-none no-underline
                      after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-4/5 after:-translate-x-1/2
                      after:rounded-full after:bg-yellow after:scale-x-0 after:transition-transform after:duration-200 after:content-['']
                      hover:after:scale-x-100 flex items-center gap-1.5
                      ${active ? "tab-active" : ""}`}
                                    >
                                        {active && <span className="inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-yellow" />}
                                        {tab.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Auth status indicator */}
                        <div className="ml-auto hidden items-center gap-2 md:flex">
                            {isSignedIn && <span className="badge badge-yellow text-[0.65rem]">Bern</span>}
                            <span className={`inline-block h-[7px] w-[7px] rounded-full transition-all duration-300
                ${isSignedIn ? "bg-success shadow-[0_0_0_2px_var(--success-bg)]" : "bg-foreground-4"}`}
                            />
                            <span className="text-[0.68rem] text-foreground-4">
                {isSignedIn ? "Signed in" : "Guest"}
              </span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}