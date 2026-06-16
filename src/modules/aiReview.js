const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`;

function buildDiffText(parsedDiff) {
  return parsedDiff
    .map((file) => {
      const changes = file.changes
        .filter((c) => c.type !== "context")
        .map(
          (c) =>
            `  ${c.type === "add" ? "+" : "-"} [L${c.lineNumber}] ${c.content}`,
        )
        .join("\n");
      return `File: ${file.filename}\n${changes}`;
    })
    .join("\n\n");
}

function stripFences(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) return "[]";
  return text.slice(start, end + 1);
}

export async function reviewDiff(parsedDiff) {
  const diffText = buildDiffText(parsedDiff);

  const payload = {
    system_instruction: {
      parts: [
        {
          text:
            "You are a senior software engineer performing a code review. " +
            "Analyze the provided diff and return ONLY a valid JSON array — no markdown, no prose, no code fences. " +
            "Each element must have: filename, line (integer), severity (bug|security|performance|style|suggestion), " +
            "issue, why, fix, explanation.",
        },
      ],
    },
    contents: [
      {
        parts: [
          {
            text: `Review the following code diff and return a JSON array of issues:\n\n${diffText}`,
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
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
  console.log("Gemini raw response:", raw);
  try {
    const comments = JSON.parse(stripFences(raw));
    const seen = new Set();
    return comments.filter((c) => {
      const key = `${c.filename}:${c.line}:${c.issue}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch (err) {
    console.error("Failed to parse Gemini response:", err.message);
    return [];
  }
}
