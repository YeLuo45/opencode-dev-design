# Architecture

> OpenCode 核心架构：TypeScript Monorepo + 客户端/服务器模式

## 1. Overview

| 指标 | 数值 |
|------|------|
| 语言 | TypeScript |
| 运行时 | Bun |
| 包数量 | 22 个 |
| 架构风格 | Monorepo + Client/Server |
| 源码行数 | ~90,000+ |

## 2. Package 结构

```
packages/
├── opencode/        # 核心 CLI 应用
├── core/            # 核心共享逻辑
├── llm/             # LLM 提供商封装
├── console/         # 终端 UI (TUI)
├── app/             # 主应用入口
├── web/             # Web 界面
├── desktop/         # 桌面应用
├── sdk/             # SDK (JS/TS)
├── docs/            # 文档
├── extensions/      # 扩展系统
├── plugin/          # 插件系统
├── function/        # 云函数
├── identity/        # 身份认证
├── http-recorder/   # HTTP 录制
├── ui/              # 共享 UI 组件
├── storybook/       # 组件预览
├── containers/      # 容器化
└── enterprise/      # 企业版
```

## 3. 核心组件

### 3.1 Client/Server 架构

```
┌─────────────────────────────────────────────────────────┐
│                      OpenCode Server                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐  │
│  │  Core   │  │   LLM   │  │  Tools  │  │  Journal  │  │
│  └─────────┘  └─────────┘  └─────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────┘
         ▲                ▲                ▲
         │                │                │
         │ TCP/WS         │ TCP/WS         │ TCP/WS
         │                │                │
┌────────┴────────┐ ┌──────┴──────┐ ┌───────┴───────┐
│   Console TUI   │ │  Desktop    │ │   Web Client  │
│   (Terminal)    │ │  (Electron) │ │   (Browser)   │
└─────────────────┘ └─────────────┘ └───────────────┘
```

### 3.2 Core Package

```typescript
// packages/core/src/types.ts
export interface OpenCodeConfig {
  provider: "anthropic" | "openai" | "google" | "local";
  model: string;
  apiKey?: string;
  baseUrl?: string;
  tools: ToolDefinition[];
  systemPrompt?: string;
}
```

### 3.3 LLM Package

```typescript
// packages/llm/src/index.ts
export interface LLMClient {
  complete(prompt: string, options?: CompleteOptions): Promise<string>;
  stream(prompt: string, options?: StreamOptions): AsyncGenerator<string>;
  countTokens(text: string): Promise<number>;
}

export type Provider = "anthropic" | "openai" | "google" | "local";
```

### 3.4 Console (TUI)

```typescript
// packages/console/src/app.ts
export interface ConsoleConfig {
  theme: "dark" | "light" | "custom";
  layout: "vertical" | "horizontal";
  fontSize: number;
  fontFamily: string;
}
```

## 4. 安装与入口

### 4.1 安装方式

```bash
# YOLO
curl -fsSL https://opencode.ai/install | bash

# 包管理器
npm i -g opencode-ai@latest
brew install anomalyco/tap/opencode
scoop install opencode

# 桌面版
brew install --cask opencode-desktop
scoop bucket add extras; scoop install extras/opencode-desktop
```

### 4.2 入口点

```bash
# CLI 入口
opencode --help

# 桌面版
opencode-desktop

# Web 版
opencode web
```

## 5. 配置

### 5.1 配置文件

OpenCode 使用配置文件进行设置：

```json
// ~/.opencode/config.json
{
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-latest",
  "apiKey": "${ANTHROPIC_API_KEY}",
  "theme": "dark",
  "tools": {
    "enabled": ["read", "write", "edit", "bash", "grep"],
    "disabled": []
  }
}
```

### 5.2 环境变量

| 变量 | 说明 |
|------|------|
| `OPENCODE_API_KEY` | API 密钥 |
| `OPENCODE_PROVIDER` | 模型提供商 |
| `OPENCODE_MODEL` | 模型名称 |
| `OPENCODE_BASE_URL` | 自定义 API 端点 |