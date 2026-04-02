# Vercel 一条龙发布工作流

适用项目目录：`F:\learncocos\cocos-knowledge-site`

## A. 推荐路径（GitHub + Vercel 控制台）

1. 把项目推到 GitHub（仓库可新建）。
2. 登录 Vercel，点击 `Add New... -> Project`。
3. 选择你的 GitHub 仓库。
4. 如果仓库根目录不是这个项目，设置：
- Root Directory: `cocos-knowledge-site`
5. 构建配置：
- Build Command: `npm run build`
- Output Directory: `dist`
6. 点击 `Deploy`。

完成后：
- 每次 push 到 `main` 自动生产部署。
- 每次 PR 自动预览部署（Preview URL）。

## B. CLI 路径（本机一键发版）

首次：

```bash
cd F:\learncocos\cocos-knowledge-site
npx vercel
```

按提示登录、链接项目。

之后：

```bash
# 预览部署
npm run deploy:preview

# 生产部署
npm run deploy:prod
```

## C. 日常内容更新发布

```bash
cd F:\learncocos\cocos-knowledge-site

# 从上级文档同步（可选）
npm run sync

# 构建
npm run build

# 本地检查
npm run preview
```

确认无误后：
- GitHub 流程：`git push` 触发自动部署
- CLI 流程：`npm run deploy:prod`

## D. 自定义域名

1. Vercel 项目 -> `Settings -> Domains`
2. 添加你的域名
3. 按提示在域名 DNS 提供商添加记录
4. 等待证书签发与生效

## E. 关键文件

- [package.json](F:\learncocos\cocos-knowledge-site\package.json)
- [vercel.json](F:\learncocos\cocos-knowledge-site\vercel.json)
- [README.md](F:\learncocos\cocos-knowledge-site\README.md)
