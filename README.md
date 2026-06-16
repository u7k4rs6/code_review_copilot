# Code Review Copilot

AI-powered code review tool that analyzes GitHub pull requests using Google Gemini and posts inline review comments.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your credentials:

```
PORT=3000
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
```

## Running

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

## API

### Health check

```
GET /
```

### Review a pull request

```
POST /api/review
Content-Type: application/json

{ "prUrl": "https://github.com/owner/repo/pull/123" }
```

Response includes `reviewComments` (array of AI findings) and `riskSummary` (quality score, risk level, merge recommendation).
