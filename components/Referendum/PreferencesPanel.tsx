"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────── */
type AnswerWeight = "strongly_pro" | "lean_pro" | "neutral" | "lean_con" | "strongly_con";

interface QuizOption {
    id:     string;
    label:  string;
    weight: AnswerWeight;
}

interface QuizQuestion {
    id:          string;
    dimension:   string;      // e.g. "Economy", "Environment"
    icon:         string;
    question:    string;
    context:     string;      // one-line factual framing
    options:     QuizOption[];
}

type StanceResult = "strongly_pro" | "lean_pro" | "neutral" | "lean_con" | "strongly_con";

interface DimensionScore {
    dimension: string;
    icon:      string;
    score:     number;   // -2 to +2 (negative = con, positive = pro)
}

/* ─────────────────────────────────────────────────────────────
   MOCK DATA — replace questions + scoring with API later
   ───────────────────────────────────────────────────────────── */
const MOCK_QUESTIONS: QuizQuestion[] = [
    {
        id: "q1",
        dimension: "Climate",
        icon: "🌱",
        question: "How urgent is it for Switzerland to accelerate its transition away from fossil fuels?",
        context: "Switzerland is currently 18% short of its 2030 Paris Agreement emission targets.",
        options: [
            { id: "q1a", label: "Extremely urgent — every year of delay compounds costs", weight: "strongly_pro" },
            { id: "q1b", label: "Important, but the current trajectory is sufficient",    weight: "lean_pro"     },
            { id: "q1c", label: "It matters, but economic stability comes first",         weight: "neutral"      },
            { id: "q1d", label: "Switzerland's contribution is too small to justify cost", weight: "lean_con"   },
        ],
    },
    {
        id: "q2",
        dimension: "Economy",
        icon: "📊",
        question: "A CHF 2 billion annual fund would be financed through future federal budgets. How does this affect your view?",
        context: "No explicit revenue source is earmarked — funding would compete with healthcare, education, and infrastructure.",
        options: [
            { id: "q2a", label: "Acceptable — the long-run savings justify the upfront cost", weight: "strongly_pro" },
            { id: "q2b", label: "Manageable if tightly controlled and transparently audited",  weight: "lean_pro"     },
            { id: "q2c", label: "Uncertain — depends entirely on governance structure",        weight: "neutral"      },
            { id: "q2d", label: "Problematic — it crowds out other essential spending",        weight: "lean_con"     },
            { id: "q2e", label: "Unacceptable — no new spending without earmarked revenue",    weight: "strongly_con" },
        ],
    },
    {
        id: "q3",
        dimension: "Federalism",
        icon: "🏔️",
        question: "The fund would allocate resources federally, bypassing cantonal budget processes. What's your view on this?",
        context: "The Swiss Constitution assigns energy and environmental competencies primarily to cantons (Art. 74, 89).",
        options: [
            { id: "q3a", label: "Climate change is national — a federal fund is appropriate",      weight: "strongly_pro" },
            { id: "q3b", label: "Acceptable if cantons have meaningful input in allocation",        weight: "lean_pro"     },
            { id: "q3c", label: "I'm undecided — both levels have legitimate roles",               weight: "neutral"      },
            { id: "q3d", label: "Cantonal competency should be respected — this sets a precedent", weight: "lean_con"     },
            { id: "q3e", label: "Strongly opposed — federal overreach undermines federalism",       weight: "strongly_con" },
        ],
    },
    {
        id: "q4",
        dimension: "Jobs & Industry",
        icon: "🏗️",
        question: "The initiative is projected to create up to 15,000 green-sector jobs. How much weight do you give this?",
        context: "This estimate from Seco is contested — some economists argue substitution effects reduce net job creation.",
        options: [
            { id: "q4a", label: "Significant benefit — green jobs are exactly what Switzerland needs", weight: "strongly_pro" },
            { id: "q4b", label: "A positive side-effect, though not the primary reason to support it", weight: "lean_pro"     },
            { id: "q4c", label: "Neutral — job creation projections are too uncertain to rely on",     weight: "neutral"      },
            { id: "q4d", label: "Sceptical — public spending is an inefficient way to create jobs",    weight: "lean_con"     },
        ],
    },
    {
        id: "q5",
        dimension: "Household Impact",
        icon: "🏠",
        question: "Rapid grid expansion may add CHF 120–180/year to the average household electricity bill. Is this acceptable?",
        context: "The Swiss median household already pays ~CHF 900/year in electricity costs.",
        options: [
            { id: "q5a", label: "Fully acceptable — a small price for a necessary transition",                weight: "strongly_pro" },
            { id: "q5b", label: "Acceptable with low-income household compensation mechanisms",               weight: "lean_pro"     },
            { id: "q5c", label: "Uncertain — depends on whether benefits materialise as promised",            weight: "neutral"      },
            { id: "q5d", label: "Problematic — regressive costs fall hardest on those least able to afford", weight: "lean_con"     },
            { id: "q5e", label: "Unacceptable — cost of living is already a crisis",                          weight: "strongly_con" },
        ],
    },
    {
        id: "q6",
        dimension: "Governance",
        icon: "⚖️",
        question: "The initiative text does not specify an independent oversight or audit body. Does this concern you?",
        context: "Allocation criteria would be set by future Federal Council ordinances without parliamentary pre-approval.",
        options: [
            { id: "q6a", label: "Not particularly — parliament will set guardrails during implementation", weight: "strongly_pro" },
            { id: "q6b", label: "Slightly — I'd prefer explicit oversight but it's not a dealbreaker",    weight: "lean_pro"     },
            { id: "q6c", label: "Moderately — accountability mechanisms matter as much as the goal",      weight: "neutral"      },
            { id: "q6d", label: "Significantly — vague mandates create risk of misallocation",            weight: "lean_con"     },
            { id: "q6e", label: "Dealbreaker — I won't support any initiative without defined safeguards", weight: "strongly_con" },
        ],
    },
];

/* ─────────────────────────────────────────────────────────────
   SCORING
   ───────────────────────────────────────────────────────────── */
const WEIGHT_SCORES: Record<AnswerWeight, number> = {
    strongly_pro: +2,
    lean_pro:     +1,
    neutral:       0,
    lean_con:     -1,
    strongly_con: -2,
};

function computeResult(answers: Record<string, QuizOption>): {
    stance:     StanceResult;
    score:      number;
    dimensions: DimensionScore[];
} {
    let total = 0;
    const dimensions: DimensionScore[] = [];

    for (const q of MOCK_QUESTIONS) {
        const ans = answers[q.id];
        if (!ans) continue;
        const s = WEIGHT_SCORES[ans.weight];
        total += s;
        dimensions.push({ dimension: q.dimension, icon: q.icon, score: s });
    }

    const max = MOCK_QUESTIONS.length * 2;
    const pct = total / max; // -1 to +1

    let stance: StanceResult;
    if      (pct >= 0.6)  stance = "strongly_pro";
    else if (pct >= 0.15) stance = "lean_pro";
    else if (pct >= -0.15) stance = "neutral";
    else if (pct >= -0.6) stance = "lean_con";
    else                  stance = "strongly_con";

    return { stance, score: Math.round(pct * 100), dimensions };
}

/* ─────────────────────────────────────────────────────────────
   RESULT CONFIG
   ───────────────────────────────────────────────────────────── */
const RESULT_CONFIG: Record<StanceResult, {
    label:       string;
    sub:         string;
    emoji:       string;
    bg:          string;
    text:        string;
    border:      string;
    barFill:     string;
    barTrack:    string;
}> = {
    strongly_pro: {
        label: "Strongly For",
        sub:   "Your values align strongly with the goals of this initiative.",
        emoji: "✅",
        bg:    "var(--color-pro-bg)",
        text:  "var(--color-pro)",
        border: "var(--color-pro-border)",
        barFill:  "var(--color-pro)",
        barTrack: "var(--color-pro-bg)",
    },
    lean_pro: {
        label: "Lean For",
        sub:   "You lean towards supporting this initiative, with some reservations.",
        emoji: "↗",
        bg:    "var(--color-pro-bg)",
        text:  "var(--color-pro)",
        border: "var(--color-pro-border)",
        barFill:  "var(--color-pro)",
        barTrack: "var(--color-pro-bg)",
    },
    neutral: {
        label: "Undecided",
        sub:   "Your values are genuinely balanced across the key trade-offs.",
        emoji: "⚖️",
        bg:    "var(--yellow-light)",
        text:  "var(--yellow-dark)",
        border: "var(--yellow-mid)",
        barFill:  "var(--yellow)",
        barTrack: "var(--yellow-light)",
    },
    lean_con: {
        label: "Lean Against",
        sub:   "You lean towards opposing this initiative, with some openness.",
        emoji: "↘",
        bg:    "var(--color-con-bg)",
        text:  "var(--color-con)",
        border: "var(--color-con-border)",
        barFill:  "var(--color-con)",
        barTrack: "var(--color-con-bg)",
    },
    strongly_con: {
        label: "Strongly Against",
        sub:   "Your values are clearly misaligned with this initiative's approach.",
        emoji: "❌",
        bg:    "var(--color-con-bg)",
        text:  "var(--color-con)",
        border: "var(--color-con-border)",
        barFill:  "var(--color-con)",
        barTrack: "var(--color-con-bg)",
    },
};

const DIM_SCORE_LABEL: Record<number, { label: string; color: string }> = {
    2:  { label: "Strong support",   color: "var(--color-pro)"    },
    1:  { label: "Lean support",     color: "var(--color-pro)"    },
    0:  { label: "Balanced",         color: "var(--yellow-dark)"  },
    "-1": { label: "Lean oppose",    color: "var(--color-con)"    },
    "-2": { label: "Strong oppose",  color: "var(--color-con)"    },
};

/* ─────────────────────────────────────────────────────────────
   SCREEN: INTRO
   ───────────────────────────────────────────────────────────── */
function IntroScreen({ onStart }: { onStart: () => void }) {
    return (
        <div className="pp-intro">
            <div className="pp-intro-icon">⚡</div>
            <div className="pp-intro-text">
                <h3 className="pp-intro-title">Discover your stance</h3>
                <p className="pp-intro-body">
                    Answer {MOCK_QUESTIONS.length} questions on the key trade-offs of the
                    Climate Fund initiative. We'll calculate whether your values lean
                    for or against — and show you why.
                </p>
            </div>
            <div className="pp-intro-meta">
                <span className="pp-meta-pill">⏱ ~2 minutes</span>
                <span className="pp-meta-pill">🔒 Not stored</span>
                <span className="pp-meta-pill">↺ Retakeable</span>
            </div>
            <button className="pp-start-btn" onClick={onStart}>
                Start questionnaire
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2 6.5h9M7 3l4 3.5L7 10" stroke="currentColor" strokeWidth="1.6"
                          strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   SCREEN: QUESTION
   ───────────────────────────────────────────────────────────── */
function QuestionScreen({
                            question,
                            index,
                            total,
                            selected,
                            onSelect,
                            onBack,
                            onNext,
                        }: {
    question: QuizQuestion;
    index:    number;
    total:    number;
    selected: QuizOption | null;
    onSelect: (opt: QuizOption) => void;
    onBack:   () => void;
    onNext:   () => void;
}) {
    const progress = ((index) / total) * 100;

    return (
        <div className="pp-question">
            {/* Progress */}
            <div className="pp-q-progress">
                <div className="pp-q-progress-track">
                    <div className="pp-q-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="pp-q-progress-label">{index + 1} / {total}</span>
            </div>

            {/* Dimension badge */}
            <div className="pp-q-dim">
                <span className="pp-q-dim-icon">{question.icon}</span>
                <span className="pp-q-dim-label">{question.dimension}</span>
            </div>

            {/* Question text */}
            <p className="pp-q-text">{question.question}</p>

            {/* Context callout */}
            <div className="pp-q-context">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5.5 4.5v3M5.5 3.5v.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                {question.context}
            </div>

            {/* Options */}
            <div className="pp-q-options">
                {question.options.map((opt) => {
                    const isSelected = selected?.id === opt.id;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onSelect(opt)}
                            className={`pp-option ${isSelected ? "pp-option-selected" : ""}`}
                        >
              <span className={`pp-option-radio ${isSelected ? "pp-option-radio-active" : ""}`}>
                {isSelected && <span className="pp-option-radio-dot" />}
              </span>
                            <span className="pp-option-label">{opt.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Navigation */}
            <div className="pp-q-nav">
                <button className="pp-nav-back" onClick={onBack} disabled={index === 0}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M9 5.5H2M5.5 2L2 5.5 5.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </button>
                <button
                    className="pp-nav-next"
                    onClick={onNext}
                    disabled={!selected}
                >
                    {index === total - 1 ? "See my result" : "Next"}
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M2 5.5h7M5.5 2l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   SCREEN: RESULT
   ───────────────────────────────────────────────────────────── */
function ResultScreen({
                          result,
                          answers,
                          onReset,
                      }: {
    result:  ReturnType<typeof computeResult>;
    answers: Record<string, QuizOption>;
    onReset: () => void;
}) {
    const cfg      = RESULT_CONFIG[result.stance];
    const absPct   = Math.abs(result.score);
    const isFor    = result.score >= 0;

    return (
        <div className="pp-result">
            {/* Verdict card */}
            <div className="pp-verdict" style={{ background: cfg.bg, borderColor: cfg.border }}>
                <div className="pp-verdict-emoji">{cfg.emoji}</div>
                <div className="pp-verdict-text">
          <span className="pp-verdict-label" style={{ color: cfg.text }}>
            {cfg.label}
          </span>
                    <p className="pp-verdict-sub">{cfg.sub}</p>
                </div>
                {/* Score bar */}
                <div className="pp-verdict-bar-wrap">
                    <div className="pp-verdict-bar-labels">
                        <span style={{ fontSize: "0.6rem", color: cfg.text, fontWeight: 700 }}>Against</span>
                        <span style={{ fontSize: "0.6rem", color: cfg.text, fontWeight: 600, opacity: 0.6 }}>Neutral</span>
                        <span style={{ fontSize: "0.6rem", color: cfg.text, fontWeight: 700 }}>For</span>
                    </div>
                    <div className="pp-verdict-bar-track" style={{ background: cfg.barTrack }}>
                        {/* Centre line */}
                        <div className="pp-verdict-bar-midline" />
                        {/* Fill — starts from centre */}
                        <div
                            className="pp-verdict-bar-fill"
                            style={{
                                left:    isFor  ? "50%" : `${50 - absPct / 2}%`,
                                width:   `${absPct / 2}%`,
                                background: cfg.barFill,
                            }}
                        />
                        {/* Indicator dot */}
                        <div
                            className="pp-verdict-bar-dot"
                            style={{
                                left:       `${50 + result.score / 2}%`,
                                background: cfg.barFill,
                                borderColor: cfg.bg,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Dimension breakdown */}
            <div className="pp-breakdown">
                <p className="pp-breakdown-title">Your stance by topic</p>
                <div className="pp-breakdown-list">
                    {result.dimensions.map((d) => {
                        const dimCfg = DIM_SCORE_LABEL[d.score] ?? DIM_SCORE_LABEL[0];
                        const fillPct = ((d.score + 2) / 4) * 100; // map -2..+2 → 0..100
                        return (
                            <div key={d.dimension} className="pp-dim-row">
                                <span className="pp-dim-icon">{d.icon}</span>
                                <div className="pp-dim-body">
                                    <div className="pp-dim-meta">
                                        <span className="pp-dim-name">{d.dimension}</span>
                                        <span className="pp-dim-verdict" style={{ color: dimCfg.color }}>
                      {dimCfg.label}
                    </span>
                                    </div>
                                    <div className="pp-dim-track">
                                        <div
                                            className="pp-dim-fill"
                                            style={{ width: `${fillPct}%`, background: dimCfg.color }}
                                        />
                                        <div className="pp-dim-midline" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Answer summary */}
            <details className="pp-answers-summary">
                <summary className="pp-answers-toggle">
                    Review your answers
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="pp-answers-chevron" aria-hidden="true">
                        <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </summary>
                <div className="pp-answers-list">
                    {MOCK_QUESTIONS.map((q) => {
                        const ans = answers[q.id];
                        if (!ans) return null;
                        const w  = WEIGHT_SCORES[ans.weight];
                        const ac = w > 0 ? "var(--color-pro)" : w < 0 ? "var(--color-con)" : "var(--yellow-dark)";
                        return (
                            <div key={q.id} className="pp-answer-row">
                                <span className="pp-answer-dim">{q.icon} {q.dimension}</span>
                                <p className="pp-answer-q">{q.question}</p>
                                <p className="pp-answer-a" style={{ color: ac }}>
                                    "{ans.label}"
                                </p>
                            </div>
                        );
                    })}
                </div>
            </details>

            {/* Reset */}
            <div className="pp-result-footer">
                <p className="pp-result-note">
                    This is a personal orientation tool, not a voting recommendation.
                </p>
                <button className="pp-reset-btn" onClick={onReset}>
                    ↺ Retake questionnaire
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   ROOT COMPONENT
   ───────────────────────────────────────────────────────────── */
type Phase = "intro" | "quiz" | "result";

export default function PreferencesPanel() {
    const [phase,       setPhase]       = useState<Phase>("intro");
    const [currentIdx,  setCurrentIdx]  = useState(0);
    const [answers,     setAnswers]     = useState<Record<string, QuizOption>>({});

    const currentQ  = MOCK_QUESTIONS[currentIdx];
    const selected  = answers[currentQ?.id] ?? null;

    function handleSelect(opt: QuizOption) {
        setAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
    }

    function handleNext() {
        if (currentIdx < MOCK_QUESTIONS.length - 1) {
            setCurrentIdx((i) => i + 1);
        } else {
            setPhase("result");
        }
    }

    function handleBack() {
        if (currentIdx > 0) setCurrentIdx((i) => i - 1);
        else setPhase("intro");
    }

    function handleReset() {
        setPhase("intro");
        setCurrentIdx(0);
        setAnswers({});
    }

    const result = phase === "result" ? computeResult(answers) : null;

    return (
        <div className="pp-shell">

            {/* ── Shell header ──────────────────────────────────── */}
            <div className="pp-shell-header">
                <div className="pp-shell-header-left">
                    <span className="pp-shell-eyebrow">Your stance</span>
                    <span className="pp-shell-title">Priority questionnaire</span>
                </div>
                {phase !== "intro" && (
                    <button className="pp-shell-reset" onClick={handleReset}>
                        ↺ Reset
                    </button>
                )}
            </div>

            {/* ── Screens ───────────────────────────────────────── */}
            <div className="pp-screen-body">
                {phase === "intro"  && <IntroScreen  onStart={() => setPhase("quiz")} />}
                {phase === "quiz"   && (
                    <QuestionScreen
                        question={currentQ}
                        index={currentIdx}
                        total={MOCK_QUESTIONS.length}
                        selected={selected}
                        onSelect={handleSelect}
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                )}
                {phase === "result" && result && (
                    <ResultScreen result={result} answers={answers} onReset={handleReset} />
                )}
            </div>

            {/* ── All scoped styles ─────────────────────────────── */}
            <style>{`

        /* ── Shell ──────────────────────────────────────── */
        .pp-shell {
          display: flex;
          flex-direction: column;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .pp-shell-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.875rem 1rem 0.75rem;
          border-bottom: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
        }

        .pp-shell-header-left { display: flex; flex-direction: column; gap: 1px; }

        .pp-shell-eyebrow {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
        }

        .pp-shell-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-text-primary);
          letter-spacing: -0.01em;
        }

        .pp-shell-reset {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--yellow-dark);
          background: var(--yellow-light);
          border: 1px solid var(--yellow-mid);
          border-radius: var(--radius-full);
          padding: 3px 10px;
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .pp-shell-reset:hover {
          background: var(--yellow-mid);
          color: var(--yellow-ink);
        }

        .pp-screen-body { overflow: hidden; }

        /* ── INTRO ──────────────────────────────────────── */
        .pp-intro {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 1.25rem;
          text-align: center;
          animation: pp-fadein 0.25s ease;
        }

        @keyframes pp-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pp-intro-icon {
          width: 48px; height: 48px;
          border-radius: var(--radius-lg);
          background: var(--yellow-light);
          border: 1px solid var(--yellow-mid);
          display: grid; place-items: center;
          font-size: 1.4rem;
        }

        .pp-intro-text { display: flex; flex-direction: column; gap: 5px; }

        .pp-intro-title {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
          margin: 0;
        }

        .pp-intro-body {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          line-height: 1.65;
          margin: 0;
        }

        .pp-intro-meta {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .pp-meta-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 600;
          background: var(--background-muted);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border-subtle);
        }

        .pp-start-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0.625rem 1.25rem;
          border-radius: var(--radius-md);
          background: var(--yellow);
          color: var(--yellow-ink);
          border: none;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.14s ease;
          width: 100%;
          justify-content: center;
        }

        .pp-start-btn:hover {
          background: var(--yellow-dark);
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px color-mix(in srgb, var(--yellow) 30%, transparent);
        }

        /* ── QUESTION ───────────────────────────────────── */
        .pp-question {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          padding: 1rem;
          animation: pp-fadein 0.22s ease;
        }

        /* Progress */
        .pp-q-progress {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pp-q-progress-track {
          flex: 1;
          height: 4px;
          border-radius: var(--radius-full);
          background: var(--background-muted);
          overflow: hidden;
        }

        .pp-q-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--yellow-dark), var(--yellow));
          border-radius: var(--radius-full);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pp-q-progress-label {
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--color-text-muted);
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Dimension badge */
        .pp-q-dim {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          background: var(--yellow-light);
          border: 1px solid var(--yellow-mid);
          width: fit-content;
        }

        .pp-q-dim-icon { font-size: 0.8rem; }

        .pp-q-dim-label {
          font-size: 0.63rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--yellow-dark);
        }

        /* Question text */
        .pp-q-text {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--color-text-primary);
          line-height: 1.4;
          margin: 0;
        }

        /* Context callout */
        .pp-q-context {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 8px 10px;
          background: var(--background-muted);
          border-left: 2px solid var(--yellow);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        /* Options */
        .pp-q-options {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .pp-option {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 9px 10px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
          cursor: pointer;
          text-align: left;
          transition: all 0.12s ease;
        }

        .pp-option:hover {
          background: var(--yellow-light);
          border-color: var(--yellow-mid);
        }

        .pp-option-selected {
          background: var(--yellow-light) !important;
          border-color: var(--yellow) !important;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--yellow) 20%, transparent);
        }

        .pp-option-radio {
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 1.5px solid var(--color-border);
          display: grid; place-items: center;
          flex-shrink: 0;
          margin-top: 1px;
          transition: border-color 0.12s ease;
        }

        .pp-option-radio-active {
          border-color: var(--yellow-dark) !important;
          background: var(--yellow-light);
        }

        .pp-option-radio-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--yellow-dark);
          display: block;
        }

        .pp-option:hover .pp-option-radio { border-color: var(--yellow); }

        .pp-option-label {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          flex: 1;
        }

        .pp-option-selected .pp-option-label {
          color: var(--yellow-ink);
          font-weight: 500;
        }

        /* Navigation */
        .pp-q-nav {
          display: flex;
          gap: 6px;
          justify-content: space-between;
          padding-top: 4px;
        }

        .pp-nav-back {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: none;
          font-size: 0.75rem; font-weight: 600;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .pp-nav-back:hover:not(:disabled) {
          background: var(--background-muted);
          color: var(--color-text-primary);
        }

        .pp-nav-back:disabled { opacity: 0.3; cursor: not-allowed; }

        .pp-nav-next {
          flex: 1;
          display: inline-flex; align-items: center; justify-content: center; gap: 5px;
          padding: 6px 14px;
          border-radius: var(--radius-md);
          background: var(--yellow);
          color: var(--yellow-ink);
          border: none;
          font-size: 0.78rem; font-weight: 700;
          cursor: pointer;
          transition: all 0.14s ease;
        }

        .pp-nav-next:hover:not(:disabled) {
          background: var(--yellow-dark);
          color: #fff;
          transform: translateY(-1px);
        }

        .pp-nav-next:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }

        /* ── RESULT ─────────────────────────────────────── */
        .pp-result {
          display: flex;
          flex-direction: column;
          gap: 0;
          animation: pp-fadein 0.28s ease;
        }

        /* Verdict */
        .pp-verdict {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 1rem;
          border-bottom: 1px solid var(--color-border-subtle);
          border: 1px solid transparent;
          margin: 0.75rem;
          border-radius: var(--radius-md);
        }

        .pp-verdict-emoji {
          font-size: 1.5rem;
          line-height: 1;
        }

        .pp-verdict-text { display: flex; flex-direction: column; gap: 3px; }

        .pp-verdict-label {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .pp-verdict-sub {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin: 0;
        }

        /* Score bar */
        .pp-verdict-bar-wrap { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }

        .pp-verdict-bar-labels {
          display: flex;
          justify-content: space-between;
        }

        .pp-verdict-bar-track {
          position: relative;
          height: 8px;
          border-radius: var(--radius-full);
          overflow: visible;
        }

        .pp-verdict-bar-fill {
          position: absolute;
          top: 0; bottom: 0;
          border-radius: var(--radius-full);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pp-verdict-bar-midline {
          position: absolute;
          top: -2px; bottom: -2px;
          left: 50%;
          width: 2px;
          background: var(--color-surface);
          z-index: 1;
          border-radius: 1px;
        }

        .pp-verdict-bar-dot {
          position: absolute;
          top: 50%;
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid;
          transform: translate(-50%, -50%);
          z-index: 2;
          transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Dimension breakdown */
        .pp-breakdown {
          padding: 0.875rem 1rem;
          border-top: 1px solid var(--color-border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .pp-breakdown-title {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-text-muted);
          margin: 0;
        }

        .pp-breakdown-list { display: flex; flex-direction: column; gap: 6px; }

        .pp-dim-row { display: flex; align-items: center; gap: 8px; }

        .pp-dim-icon { font-size: 0.85rem; flex-shrink: 0; width: 18px; text-align: center; }

        .pp-dim-body { flex: 1; display: flex; flex-direction: column; gap: 3px; }

        .pp-dim-meta { display: flex; align-items: center; justify-content: space-between; }

        .pp-dim-name { font-size: 0.72rem; font-weight: 600; color: var(--color-text-primary); }

        .pp-dim-verdict { font-size: 0.62rem; font-weight: 700; }

        .pp-dim-track {
          position: relative;
          height: 4px;
          border-radius: var(--radius-full);
          background: var(--background-muted);
          overflow: visible;
        }

        .pp-dim-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pp-dim-midline {
          position: absolute;
          top: -1px; bottom: -1px;
          left: 50%; width: 1.5px;
          background: var(--color-surface);
          z-index: 1;
        }

        /* Answer summary */
        .pp-answers-summary {
          border-top: 1px solid var(--color-border-subtle);
        }

        .pp-answers-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 1rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-text-muted);
          cursor: pointer;
          list-style: none;
          background: var(--color-surface-raised);
          transition: background 0.12s ease;
        }

        .pp-answers-toggle:hover { background: var(--background-muted); }
        .pp-answers-toggle::-webkit-details-marker { display: none; }

        details[open] .pp-answers-chevron { transform: rotate(180deg); }
        .pp-answers-chevron { transition: transform 0.2s ease; }

        .pp-answers-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid var(--color-border-subtle);
        }

        .pp-answer-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0.625rem 1rem;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .pp-answer-row:last-child { border-bottom: none; }

        .pp-answer-dim {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-muted);
        }

        .pp-answer-q {
          font-size: 0.72rem;
          color: var(--color-text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        .pp-answer-a {
          font-size: 0.72rem;
          font-weight: 600;
          margin: 0;
          font-style: italic;
        }

        /* Footer */
        .pp-result-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--color-border-subtle);
          background: var(--color-surface-raised);
          flex-wrap: wrap;
        }

        .pp-result-note {
          font-size: 0.65rem;
          color: var(--color-text-tertiary);
          margin: 0;
          flex: 1;
          line-height: 1.45;
        }

        .pp-reset-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          font-size: 0.72rem; font-weight: 600;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.12s ease;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .pp-reset-btn:hover {
          background: var(--yellow-light);
          border-color: var(--yellow-mid);
          color: var(--yellow-dark);
        }
      `}</style>
        </div>
    );
}