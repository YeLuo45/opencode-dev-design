# Style Guide

> OpenCode 代码风格指南

## 1. TypeScript 规范

### 1.1 类型推断

优先使用类型推断，避免显式类型标注：

```typescript
// Good - 类型推断
const journal = await Bun.file(path).json();
const messages = [msg1, msg2, msg3].filter(Boolean);

// Bad - 过度标注
const journal: Journal = await Bun.file(path).json();
const messages: Message[] = [msg1, msg2, msg3].filter((m): m is Message => Boolean(m));
```

### 1.2 函数签名

```typescript
// Good - 简洁签名
function createMessage(role: MessageRole, content: string) {
  return { id: crypto.randomUUID(), role, content, timestamp: Date.now() };
}

// Bad - 过度复杂
interface MessageOptions {
  role: MessageRole;
  content: string;
}

function createMessage(options: MessageOptions): Message {
  return {
    id: crypto.randomUUID(),
    role: options.role,
    content: options.content,
    timestamp: Date.now(),
  };
}
```

### 1.3 避免 Any

```typescript
// Good - 具体类型
function handleEvent(event: KeyboardEvent) {
  if (event.key === "Enter") {
    // ...
  }
}

// Bad - any
function handleEvent(event: any) {
  if (event.key === "Enter") {
    // ...
  }
}
```

## 2. 命名规范

### 2.1 变量与函数

```typescript
// Good - 描述性名称
const sessionJournal = await Bun.file(journalPath).json();
async function compactContext() { }

// Bad - 模糊名称
const journal = await Bun.file(path).json();
async function compact() { }
```

### 2.2 常量

```typescript
// Good - 全大写 + 下划线
const MAX_TOKEN_COUNT = 200000;
const DEFAULT_PROVIDER = "anthropic";

// Bad - 命名不一致
const maxTokenCount = 200000;
const Provider = "anthropic";
```

## 3. 控制流

### 3.1 Early Return

```typescript
// Good - early return
function processMessage(msg: Message) {
  if (!msg.content) return;
  if (msg.role === "system") return;

  // 主逻辑...
}

// Bad - 嵌套 if
function processMessage(msg: Message) {
  if (msg.content) {
    if (msg.role !== "system") {
      // 主逻辑...
    }
  }
}
```

### 3.2 避免 Else

```typescript
// Good - 无 else
function getStatus(code: number) {
  if (code === 200) return "ok";
  if (code === 404) return "not found";
  return "unknown";
}

// Bad - else
function getStatus(code: number) {
  if (code === 200) {
    return "ok";
  } else if (code === 404) {
    return "not found";
  } else {
    return "unknown";
  }
}
```

## 4. 数组方法

### 4.1 链式操作

```typescript
// Good - 链式
const files = await glob("src/**/*.ts")
  .filter(f => !f.includes("test"))
  .map(f => f.replace("src", "lib"));

// Bad - for 循环
const files: string[] = [];
for (const f of await glob("src/**/*.ts")) {
  if (!f.includes("test")) {
    files.push(f.replace("src", "lib"));
  }
}
```

### 4.2 Type Guard

```typescript
// Good - 类型守卫
const validMessages = messages.filter((m): m is Message => {
  return m !== null && typeof m.content === "string";
});

// Bad - 断言
const validMessages = messages.filter(m => m !== null) as Message[];
```

## 5. 错误处理

### 5.1 避免 Try/Catch

```typescript
// Good - 避免 try/catch
const file = Bun.file(path);
if (!await file.exists()) return null;
const content = await file.json();

// Bad - try/catch
try {
  const content = await Bun.file(path).json();
} catch {
  return null;
}
```

### 5.2 Result 类型

```typescript
// 使用 Result 类型处理错误
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function readFile(path: string): Promise<Result<string>> {
  const file = Bun.file(path);
  if (!await file.exists()) {
    return { ok: false, error: new Error("File not found") };
  }
  return { ok: true, value: await file.text() };
}
```

## 6. Bun API

### 6.1 文件操作

```typescript
// Good - Bun.file()
const config = await Bun.file("config.json").json();
const content = await Bun.file("data.txt").text();

// Bad - fs/promises
import { readFile } from "fs/promises";
const config = JSON.parse(await readFile("config.json", "utf-8"));
```

### 6.2 文件写入

```typescript
// Good - Bun.write()
await Bun.write("output.txt", content);

// Bad - fs/promises
import { writeFile } from "fs/promises";
await writeFile("output.txt", content);
```

## 7. Schema (Drizzle)

### 7.1 字段命名

```typescript
// Good - snake_case
const table = sqliteTable("session", {
  id: text().primaryKey(),
  projectId: text().notNull(),
  createdAt: integer().notNull(),
});

// Bad - 重复定义
const table = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectID: text("project_id").notNull(),
  createdAt: integer("created_at").notNull(),
});
```

## 8. 导入顺序

```typescript
// 1. 内置模块
import { randomUUID } from "crypto";
import { basename, dirname } from "path";

// 2. 外部包
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/better-sqlite3";

// 3. 内部包
import { Config } from "@opencode/config";

// 4. 相对导入
import { Journal } from "./journal";
import type { Message } from "./types";
```