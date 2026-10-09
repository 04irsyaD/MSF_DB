import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, "../src/data/shortcuts");
const files = ["postgresql.json", "mysql.json"];

console.log("=== SQL Helper Data Validation ===");

let totalCount = 0;
const seenIds = new Set();
let hasErrors = false;

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
    // Check ID
    if (!item.id || typeof item.id !== "string") {
      console.error(`Error in ${file}: Missing or invalid id:`, item);
      hasErrors = true;
    } else if (seenIds.has(item.id)) {
      console.error(`Error in ${file}: Duplicate script id found: "${item.id}"`);
      hasErrors = true;
    } else {
      seenIds.add(item.id);
    }

    // Check title & description
    if (!item.title || item.title.length < 3) {
      console.error(`Error in ${file} [${item.id}]: title too short`);
      hasErrors = true;
    }
    if (!item.description || item.description.length < 5) {
      console.error(`Error in ${file} [${item.id}]: description too short`);
      hasErrors = true;
    }

    // Check SQL
    if (!item.sql || typeof item.sql !== "string" || item.sql.trim().length === 0) {
      console.error(`Error in ${file} [${item.id}]: empty or missing sql`);
      hasErrors = true;
    }

    // Check risk level
    if (!item.risk_level) {
      console.error(`Error in ${file} [${item.id}]: missing risk_level`);
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error("\nFAILED: Data validation found errors.");
  process.exit(1);
} else {
  console.log(`\nPASSED: All ${totalCount} scripts across ${files.length} datasets are valid and unique.`);
  process.exit(0);
}
