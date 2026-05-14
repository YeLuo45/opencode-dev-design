# Client/Server Architecture

> OpenCode 客户端/服务器分离架构

## 1. 架构概述

```
┌─────────────────────────────────────────────────────────────┐
│                        Server                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Core     │  │     LLM     │  │   Journal   │        │
│  │   Engine    │  │   Engine    │  │   Storage   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  Port: 8080 (default)                                       │
└─────────────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │                    │                    │
         │ TCP/WebSocket       │ TCP/WebSocket       │
         │                    │                    │
┌────────┴────────┐  ┌────────┴────────┐  ┌────────┴────────┐
│   Console TUI   │  │   Desktop App   │  │   Web Client   │
│   (Terminal)    │  │   (Electron)    │  │   (Browser)    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## 2. 服务器模式

### 2.1 启动服务器

```bash
# 启动服务器（默认端口 8080）
opencode server

# 自定义端口
opencode server --port 9000

# 指定 host
opencode server --host 0.0.0.0

# 带认证
opencode server --api-key your-secret-key
```

### 2.2 服务器配置

```json
{
  "server": {
    "port": 8080,
    "host": "127.0.0.1",
    "auth": {
      "type": "api-key",
      "key": "${OPENCODE_API_KEY}"
    },
    "tls": {
      "enabled": true,
      "cert": "./certs/cert.pem",
      "key": "./certs/key.pem"
    }
  }
}
```

## 3. 客户端连接

### 3.1 连接服务器

```bash
# 连接远程服务器
opencode connect https://server.example.com:8080

# 带 API Key
opencode connect https://server.example.com:8080 --api-key xxx

# 本地连接
opencode connect localhost:8080
```

### 3.2 连接配置

```json
{
  "connections": {
    "remote": {
      "url": "https://server.example.com:8080",
      "apiKey": "${OPENCODE_API_KEY}"
    },
    "local": {
      "url": "localhost:8080"
    }
  }
}
```

## 4. WebSocket 协议

### 4.1 消息格式

```typescript
// 请求
interface Request {
  id: string;
  method: string;
  params?: unknown;
}

// 响应
interface Response {
  id: string;
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
}

// 通知
interface Notification {
  method: string;
  params?: unknown;
}
```

### 4.2 方法

| 方法 | 说明 |
|------|------|
| `session.start` | 启动新会话 |
| `session.send` | 发送消息 |
| `session.stream` | 流式响应 |
| `tool.call` | 调用工具 |
| `tool.list` | 列出工具 |

## 5. 用例

### 5.1 远程开发

```bash
# 在服务器上启动
ssh server
opencode server --port 8080

# 本地客户端连接
opencode connect server:8080
```

### 5.2 移动端使用

```bash
# 服务器运行在桌面
opencode server

# 移动设备连接
opencode connect desktop-ip:8080
```

### 5.3 团队共享

```bash
# 团队服务器
opencode server --api-key team-secret

# 团队成员连接
opencode connect team-server:8080 --api-key team-secret
```

## 6. 安全

### 6.1 认证

```typescript
// API Key 认证
const auth = {
  type: "api-key",
  key: await Bun.password.hash(process.env.OPENCODE_API_KEY),
};

// Token 认证
const auth = {
  type: "token",
  token: jwt.sign({ user: "admin" }, secret),
};
```

### 6.2 TLS 加密

```bash
# 生成证书
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# 启用 TLS
opencode server --tls --cert cert.pem --key key.pem
```