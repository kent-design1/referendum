"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader } from "@/components/UI_Primitives/Card";
import Badge from "@/components/UI_Primitives/Badge";
import { initialMessages, sources } from "@/constants";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
    { icon: "⚡", text: "What does this proposal actually do?" },
    { icon: "✅", text: "What are the strongest PRO arguments?" },
    { icon: "❌", text: "What are the strongest CON arguments?" },
    { icon: "💰", text: "How much will this cost taxpayers?" },
];

export default function ChatAssistant() {
    const [messages, setMessages]               = useState<ChatMessage[]>(initialMessages);
    const [input, setInput]                     = useState("");
    const [loading, setLoading]                 = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const scrollRef                             = useRef<HTMLDivElement>(null);
    const inputRef                              = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    function send(text: string) {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        setShowSuggestions(false);
        setMessages((prev) => [
            ...prev,
            { id: `msg-${Date.now()}`, role: "user", content: trimmed },
        ]);
        setInput("");
        setLoading(true);
        inputRef.current?.focus();

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: `msg-${Date.now() + 1}`,
                    role: "assistant",
                    content:
                        "This is a mock response. In production this would call your AI backend with full referendum context, user preferences, and sourced factual grounding.",
                    confidence: "Medium",
                },
            ]);
            setLoading(false);
        }, 950);
    }

    const canSend = !loading && input.trim().length > 0;

    return (
        <Card className="min-h-1/2">
            <CardHeader
                title="AI Assistant"
                subtitle="Ask anything about this referendum"
                action={
                    <div className="chat-status-pill">
                        <span className="chat-status-dot" />
                        Live
                    </div>
                }
            />

            <div className="chat-body">

                {/* ── Message thread ──────────────────────────────────── */}
                <div ref={scrollRef} className="chat-scroll">
                    {messages.map((msg) =>
                        msg.role === "user"
                            ? <UserBubble key={msg.id} message={msg} />
                            : <AssistantBubble key={msg.id} message={msg} />
                    )}

                    {loading && (
                        <div className="chat-thinking">
                            <div className="chat-thinking-avatar">
                                <svg width="9" height="9" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                                    <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <TypingDots />
                            <span className="chat-thinking-label">Thinking…</span>
                        </div>
                    )}
                </div>

                {/* ── Suggested questions ─────────────────────────────── */}
                {showSuggestions && (
                    <div className="chat-suggestions">
                        <p className="chat-suggestions-label">Suggested questions</p>
                        <div className="chat-suggestions-grid">
                            {SUGGESTIONS.map(({ icon, text }) => (
                                <button key={text} onClick={() => send(text)} className="chat-suggestion-btn">
                                    <span className="chat-suggestion-icon">{icon}</span>
                                    <span className="chat-suggestion-text">{text}</span>
                                    <svg className="chat-suggestion-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                                        <path d="M2 5h6M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Input row ───────────────────────────────────────── */}
                <div className="chat-input-shell">
                    <input
                        ref={inputRef}
                        className="chat-input"
                        placeholder="Ask about this referendum…"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && send(input)}
                        disabled={loading}
                        aria-label="Chat input"
                    />
                    <button
                        onClick={() => send(input)}
                        disabled={!canSend}
                        className={`chat-send-btn ${canSend ? "chat-send-active" : ""}`}
                        aria-label="Send message"
                    >
                        {loading
                            ? <span className="chat-send-spinner" />
                            : (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                    <path d="M1 7h12M7.5 1.5l6 5.5-6 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )
                        }
                    </button>
                </div>

                {/* ── Disclaimer ──────────────────────────────────────── */}
                <p className="chat-disclaimer">
                    Supports informed decision-making. Not a substitute for official voting guidance.
                </p>
            </div>

            {/* ── All scoped styles ─────────────────────────────────── */}
            <style>{`

        /* Body */
        .chat-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 0.875rem;
        }

        /* Live pill */
        .chat-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          font-size: 0.68rem;
          font-weight: 600;
          background-color: var(--yellow-light);
          color: var(--yellow-ink);
          border: 1px solid var(--yellow-mid);
        }

        .chat-status-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background-color: var(--yellow-dark);
          flex-shrink: 0;
          animation: status-pulse 2.2s ease-in-out infinite;
        }

        @keyframes status-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* Scroll area */
        .chat-scroll {
          height: 340px;
          overflow-y: auto;
          background-color: var(--color-surface-raised);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scroll-behavior: smooth;
        }
        .chat-scroll::-webkit-scrollbar       { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: var(--color-border);
          border-radius: var(--radius-full);
        }

        /* Thinking row */
        .chat-thinking {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--color-surface);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          border-bottom-left-radius: 4px;
          width: fit-content;
        }
        .chat-thinking-avatar {
          width: 20px;
          height: 20px;
          border-radius: var(--radius-sm);
          background-color: var(--color-accent);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .chat-thinking-label {
          font-size: 0.72rem;
          color: var(--color-text-tertiary);
        }

        /* Typing dots */
        .typing-dots { display: flex; gap: 3px; align-items: center; }
        .typing-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background-color: var(--yellow); display: inline-block;
        }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.35; }
          40%            { transform: translateY(-4px); opacity: 1; }
        }

        /* User bubble */
        .chat-user-bubble {
          align-self: flex-end;
          max-width: 82%;
          background-color: var(--color-accent);
          color: #fff;
          border-radius: var(--radius-md);
          border-bottom-right-radius: 4px;
          padding: 10px 14px;
        }
        .chat-user-label {
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          opacity: 0.4;
          margin: 0 0 5px;
        }
        .chat-user-text { font-size: 0.84rem; margin: 0; line-height: 1.55; }

        /* Assistant bubble */
        .chat-assistant-bubble {
          background: var(--color-surface);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          border-bottom-left-radius: 4px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .chat-assistant-header { display: flex; align-items: center; gap: 7px; }
        .chat-assistant-avatar {
          width: 22px; height: 22px; border-radius: var(--radius-sm);
          background-color: var(--color-accent);
          display: grid; place-items: center; flex-shrink: 0;
        }
        .chat-assistant-name {
          font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--color-text-muted); flex: 1;
        }
        .chat-assistant-text {
          font-size: 0.84rem; color: var(--color-text-secondary);
          margin: 0; line-height: 1.65;
        }

        /* Feedback */
        .chat-feedback-row { display: flex; flex-wrap: wrap; gap: 5px; }
        .chat-feedback-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; font-size: 0.7rem; font-weight: 500;
          color: var(--color-text-muted);
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-full); cursor: pointer;
          transition: all 0.12s ease;
        }
        .chat-feedback-btn:hover,
        .chat-feedback-btn.active {
          background-color: var(--yellow-light);
          border-color: var(--yellow-mid);
          color: var(--yellow-ink);
        }
        .chat-feedback-btn.active { border-color: var(--yellow); font-weight: 600; }

        /* Sources */
        .chat-sources {
          background-color: var(--background-muted);
          border-radius: var(--radius-md);
          padding: 9px 11px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .chat-sources-label,
        .chat-limits-label {
          font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--color-text-muted); margin: 0 0 3px;
        }
        .chat-source-row {
          font-size: 0.77rem; color: var(--color-text-secondary); margin: 0; line-height: 1.45;
        }
        .chat-source-id { font-weight: 700; color: var(--color-text-primary); }

        /* Knowledge limits */
        .chat-limits {
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md); padding: 9px 11px;
        }
        .chat-limits-list { margin: 0; padding-left: 1rem; display: flex; flex-direction: column; gap: 2px; }
        .chat-limits-list li { font-size: 0.77rem; color: var(--color-text-secondary); line-height: 1.5; }

        /* Suggestions */
        .chat-suggestions { display: flex; flex-direction: column; gap: 6px; }
        .chat-suggestions-label {
          font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--color-text-muted); margin: 0;
        }
        .chat-suggestions-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 5px;
        }
        .chat-suggestion-btn {
          display: flex; align-items: center; gap: 7px;
          text-align: left; padding: 8px 10px;
          font-size: 0.75rem; color: var(--color-text-secondary);
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-md); cursor: pointer;
          transition: all 0.12s ease; line-height: 1.4;
        }
        .chat-suggestion-btn:hover {
          background-color: var(--yellow-light);
          border-color: var(--yellow-mid); color: var(--yellow-ink);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px 0 color-mix(in srgb, var(--yellow) 15%, transparent);
        }
        .chat-suggestion-icon { font-size: 0.85rem; flex-shrink: 0; line-height: 1; }
        .chat-suggestion-text { flex: 1; line-height: 1.4; }
        .chat-suggestion-arrow {
          flex-shrink: 0; color: var(--color-text-tertiary);
          opacity: 0; transform: translateX(-4px);
          transition: opacity 0.12s ease, transform 0.12s ease;
        }
        .chat-suggestion-btn:hover .chat-suggestion-arrow { opacity: 1; transform: translateX(0); }

        /* Input shell */
        .chat-input-shell {
          display: flex; gap: 6px; align-items: center;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 5px 5px 5px 12px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .chat-input-shell:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 8%, transparent);
        }
        .chat-input {
          flex: 1; background: none; border: none; outline: none;
          font-size: 0.84rem; color: var(--color-text-primary);
          line-height: 1.5; padding: 4px 0; min-width: 0;
        }
        .chat-input::placeholder { color: var(--color-text-tertiary); }
        .chat-input:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Send button */
        .chat-send-btn {
          width: 34px; height: 34px; border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background-color: var(--background-muted);
          color: var(--color-text-tertiary);
          display: grid; place-items: center;
          flex-shrink: 0; cursor: not-allowed;
          transition: all 0.15s ease;
        }
        .chat-send-active {
          background-color: var(--yellow);
          border-color: color-mix(in srgb, var(--yellow) 70%, transparent);
          color: var(--yellow-ink); cursor: pointer;
        }
        .chat-send-active:hover {
          background-color: var(--yellow-dark);
          border-color: var(--yellow-dark); color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px 0 color-mix(in srgb, var(--yellow) 30%, transparent);
        }
        .chat-send-spinner {
          width: 13px; height: 13px;
          border: 2px solid var(--yellow-mid);
          border-top-color: var(--yellow-dark);
          border-radius: 50%;
          animation: spin 0.7s linear infinite; display: block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Disclaimer */
        .chat-disclaimer {
          font-size: 0.68rem; color: var(--color-text-tertiary);
          margin: 0; line-height: 1.55; text-align: center;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .chat-scroll { height: 280px; }
          .chat-suggestions-grid { grid-template-columns: 1fr; }
          .chat-user-bubble { max-width: 92%; }
        }
      `}</style>
        </Card>
    );
}

/* ── Typing dots ─────────────────────────────────────────────── */
function TypingDots() {
    return (
        <span className="typing-dots">
      {[0, 1, 2].map((i) => (
          <span
              key={i}
              className="typing-dot"
              style={{ animation: `typingBounce 1.1s ease-in-out ${i * 0.18}s infinite` }}
          />
      ))}
    </span>
    );
}

/* ── User bubble ─────────────────────────────────────────────── */
function UserBubble({ message }: { message: ChatMessage }) {
    return (
        <div className="chat-user-bubble">
            <p className="chat-user-label">You</p>
            <p className="chat-user-text">{message.content}</p>
        </div>
    );
}

/* ── Assistant bubble ────────────────────────────────────────── */
function AssistantBubble({ message }: { message: ChatMessage }) {
    const [feedback, setFeedback] = useState<string | null>(null);
    const citedSources = sources.filter((s) => message.sources?.includes(s.id));

    return (
        <div className="chat-assistant-bubble">
            {/* Header */}
            <div className="chat-assistant-header">
                <div className="chat-assistant-avatar">
                    <svg width="9" height="9" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                        <path d="M4 0.5v7M0.5 4h7" stroke="var(--yellow)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
                <span className="chat-assistant-name">Assistant</span>
                {message.confidence && (
                    <Badge label="Confidence" value={message.confidence} variant="yellow" />
                )}
            </div>

            {/* Content */}
            <p className="chat-assistant-text">{message.content}</p>

            {/* Feedback */}
            <div className="chat-feedback-row">
                {(["👍 Agree", "👎 Disagree", "❓ Confused"] as const).map((label) => (
                    <button
                        key={label}
                        onClick={() => setFeedback(feedback === label ? null : label)}
                        className={`chat-feedback-btn ${feedback === label ? "active" : ""}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Sources */}
            {citedSources.length > 0 && (
                <div className="chat-sources">
                    <p className="chat-sources-label">Sources cited</p>
                    {citedSources.map((s) => (
                        <p key={s.id} className="chat-source-row">
                            <span className="chat-source-id">{s.id}</span>{" "}{s.title}
                        </p>
                    ))}
                </div>
            )}

            {/* Knowledge limits */}
            {message.knowledgeLimits && message.knowledgeLimits.length > 0 && (
                <div className="chat-limits">
                    <p className="chat-limits-label">Knowledge limits</p>
                    <ul className="chat-limits-list">
                        {message.knowledgeLimits.map((l, i) => (
                            <li key={i}>{l}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}