# SDK

> OpenCode JavaScript/TypeScript SDK

## 1. 安装

```bash
npm install @opencode/sdk
# 或
bun add @opencode/sdk
```

## 2. 基本使用

### 2.1 初始化

```typescript
import { OpenCode } from "@opencode/sdk";

const client = new OpenCode({
  apiKey: process.env.OPENCODE_API_KEY,
  serverUrl: "http://localhost:8080",
});
```

### 2.2 发送消息

```typescript
const response = await client.complete({
  prompt: "Explain this code",
  context: {
    files: ["./src/index.ts"],
  },
});

console.log(response.text);
```

### 2.3 流式响应

```typescript
const stream = await client.completeStream({
  prompt: "Write a function",
  context: {
    files: ["./src/utils.ts"],
  },
});

for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

---

## 3. 工具调用

### 3.1 注册工具

```typescript
client.registerTool({
  name: "my-tool",
  description: "A custom tool",
  parameters: {
    type: "object",
    properties: {
      input: { type: "string" },
    },
    required: ["input"],
  },
  handler: async ({ input }) => {
    return { result: process(input) };
  },
});
```

### 3.2 调用工具

```typescript
const result = await client.callTool({
  name: "read",
  arguments: { path: "./README.md" },
});
```

---

## 4. 会话管理

### 4.1 创建会话

```typescript
const session = await client.sessions.create({
  agent: "build",
  model: "claude-3-5-sonnet-latest",
  tools: ["read", "write", "edit", "bash"],
});

console.log(session.id);
```

### 4.2 发送消息

```typescript
const response = await session.send({
  role: "user",
  content: "Hello!",
});
```

### 4.3 列出会话

```typescript
const sessions = await client.sessions.list();
for (const session of sessions) {
  console.log(`${session.id} - ${session.createdAt}`);
}
```

### 4.4 恢复会话

```typescript
const session = await client.sessions.get("session-id");
await session.send({ role: "user", content: "Continue" });
```

---

## 5. 配置选项

### 5.1 客户端配置

```typescript
const client = new OpenCode({
  // 服务器地址
  serverUrl: "http://localhost:8080",

  // API 密钥
  apiKey: "your-api-key",

  // 超时（毫秒）
  timeout: 60000,

  // 重试次数
  retries: 3,

  // 默认模型
  model: "claude-3-5-sonnet-latest",

  // 默认工具
  tools: ["read", "grep", "glob"],
});
```

### 5.2 请求配置

```typescript
const response = await client.complete({
  prompt: "...",
  model: "claude-3-opus", // 覆盖默认模型
  temperature: 0.7,
  maxTokens: 2000,
  tools: ["read", "write"], // 覆盖默认工具
});
```

---

## 6. 类型定义

### 6.1 核心类型

```typescript
interface ClientOptions {
  serverUrl: string;
  apiKey?: string;
  timeout?: number;
  retries?: number;
}

interface CompleteOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: string[];
  context?: Context;
}

interface StreamChunk {
  text: string;
  done: boolean;
  usage?: TokenUsage;
}
```

### 6.2 会话类型

```typescript
interface Session {
  id: string;
  agent: "build" | "plan" | "general";
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}
```

---

## 7. 错误处理

### 7.1 错误类型

```typescript
try {
  await client.complete({ prompt: "..." });
} catch (error) {
  if (error instanceof OpenCodeError) {
    console.error(`Error ${error.code}: ${error.message}`);
  }
}
```

### 7.2 错误代码

| 代码 | 说明 |
|------|------|
| `AUTH_ERROR` | 认证失败 |
| `TOOL_NOT_FOUND` | 工具不存在 |
| `TOOL_ERROR` | 工具执行错误 |
| `MODEL_ERROR` | 模型调用错误 |
| `TIMEOUT` | 请求超时 |
| `SERVER_ERROR` | 服务器错误 |