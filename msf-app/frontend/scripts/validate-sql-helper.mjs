import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, "../src/data/shortcuts");
const files = ["postgresql.json", "mysql.json"];

console.log("=== SQL Helper Data Validation (Fase 4 Schema & Params) ===");

let totalCount = 0;
const seenIds = new Set();
let hasErrors = false;

const PARAM_KEY_REGEX = /^[a-z][a-z0-9_]*$/;
const PLACEHOLDER_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

for (const file of files) {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${filePath}`);
    hasErrors = true;
    continue;
  }

  const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!Array.isArray(content)) {
    console.error(`Invalid structure in ${file}: expected JSON array`);
    hasErrors = true;
    continue;
  }

  console.log(`Checking ${file}: ${content.length} scripts found`);

  for (const item of content) {
    totalCount++;

    // 1. Check ID
    if (!item.id || typeof item.id !== "string") {
      console.error(`Error in ${file}: Missing or invalid id:`, item);
      hasErrors = true;
    } else if (seenIds.has(item.id)) {
      console.error(`Error in ${file}: Duplicate script id found: "${item.id}"`);
      hasErrors = true;
    } else {
      seenIds.add(item.id);
    }

    // 2. Check title & description
    if (!item.title || item.title.length < 3) {
      console.error(`Error in ${file} [${item.id}]: title too short`);
      hasErrors = true;
    }
    if (!item.description || item.description.length < 5) {
      console.error(`Error in ${file} [${item.id}]: description too short`);
      hasErrors = true;
    }

    // 3. Check SQL
    if (!item.sql || typeof item.sql !== "string" || item.sql.trim().length === 0) {
      console.error(`Error in ${file} [${item.id}]: empty or missing sql`);
      hasErrors = true;
    }

    // 4. Check risk level
    if (!item.risk_level) {
      console.error(`Error in ${file} [${item.id}]: missing risk_level`);
      hasErrors = true;
    }

    // 5. Check params & placeholders consistency (SPEC §3.4)
    const definedParamKeys = new Set();
    if (item.params) {
      if (!Array.isArray(item.params)) {
        console.error(`Error in ${file} [${item.id}]: params must be an array`);
        hasErrors = true;
      } else {
        for (const p of item.params) {
          if (!p.key || !PARAM_KEY_REGEX.test(p.key)) {
            console.error(
              `Error in ${file} [${item.id}]: invalid param key "${p.key}" (must match ${PARAM_KEY_REGEX})`
            );
            hasErrors = true;
          }
          if (!p.label || typeof p.label !== "string") {
            console.error(`Error in ${file} [${item.id}]: missing param label for "${p.key}"`);
            hasErrors = true;
          }
          if (p.type && !["identifier", "string", "number"].includes(p.type)) {
            console.error(`Error in ${file} [${item.id}]: invalid param type "${p.type}" for "${p.key}"`);
            hasErrors = true;
          }
          definedParamKeys.add(p.key);
        }
      }
    }

    // Extract placeholders from SQL
    if (item.sql) {
      let match;
      const sqlPlaceholders = new Set();
      const regex = new RegExp(PLACEHOLDER_REGEX);
      while ((match = regex.exec(item.sql)) !== null) {
        sqlPlaceholders.add(match[1]);
      }

      // Every placeholder in SQL must have a defined param
      for (const ph of sqlPlaceholders) {
        if (!definedParamKeys.has(ph)) {
          console.error(
            `Error in ${file} [${item.id}]: SQL placeholder "{{${ph}}}" is not defined in params list`
          );
          hasErrors = true;
        }
      }

      // Every defined param should be present in SQL
      for (const pk of definedParamKeys) {
        if (!sqlPlaceholders.has(pk)) {
          console.error(
            `Error in ${file} [${item.id}]: Defined param "${pk}" does not appear as "{{${pk}}}" in SQL`
          );
          hasErrors = true;
        }
      }
    }
  }
}

if (hasErrors) {
  console.error("\nFAILED: Data validation found errors.");
  process.exit(1);
} else {
  console.log(
    `\nPASSED: All ${totalCount} scripts across ${files.length} datasets are valid, unique, and parameter-consistent.`
  );
  process.exit(0);
}
