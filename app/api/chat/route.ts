import { NextRequest } from "next/server";

export const runtime = "nodejs";

const OLLAMA_URL   = process.env.OLLAMA_URL   ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:14b";

export async function POST(req: NextRequest) {
    const { messages, voteContext, voteType } = await req.json();

    if (!messages || !Array.isArray(messages)) {
        return Response.json({ error: "messages array required" }, { status: 400 });
    }

    /* System prompt — neutral, source-aware, Swiss civic context */
    const systemPrompt = [
        "You are SmartInfo, a neutral AI assistant helping Swiss citizens understand referendum proposals.",
        "Your role is to inform, never to persuade or recommend how to vote.",
        "Be factual, balanced, and concise. Cite official sources (Federal Voting Booklet, BAFU, Seco) where possible.",
        "When uncertain, say so clearly rather than guessing.",
        "Respond in the same language the user writes in (German, French, Italian, Romansh, or English).",
        "Keep responses SHORT — maximum 3 sentences or 2 short paragraphs. If more detail is needed, end with 'Want me to go deeper on any part?'",
        "Never use bullet points unless the user specifically asks for a list.",
        "After your response, on a new line write exactly: CONFIDENCE: High, CONFIDENCE: Medium, or CONFIDENCE: Low — based on how certain you are about the facts you stated.",
        voteContext
            ? `Current topic: ${voteContext} (${voteType ?? "referendum"}).`
            : "",
    ]
        .filter(Boolean)
        .join(" ");

    const body = {
        model:    OLLAMA_MODEL,
        stream:   false,
        options: {
            temperature: 0.3,   /* lower = more factual, less creative */
            num_predict: 180,   /* max tokens per response             */
        },
        messages: [
            { role: "system", content: systemPrompt },
            ...messages,
        ],
    };

    try {
        const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
            signal:  AbortSignal.timeout(60_000), /* 60s timeout */
        });

        if (!ollamaRes.ok) {
            console.error("Ollama error:", ollamaRes.status, await ollamaRes.text());
            return Response.json(
                { error: `Ollama returned ${ollamaRes.status}` },
                { status: 502 }
            );
        }

        const data  = await ollamaRes.json();
        const raw   = data.message?.content ?? "";

        const match      = raw.match(/CONFIDENCE:\s*(High|Medium|Low)/i);
        const confidence = (match?.[1] ?? "Medium") as "High" | "Medium" | "Low";
        const content    = raw.replace(/\n?CONFIDENCE:\s*(High|Medium|Low)/i, "").trim();

        return Response.json({ content, model: data.model, confidence });

    } catch (err: any) {
        /* AbortSignal.timeout fires this */
        if (err?.name === "TimeoutError") {
            return Response.json({ error: "Ollama timed out" }, { status: 504 });
        }
        console.error("Ollama unreachable:", err);
        return Response.json({ error: "AI backend unreachable" }, { status: 503 });
    }
}

/* ─────────────────────────────────────────────────────────────
   Derive a simple confidence label from Ollama's response meta.
   Ollama doesn't expose logprobs yet — use duration as a proxy:
   fast responses on a known topic → High,
   slow/long responses → Medium (more generation = more uncertainty).
   Replace with real logprob scoring when Ollama exposes it.
   ───────────────────────────────────────────────────────────── */
// function inferConfidence(data: any): "High" | "Medium" | "Low" {
//     const tokens = data.eval_count ?? 0;
//     if (tokens < 80)  return "High";
//     if (tokens < 200) return "Medium";
//     return "Low";
// }