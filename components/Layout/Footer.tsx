"use client";

import { footerPillars } from "@/constants";

const footerLinks = {
    Product:  ["How it works", "Upcoming votes", "Referendum archive", "My Canton"],
    Research: ["Data sources", "Methodology", "Explainability", "AI model"],
    Legal:    ["Privacy policy", "Terms of use", "Accessibility", "Contact"],
};

const socials = [
    {
        label: "GitHub",
        href: "#",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
        ),
    },
    {
        label: "Twitter / X",
        href: "#",
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        ),
    },
];

/* ── Logo (matches Header) ───────────────────────────────── */
function FooterLogo() {
    return (
        <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
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

export default function Footer() {
    return (
        <>
            <style>{`
        .footer-link {
          position: relative;
          display: inline-block;
          font-size: 0.8rem;
          color: var(--foreground-3);
          font-weight: 400;
          transition: color 0.15s ease;
          text-decoration: none;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--yellow);
          transition: width 0.2s cubic-bezier(0.4,0,0.2,1);
        }
        .footer-link:hover { color: var(--foreground); }
        .footer-link:hover::after { width: 100%; }

        .social-btn {
          display: grid;
          place-items: center;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          color: var(--foreground-4);
          text-decoration: none;
          width: 32px;
          height: 32px;
        }
        .social-btn:hover {
          background: var(--yellow-light);
          border-color: var(--yellow-mid);
          color: var(--yellow-ink);
          transform: translateY(-1px);
        }

        .pillar-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.68rem;
          font-weight: 500;
          background: var(--background-muted);
          color: var(--foreground-3);
          border: 1px solid var(--border);
          transition: all 0.15s ease;
          cursor: default;
        }
        .pillar-badge:hover {
          background: var(--yellow-light);
          color: var(--yellow-ink);
          border-color: color-mix(in srgb, var(--yellow) 40%, transparent);
          transform: translateY(-1px);
        }
      `}</style>

            <footer
                className="mt-16 border-t border-[var(--border)]"
                style={{ background: "var(--background-subtle)" }}
            >

                {/* ── Top newsletter strip ──────────────────── */}
                <div
                    className="border-b border-[var(--border)]"
                    style={{ background: "var(--yellow-light)" }}
                >
                    <div className="page-container py-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
              <span
                  className="inline-block rounded-full animate-pulse shrink-0"
                  style={{ width: 8, height: 8, background: "var(--yellow-dark)" }}
              />
                            <p style={{ fontSize: "0.82rem", color: "var(--yellow-ink)", fontWeight: 500, margin: 0 }}>
                                Next federal vote: <strong>9 June (example)</strong> — stay informed
                            </p>
                        </div>
                        <a
                            href="#"
                            className="btn btn-yellow btn-sm shrink-0"
                        >
                            Get vote reminders
                        </a>
                    </div>
                </div>

                {/* ── Main footer body ─────────────────────── */}
                <div className="page-container pt-10 pb-8">

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">

                        {/* Brand column */}
                        <div className="md:col-span-4">
                            <a href="/" className="flex items-center gap-2.5 no-underline mb-4 group w-fit">
                                <div className="transition-transform duration-200 group-hover:scale-95">
                                    <FooterLogo />
                                </div>
                                <div className="flex flex-col leading-tight">
                  <span
                      className="font-bold tracking-tight"
                      style={{ fontSize: "0.84rem", color: "var(--foreground)", letterSpacing: "-0.015em" }}
                  >
                    Swiss Referendum
                  </span>
                                    <span
                                        className="text-[0.6rem] text-[var(--yellow-dark)] tracking-[0.08em] uppercase font-bold"
                                    >
                    smartinfo
                  </span>
                                </div>
                            </a>

                            <p className="mb-5" style={{ fontSize: "0.78rem", color: "var(--foreground-4)", lineHeight: 1.7, maxWidth: 280 }}>
                                AI-powered explainers for Swiss direct democracy — transparent, sourced, and built for informed participation.
                            </p>

                            {/* Pillars */}
                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {footerPillars.map((p) => (
                                    <span key={p} className="pillar-badge">{p}</span>
                                ))}
                            </div>

                            {/* Socials */}
                            <div className="flex items-center gap-2">
                                {socials.map((s) => (
                                    <a key={s.label} href={s.href} aria-label={s.label} className="social-btn">
                                        {s.icon}
                                    </a>
                                ))}
                                <span style={{ fontSize: "0.68rem", color: "var(--foreground-4)", marginLeft: 4 }}>
                  Follow the project
                </span>
                            </div>
                        </div>

                        {/* Link columns */}
                        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                            {Object.entries(footerLinks).map(([section, links]) => (
                                <div key={section}>
                                    <p className="text-label mb-4">{section}</p>
                                    <ul className="flex flex-col gap-2.5" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {links.map((link) => (
                                            <li key={link}>
                                                <a href="#" className="footer-link">{link}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* ── Divider with canton strip ─────────── */}
                    <div
                        className="rounded-[var(--radius-lg)] px-4 py-3 mb-6 flex flex-wrap items-center gap-3"
                        style={{ background: "var(--background-muted)", border: "1px solid var(--border)" }}
                    >
                        <span className="text-label">Available cantons</span>
                        <div className="flex flex-wrap gap-1.5">
                            {["ZH", "BE", "GE", "BS", "LU", "ZG", "VD", "TI"].map((canton) => (
                                <span
                                    key={canton}
                                    className="badge"
                                    style={{ fontSize: "0.63rem", padding: "2px 7px" }}
                                >
                  {canton}
                </span>
                            ))}
                            <span className="badge" style={{ fontSize: "0.63rem", padding: "2px 7px", color: "var(--foreground-4)" }}>
                +18 more
              </span>
                        </div>
                    </div>

                    {/* ── Bottom bar ───────────────────────── */}
                    <div
                        className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-[var(--border)]"
                    >
            <span style={{ fontSize: "0.71rem", color: "var(--foreground-4)" }}>
              © {new Date().getFullYear()} smartinfo · Mock interface · Not affiliated with the Swiss Confederation
            </span>

                        <div className="flex items-center gap-2">
                            <span style={{ fontSize: "0.71rem", color: "var(--foreground-4)" }}>Built with</span>
                            {[
                                { label: "Next.js",      cls: "badge" },
                                { label: "Tailwind v4",  cls: "badge badge-yellow" },
                                { label: "TypeScript",   cls: "badge" },
                            ].map(({ label, cls }) => (
                                <span key={label} className={cls} style={{ fontSize: "0.65rem", padding: "2px 8px" }}>
                  {label}
                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </footer>
        </>
    );
}