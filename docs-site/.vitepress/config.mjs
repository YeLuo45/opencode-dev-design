import { defineConfig } from "vitepress";

export default defineConfig({
  title: "OpenCode Dev Design",
  description: "OpenCode 开源 AI 编程助手设计文档 — 100% 开源、Provider 无关",

  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    ["meta", { name: "theme-color", content: "#7c3aed" }],
  ],

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Architecture", link: "/architecture" },
      { text: "Core Systems", link: "/core-systems" },
      { text: "Agents", link: "/agents" },
      { text: "SDK", link: "/sdk" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Home", link: "/" },
          { text: "Architecture", link: "/architecture" },
          { text: "Core Systems", link: "/core-systems" },
        ],
      },
      {
        text: "Features",
        items: [
          { text: "Agents", link: "/agents" },
          { text: "Tool System", link: "/tool-system" },
          { text: "LSP Support", link: "/lsp-support" },
          { text: "Client/Server", link: "/client-server" },
        ],
      },
      {
        text: "Development",
        items: [
          { text: "SDK", link: "/sdk" },
          { text: "Contributing", link: "/contributing" },
          { text: "Style Guide", link: "/style-guide" },
        ],
      },
    ],

    socialLinks: [
      { icon: "discord", link: "https://discord.gg/opencode" },
      { icon: "x", link: "https://x.com/opencode" },
      { icon: "github", link: "https://github.com/anomalyco/opencode" },
    ],
  },

  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
  },

  lastUpdated: true,
});