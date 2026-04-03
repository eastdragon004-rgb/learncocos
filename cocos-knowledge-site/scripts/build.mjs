import { mkdir, readFile, writeFile, copyFile, cp, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const contentFile = join(rootDir, "content", "knowledge.md");
const templateFile = join(rootDir, "src", "template.html");
const styleFile = join(rootDir, "src", "styles.css");
const distDir = join(rootDir, "dist");
const distAssetDir = join(distDir, "assets");
const contentImagesDir = join(rootDir, "content", "images");
const distImagesDir = join(distDir, "images");

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
});

const content = await readFile(contentFile, "utf8");
const template = await readFile(templateFile, "utf8");

const tokens = md.parse(content, {});
const toc = [];
let headingIndex = 0;

for (let i = 0; i < tokens.length; i += 1) {
  const token = tokens[i];
  if (token.type !== "heading_open") {
    continue;
  }
  const level = Number(token.tag.replace("h", ""));
  const textToken = tokens[i + 1];
  const title = textToken?.content?.trim() ?? "";
  if (!title) {
    continue;
  }

  headingIndex += 1;
  const id = `sec-${headingIndex}`;
  token.attrSet("id", id);

  if (level === 2 || level === 3) {
    toc.push({ id, level, title });
  }
}

const articleHtml = md.renderer.render(tokens, md.options, {});

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const tocHtml = toc
  .map(
    (item) =>
      `<li class="toc-item toc-lv-${item.level}"><a href="#${item.id}">${escapeHtml(item.title)}</a></li>`
  )
  .join("\n");

const builtAt = new Date().toISOString().slice(0, 10);
const html = template
  .replace("{{TOC_HTML}}", tocHtml)
  .replace("{{ARTICLE_HTML}}", articleHtml)
  .replace("{{BUILT_AT}}", builtAt);

await rm(distDir, { recursive: true, force: true });
await mkdir(distAssetDir, { recursive: true });
await writeFile(join(distDir, "index.html"), html, "utf8");
await copyFile(styleFile, join(distAssetDir, "styles.css"));

try {
  await cp(contentImagesDir, distImagesDir, { recursive: true });
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

console.log(`Built site: ${join(distDir, "index.html")}`);
