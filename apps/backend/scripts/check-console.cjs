// scripts/check-console.js
// Cross-platform replacement for the bash grep command.
// Scans bsa/ and backend/ for console.log statements.

const fs = require("fs");
const path = require("path");

const foldersToCheck = ["bsa", "backend"];
const extensions = [".js", ".jsx", ".ts", ".tsx"];
const ignoreDirs = ["node_modules", ".git", "build", "dist", "coverage"];

let found = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoreDirs.includes(entry.name)) walk(fullPath);
    } else if (extensions.includes(path.extname(entry.name))) {
      const content = fs.readFileSync(fullPath, "utf8");
      content.split("\n").forEach((line, index) => {
        if (line.includes("console.log")) {
          found.push(`${fullPath}:${index + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

foldersToCheck.forEach((folder) => {
  if (fs.existsSync(folder)) walk(folder);
});

if (found.length > 0) {
  console.log("console.log statements found:\n");
  found.forEach((line) => console.log(line));
  process.exit(1);
} else {
  console.log("No console.log statements found.");
  process.exit(0);
}
