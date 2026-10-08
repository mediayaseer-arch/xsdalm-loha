import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const clientSourceDirectories = ["src", "components", "hooks", "lib", "site"];
const clientSourceFiles = ["index.html"];
const sourceExtensions = new Set([
  ".html",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
]);
const forbiddenPatterns = [
  { name: "localStorage", pattern: /\blocalStorage\b/i },
  { name: "sessionStorage", pattern: /\bsessionStorage\b/i },
  { name: "IndexedDB", pattern: /\bindexedDB\b/i },
  { name: "Cache Storage", pattern: /\b(?:caches|CacheStorage)\b/i },
  { name: "Cookie Store", pattern: /\bcookieStore\b/i },
  {
    name: "document.cookie",
    pattern: /\bdocument\s*(?:\.\s*cookie\b|\[\s*["']cookie["']\s*\])/i,
  },
  {
    name: "cookie access",
    pattern: /\bCookies?\s*\.\s*(?:get|set|remove|delete)\s*\(/i,
  },
  {
    name: "client cookie package",
    pattern:
      /\b(?:from\s*|import\s*\(\s*|require\s*\(\s*)["'](?:js-cookie|react-cookie|universal-cookie|nookies)["']/i,
  },
  {
    name: "Supabase client SDK",
    pattern: /\b(?:from\s*|import\s*\(\s*|require\s*\(\s*)["']@supabase\//i,
  },
  {
    name: "Supabase server credential",
    pattern: /\bSUPABASE_(?:SECRET_KEY|SERVICE_ROLE_KEY)\b/i,
  },
  {
    name: "Vite-exposed Supabase environment variable",
    pattern: /\bVITE_SUPABASE_[A-Z0-9_]+\b/i,
  },
  {
    name: "direct Supabase API URL",
    pattern: /https?:\/\/[^\s"'`]*supabase\.co\b/i,
  },
  {
    name: "direct IPData API URL",
    pattern: /\bapi\.ipdata\.co\b/i,
  },
];

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(entryPath)));
    } else if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

const violations = [];
const sourceFiles = [...clientSourceFiles];

for (const directory of clientSourceDirectories) {
  let files;
  try {
    files = await collectSourceFiles(directory);
  } catch (error) {
    console.error(`Unable to scan client source directory "${directory}": ${error.message}`);
    process.exitCode = 1;
    continue;
  }

  sourceFiles.push(...files);
}

for (const file of sourceFiles) {
  const contents = await readFile(file, "utf8");

  for (const { name, pattern } of forbiddenPatterns) {
    const match = pattern.exec(contents);
    if (match) {
      const lineNumber = contents.slice(0, match.index).split(/\r?\n/).length;
      violations.push(`${file}:${lineNumber}: ${name}`);
    }
  }
}

if (violations.length > 0) {
  console.error("Client source safety check failed:");
  for (const violation of violations) {
    console.error(`  ${violation}`);
  }
  process.exitCode = 1;
} else if (process.exitCode !== 1) {
  console.log("Client source safety checks passed.");
}