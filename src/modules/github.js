const BASE = "https://api.github.com";

function baseHeaders(accept) {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: accept,
    "User-Agent": "code-review-copilot",
  };
}

export async function fetchPRDiff(owner, repo, pullNumber) {
  const res = await fetch(
    `${BASE}/repos/${owner}/${repo}/pulls/${pullNumber}`,
    { headers: baseHeaders("application/vnd.github.v3.diff") },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  return res.text();
}

export async function fetchPRFiles(owner, repo, pullNumber) {
  const res = await fetch(
    `${BASE}/repos/${owner}/${repo}/pulls/${pullNumber}/files`,
    { headers: baseHeaders("application/vnd.github.v3+json") },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchCommitId(owner, repo, pullNumber) {
  const res = await fetch(
    `${BASE}/repos/${owner}/${repo}/pulls/${pullNumber}`,
    { headers: baseHeaders("application/vnd.github.v3+json") },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.head.sha;
}

export async function postReviewComments(
  owner,
  repo,
  pullNumber,
  commitId,
  comments,
) {
  const inlineComments = (comments.comments || []).map((c) => ({
    path: c.filename,
    line: c.line,
    body: [
      `**[${c.severity?.toUpperCase() ?? "INFO"}]** ${c.issue}`,
      "",
      `**Why it matters:** ${c.why}`,
      "",
      `**Suggested fix:** ${c.fix}`,
      "",
      "---",
      `*Explanation for juniors: ${c.explanation}*`,
    ].join("\n"),
  }));

  const res = await fetch(
    `${BASE}/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`,
    {
      method: "POST",
      headers: {
        ...baseHeaders("application/vnd.github.v3+json"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commit_id: commitId,
        body: comments.summary ?? "",
        event: "COMMENT",
        comments: inlineComments,
      }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub post review error ${res.status}: ${text}`);
  }
  return res.json();
}
