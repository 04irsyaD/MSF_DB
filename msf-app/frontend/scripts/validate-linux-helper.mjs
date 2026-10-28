import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, "../src/features/linux-helper/data");
const levelFiles = ["level-0.json", "level-1.json", "level-2.json"];
const runbookFile = "runbooks/index.json";

console.log("=== Linux Helper Data Validation ===");

const KEY_REGEX = /^[a-z][a-z0-9_]*$/;
const PLACEHOLDER_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
const ENVS = ["desktop", "ssh"];
const DISTROS = ["ubuntu", "rhel"];
const RISKS = ["low", "medium", "high"];
const PARAM_TYPES = ["identifier", "string", "number", "port", "ip", "cidr", "path"];

let hasErrors = false;
const seenIds = new Set();
let shortcutCount = 0;
let commandCount = 0;
let runbookCount = 0;

function err(msg) {
  console.error(`  ✗ ${msg}`);
  hasErrors = true;
}

function readJson(file) {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) {
    err(`Missing file: ${file}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    err(`Invalid JSON in ${file}: ${e.message}`);
    return null;
  }
}

function checkId(file, item) {
  if (!item.id || typeof item.id !== "string") {
    err(`${file}: item missing/invalid id`);
  } else if (seenIds.has(item.id)) {
    err(`${file}: duplicate id "${item.id}"`);
  } else {
    seenIds.add(item.id);
  }
}

function checkPlaceholders(file, id, text, definedKeys) {
  const regex = new RegExp(PLACEHOLDER_REGEX);
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (!definedKeys.has(m[1])) {
      err(`${file} [${id}]: placeholder "{{${m[1]}}}" has no matching var`);
    }
  }
}

// --- Levels: shortcuts + commands ---
for (const file of levelFiles) {
  const expectedLevel = file.match(/level-(\d)/)[1];
  const content = readJson(file);
  if (!content) continue;
  if (typeof content !== "object" || Array.isArray(content)) {
    err(`${file}: expected object { shortcuts, commands }`);
    continue;
  }

  const shortcuts = Array.isArray(content.shortcuts) ? content.shortcuts : [];
  const commands = Array.isArray(content.commands) ? content.commands : [];

  for (const s of shortcuts) {
    shortcutCount++;
    checkId(file, s);
    if (s.level !== expectedLevel) err(`${file} [${s.id}]: level "${s.level}" != file level ${expectedLevel}`);
    if (!s.title) err(`${file} [${s.id}]: shortcut missing title`);
    if (!Array.isArray(s.keys) || s.keys.length === 0 || !s.keys.every((k) => Array.isArray(k) && k.length > 0)) {
      err(`${file} [${s.id}]: keys must be a non-empty array of non-empty arrays`);
    }
    if (!Array.isArray(s.env) || s.env.length === 0 || !s.env.every((e) => ENVS.includes(e))) {
      err(`${file} [${s.id}]: env must be a non-empty subset of ${ENVS.join("/")}`);
    }
  }

  for (const c of commands) {
    commandCount++;
    checkId(file, c);
    if (c.level !== expectedLevel) err(`${file} [${c.id}]: level "${c.level}" != file level ${expectedLevel}`);
    if (!c.title) err(`${file} [${c.id}]: command missing title`);
    if (!c.description || c.description.length < 5) err(`${file} [${c.id}]: description too short (min 5 chars)`);
    if (!c.command || typeof c.command !== "string") err(`${file} [${c.id}]: empty command`);
    if (!c.category) err(`${file} [${c.id}]: missing category`);
    if (c.risk && !RISKS.includes(c.risk)) err(`${file} [${c.id}]: invalid risk "${c.risk}"`);
    if (c.variants) {
      for (const k of Object.keys(c.variants)) {
        if (!DISTROS.includes(k)) err(`${file} [${c.id}]: invalid distro key "${k}" in variants`);
      }
    }
  }
}

// --- Runbooks ---
const runbooks = readJson(runbookFile);
if (Array.isArray(runbooks)) {
  for (const rb of runbooks) {
    runbookCount++;
    checkId(runbookFile, rb);
    if (!rb.title) err(`${runbookFile} [${rb.id}]: missing title`);
    if (!rb.description) err(`${runbookFile} [${rb.id}]: missing description`);

    const definedKeys = new Set();
    for (const v of rb.vars || []) {
      if (!v.key || !KEY_REGEX.test(v.key)) err(`${runbookFile} [${rb.id}]: invalid var key "${v.key}"`);
      if (v.type && !PARAM_TYPES.includes(v.type)) err(`${runbookFile} [${rb.id}]: invalid var type "${v.type}"`);
      definedKeys.add(v.key);
    }

    if (!Array.isArray(rb.steps) || rb.steps.length === 0) {
      err(`${runbookFile} [${rb.id}]: steps must be a non-empty array`);
      continue;
    }
    for (const step of rb.steps) {
      if (!Array.isArray(step.commands) || step.commands.length === 0) {
        err(`${runbookFile} [${rb.id}/${step.id}]: commands must be a non-empty array`);
      } else {
        for (const cmd of step.commands) checkPlaceholders(runbookFile, rb.id, cmd, definedKeys);
      }
      if (step.risk && !RISKS.includes(step.risk)) err(`${runbookFile} [${rb.id}/${step.id}]: invalid risk "${step.risk}"`);
    }
  }
} else if (runbooks !== null) {
  err(`${runbookFile}: expected a JSON array`);
}

const total = shortcutCount + commandCount + runbookCount;
if (hasErrors) {
  console.error("\nFAILED: Linux Helper data validation found errors.");
  process.exit(1);
} else {
  console.log(
    `\nPASSED: ${shortcutCount} shortcuts, ${commandCount} commands, ${runbookCount} runbooks (${total} items) valid & unique.`
  );
  process.exit(0);
}
