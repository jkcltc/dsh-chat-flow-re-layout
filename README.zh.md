# dsh-chat-flow-re-layout

DeepSeek Harness Web UI 的客户端布局插件：已完成的工具调用、上下文注入与
思考块在聊天流中横向堆叠为仅含名称的紧凑小块；运行中的卡片、流式思考与
正文段落保持原有的全宽垂直堆叠。

## 前后对比

**启用前** —— 每个工具调用与思考块都独占一个全宽行：

![启用前：默认纵向堆叠，每个工具调用独占一行](docs/before.png)

**启用后** —— 完成态的行横向堆叠为仅含名称的紧凑小块，同一轮对话只
占原来几分之一的纵向空间：

![启用后：已完成的工具调用与思考块在段落间横向堆叠为紧凑小块](docs/after.png)

## 工作原理

纯 CSS 注入，不改动任何组件：

- 聊天流列改造为可换行的横向 flex 容器；
- 按节点类型裁决宽度：已完成的工具调用 / 上下文注入 / 思考块收缩为
  内容宽度小块（`flex: 0 0 auto`），其余元素保持全宽行（`flex: 1 1 100%`）；
- 通过 `display: contents` 拆解 assistant-step 内部层级，使思考块与
  工具块在同一行混排；
- 运行状态条（`role="status"`，"Deep diving..."）始终独占流末尾的全宽行；
- 完成态小块隐藏摘要文本（class 后缀约定 `_summary` / `_separator` /
  `_sep` / `_fileLink`），运行中与 Cordis 交互卡片通过 `:has()` 恢复原样。

## 目录结构

```
dsh-chat-flow-re-layout/
├── package.json          # dsh-chat-flow-re-layout
├── LICENSE               # MIT
├── lib/
│   ├── index.js          # Node 半：空插件（ESM）
│   ├── client.js         # 浏览器半：ModuleLoader bundle，注入 <style>
│   └── types/            # 两半的类型声明
```

浏览器半为手写 ModuleLoader bundle（无构建步骤）：模块加载时把样式表注入
`<head>`，并以 `data-plugin-css` 标记防止重复注入。

## 安装

克隆本仓库，然后在仓库目录运行：

```sh
dsh plugin --profile web add .
```

在 profile 的 `cordis.patch.yml` 中添加行：

```yaml
- insert:
    - id: chat-flow-re-layout
      name: 'dsh-chat-flow-re-layout'
```

然后重启 `dsh web`。可以运行 `dsh --profile web --dump-config` 确认插件
已经进入最终组合配置。无需构建——手写的 ModuleLoader bundle 直接随
仓库提交。
