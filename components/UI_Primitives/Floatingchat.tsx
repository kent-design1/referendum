"use client";

import { useState, useRef, useEffect } from "react";
import Badge                           from "@/components/UI_Primitives/Badge";
import { initialMessages, sources }    from "@/constants";
import type { ChatMessage }            from "@/lib/types";

const SUGGESTIONS = [
    { icon: "⚡", text: "What does this proposal actually do?" },
    { icon: "✅", text: "What are the strongest PRO arguments?" },
    { icon: "❌", text: "What are the strongest CON arguments?" },
    { icon: "💰", text: "How much will this cost taxpayers?"   },
];

/* ─────────────────────────────────────────────────────────────
   TYPING DOTS
   ───────────────────────────────────────────────────────────── */
function TypingDots() {
    return (
        <span className="fct-dots">
      {[0, 1, 2].map((i) => (
          <span key={i} className="fct-dot"
                style={{ animation: `fct-bounce 1.1s ease-in-out ${i * 0.18}s infinite` }} />
      ))}
    </span>
    );
}

/* ─────────────────────────────────────────────────────────────
   FLOATING CHAT
   ───────────────────────────────────────────────────────────── */
export default function FloatingChat() {
    const [open,            setOpen]            = useState(false);
    const [messages,        setMessages]        = useState<ChatMessage[]>(initialMessages);
    const [input,           setInput]           = useState("");
    const [loading,         setLoading]         = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [unread,          setUnread]          = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef  = useRef<HTMLInputElement>(null);

    /* Auto-scroll */
    useEffect(() => {
        if (open && scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, loading, open]);

    /* Clear unread on open + focus input */
    useEffect(() => {
        if (open) {
            setUnread(0);
            setTimeout(() => inputRef.current?.focus(), 140);
        }
    }, [open]);

    function send(text: string) {
        const t = text.trim();
        if (!t || loading) return;
        setShowSuggestions(false);
        setMessages((p) => [...p, { id: `u-${Date.now()}`, role: "user", content: t }]);
        setInput("");
        setLoading(true);
        setTimeout(() => {
            setMessages((p) => [...p, {
                id:         `a-${Date.now()}`,
                role:       "assistant",
                content:    "This is a mock response. In production this calls your AI backend with full referendum context, user preferences, and sourced factual grounding.",
                confidence: "Medium",
            }]);
            setLoading(false);
            if (!open) setUnread((n) => n + 1);
        }, 950);
    }

    const canSend = !loading && input.trim().length > 0;

    return (
        <>
            {/* ── FLOATING TRIGGER ────────────────────────────── */}
            <button
                className={`fct-btn ${open ? "fct-btn-open" : ""}`}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close AI assistant" : "Open AI assistant"}
                aria-expanded={open}
            >
                {open ? (
                    /* X — close */
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2.2"
                              strokeLinecap="round" />
                    </svg>
                ) : (
                    /* + cross logo */
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                        <rect width="22" height="22" rx="6" fill="var(--yellow)" />
                        <rect x="10" y="4"  width="2.2" height="14" rx="1" fill="var(--yellow-ink)" />
                        <rect x="4"  y="10" width="14"  height="2.2" rx="1" fill="var(--yellow-ink)" />
                        <circle cx="5"  cy="5"  r="1.2" fill="var(--yellow-ink)" opacity="0.3" />
                        <circle cx="17" cy="5"  r="1.2" fill="var(--yellow-ink)" opacity="0.3" />
                        <circle cx="5"  cy="17" r="1.2" fill="var(--yellow-ink)" opacity="0.3" />
                        <circle cx="17" cy="17" r="1.2" fill="var(--yellow-ink)" opacity="0.3" />
                    </svg>
                )}

                {/* Unread badge */}
                {!open && unread > 0 && (
                    <span className="fct-unread" aria-label={`${unread} unread`}>{unread}</span>
                )}

                {/* Pulse ring */}
                {!open && <span className="fct-ring" aria-hidden="true" />}
            </button>

            {/* ── CHAT PANEL ──────────────────────────────────── */}
            <div
                className={`fct-panel ${open ? "fct-panel-open" : "fct-panel-closed"}`}
                role="dialog"
                aria-label="AI referendum assistant"
                aria-modal="false"
            >
                {/* Header */}
                <div className="fct-header">
                    <div className="fct-header-left">
                        <div className="fct-hdr-avatar">
                            <svg width="9" height="9" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                                <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)"
                                      strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div>
                            <p className="fct-hdr-title">AI Assistant</p>
                            <p className="fct-hdr-sub">Ask about this referendum</p>
                        </div>
                    </div>
                    <div className="fct-header-right">
            <span className="fct-live-pill">
              <span className="fct-live-dot" aria-hidden="true" />
              Live
            </span>
                        {/* Minimise */}
                        <button
                            className="fct-min-btn"
                            onClick={() => setOpen(false)}
                            aria-label="Minimise chat"
                            title="Minimise"
                        >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                                <path d="M2 6.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scroll area */}
                <div ref={scrollRef} className="fct-scroll">
                    {messages.map((m) =>
                        m.role === "user"
                            ? <UserBubble      key={m.id} msg={m} />
                            : <AssistantBubble key={m.id} msg={m} />
                    )}
                    {loading && (
                        <div className="fct-thinking">
                            <div className="fct-thinking-av">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                                    <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)"
                                          strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <TypingDots />
                            <span className="fct-thinking-lbl">Thinking…</span>
                        </div>
                    )}
                </div>

                {/* Suggestions */}
                {showSuggestions && (
                    <div className="fct-suggestions">
                        <p className="fct-sugg-label">Try asking</p>
                        <div className="fct-sugg-grid">
                            {SUGGESTIONS.map(({ icon, text }) => (
                                <button key={text} className="fct-sugg-btn" onClick={() => send(text)}>
                                    <span className="fct-sugg-icon">{icon}</span>
                                    <span className="fct-sugg-text">{text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="fct-input-wrap">
                    <div className="fct-input-shell">
                        <input
                            ref={inputRef}
                            className="fct-input"
                            placeholder="Ask about this referendum…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send(input)}
                            disabled={loading}
                            aria-label="Chat input"
                        />
                        <button
                            className={`fct-send ${canSend ? "fct-send-on" : ""}`}
                            onClick={() => send(input)}
                            disabled={!canSend}
                            aria-label="Send message"
                        >
                            {loading
                                ? <span className="fct-spinner" />
                                : (
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                                        <path d="M1 6.5h10M7 2.5l5 4-5 4" stroke="currentColor"
                                              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="fct-disclaimer">
                    Supports informed decision-making. Not official voting guidance.
                </p>
            </div>

            {/* ── SCOPED STYLES ───────────────────────────────── */}
            <style>{`

        /* ── TRIGGER ──────────────────────────────────── */
        .fct-btn {
          position: fixed;
          bottom: 1.75rem; right: 1.75rem; z-index: 60;

          width: 54px; height: 54px; border-radius: 50%;
          background: var(--color-accent);
          border: none; cursor: pointer;
          display: grid; place-items: center;

          box-shadow: 0 4px 20px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.10);
          color: #fff;

          transition:
            transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.18s ease,
            background 0.15s ease;
        }

        .fct-btn:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.22);
        }

        .fct-btn-open {
          background: var(--color-accent-hover);
        }

        /* Pulse ring */
        .fct-ring {
          position: absolute; inset: -5px; border-radius: 50%;
          border: 2px solid color-mix(in srgb, var(--yellow) 60%, transparent);
          animation: fct-ring 3s ease-out 1s infinite;
          pointer-events: none;
        }

        @keyframes fct-ring {
          0%   { transform: scale(1);    opacity: 0.7; }
          100% { transform: scale(1.55); opacity: 0;   }
        }

        /* Unread */
        .fct-unread {
          position: absolute; top: -2px; right: -2px;
          min-width: 18px; height: 18px; padding: 0 3px;
          border-radius: var(--radius-full);
          background: var(--yellow); color: var(--yellow-ink);
          font-size: 0.58rem; font-weight: 800;
          display: grid; place-items: center; line-height: 1;
          border: 2px solid var(--color-accent);
          animation: fct-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes fct-pop { from { transform: scale(0); } to { transform: scale(1); } }

        /* ── PANEL ────────────────────────────────────── */
        .fct-panel {
          position: fixed;
          bottom: calc(1.75rem + 54px + 14px);
          right: 1.75rem; z-index: 59;

          width: 360px;
          max-width: calc(100vw - 2rem);
          display: flex; flex-direction: column;

          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 44px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;

          transform-origin: bottom right;
          transition:
            transform 0.28s cubic-bezier(0.34,1.2,0.64,1),
            opacity   0.2s ease;
        }

        .fct-panel-closed {
          transform: scale(0.82) translateY(16px);
          opacity: 0; pointer-events: none;
        }

        .fct-panel-open {
          transform: scale(1) translateY(0);
          opacity: 1; pointer-events: all;
        }

        /* Header */
        .fct-header {
          display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
          padding: 0.75rem 0.875rem 0.625rem;
          border-bottom: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
        }

        .fct-header-left  { display: flex; align-items: center; gap: 8px; }
        .fct-header-right { display: flex; align-items: center; gap: 6px; }

        .fct-hdr-avatar {
          width: 28px; height: 28px; border-radius: var(--radius-md);
          background: var(--color-accent);
          display: grid; place-items: center; flex-shrink: 0;
        }

        .fct-hdr-title {
          font-size: 0.8rem; font-weight: 700; letter-spacing: -0.01em;
          color: var(--color-text-primary); line-height: 1; margin: 0;
        }

        .fct-hdr-sub {
          font-size: 0.6rem; color: var(--color-text-muted); margin: 1px 0 0;
        }

        .fct-live-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 7px; border-radius: var(--radius-full);
          font-size: 0.6rem; font-weight: 700;
          background: var(--yellow-light); color: var(--yellow-dark);
          border: 1px solid var(--yellow-mid);
        }

        .fct-live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--yellow-dark);
          animation: fct-pulse 2.2s ease-in-out infinite;
        }

        @keyframes fct-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

        .fct-min-btn {
          width: 26px; height: 26px; border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle); background: none;
          cursor: pointer; display: grid; place-items: center;
          color: var(--color-text-muted); transition: all 0.12s ease;
        }

        .fct-min-btn:hover {
          background: var(--yellow-light); border-color: var(--yellow-mid);
          color: var(--yellow-dark);
        }

        /* Scroll */
        .fct-scroll {
          height: 300px; overflow-y: auto;
          background: var(--color-surface-raised);
          padding: 10px; display: flex; flex-direction: column;
          gap: 8px; scroll-behavior: smooth;
        }

        .fct-scroll::-webkit-scrollbar       { width: 3px; }
        .fct-scroll::-webkit-scrollbar-track { background: transparent; }
        .fct-scroll::-webkit-scrollbar-thumb {
          background: var(--color-border); border-radius: var(--radius-full);
        }

        /* Thinking */
        .fct-thinking {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 10px;
          background: var(--color-surface);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md); border-bottom-left-radius: 3px;
          width: fit-content;
        }

        .fct-thinking-av {
          width: 18px; height: 18px; border-radius: var(--radius-sm);
          background: var(--color-accent); display: grid; place-items: center; flex-shrink: 0;
        }

        .fct-thinking-lbl { font-size: 0.66rem; color: var(--color-text-tertiary); }

        /* Typing dots */
        .fct-dots { display: flex; gap: 3px; align-items: center; }

        .fct-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--yellow); display: inline-block;
        }

        @keyframes fct-bounce {
          0%,80%,100% { transform: translateY(0);    opacity: 0.35; }
          40%          { transform: translateY(-4px); opacity: 1;    }
        }

        /* User bubble */
        .fct-user-bubble {
          align-self: flex-end; max-width: 86%;
          background: var(--color-accent); color: #fff;
          border-radius: var(--radius-md); border-bottom-right-radius: 3px;
          padding: 8px 11px;
        }

        .fct-user-label {
          font-size: 0.57rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; opacity: 0.4; margin: 0 0 4px;
        }

        .fct-user-text { font-size: 0.8rem; margin: 0; line-height: 1.5; }

        /* Assistant bubble */
        .fct-asst-bubble {
          background: var(--color-surface);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md); border-bottom-left-radius: 3px;
          padding: 8px 11px; display: flex; flex-direction: column; gap: 6px;
        }

        .fct-asst-hdr { display: flex; align-items: center; gap: 6px; }

        .fct-asst-av {
          width: 18px; height: 18px; border-radius: var(--radius-sm);
          background: var(--color-accent); display: grid; place-items: center; flex-shrink: 0;
        }

        .fct-asst-name {
          font-size: 0.59rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--color-text-muted); flex: 1;
        }

        .fct-asst-text { font-size: 0.78rem; color: var(--color-text-secondary); margin: 0; line-height: 1.62; }

        /* Feedback */
        .fct-fb-row { display: flex; flex-wrap: wrap; gap: 4px; }

        .fct-fb-btn {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 3px 8px; border-radius: var(--radius-full);
          border: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
          font-size: 0.64rem; font-weight: 500; color: var(--color-text-muted);
          cursor: pointer; transition: all 0.11s ease;
        }

        .fct-fb-btn:hover, .fct-fb-active {
          background: var(--yellow-light); border-color: var(--yellow-mid);
          color: var(--yellow-dark);
        }

        .fct-fb-active { border-color: var(--yellow) !important; font-weight: 700; }

        /* Suggestions */
        .fct-suggestions {
          padding: 8px 10px; border-top: 1px solid var(--color-border-subtle);
          background: var(--color-surface);
          display: flex; flex-direction: column; gap: 5px;
        }

        .fct-sugg-label {
          font-size: 0.57rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--color-text-muted); margin: 0;
        }

        .fct-sugg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }

        .fct-sugg-btn {
          display: flex; align-items: flex-start; gap: 5px;
          padding: 6px 8px; border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
          cursor: pointer; text-align: left;
          transition: all 0.11s ease;
        }

        .fct-sugg-btn:hover { background: var(--yellow-light); border-color: var(--yellow-mid); }

        .fct-sugg-icon { font-size: 0.7rem; flex-shrink: 0; line-height: 1.4; }

        .fct-sugg-text { font-size: 0.63rem; color: var(--color-text-secondary); line-height: 1.4; flex: 1; }

        .fct-sugg-btn:hover .fct-sugg-text { color: var(--yellow-ink); }

        /* Input */
        .fct-input-wrap {
          padding: 7px 10px 5px;
          border-top: 1px solid var(--color-border-subtle);
          background: var(--color-surface);
        }

        .fct-input-shell {
          display: flex; gap: 5px; align-items: center;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 3px 3px 3px 10px;
          transition: border-color 0.14s, box-shadow 0.14s;
        }

        .fct-input-shell:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 8%, transparent);
        }

        .fct-input {
          flex: 1; background: none; border: none; outline: none;
          font-size: 0.78rem; color: var(--color-text-primary);
          padding: 4px 0; min-width: 0;
        }

        .fct-input::placeholder { color: var(--color-text-tertiary); }
        .fct-input:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Send */
        .fct-send {
          width: 30px; height: 30px; border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--background-muted); color: var(--color-text-tertiary);
          display: grid; place-items: center; flex-shrink: 0;
          cursor: not-allowed; transition: all 0.14s ease;
        }

        .fct-send-on {
          background: var(--yellow);
          border-color: color-mix(in srgb, var(--yellow) 70%, transparent);
          color: var(--yellow-ink); cursor: pointer;
        }

        .fct-send-on:hover {
          background: var(--yellow-dark); border-color: var(--yellow-dark);
          color: #fff; transform: translateY(-1px);
        }

        .fct-spinner {
          width: 11px; height: 11px; display: block;
          border: 1.5px solid var(--yellow-mid); border-top-color: var(--yellow-dark);
          border-radius: 50%; animation: fct-spin 0.7s linear infinite;
        }

        @keyframes fct-spin { to { transform: rotate(360deg); } }

        /* Disclaimer */
        .fct-disclaimer {
          font-size: 0.59rem; color: var(--color-text-tertiary);
          text-align: center; margin: 0; line-height: 1.4;
          padding: 4px 10px 8px; background: var(--color-surface);
        }

        /* Mobile */
        @media (max-width: 420px) {
          .fct-panel { right: 0.75rem; width: calc(100vw - 1.5rem); }
          .fct-btn   { bottom: 1.25rem; right: 1.25rem; }
        }
      `}</style>
        </>
    );
}

/* ─────────────────────────────────────────────────────────────
   USER BUBBLE
   ───────────────────────────────────────────────────────────── */
function UserBubble({ msg }: { msg: ChatMessage }) {
    return (
        <div className="fct-user-bubble">
            <p className="fct-user-label">You</p>
            <p className="fct-user-text">{msg.content}</p>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   ASSISTANT BUBBLE
   ───────────────────────────────────────────────────────────── */
function AssistantBubble({ msg }: { msg: ChatMessage }) {
    const [feedback,     setFeedback]     = useState<string | null>(null);
    const citedSources = sources.filter((s) => msg.sources?.includes(s.id));

    return (
        <div className="fct-asst-bubble">
            <div className="fct-asst-hdr">
                <div className="fct-asst-av">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                        <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
                <span className="fct-asst-name">Assistant</span>
                {msg.confidence && (
                    <Badge label="Confidence" value={msg.confidence} variant="yellow" />
                )}
            </div>

            <p className="fct-asst-text">{msg.content}</p>

            <div className="fct-fb-row">
                {(["👍 Agree", "👎 Disagree", "❓ Confused"] as const).map((label) => (
                    <button
                        key={label}
                        onClick={() => setFeedback(feedback === label ? null : label)}
                        className={`fct-fb-btn ${feedback === label ? "fct-fb-active" : ""}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {citedSources.length > 0 && (
                <div style={{
                    background: "var(--background-muted)", borderRadius: "var(--radius-md)", padding: "6px 8px",
                }}>
                    <p style={{ fontSize: "0.56rem", fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.06em", color: "var(--color-text-muted)", margin: "0 0 3px" }}>
                        Sources
                    </p>
                    {citedSources.map((s) => (
                        <p key={s.id} style={{ fontSize: "0.69rem", color: "var(--color-text-secondary)", margin: "2px 0" }}>
                            <strong style={{ color: "var(--color-text-primary)" }}>{s.id}</strong> {s.title}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}