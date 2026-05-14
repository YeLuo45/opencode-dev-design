# Agents

> OpenCode 内置 Agent 系统

## 1. Agent 概述

OpenCode 提供三种内置 Agent：

| Agent | 说明 | 权限级别 |
|-------|------|---------|
| `build` | 默认开发 Agent | 完全访问 |
| `plan` | 分析规划 Agent | 只读，需确认 |
| `general` | 通用搜索 Agent | 中等权限 |

## 2. Agent 切换

### 2.1 Tab 键切换

在对话中使用 `Tab` 键快速切换 Agent：

```
User: 如何实现这个功能？

[Tab] Agent: build → plan → general → build
```

### 2.2 @ 符号调用

```bash
# 直接调用 general Agent
@general 搜索这个代码库中的所有 API 路由

# 切换到 plan Agent
@plan 分析这个函数的复杂度
```

## 3. Build Agent

### 3.1 特性

- 全权限访问文件系统
- 可执行任意 shell 命令
- 默认启用所有工具
- 适合快速开发迭代

### 3.2 系统提示

```typescript
const buildSystemPrompt = `You are OpenCode Build Agent.
You have full access to the filesystem and shell.
You can read, write, edit, and delete files.
You can run any shell commands.

Be careful with destructive operations.
Always prefer safe alternatives when available.`;
```

## 4. Plan Agent

### 4.1 特性

- 默认禁止文件编辑
- Shell 命令需要确认
- 适合代码探索和分析
- 可生成变更计划

### 4.2 系统提示

```typescript
const planSystemPrompt = `You are OpenCode Plan Agent.
You focus on analysis and planning.

Default restrictions:
- File edits are disabled by default
- Shell commands require user confirmation
- Ask before executing potentially dangerous operations

You excel at:
- Code exploration
- Complexity analysis
- Change planning
- Code review`;
```

## 5. General Agent

### 5.1 特性

- 用于复杂搜索任务
- 多步骤任务编排
- 内部使用
- 可通过 `@general` 调用

### 5.2 使用示例

```bash
# 搜索任务
@general 找出所有使用过时 API 的文件

# 多步骤任务
@general 分析这个项目的架构并生成文档
```

## 6. 自定义 Agent

### 6.1 Agent 定义

```typescript
import { createAgent } from "@opencode/core";

const myAgent = createAgent({
  name: "reviewer",
  description: "Code review agent",
  systemPrompt: `You are a code reviewer.
Focus on:
- Code quality
- Potential bugs
- Security issues
- Performance problems`,
  tools: ["read", "grep", "glob"],
  restrictions: {
    allowEdit: false,
    allowBash: false,
    confirmBash: true,
  },
});
```

### 6.2 注册 Agent

```typescript
import { registerAgent } from "@opencode/core";

registerAgent(myAgent);
```

---

## 7. Tool Access Control

### 7.1 工具权限矩阵

| 工具 | build | plan | general |
|------|-------|------|---------|
| read | ✅ | ✅ | ✅ |
| write | ✅ | ❌ | ❌ |
| edit | ✅ | ❌ | ✅ |
| bash | ✅ | ⚠️ | ✅ |
| grep | ✅ | ✅ | ✅ |
| glob | ✅ | ✅ | ✅ |

### 7.2 权限覆盖

```typescript
// 在 build 中临时禁用危险工具
@build [disable:bash] rm -rf /

// 在 plan 中临时允许编辑
@plan [enable:edit] 编辑这个文件
```

---

## 8. Context Management

### 8.1 上下文保留

Agent 保留对话历史直到上下文满：

```typescript
const contextLimit = {
  "claude-3-5-sonnet-latest": 200000,
  "claude-3-opus": 200000,
  "gpt-4-turbo": 128000,
}[model];
```

### 8.2 上下文压缩

当上下文接近限制时自动压缩：

```typescript
// 压缩策略
const compactStrategy = {
  // 保留最近 N 条消息
  keepRecentMessages: 10,
  // 保留系统消息
  preserveSystem: true,
  // 生成摘要
  summarize: true,
  // 摘要长度
  summaryTokens: 500,
};
```