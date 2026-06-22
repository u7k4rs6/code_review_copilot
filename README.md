# Code Review Copilot

> AI-powered code review for GitHub pull requests — automated bug detection, security analysis, and merge recommendations powered by Google Gemini.

Code Review Copilot analyzes GitHub pull requests and posts inline review comments with actionable suggestions. It flags bugs, security vulnerabilities, performance issues, and style problems, then delivers a risk summary with a quality score and a clear merge recommendation.

---

## Features

- **Automated PR analysis** — Submit a pull request URL and get a full review in seconds.
- **Severity-categorized comments** — Issues tagged as `bug`, `security`, `performance`, `style`, or `suggestion`.
- **Actionable fixes** — Each comment explains *what's wrong*, *why it matters*, and *how to fix it*.
- **Risk summary** — A quality score, risk level, and merge recommendation for the whole PR.
- **Inline GitHub comments** — Findings posted directly to the PR where the code lives.

---

## How It Works

```
PR URL
  → GitHub API (fetch diff & files)
    → Gemini AI (analyze code)
      → Review comments + risk summary
        → Post inline comments to GitHub PR
```

1. User submits a GitHub pull request URL.
2. The server fetches the PR diff and file list from the GitHub API.
3. The diff is parsed and sent to Google Gemini for analysis.
4. Gemini returns structured review comments categorized by severity.
5. A risk summary is generated with a quality score, risk level, and merge recommendation.
6. All comments are posted back to the GitHub PR as inline comments.

---

## Prerequisites

| Requirement | Notes |
|---|---|
| **Node.js** v18+ | Required runtime |
| **GitHub Personal Access Token** | Needs `repo` scope — [generate here](https://github.com/settings/tokens) |
| **Google Gemini API Key** | [Generate here](https://aistudio.google.com/apikey) |

---

## Setup

**1. Clone the repository**

```bash
git clone https://github.com/your-username/code-review-copilot.git
cd code-review-copilot
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=3000
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
```

---

## Running

```bash
# Development (auto-reload on file changes)
npm run dev

# Production
npm start
```

The server starts at **`http://localhost:3000`** by default.

---

## API Reference

### `GET /`

Returns the frontend UI.

### `POST /api/review`

Reviews a pull request.

**Request**

```json
{
  "prUrl": "https://github.com/owner/repo/pull/123"
}
```

**Response**

```json
{
  "pr": {
    "owner": "owner",
    "repo": "repo",
    "pullNumber": "123"
  },
  "reviewComments": [
    {
      "filename": "src/utils.js",
      "line": 42,
      "severity": "bug",
      "issue": "Possible null reference",
      "why": "The variable may be undefined when accessed",
      "fix": "Add a null check before accessing the property",
      "explanation": "When a variable might not have a value, accessing its properties can crash the program"
    }
  ],
  "riskSummary": {
    "qualityScore": 7,
    "riskLevel": "low",
    "highRiskChanges": [],
    "mergeRecommendation": "Safe to merge",
    "rationale": "Minor style issues found, no critical bugs detected"
  }
}
```

---

## Project Structure

```
code-review-copilot/
├── public/                  # Frontend UI (React)
│   ├── index.html           # Entry point
│   ├── styles.css           # Global styles
│   ├── kit.css              # Design system styles
│   ├── icons.js             # Icon components
│   ├── components.js        # Reusable UI components
│   ├── tokens/              # Design tokens
│   └── app/                 # App screens (Sidebar, PRInbox, ReviewWorkspace, etc.)
├── src/                     # Backend server (Express + Node.js)
│   ├── index.js             # Server entry point with env validation
│   ├── routes/
│   │   └── review.js        # POST /api/review endpoint
│   └── modules/
│       ├── github.js        # GitHub API integration
│       ├── diffParser.js    # Unified diff parser
│       ├── aiReview.js      # Gemini AI code review analysis
│       └── riskSummary.js   # Gemini AI risk summary generation
├── .env.example             # Environment variable template
├── vercel.json              # Vercel deployment configuration
└── package.json
```

---

## Deployment

The project includes a `vercel.json` configuration for [Vercel](https://vercel.com):

1. Connect your GitHub repository to Vercel.
2. Set `GITHUB_TOKEN` and `GEMINI_API_KEY` in the Vercel dashboard.
3. Deploy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express |
| **Frontend** | React 18 (via CDN), Vanilla CSS |
| **AI** | Google Gemini API (`gemini-2.5-flash-lite`) |
| **APIs** | GitHub REST API v3 |
| **Deployment** | Vercel |
