# 半人马·飞轮 (Centaur Flywheel) — 产品规划

> 最后更新：2026-04-15
> 状态：挂起 (Parked)，待资源就绪后恢复

---

## 一、产品定位

**一句话**：帮助中小外贸企业在 AI 搜索引擎（Perplexity、ChatGPT、Gemini、Kimi 等）中获得品牌曝光的桌面工具。

**核心逻辑**：GEO 扫描发现问题 → AI 生成优化内容 → 发布到目标平台 → 再次扫描验证效果 → 形成飞轮。

**目标用户**：没有专职 SEO/内容团队的中小外贸企业主或营销负责人。

---

## 二、当前状态 (v0.1 - MVP 骨架)

### 已完成

| 模块 | 状态 | 说明 |
|------|------|------|
| 项目框架 | ✅ 完成 | Electron 28 + React 18 + Zustand + Tailwind + Vite + TypeScript |
| 品牌档案 (Brand) | ✅ 完成 | 品牌名称/行业/关键词/竞品/禁忌词等，JSON 持久化 |
| 内容管理 (Content) | ✅ 完成 | 内容 CRUD、状态流转（idea→draft→reviewing→approved→published）|
| AI 内容生成 | ✅ 完成 | 基于品牌档案 + Gemini 生成 GEO 优化内容 |
| 设置页 (Settings) | ✅ 完成 | 多 Provider 切换（Gemini/vveai/自定义）、API Key 管理 |
| 五层记忆引擎 | ✅ 完成 | brand / preferences / context / learnings / geo-history，JSON 文件存储 |
| GEO 扫描 UI | ✅ 完成 | 多关键词输入、报告展示、历史记录 |
| 仪表盘 UI | ✅ 完成 | 统计卡片、快捷操作、活动流 |
| QeeClaw SDK | ✅ 就绪 | 17 模块 SDK 已集成，Bridge 封装完成，未接入主流程 |

### 未完成 / 占位

| 模块 | 状态 | 说明 |
|------|------|------|
| GEO 扫描后端 | ❌ Mock | scanner:scan 返回随机数据，需接 Perplexity/SerpAPI |
| 内容发布 | ❌ Stub | 仅改本地状态，未对接任何平台 API |
| 定时任务引擎 | ❌ 空壳 | schedule 配置可保存，但无执行器 |
| 仪表盘数据 | ❌ 空 | FlywheelStats 从未被计算填充 |
| 聊天界面 | ❌ 缺失 | IPC handler 存在，无前端 UI |
| 偏好/上下文编辑 | ❌ 缺失 | MemoryEngine 支持，无编辑页面 |
| 学习记录 | ❌ 未调用 | addLearning 方法存在但从未被触发 |
| 图片生成 | ❌ 未实现 | 设置项存在，功能未开发 |
| Settings 热更新 | ❌ Bug | 改 API Key 后需重启 app，GeminiClient 未重新初始化 |

---

## 三、产品迭代路线

### Phase 1 — 核心闭环 (GEO 扫描真实化)

**目标**：让"扫描→看到真实结果"这条路跑通，用户能看到自己品牌在 AI 搜索中的真实表现。

- [ ] 接入 Perplexity API，实现真实 AI 搜索查询
- [ ] 接入 SerpAPI 作为传统搜索对照
- [ ] 解析 AI 回答中的品牌提及、位置、情感倾向
- [ ] GEO 评分算法：基于提及率、位置、情感、来源权威度计算综合分
- [ ] 仪表盘数据自动聚合（从 geo-history 计算 stats）
- [ ] 修复 Settings 热更新 bug

**交付标准**：用户输入 3 个关键词，能在 30 秒内看到真实的 GEO 报告和评分。

### Phase 2 — 内容飞轮 (生成→发布→验证)

**目标**：AI 生成的内容能一键发布到目标平台，发布后自动触发扫描验证效果。

- [ ] 内容编辑器增强：富文本编辑、关键词高亮、GEO 优化建议实时提示
- [ ] 平台发布对接：WordPress REST API、Medium API、LinkedIn API
- [ ] 发布后自动触发 GEO 扫描，对比发布前后的品牌提及变化
- [ ] 内容表现追踪：将 GEO 扫描结果关联到具体内容
- [ ] 学习引擎激活：高表现内容自动记录到 learnings，影响后续生成策略

**交付标准**：用户从生成到发布到看到效果验证，全程不离开飞轮。

### Phase 3 — 自动化飞轮 (定时 + 智能)

**目标**：飞轮能自己转——定时扫描、自动生成、智能排期。

- [ ] 定时扫描引擎：cron 式调度，每日/每周自动扫描关键词
- [ ] 智能内容建议：基于扫描结果自动推荐应该写什么内容
- [ ] 发布排期：内容日历视图，支持定时发布
- [ ] 异常告警：品牌提及突然下降或出现负面情感时通知用户
- [ ] 竞品监控：同时扫描竞品关键词，对比分析

**交付标准**：用户一周只需打开飞轮 2-3 次审核内容，其余自动运行。

### Phase 4 — 平台化 (QeeClaw 接入)

**目标**：从单机工具升级为云端协作平台，接入半人马生态。

- [ ] QeeClaw Bridge 接入主流程：记忆云端同步、知识库检索
- [ ] 多用户/多品牌支持
- [ ] 聊天界面：自然语言驱动所有操作（"帮我扫描一下 XX 关键词"）
- [ ] 图片生成集成：为内容自动生成配图
- [ ] 数据导出：PDF 报告、Excel 数据

---

## 四、技术债务

1. **CJS/ESM 混用**：package.json 无 `"type": "module"`，postcss.config.js 触发 Node 警告
2. **Vite CJS API 弃用**：当前使用 Vite 5 的 CJS 构建，需迁移到 ESM
3. **无测试**：零测试覆盖，核心逻辑（GEO 评分、内容生成 prompt）需要单测
4. **无错误边界**：React 侧无 ErrorBoundary，Electron 侧无 crash reporter
5. **类型安全**：部分 IPC handler 参数用 `any`，需收紧类型

---

## 五、关键决策记录

| 日期 | 决策 | 原因 |
|------|------|------|
| 2026-04 | 选择 Electron 而非 Web | 目标用户是企业主，桌面 app 信任感更强；本地存储避免数据安全顾虑 |
| 2026-04 | Gemini 作为默认 AI 后端 | 性价比最优，通过 CF Worker 代理解决国内访问问题 |
| 2026-04 | JSON 文件存储而非 SQLite | MVP 阶段数据量小，JSON 开发效率高，后续可迁移 |
| 2026-04 | 五层记忆架构 | 参考人类记忆模型，让 AI 生成内容时有足够的品牌上下文 |
| 2026-04-15 | 项目挂起 | 优先级调整，待核心业务资源就绪后恢复 |

---

## 六、恢复开发时的第一步

1. 启动 Vite dev server：`npm run dev:vite`
2. 启动 Electron：`npm run dev:electron`（或 `npm run dev` 同时启动）
3. 从 Phase 1 第一项开始：接入 Perplexity API，替换 scanner mock
4. 注意检查 node_modules 是否需要重新安装（`npm install`）
