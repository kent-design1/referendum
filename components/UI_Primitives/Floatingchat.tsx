"use client";

import { useState, useRef, useEffect } from "react";
import Link                            from "next/link";
import Badge                           from "@/components/UI_Primitives/Badge";
import { useChatStore, daysLeft }      from "@/lib/useChatStore";
import type { ChatMessage, VoteType }  from "@/lib/useChatStore";

const TYPE_CFG: Record<VoteType, {
    label: string; bg: string; text: string; border: string; stripe: string;
}> = {
    "initiative":       { label: "Initiative",       bg: "var(--yellow-light)",     text: "var(--yellow-dark)",      border: "var(--yellow-mid)",          stripe: "var(--yellow)"            },
    "counter-proposal": { label: "Counter-proposal", bg: "var(--color-pro-bg)",     text: "var(--color-pro)",        border: "var(--color-pro-border)",    stripe: "var(--color-pro)"         },
    "referendum":       { label: "Referendum",        bg: "var(--background-muted)", text: "var(--color-text-muted)", border: "var(--color-border-subtle)", stripe: "var(--color-text-muted)"  },
};

const SUGGESTIONS = [
    { icon: "⚡", text: "What does this proposal actually do?"  },
    { icon: "✅", text: "What are the strongest PRO arguments?" },
    { icon: "❌", text: "What are the strongest CON arguments?" },
    { icon: "💰", text: "How much will this cost taxpayers?"    },
];

/* ── Typing dots ─────────────────────────────────────────── */
function TypingDots() {
    return (
        <span className="fc-dots">
      {[0, 1, 2].map((i) => (
          <span key={i} className="fc-dot"
                style={{ animation: `fc-bounce 1.1s ease-in-out ${i * 0.18}s infinite` }} />
      ))}
    </span>
    );
}

/* ── User bubble ─────────────────────────────────────────── */
function UserBubble({ msg }: { msg: ChatMessage }) {
    return (
        <div className="fc-user-bubble">
            <p className="fc-user-label">You</p>
            <p className="fc-user-text">{msg.content}</p>
        </div>
    );
}

/* ── Assistant bubble ────────────────────────────────────── */
function AssistantBubble({ msg }: { msg: ChatMessage }) {
    const [fb, setFb] = useState<string | null>(null);
    return (
        <div className="fc-asst-bubble">
            <div className="fc-asst-hdr">
                <div className="fc-asst-av">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
                <span className="fc-asst-name">SmartInfo AI</span>
                {msg.confidence && <Badge label="Confidence" value={msg.confidence} variant="yellow" />}
            </div>
            <p className="fc-asst-text">{msg.content}</p>
            <div className="fc-fb-row">
                {(["👍", "👎", "❓"] as const).map((e) => (
                    <button key={e}
                            onClick={() => setFb(fb === e ? null : e)}
                            className={`fc-fb-btn ${fb === e ? "fc-fb-on" : ""}`}>{e}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ── Main component ──────────────────────────────────────── */
export default function FloatingChat() {
    const { threads, activeId, activeThread, setActiveId, sendMessage, loading, ready } = useChatStore();

    const [open,            setOpen]            = useState(false);
    const [showPicker,      setShowPicker]      = useState(false);
    const [input,           setInput]           = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [unread,          setUnread]          = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef  = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [activeThread?.messages, loading, open]);

    useEffect(() => {
        setShowSuggestions((activeThread?.messages.length ?? 0) <= 1);
        setInput("");
    }, [activeId, activeThread?.messages.length]);

    useEffect(() => {
        if (open) {
            setUnread(0);
            setShowPicker(false);
            setTimeout(() => inputRef.current?.focus(), 120);
        }
    }, [open]);

    async function send(text: string) {
        if (!text.trim() || loading || !activeThread) return;
        setShowSuggestions(false);
        setInput("");

        await sendMessage(activeThread.id, text);

        /*
          sendMessage is now finished — the AI response has been
          added to the thread. If the panel is closed, badge the trigger.
        */
        if (!open) setUnread((n) => n + 1);
    }

    const canSend = !loading && input.trim().length > 0;
    const cfg     = activeThread ? TYPE_CFG[activeThread.type] : null;

    if (!ready) return null;

    return (
        <>
            {/* ── Trigger button ──────────────────────────────── */}
            <button
                className={`fc-btn ${open ? "fc-btn-open" : ""}`}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close AI assistant" : "Open AI assistant"}
                aria-expanded={open}
            >
                {open
                    ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                    : <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <rect width="22" height="22" rx="6" fill="var(--yellow)" />
                        <rect x="10" y="4"  width="2.2" height="14" rx="1" fill="var(--yellow-ink)" />
                        <rect x="4"  y="10" width="14"  height="2.2" rx="1" fill="var(--yellow-ink)" />
                        <circle cx="5"  cy="5"  r="1.2" fill="var(--yellow-ink)" opacity="0.3" />
                        <circle cx="17" cy="5"  r="1.2" fill="var(--yellow-ink)" opacity="0.3" />
                        <circle cx="5"  cy="17" r="1.2" fill="var(--yellow-ink)" opacity="0.3" />
                        <circle cx="17" cy="17" r="1.2" fill="var(--yellow-ink)" opacity="0.3" />
                    </svg>
                }
                {!open && unread > 0 && <span className="fc-unread">{unread}</span>}
                {!open && <span className="fc-ring" aria-hidden="true" />}
            </button>

            {/* ── Panel ───────────────────────────────────────── */}
            <div
                className={`fc-panel ${open ? "fc-panel-open" : "fc-panel-closed"}`}
                role="dialog"
                aria-label="AI referendum assistant"
            >
                {/* Header */}
                <div className="fc-header">
                    <div className="fc-header-left">
                        <div className="fc-hdr-av">
                            <svg width="9" height="9" viewBox="0 0 8 8" fill="none">
                                <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div>
                            <p className="fc-hdr-title">SmartInfo AI</p>
                            <p className="fc-hdr-sub">Referendum assistant</p>
                        </div>
                    </div>
                    <div className="fc-header-right">
            <span className="fc-live-pill">
              <span className="fc-live-dot" />Live
            </span>
                        <Link href={`/chat?vote=${activeId}`} className="fc-icon-btn" title="Open full workspace">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                <path d="M8 1h4v4M12 1L7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                        <button className="fc-icon-btn" onClick={() => setOpen(false)} aria-label="Minimise">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <path d="M2 6.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Vote switcher strip */}
                <div className="fc-switcher">
                    <button
                        className="fc-sw-trigger"
                        onClick={() => setShowPicker((v) => !v)}
                        aria-expanded={showPicker}
                    >
                        {cfg && <span className="fc-sw-dot" style={{ background: cfg.stripe }} />}
                        <span className="fc-sw-label">{activeThread?.shortTitle ?? "Select a referendum"}</span>
                        <svg
                            className={`fc-sw-chevron ${showPicker ? "fc-sw-chevron-open" : ""}`}
                            width="11" height="11" viewBox="0 0 11 11" fill="none"
                        >
                            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {showPicker && (
                        <div className="fc-sw-dropdown">
                            {threads.map((t) => {
                                const tc      = TYPE_CFG[t.type];
                                const active  = t.id === activeId;
                                const left    = daysLeft(t.createdAt);
                                const expired = left === 0;
                                return (
                                    <button
                                        key={t.id}
                                        disabled={expired}
                                        onClick={() => { setActiveId(t.id); setShowPicker(false); }}
                                        className={`fc-sw-opt ${active ? "fc-sw-opt-active" : ""} ${expired ? "fc-sw-opt-expired" : ""}`}
                                    >
                                        <span className="fc-sw-opt-stripe" style={{ background: tc.stripe }} />
                                        <div className="fc-sw-opt-body">
                                            <div className="fc-sw-opt-top">
                        <span className="fc-sw-opt-pill"
                              style={{ background: tc.bg, color: tc.text, borderColor: tc.border }}>
                          {tc.label}
                        </span>
                                                <span className="fc-sw-opt-expiry"
                                                      style={{ color: left <= 3 ? "var(--color-con)" : "var(--color-text-tertiary)" }}>
                          {expired ? "Cleared" : `${left}d left`}
                        </span>
                                            </div>
                                            <span className="fc-sw-opt-title">{t.shortTitle}</span>
                                            <span className="fc-sw-opt-count">{t.messages.length} messages</span>
                                        </div>
                                        {active && <span className="fc-sw-check">✓</span>}
                                    </button>
                                );
                            })}
                            <Link href="/chat" className="fc-sw-fulllink">Open full chat workspace →</Link>
                        </div>
                    )}
                </div>

                {/* Scroll area */}
                <div ref={scrollRef} className="fc-scroll">
                    {activeThread?.messages.map((m) =>
                        m.role === "user"
                            ? <UserBubble      key={m.id} msg={m} />
                            : <AssistantBubble key={m.id} msg={m} />
                    )}
                    {loading && (
                        <div className="fc-thinking">
                            <div className="fc-thinking-av">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <TypingDots />
                            <span className="fc-thinking-lbl">Thinking…</span>
                        </div>
                    )}
                </div>

                {/* Suggestions */}
                {showSuggestions && !showPicker && (
                    <div className="fc-suggestions">
                        <p className="fc-sugg-label">Try asking</p>
                        <div className="fc-sugg-grid">
                            {SUGGESTIONS.map(({ icon, text }) => (
                                <button key={text} className="fc-sugg-btn" onClick={() => send(text)}>
                                    <span className="fc-sugg-icon">{icon}</span>
                                    <span className="fc-sugg-text">{text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="fc-input-wrap">
                    <div className="fc-input-shell">
                        <input
                            ref={inputRef}
                            className="fc-input"
                            placeholder={activeThread ? `Ask about ${activeThread.shortTitle}…` : "Select a referendum above…"}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send(input)}
                            disabled={loading || !activeThread}
                            aria-label="Chat input"
                        />
                        <button
                            className={`fc-send ${canSend ? "fc-send-on" : ""}`}
                            onClick={() => send(input)}
                            disabled={!canSend}
                            aria-label="Send"
                        >
                            {loading
                                ? <span className="fc-spinner" />
                                : <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path d="M1 6.5h10M7 2.5l5 4-5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="fc-footer">
                    <p className="fc-disclaimer">Not official voting guidance · sources cited on request</p>
                    <Link href="/chat" className="fc-full-link">
                        Full workspace
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5h6M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>

            <style>{`
        .fc-btn {
          position: fixed; bottom: 1.75rem; right: 1.75rem; z-index: 60;
          width: 54px; height: 54px; border-radius: 50%;
          background: var(--color-accent); border: none; cursor: pointer;
          display: grid; place-items: center; color: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.1);
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s;
        }
        .fc-btn:hover  { transform: scale(1.1) translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.22); }
        .fc-btn-open   { background: var(--color-accent-hover); }
        .fc-ring {
          position: absolute; inset: -5px; border-radius: 50%;
          border: 2px solid color-mix(in srgb, var(--yellow) 60%, transparent);
          animation: fc-ring 3s ease-out 1s infinite; pointer-events: none;
        }
        @keyframes fc-ring { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(1.55); opacity: 0; } }
        .fc-unread {
          position: absolute; top: -2px; right: -2px;
          min-width: 18px; height: 18px; padding: 0 3px;
          border-radius: var(--radius-full); background: var(--yellow);
          color: var(--yellow-ink); font-size: 0.58rem; font-weight: 800;
          display: grid; place-items: center; border: 2px solid var(--color-accent);
          animation: fc-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes fc-pop { from { transform: scale(0); } to { transform: scale(1); } }

        .fc-panel {
          position: fixed; bottom: calc(1.75rem + 54px + 14px); right: 1.75rem; z-index: 59;
          width: 368px; max-width: calc(100vw - 2rem);
          display: flex; flex-direction: column;
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 44px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden; transform-origin: bottom right;
          transition: transform 0.28s cubic-bezier(0.34,1.2,0.64,1), opacity 0.2s ease;
        }
        .fc-panel-closed { transform: scale(0.82) translateY(16px); opacity: 0; pointer-events: none; }
        .fc-panel-open   { transform: scale(1) translateY(0);       opacity: 1; pointer-events: all;  }

        .fc-header {
          display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
          padding: 0.75rem 0.875rem 0.625rem;
          border-bottom: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised); flex-shrink: 0;
        }
        .fc-header-left  { display: flex; align-items: center; gap: 8px; }
        .fc-header-right { display: flex; align-items: center; gap: 5px; }
        .fc-hdr-av { width: 28px; height: 28px; border-radius: var(--radius-md); background: var(--color-accent); display: grid; place-items: center; flex-shrink: 0; }
        .fc-hdr-title { font-size: 0.8rem; font-weight: 700; letter-spacing: -0.01em; color: var(--color-text-primary); line-height: 1; margin: 0; }
        .fc-hdr-sub   { font-size: 0.6rem; color: var(--color-text-muted); margin: 1px 0 0; }
        .fc-live-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 7px; border-radius: var(--radius-full);
          font-size: 0.6rem; font-weight: 700;
          background: var(--yellow-light); color: var(--yellow-dark); border: 1px solid var(--yellow-mid);
        }
        .fc-live-dot {
          width: 5px; height: 5px; border-radius: 50%; background: var(--yellow-dark);
          animation: fc-pulse 2.2s ease-in-out infinite;
        }
        @keyframes fc-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .fc-icon-btn {
          width: 26px; height: 26px; border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle); background: none;
          cursor: pointer; display: grid; place-items: center;
          color: var(--color-text-muted); transition: all 0.12s ease; text-decoration: none;
        }
        .fc-icon-btn:hover { background: var(--yellow-light); border-color: var(--yellow-mid); color: var(--yellow-dark); }

        /* Switcher */
        .fc-switcher { position: relative; border-bottom: 1px solid var(--color-border-subtle); background: var(--color-surface); flex-shrink: 0; }
        .fc-sw-trigger {
          display: flex; align-items: center; gap: 7px; width: 100%;
          padding: 8px 12px; background: none; border: none; cursor: pointer; text-align: left;
          transition: background 0.12s;
        }
        .fc-sw-trigger:hover { background: var(--color-surface-raised); }
        .fc-sw-dot   { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .fc-sw-label { flex: 1; font-size: 0.78rem; font-weight: 700; letter-spacing: -0.01em; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fc-sw-chevron { color: var(--color-text-muted); transition: transform 0.18s; }
        .fc-sw-chevron-open { transform: rotate(180deg); }
        .fc-sw-dropdown {
          position: absolute; left: 0; right: 0; top: 100%; z-index: 20;
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-top: none; border-radius: 0 0 var(--radius-md) var(--radius-md);
          box-shadow: 0 8px 28px rgba(0,0,0,0.12); overflow: hidden;
          animation: fc-dd-in 0.16s ease;
        }
        @keyframes fc-dd-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .fc-sw-opt {
          display: flex; align-items: stretch; gap: 0; width: 100%; text-align: left;
          background: none; border: none; border-bottom: 1px solid var(--color-border-subtle);
          cursor: pointer; padding: 0; transition: background 0.12s;
        }
        .fc-sw-opt:last-of-type { border-bottom: none; }
        .fc-sw-opt:hover:not(.fc-sw-opt-expired) { background: var(--color-surface-raised); }
        .fc-sw-opt-active  { background: var(--yellow-light) !important; }
        .fc-sw-opt-expired { opacity: 0.4; cursor: not-allowed; }
        .fc-sw-opt-stripe  { width: 3px; flex-shrink: 0; align-self: stretch; }
        .fc-sw-opt-body    { flex: 1; min-width: 0; padding: 8px 10px; display: flex; flex-direction: column; gap: 2px; }
        .fc-sw-opt-top     { display: flex; align-items: center; justify-content: space-between; gap: 4px; }
        .fc-sw-opt-pill    { display: inline-flex; align-items: center; padding: 1px 5px; border-radius: var(--radius-full); font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid; }
        .fc-sw-opt-expiry  { font-size: 0.58rem; font-weight: 600; }
        .fc-sw-opt-title   { font-size: 0.75rem; font-weight: 700; color: var(--color-text-primary); letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fc-sw-opt-active .fc-sw-opt-title { color: var(--yellow-ink); }
        .fc-sw-opt-count   { font-size: 0.6rem; color: var(--color-text-muted); }
        .fc-sw-check       { font-size: 0.7rem; font-weight: 800; color: var(--yellow-dark); padding: 0 10px; align-self: center; flex-shrink: 0; }
        .fc-sw-fulllink    {
          display: flex; align-items: center; justify-content: center; padding: 8px 12px;
          font-size: 0.68rem; font-weight: 700; color: var(--color-text-muted);
          text-decoration: none; background: var(--color-surface-raised);
          border-top: 1px solid var(--color-border-subtle); transition: all 0.12s;
        }
        .fc-sw-fulllink:hover { background: var(--yellow-light); color: var(--yellow-dark); }

        /* Scroll */
        .fc-scroll {
          height: 260px; overflow-y: auto; background: var(--color-surface-raised);
          padding: 10px; display: flex; flex-direction: column; gap: 8px; scroll-behavior: smooth;
        }
        .fc-scroll::-webkit-scrollbar { width: 3px; }
        .fc-scroll::-webkit-scrollbar-track { background: transparent; }
        .fc-scroll::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: var(--radius-full); }

        /* Thinking */
        .fc-thinking {
          display: flex; align-items: center; gap: 7px; padding: 7px 10px;
          background: var(--color-surface); border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md); border-bottom-left-radius: 3px; width: fit-content;
        }
        .fc-thinking-av  { width: 18px; height: 18px; border-radius: var(--radius-sm); background: var(--color-accent); display: grid; place-items: center; flex-shrink: 0; }
        .fc-thinking-lbl { font-size: 0.66rem; color: var(--color-text-tertiary); }
        .fc-dots { display: flex; gap: 3px; align-items: center; }
        .fc-dot  { width: 4px; height: 4px; border-radius: 50%; background: var(--yellow); display: inline-block; }
        @keyframes fc-bounce { 0%,80%,100% { transform: translateY(0); opacity: 0.35; } 40% { transform: translateY(-4px); opacity: 1; } }

        /* Bubbles */
        .fc-user-bubble { align-self: flex-end; max-width: 86%; background: var(--color-accent); color: #fff; border-radius: var(--radius-md); border-bottom-right-radius: 3px; padding: 8px 11px; }
        .fc-user-label  { font-size: 0.57rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; opacity: 0.4; margin: 0 0 4px; color:#FFFAFA}
        .fc-user-text   { font-size: 0.8rem; margin: 0; line-height: 1.5; color: #ffff}
        .fc-asst-bubble { background: var(--color-surface); border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); border-bottom-left-radius: 3px; padding: 8px 11px; display: flex; flex-direction: column; gap: 6px; }
        .fc-asst-hdr    { display: flex; align-items: center; gap: 6px; }
        .fc-asst-av     { width: 18px; height: 18px; border-radius: var(--radius-sm); background: var(--color-accent); display: grid; place-items: center; flex-shrink: 0; }
        .fc-asst-name   { font-size: 0.59rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--color-text-muted); flex: 1; }
        .fc-asst-text   { font-size: 0.78rem; color: var(--color-text-secondary); margin: 0; line-height: 1.62; }
        .fc-fb-row { display: flex; gap: 4px; }
        .fc-fb-btn { padding: 2px 7px; border-radius: var(--radius-full); border: 1px solid var(--color-border-subtle); background: var(--color-surface-raised); font-size: 0.7rem; cursor: pointer; transition: all 0.11s; }
        .fc-fb-btn:hover, .fc-fb-on { background: var(--yellow-light); border-color: var(--yellow-mid); }
        .fc-fb-on { border-color: var(--yellow) !important; }

        /* Suggestions */
        .fc-suggestions { padding: 8px 10px; border-top: 1px solid var(--color-border-subtle); background: var(--color-surface); flex-shrink: 0; display: flex; flex-direction: column; gap: 5px; }
        .fc-sugg-label  { font-size: 0.57rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--color-text-muted); margin: 0; }
        .fc-sugg-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .fc-sugg-btn    { display: flex; align-items: flex-start; gap: 5px; padding: 6px 8px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); background: var(--color-surface-raised); cursor: pointer; text-align: left; transition: all 0.11s; }
        .fc-sugg-btn:hover { background: var(--yellow-light); border-color: var(--yellow-mid); }
        .fc-sugg-icon { font-size: 0.7rem; flex-shrink: 0; line-height: 1.4; }
        .fc-sugg-text { font-size: 0.63rem; color: var(--color-text-secondary); line-height: 1.4; flex: 1; }
        .fc-sugg-btn:hover .fc-sugg-text { color: var(--yellow-ink); }

        /* Input */
        .fc-input-wrap  { padding: 7px 10px 5px; border-top: 1px solid var(--color-border-subtle); background: var(--color-surface); flex-shrink: 0; }
        .fc-input-shell { display: flex; gap: 5px; align-items: center; background: var(--color-surface-raised); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 3px 3px 3px 10px; transition: border-color 0.14s, box-shadow 0.14s; }
        .fc-input-shell:focus-within { border-color: var(--color-accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 8%, transparent); }
        .fc-input { flex: 1; background: none; border: none; outline: none; font-size: 0.78rem; color: var(--color-text-primary); padding: 4px 0; min-width: 0; }
        .fc-input::placeholder { color: var(--color-text-tertiary); }
        .fc-input:disabled     { opacity: 0.5; cursor: not-allowed; }
        .fc-send { width: 30px; height: 30px; border-radius: var(--radius-md); border: 1px solid var(--color-border); background: var(--background-muted); color: var(--color-text-tertiary); display: grid; place-items: center; flex-shrink: 0; cursor: not-allowed; transition: all 0.14s; }
        .fc-send-on { background: var(--yellow); border-color: color-mix(in srgb, var(--yellow) 70%, transparent); color: var(--yellow-ink); cursor: pointer; }
        .fc-send-on:hover { background: var(--yellow-dark); border-color: var(--yellow-dark); color: #fff; transform: translateY(-1px); }
        .fc-spinner { width: 11px; height: 11px; display: block; border: 1.5px solid var(--yellow-mid); border-top-color: var(--yellow-dark); border-radius: 50%; animation: fc-spin 0.7s linear infinite; }
        @keyframes fc-spin { to { transform: rotate(360deg); } }

        /* Footer */
        .fc-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 4px 10px 8px; background: var(--color-surface); flex-shrink: 0; }
        .fc-disclaimer { font-size: 0.58rem; color: var(--color-text-tertiary); margin: 0; }
        .fc-full-link  { display: inline-flex; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 700; color: var(--color-text-muted); text-decoration: none; white-space: nowrap; transition: color 0.13s; }
        .fc-full-link:hover { color: var(--yellow-dark); }

        @media (max-width: 420px) {
          .fc-panel { right: 0.75rem; width: calc(100vw - 1.5rem); }
          .fc-btn   { bottom: 1.25rem; right: 1.25rem; }
        }
      `}</style>
        </>
    );
}