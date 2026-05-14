# Tool System

> OpenCode 工具系统：文件系统、Shell、搜索

## 1. 内置工具分类

### 1.1 文件操作 (6)

| 工具 | 说明 | 签名 |
|------|------|------|
| `read` | 读取文件 | `(path: string, limit?: number) => string` |
| `write` | 写入文件 | `(path: string, content: string) => void` |
| `edit` | 编辑文件 | `(path: string, old: string, new: string) => void` |
| `glob` | 文件匹配 | `(pattern: string) => string[]` |
| `mkdir` | 创建目录 | `(path: string) => void` |
| `rm` | 删除文件 | `(path: string, recursive?: boolean) => void` |

### 1.2 Shell 执行 (3)

| 工具 | 说明 | 签名 |
|------|------|------|
| `bash` | 执行命令 | `(cmd: string, timeout?: number) => BashResult` |
| `spawn` | 异步进程 | `(cmd: string[], opts?: SpawnOptions) => ChildProcess` |
| `kill` | 终止进程 | `(pid: number) => void` |

### 1.3 代码搜索 (4)

| 工具 | 说明 | 签名 |
|------|------|------|
| `grep` | 正则搜索 | `(pattern: string, files?: string[]) => GrepResult[]` |
| `find` | 文件查找 | `(name: string, dir?: string) => string[]` |
| `search` | Web 搜索 | `(query: string) => SearchResult[]` |
| `look` | 符号查找 | `(symbol: string) => Definition[]` |

### 1.4 Git 操作 (5)

| 工具 | 说明 | 签名 |
|------|------|------|
| `git-status` | 状态 | `() => GitStatus` |
| `git-diff` | 差异 | `(path?: string) => Diff[]` |
| `git-log` | 提交历史 | `(n?: number) => Commit[]` |
| `git-branch` | 分支 | `() => Branch[]` |
| `git-blame` | 逐行追溯 | `(path: string) => Blame[]` |

---

## 2. 工具注册

### 2.1 注册内置工具

```typescript
import { registerBuiltinTools } from "@opencode/core";

const api = createAPI();
registerBuiltinTools(api);

// 启用/禁用
api.tools.enable("git-commit");
api.tools.disable("bash");
```

### 2.2 注册自定义工具

```typescript
api.registerTool({
  name: "my-tool",
  description: "Custom tool description",
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

---

## 3. Shell 工具

### 3.1 基本使用

```typescript
// 简单命令
const result = await bash("ls -la");

// 带超时
const result = await bash("npm install", { timeout: 30000 });

// 工作目录
const result = await bash("npm test", { cwd: "/project" });
```

### 3.2 结果结构

```typescript
interface BashResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  signal?: string;
  duration: number;
}
```

### 3.3 管道支持

```typescript
// 管道命令
const result = await bash("cat file.txt | grep pattern | head -n 10");

// 重定向
const result = await bash("command > output.txt 2>&1");
```

---

## 4. 搜索工具

### 4.1 Grep

```typescript
const results = await grep({
  pattern: "function \\w+\\(.*\\)",
  files: ["src/**/*.ts"],
  context: 2, // 显示上下文行数
  caseSensitive: false,
});

// 结果
interface GrepResult {
  file: string;
  line: number;
  column: number;
  content: string;
  context: string[];
}
```

### 4.2 Glob

```typescript
const files = await glob("src/**/*.{ts,js}");
const files = await glob("**/*.test.ts");
```

### 4.3 Web Search

```typescript
const results = await search({
  query: "OpenCode AI coding agent",
  limit: 10,
});

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}
```

---

## 5. Git 工具

### 5.1 Git Status

```typescript
const status = await gitStatus();

interface GitStatus {
  branch: string;
  staged: FileChange[];
  modified: FileChange[];
  untracked: string[];
  ahead: number;
  behind: number;
}
```

### 5.2 Git Diff

```typescript
// 所有变更
const diffs = await gitDiff();

// 单文件
const diffs = await gitDiff("src/index.ts");

interface Diff {
  file: string;
  hunks: Hunk[];
}
```

---

## 6. 工具权限

### 6.1 权限级别

```typescript
enum ToolPermission {
  ALLOW = "allow",
  DENY = "deny",
  CONFIRM = "confirm",  // 需要用户确认
}
```

### 6.2 配置权限

```json
{
  "tools": {
    "permissions": {
      "bash": "confirm",
      "rm": "confirm",
      "write": "allow",
      "read": "allow"
    }
  }
}
```