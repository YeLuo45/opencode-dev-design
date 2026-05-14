# Core Systems

> OpenCode 核心子系统详解

## 1. Core Package (`packages/core`)

### 1.1 消息处理

```typescript
import { Message, MessageRole } from "@opencode/core";

// 消息结构
interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// 消息构建
const message = new Message({
  role: "user",
  content: "Hello, OpenCode!",
});
```

### 1.2 上下文管理

```typescript
import { ContextManager } from "@opencode/core";

const ctx = new ContextManager({
  maxTokens: 200000,
  strategy: "compact", // "compact" | "truncate" | "summarize"
});

ctx.addMessage(message);
await ctx.compact();
const context = ctx.getContext();
```

### 1.3 工具注册

```typescript
import { ToolRegistry } from "@opencode/core";

const registry = new ToolRegistry();

registry.register({
  name: "read",
  description: "Read file contents",
  parameters: {
    type: "object",
    properties: {
      path: { type: "string" },
      limit: { type: "number" },
    },
    required: ["path"],
  },
  handler: async ({ path, limit }) => {
    const content = await Bun.file(path).text();
    return limit ? content.slice(0, limit) : content;
  },
});
```

---

## 2. LLM Package (`packages/llm`)

### 2.1 提供商实现

```typescript
import { createLLMClient } from "@opencode/llm";

// Anthropic
const anthropic = createLLMClient({
  provider: "anthropic",
  model: "claude-3-5-sonnet-latest",
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// OpenAI
const openai = createLLMClient({
  provider: "openai",
  model: "gpt-4-turbo",
  apiKey: process.env.OPENAI_API_KEY,
});

// Google
const google = createLLMClient({
  provider: "google",
  model: "gemini-pro",
  apiKey: process.env.GOOGLE_API_KEY,
});

// Local
const local = createLLMClient({
  provider: "local",
  baseUrl: "http://localhost:11434/v1",
  apiKey: "ollama",
});
```

### 2.2 流式调用

```typescript
const stream = await llm.stream("Explain this code");

for await (const chunk of stream) {
  process.stdout.write(chunk);
}
```

### 2.3 Token 计算

```typescript
const count = await llm.countTokens("Hello, world!");
console.log(`Tokens: ${count}`); // ~4 tokens
```

---

## 3. Console Package (`packages/console`)

### 3.1 TUI 渲染

```typescript
import { createConsole } from "@opencode/console";

const console = createConsole({
  theme: "dark",
  layout: "horizontal",
});

console.render({
  type: "chat",
  messages: [...messages],
  input: {
    placeholder: "Ask OpenCode...",
    autofocus: true,
  },
});
```

### 3.2 主题支持

```typescript
// 自定义主题
console.setTheme({
  colors: {
    background: "#0d1117",
    foreground: "#c9d1d9",
    accent: "#7c3aed",
    error: "#f85149",
    success: "#3fb950",
  },
  font: {
    family: "JetBrains Mono",
    size: 14,
  },
});
```

### 3.3 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Tab` | 切换 Agent |
| `Ctrl+C` | 中断生成 |
| `Ctrl+L` | 清除对话 |
| `Ctrl+/` | 打开命令面板 |
| `Esc` | 关闭面板 |

---

## 4. Journal System

### 4.1 会话记录

```typescript
import { Journal } from "@opencode/core";

const journal = new Journal({
  path: "~/.opencode/journal",
  maxSize: 100 * 1024 * 1024, // 100MB
});

// 记录消息
await journal.write({
  type: "message",
  data: { role: "user", content: "Hello" },
});

// 记录工具调用
await journal.write({
  type: "tool_call",
  data: { name: "read", arguments: { path: "src/index.ts" } },
});

// 记录响应
await journal.write({
  type: "response",
  data: { content: "File contents..." },
});
```

### 4.2 会话恢复

```typescript
// 列出历史会话
const sessions = await journal.listSessions();

// 恢复会话
const session = await journal.getSession("session-id");
for (const entry of session.entries()) {
  console.log(entry);
}
```

---

## 5. Configuration System

### 5.1 配置加载

```typescript
import { loadConfig } from "@opencode/core";

const config = await loadConfig({
  paths: [
    "~/.opencode/config.json",
    "./opencode.json",
  ],
  defaults: {
    provider: "anthropic",
    model: "claude-3-5-sonnet-latest",
    theme: "dark",
  },
});
```

### 5.2 配置验证

```typescript
import { validateConfig } from "@opencode/core";

const result = validateConfig(config);
if (!result.valid) {
  console.error("Config errors:", result.errors);
}
```

---

## 6. Plugin System

### 6.1 插件接口

```typescript
import type { Plugin } from "@opencode/core";

export interface Plugin {
  name: string;
  version: string;
  setup: (api: OpenCodeAPI) => void | Promise<void>;
  teardown?: () => void | Promise<void>;
}

export interface OpenCodeAPI {
  registerTool: (tool: ToolDefinition) => void;
  registerProvider: (provider: ProviderDefinition) => void;
  hook: (name: string, handler: HookHandler) => void;
  config: {
    get: <T>(key: string) => T;
    set: <T>(key: string, value: T) => void;
  };
}
```

### 6.2 插件加载

```typescript
// 从目录加载
const plugins = await loadPlugins([
  "~/.opencode/plugins/my-plugin",
  "./plugins/local-plugin",
]);

// 启用插件
for (const plugin of plugins) {
  await plugin.setup(api);
}
```