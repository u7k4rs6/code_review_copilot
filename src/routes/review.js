import { Router } from "express";
import {
  fetchPRDiff,
  fetchPRFiles,
  fetchCommitId,
  postReviewComments,
} from "../modules/github.js";
import { parseDiff } from "../modules/diffParser.js";
import { reviewDiff } from "../modules/aiReview.js";
import { generateRiskSummary } from "../modules/riskSummary.js";

const router = Router();

const PR_URL_RE = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;

router.post("/", async (req, res) => {
  const { prUrl } = req.body;

  if (!prUrl) {
    return res.status(400).json({ error: "prUrl is required" });
  }

  const match = prUrl.match(PR_URL_RE);
  if (!match) {
    return res.status(400).json({
      error: "Invalid prUrl. Expected: https://github.com/owner/repo/pull/123",
    });
  }

  const [, owner, repo, pullNumber] = match;

  try {
    const [rawDiff, prFiles, commitId] = await Promise.all([
      fetchPRDiff(owner, repo, pullNumber),
      fetchPRFiles(owner, repo, pullNumber),
      fetchCommitId(owner, repo, pullNumber),
    ]);

    const parsedDiff = parseDiff(rawDiff);
    const aiComments = await reviewDiff(parsedDiff);
    const riskSummary = await generateRiskSummary(parsedDiff, aiComments);

    const summaryText = [
      `## PR Risk Summary`,
      `**Quality Score:** ${riskSummary.qualityScore}/10`,
      `**Risk Level:** ${riskSummary.riskLevel}`,
      `**Merge Recommendation:** ${riskSummary.mergeRecommendation}`,
      `**Rationale:** ${riskSummary.rationale}`,
      riskSummary.highRiskChanges?.length
        ? `\n**High Risk Changes:**\n${riskSummary.highRiskChanges.map((c) => `- ${c}`).join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    await postReviewComments(owner, repo, pullNumber, commitId, {
      comments: aiComments,
      summary: summaryText,
    });

    res.json({
      pr: { owner, repo, pullNumber },
      reviewComments: aiComments,
      riskSummary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
