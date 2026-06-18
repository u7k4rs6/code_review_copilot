/** Gemini API endpoint for risk summary generation */
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`;

/**
 * Strips markdown code fences from Gemini's response text.
 * Removes opening/closing ``` markers that the model sometimes adds.
 * @param {string} text - Raw text response from Gemini API
 * @returns {string} Cleaned text with code fences removed
 */
function stripFences(text) {
  return text
    .replace(/^```(?:json)?\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();
}

/**
 * Generates a risk summary for a pull request using Gemini AI.
 * Analyzes the changed files and review findings to produce a quality score,
 * risk level, and merge recommendation.
 * @param {Array<{filename: string, changes: Array}>} parsedDiff - Parsed diff from diffParser
 * @param {Array<{severity: string, filename: string, line: number, issue: string}>} reviewComments - AI review findings
 * @returns {Promise<{qualityScore: number, riskLevel: string, highRiskChanges: string[], mergeRecommendation: string, rationale: string}>}
 * @throws {Error} If the Gemini API returns a non-OK response
 */
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
  console.log("Gemini risk summary raw response:", raw);
  try {
    return JSON.parse(stripFences(raw));
  } catch (err) {
    console.error("Failed to parse risk summary response:", err.message);
    return {
      qualityScore: 5,
      riskLevel: "medium",
      highRiskChanges: [],
      mergeRecommendation: "Needs work",
      rationale: "Unable to parse AI response. Manual review recommended.",
    };
  }
}
