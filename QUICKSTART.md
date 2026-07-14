# 快速启动指南

## 🚀 5 分钟快速上手

### 第一步：安装插件（开发版）

1. **克隆仓库**
   ```bash
   git clone https://github.com/Zhen0507/obsidian-ai-excalidraw
   cd obsidian-ai-excalidraw
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建插件**
   ```bash
   npm run build
   ```

4. **复制到 Obsidian**
   - 打开你的 Obsidian 仓库文件夹
   - 进入 `.obsidian/plugins/` 目录
   - 创建 `obsidian-ai-excalidraw` 文件夹
   - 复制以下文件到该文件夹：
     - `main.js`
     - `manifest.json`
     - `styles.css`（如果有）

5. **在 Obsidian 中启用插件**
   - 打开 Obsidian 设置 → 社区插件
   - 找到 "AI Excalidraw Generator"
   - 点击启用

### 第二步：配置 AI 提供商

#### 🔷 使用 DeepSeek（推荐新手）

1. 访问 https://platform.deepseek.com
2. 注册账户（需要手机号）
3. 创建 API 密钥
4. 在 Obsidian 插件设置中：
   - 选择 "Active AI Provider" → DeepSeek
   - 粘贴你的 API 密钥
   - 保存设置

#### 🟠 使用 OpenAI

1. 访问 https://platform.openai.com
2. 创建 API 密钥
3. 设置支付方式（按量计费）
4. 在插件设置中配置

#### 🔵 使用阿里云百炼

1. 访问 https://dashscope.aliyuncs.com
2. 注册阿里云账户
3. 获取 API 密钥和应用 ID
4. 在插件设置中配置

#### 🌋 使用火山引擎

1. 访问火山引擎控制台
2. 创建 API 密钥
3. 在插件设置中配置

### 第三步：生成第一个图表

1. **打开 Obsidian**
   - 创建或打开任何笔记

2. **触发生成对话框**
   - 方法 A：按 `Ctrl+P`（Mac：`Cmd+P`），搜索 "生成 Excalidraw 图表"
   - 方法 B：点击左侧功能区的铅笔图标

3. **填写信息**
   ```
   描述: "创建一个简单的开始→结束流程图"
   风格: 选择 "手绘风格"
   ```

4. **点击生成**
   - 等待 AI 处理（通常 5-10 秒）
   - 看到"生成成功"提示

5. **插入到笔记**
   - 点击 "插入到笔记"
   - 图表会被添加到你的笔记中

## 📝 常见问题

### Q1: 如何修改已生成的图表？

**方法 1：直接编辑**
- 在 Obsidian 中找到图表代码块
- 点击"编辑"按钮用 Excalidraw 编辑

**方法 2：重新生成**
- 重新打开生成对话框
- 修改描述
- 点击"重新生成"

### Q2: API 密钥哪里获取？

**DeepSeek**: https://platform.deepseek.com/api_keys
**OpenAI**: https://platform.openai.com/api-keys
**阿里云**: https://dashscope.aliyuncs.com/
**火山引擎**: https://console.volcengine.com/

### Q3: 生成失败了怎么办？

常见原因和解决方法：

| 错误信息 | 原因 | 解决方案 |
|---------|------|--------|
| API 密钥未配置 | 没有设置 API 密钥 | 进入设置，添加有效的 API 密钥 |
| 连接超时 | 网络问题或服务不可用 | 检查网络，或尝试另一个 AI 提供商 |
| JSON 无效 | AI 输出格式有问题 | 简化描述，或尝试不同的措辞 |
| 配额已用尽 | API 调用次数超限或余额不足 | 查看服务的配额/账单设置 |

### Q4: 如何切换 AI 提供商？

1. 打开 Obsidian 设置
2. 找到 "AI Excalidraw Generator"
3. 在 "Active AI Provider" 下拉框选择新的提供商
4. 根据提示填写该提供商的配置
5. 点击保存

### Q5: 生成的图表质量不好怎么办？

**改善技巧：**

1. **改变描述方式**
   - ❌ "画一个系统"
   - ✅ "创建一个三层架构图：前���→后端→数据库"

2. **尝试不同的风格**
   - 手绘风格适合非正式场景
   - 细线条适合技术文档
   - 暗黑主题用于专业演示

3. **使用关键词**
   - "从左到右流动"
   - "顶部是输入，底部是输出"
   - "使用矩形表示步骤，菱形表示决策"

4. **分解复杂图表**
   - 不要一次描述太复杂的结构
   - 分成多个简单的图表
   - 后续可以合并

## 💡 最佳实践示例

### 例 1：生成流程图（推荐）

**输入：**
```
创建一个用户注册流程图：
1. 开始
2. 用户输入邮箱
3. 验证邮箱格式
4. 如果格式错误 → 显示错误，返回第2步
5. 如果格式正确 → 发送验证码
6. 用户输入验证码
7. 验证验证码
8. 成功 → 创建账户 → 结束
9. 失败 → 重试或返回
```

**风格：** 手绘风格

### 例 2：生成架构图（推荐）

**输入：**
```
绘制一个电商系统微服务架构图，包含：
- 顶部：用户客户端
- 中间层：API 网关
- 服务层：
  - 用户服务（用户数据库）
  - 商品服务（商品数据库）
  - 订单服务（订单数据库）
  - 支付服务（支付网关）
- 底部：共享消息队列和缓存
```

**风格：** 细线条

### 例 3：生成决策树（推荐）

**输入：**
```
创建一个故障排除决策树：
- 系统不工作？
  - 是 → 网络连接正常？
    - 是 → 服务启动了？
      - 是 → 检查日志
      - 否 → 启动服务
    - 否 → 检查网络
  - 否 → 系统运行正常
```

**风格：** 极简风格

## 🔧 高级配置

### 修改默认 AI 模型

编辑 `src/config/AIConfigManager.ts`，修改 `getModel()` 方法：

```typescript
case 'deepseek':
  return config?.model || 'deepseek-chat';  // 改为其他模型
case 'openai':
  return config?.model || 'gpt-4';  // 或 gpt-3.5-turbo
```

### 添加自定义样式

编辑 `src/styles/StyleManager.ts`，在 `styles` 对象中添加：

```typescript
'custom-style': {
  name: '自定义风格',
  description: '我的风格',
  roughness: 1.5,
  strokeWidth: 2,
  // ... 其他配置
}
```

### 调整提示词

编辑 `src/config/AIConfigManager.ts` 中的 `buildSystemPrompt()` 方法来优化 AI 输出。

## 📚 更多资源

- **Excalidraw 官网**: https://excalidraw.com/
- **Obsidian 插件开发**: https://docs.obsidian.md/
- **DeepSeek API 文档**: https://platform.deepseek.com/docs
- **OpenAI API 文档**: https://platform.openai.com/docs

## 🎯 下一步

1. ✅ 完成基本配置
2. ✅ 生成第一个图表
3. ⭐ 根据需要调整设置
4. 💡 尝试不同的 AI 提供商
5. 🚀 在工作中使用

## 📞 获得帮助

- 🐛 发现 Bug？提交 Issue
- 💬 有建议？讨论区发言
- 📖 需要帮助？查看文档

---

**祝你使用愉快！** 🎨✨
