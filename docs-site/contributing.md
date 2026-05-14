# Contributing

> OpenCode 贡献指南

## 1. 开发环境

### 1.1 前置要求

- Bun >= 1.0
- Node.js >= 18
- Git

### 1.2 克隆与安装

```bash
git clone https://github.com/anomalyco/opencode.git
cd opencode
bun install
```

### 1.3 开发命令

```bash
# 开发模式
bun dev

# 类型检查
bun typecheck

# 测试
bun test

# lint
bun lint
bun lint:fix
```

## 2. 项目结构

### 2.1 Monorepo 结构

```
opencode/
├── packages/
│   ├── opencode/     # CLI 入口
│   ├── core/        # 核心逻辑
│   ├── llm/         # LLM 提供商
│   ├── console/     # TUI
│   └── ...
├── github/          # GitHub Actions
├── infra/           # 基础设施
└── specs/           # 规范文档
```

### 2.2 包开发

每个包独立开发：

```bash
cd packages/core
bun typecheck
bun test
```

## 3. 提交规范

### 3.1 提交格式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### 3.2 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档 |
| `style` | 格式（不影响代码） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试 |
| `chore` | 构建/工具 |

### 3.3 示例

```
feat(llm): add Google provider support

- Add Google AI client
- Support Gemini models
- Add token counting

Closes #123
```

## 4. 测试

### 4.1 测试位置

```
packages/
└── core/
    ├── src/
    │   └── index.ts
    └── test/
        └── index.test.ts
```

### 4.2 运行测试

```bash
# 单个包
cd packages/core
bun test

# 所有包
bun test --filter='packages/**'

# 带 coverage
bun test --coverage
```

### 4.3 注意事项

- 不要从根目录运行测试（有 guard 检查）
- 避免 mock，尽可能测试实际实现
- 测试不能重复业务逻辑

## 5. 代码规范

### 5.1 TypeScript

- 避免 `any` 类型
- 使用类型推断
- 优先 Bun API

```typescript
// Good
const journal = await Bun.file(path).json();

// Bad
const journalPath = path.join(dir, "journal.json");
const journal = await Bun.file(journalPath).json();
```

### 5.2 函数组织

- 保持函数短小
- 不提前提取单用帮助函数
- 避免不必要的解构

```typescript
// Good
obj.a
obj.b

// Bad
const { a, b } = obj
```

### 5.3 控制流

- 避免 `else`
- 优先 early return

```typescript
// Good
function foo() {
  if (condition) return 1;
  return 2;
}
```

## 6. Pull Request

### 6.1 创建 PR

1. Fork 仓库
2. 创建功能分支：`git checkout -b feat/my-feature`
3. 开发并测试
4. 提交：`git commit -m "feat(...)"`
5. 推送：`git push -u origin feat/my-feature`
6. 创建 Pull Request

### 6.2 PR 模板

```markdown
## Description
Brief description of changes

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
```

## 7. 代码审查

### 7.1 审查要点

- 代码质量
- 测试覆盖
- 文档完整性
- 安全性
- 性能影响

### 7.2 审查流程

1. 自动化检查通过（CI）
2. 至少 1 人审查通过
3. 无未解决的评论
4. 分支是最新的

---

详见 [CONTRIBUTING.md](https://github.com/anomalyco/opencode/blob/main/CONTRIBUTING.md)