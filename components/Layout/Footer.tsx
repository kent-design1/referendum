import { footerPillars } from "@/constants";

const footerLinks = {
  Project: ["About", "How it works", "Data sources", "Methodology"],
  Legal:   ["Privacy policy", "Terms of use", "Accessibility", "Contact"],
};

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      background: "var(--background-subtle)",
      marginTop: "4rem",
    }}>
      <div className="page-container" style={{ paddingTop: "2.5rem", paddingBottom: "2rem" }}>

        {/* ── Top section ─────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
          marginBottom: "2rem",
        }}
          className="md:grid-cols-3"
        >
          {/* Brand */}
          <div style={{ gridColumn: "1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: "var(--radius-md)",
                background: "var(--foreground)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 1v9M1 5.5h9" stroke="var(--yellow)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>
                Swiss Referendum Info
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--foreground-4)", lineHeight: 1.65, maxWidth: "260px" }}>
              AI-powered explainers for Swiss direct democracy — transparent, sourced, and built for informed participation.
            </p>
            {/* Pillars */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "14px" }}>
              {footerPillars.map((p) => (
                <span key={p} className="badge badge-yellow" style={{ fontSize: "0.68rem" }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-label" style={{ marginBottom: "12px" }}>{section}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--foreground-3)",
                        fontWeight: 400,
                        transition: "color 0.12s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-3)")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ──────────────────────────────── */}
        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}>
          <span style={{ fontSize: "0.72rem", color: "var(--foreground-4)" }}>
            © {new Date().getFullYear()} smartinfo · Mock interface · Not affiliated with the Swiss Confederation
          </span>
          <span style={{
            fontSize: "0.72rem",
            color: "var(--foreground-4)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}>
            Built with
            <span style={{
              padding: "2px 7px",
              background: "var(--background-muted)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "var(--foreground-3)",
            }}>
              Next.js
            </span>
            <span style={{
              padding: "2px 7px",
              background: "var(--yellow-light)",
              border: "1px solid color-mix(in srgb, var(--yellow) 30%, transparent)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "var(--yellow-ink)",
            }}>
              Tailwind v4
            </span>
          </span>
        </div>

      </div>
    </footer>
  );
}
