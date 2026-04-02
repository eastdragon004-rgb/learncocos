# Cocos Knowledge Site Workflow

这个项目把你的知识点沉淀成一个可持续迭代的网站工作流：

1. 内容确定：维护 `content/knowledge.md`
2. 网站设计：维护 `src/template.html` 与 `src/styles.css`
3. 生成页面：运行 `npm run build` 输出 `dist/`
4. 部署上线：Vercel 或 Cloudflare Pages（都可免费）

## 目录结构

```txt
cocos-knowledge-site/
  content/knowledge.md      # 内容源（Markdown）
  src/template.html         # 页面结构模板
  src/styles.css            # 视觉样式
  scripts/build.mjs         # Markdown -> HTML 构建脚本
  scripts/sync-content.mjs  # 从上级知识点文档同步内容
  dist/                     # 构建产物（部署目录）
```

## 本地使用

### 1) 安装依赖

```bash
npm install
```

### 2) 同步或编辑内容

如果你在项目根目录有 `CocosCreator_知识点总结.md`，可直接同步：

```bash
npm run sync
```

或者直接改：

```txt
content/knowledge.md
```

### 3) 构建

```bash
npm run build
```

输出文件：

```txt
dist/index.html
dist/assets/styles.css
```

### 4) 本地预览

```bash
npm run preview
```

浏览器打开 `http://localhost:4173`

## Vercel 部署（免费）

1. 把项目推到 GitHub。
2. Vercel 控制台 `New Project` 选择该仓库。
3. 项目根目录设为 `cocos-knowledge-site`（如果仓库根目录有多个项目）。
4. 构建命令：`npm run build`
5. 输出目录：`dist`
6. 点击 Deploy。

`vercel.json` 已提供默认配置。

## Cloudflare Pages 部署（免费）

1. 把项目推到 GitHub。
2. Cloudflare Pages `Create a project` 连接仓库。
3. 构建配置：
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `cocos-knowledge-site`（按仓库结构决定）
4. 部署完成后可在 Pages 里绑定自定义域名。

`wrangler.toml` 已提供本地 CLI 配置（可选）。

## 推荐迭代流程（一条龙）

1. 内容定稿：只改 `content/knowledge.md`
2. 版式调整：只改 `src/styles.css`
3. 结构调整：改 `src/template.html`
4. 运行 `npm run build && npm run preview` 复核
5. 提交 Git
6. 自动触发 Vercel/Cloudflare 构建并发布

## 可继续扩展

- 新增 `content/` 下多个专题 Markdown，做多页站点
- 接入评论系统（Giscus）
- 接入统计（Cloudflare Web Analytics 或 Vercel Analytics）
