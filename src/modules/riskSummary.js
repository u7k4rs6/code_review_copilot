const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`;

function stripFences(text) {
  return text
    .replace(/^```(?:json)?\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();
}

export async function generateRiskSummary(parsedDiff, reviewComments) {
  const fileList = parsedDiff.map((f) => f.filename).join(", ");
  const commentsSummary = reviewComments
    .map((c) => `[${c.severity}] ${c.filename}:${c.line} — ${c.issue}`)
    .join("\n");

  const payload = {
    system_instruction: {
      parts: [
        {
          text:
            "You are a senior software engineer writing a pull request risk summary. " +
            "Return ONLY a valid JSON object — no markdown, no prose, no code fences. " +
            "The object must have: qualityScore (integer 1-10), riskLevel (low|medium|high), " +
            "highRiskChanges (array of strings), mergeRecommendation (Needs work|Safe to merge|Do not merge), " +
            "rationale (string).",
        },
      ],
    },
    contents: [
      {
        parts: [
          {
            text:
              `Files changed: ${fileList}\n\nReview findings:\n${commentsSummary || "No issues found."}\n\n` +
              "Produce a PR risk summary JSON object.",
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.2 },
  };

  const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  return JSON.parse(stripFences(raw));
}
