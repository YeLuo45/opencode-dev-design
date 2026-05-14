# LSP Support

> OpenCode 内置 Language Server Protocol 支持

## 1. 概述

OpenCode 提供可选的 LSP 支持，用于增强代码理解能力：

- 符号跳转
- 类型提示
- 错误诊断
- 代码补全
- 重构建议

## 2. 配置

### 2.1 启用 LSP

```json
{
  "lsp": {
    "enabled": true,
    "servers": {
      "typescript": {
        "command": "tsserver",
        "filetypes": ["typescript", "javascript"]
      },
      "python": {
        "command": "python",
        "args": ["-m", "pyright"]
      }
    }
  }
}
```

### 2.2 语言服务器

| 语言 | 服务器 | 安装 |
|------|--------|------|
| TypeScript | tsserver/volar | 内置 |
| JavaScript | tsserver | 内置 |
| Python | pyright/pylance | 手动 |
| Rust | rust-analyzer | 手动 |
| Go | gopls | 手动 |

## 3. 功能

### 3.1 符号查找

```typescript
// 查找符号定义
const definition = await lsp.findDefinition({
  file: "src/index.ts",
  position: { line: 10, character: 5 },
});

// 查找符号引用
const references = await lsp.findReferences({
  file: "src/index.ts",
  position: { line: 10, character: 5 },
});
```

### 3.2 悬停信息

```typescript
const hover = await lsp.getHover({
  file: "src/index.ts",
  position: { line: 10, character: 5 },
});

// {
//   contents: "function foo(a: string): void",
//   range: { start, end }
// }
```

### 3.3 诊断

```typescript
// 获取文件诊断
const diagnostics = await lsp.getDiagnostics({
  file: "src/index.ts",
});

diagnostics.forEach(d => {
  console.log(`${d.severity}: ${d.message} (${d.range})`);
});
```

## 4. 自定义服务器

### 4.1 添加服务器

```json
{
  "lsp": {
    "servers": {
      "my-lang": {
        "command": "my-lsp-server",
        "args": ["--stdio"],
        "filetypes": ["my-lang"],
        "rootPatterns": ["my-lang.json"]
      }
    }
  }
}
```

### 4.2 调试 LSP

```bash
# 启用 LSP 日志
OPENCODE_LOG=lsp opencode

# 查看 LSP 通信
OPENCODE_TRACE=lsp opencode
```