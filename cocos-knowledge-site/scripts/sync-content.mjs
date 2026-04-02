import { copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectDir = join(__dirname, "..");

const source = join(projectDir, "..", "CocosCreator_知识点总结.md");
const target = join(projectDir, "content", "knowledge.md");

await copyFile(source, target);
console.log(`Synced content: ${source} -> ${target}`);
