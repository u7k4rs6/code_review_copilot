export function parseDiff(rawDiff) {
  const lines = rawDiff.split("\n");
  const files = [];
  let current = null;
  let lineNumber = 0;

  for (const line of lines) {
    if (line.startsWith("diff --git")) {
      if (current) files.push(current);
      const match = line.match(/diff --git a\/.+ b\/(.+)/);
      current = { filename: match ? match[1] : line, changes: [] };
      lineNumber = 0;
      continue;
    }

    if (!current) continue;

    if (
      line.startsWith("index ") ||
      line.startsWith("--- ") ||
      line.startsWith("+++ ")
    ) {
      continue;
    }

    if (line.startsWith("@@")) {
      const match = line.match(/\+(\d+)/);
      lineNumber = match ? parseInt(match[1], 10) - 1 : 0;
      continue;
    }

    if (line.startsWith("+")) {
      lineNumber++;
      current.changes.push({ type: "add", lineNumber, content: line.slice(1) });
    } else if (line.startsWith("-")) {
      current.changes.push({
        type: "remove",
        lineNumber,
        content: line.slice(1),
      });
    } else {
      lineNumber++;
      current.changes.push({
        type: "context",
        lineNumber,
        content: line.slice(1),
      });
    }
  }

  if (current) files.push(current);
  return files;
}
