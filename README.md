# OpenCode Dev Design

Design documentation site for [anomalyco/opencode](https://github.com/anomalyco/opencode) — the open source AI coding agent.

**GitHub Repository**: https://github.com/yeluo45/opencode-dev-design

## Project Structure

```
opencode-dev-design/
├── README.md
├── .github/workflows/deploy.yml
├── docs-site/
│   ├── package.json
│   ├── index.md              # 首页
│   ├── architecture.md       # 架构总览
│   ├── core-systems.md       # 核心系统
│   ├── agents.md             # Agent 系统
│   ├── tool-system.md        # 工具系统
│   ├── lsp-support.md        # LSP 支持
│   ├── client-server.md      # 客户端/服务器
│   ├── sdk.md                # SDK
│   ├── contributing.md       # 贡献指南
│   ├── style-guide.md        # 代码风格
│   └── .vitepress/
│       ├── config.mjs       # VitePress 配置 (紫色主题)
│       ├── theme/
│       │   ├── index.js
│       │   └── custom.css
│       └── public/
│           └── favicon.svg
```

## Tech Stack

| 技术 | 用途 |
|------|------|
| TypeScript | 主语言 |
| Bun | JavaScript 运行时 |
| VitePress | 文档站点 |

## Packages

| Package | 说明 |
|---------|------|
| `packages/core` | 核心共享逻辑 |
| `packages/llm` | LLM 提供商封装 |
| `packages/console` | 终端 UI (TUI) |
| `packages/opencode` | CLI 入口 |
| `packages/sdk` | JS/TS SDK |
| `packages/web` | Web 界面 |
| `packages/desktop` | 桌面应用 |

## Key Features

| Feature | 说明 |
|---------|------|
| 100% Open Source | 完全开源 |
| Provider 无关 | 支持多种 LLM 提供商 |
| Client/Server | 可远程运行 |
| Built-in LSP | 可选 LSP 支持 |
| Multiple Agents | build/plan/general |

## GitHub Pages Deployment

**URL**: https://yeluo45.github.io/opencode-dev-design/

**Base Path**: `/opencode-dev-design/`

**Setup Required**:
1. Create GitHub repo `opencode-dev-design`
2. Add remote: `git remote add origin https://github.com/yeluo45/opencode-dev-design.git`
3. Push: `git push -u origin master`
4. GitHub Settings → Pages → Source: GitHub Actions

## Local Development

```bash
cd docs-site
pnpm install
pnpm run dev
```

## License

MIT License - See [anomalyco/opencode](https://github.com/anomalyco/opencode/blob/main/LICENSE)