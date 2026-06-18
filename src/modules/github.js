/** GitHub REST API base URL */
const BASE = "https://api.github.com";

/**
 * Builds standard headers for GitHub API requests.
 * @param {string} accept - The Accept header value (e.g., diff format or JSON)
 * @returns {{Authorization: string, Accept: string, "User-Agent": string}} Headers object
 */
function baseHeaders(accept) {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: accept,
    "User-Agent": "code-review-copilot",
  };
}

/**
 * Fetches the raw unified diff for a pull request.
 * @param {string} owner - Repository owner (GitHub username or org)
 * @param {string} repo - Repository name
 * @param {string} pullNumber - Pull request number
 * @returns {Promise<string>} Raw diff text
 * @throws {Error} If the GitHub API returns a non-OK response
 */
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

/**
 * Fetches the list of files changed in a pull request.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} pullNumber - Pull request number
 * @returns {Promise<Array>} Array of file objects from GitHub API
 * @throws {Error} If the GitHub API returns a non-OK response
 */
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

/**
 * Fetches the latest commit SHA (head) of a pull request.
 * This is needed when posting review comments to a specific commit.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} pullNumber - Pull request number
 * @returns {Promise<string>} The head commit SHA
 * @throws {Error} If the GitHub API returns a non-OK response
 */
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

/**
 * Posts AI-generated review comments as an inline review on the pull request.
 * Each comment is formatted with severity, explanation, and suggested fix.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} pullNumber - Pull request number
 * @param {string} commitId - The commit SHA to attach comments to
 * @param {{comments: Array, summary: string}} comments - Review comments and summary text
 * @returns {Promise<Object>} GitHub API response for the created review
 * @throws {Error} If the GitHub API returns a non-OK response
 */
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
