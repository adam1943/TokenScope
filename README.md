# TokenScope

中转站 / 网关场景下的大模型 API **验真工作台**：检查协议有没有被改写、参数有没有透传、Token 统计稳不稳，并按供应商验收口径给出性能 SLA 与效果评测视图。

这是静态页面，不发起真实压测，也不把 API Key 写进仓库。浏览器打开即可用。

仓库地址：<https://github.com/adam1943/TokenScope>

---

## 能做什么

### 1. 协议支持

验证网关是否按原厂协议接入，而不是悄悄转成另一套格式。

| 协议 | 路径 | 关注点 |
|---|---|---|
| OpenAI Chat Completions | `POST /v1/chat/completions` | `messages`、`tool_calls`、SSE `data:` + `[DONE]` |
| OpenAI Responses | `POST /v1/responses` | `input` / `instructions`、`max_output_tokens`、`previous_response_id` |
| Anthropic Messages | `POST /v1/messages` | 顶层 `system`、必填 `max_tokens`、`x-api-key`、named SSE |
| Google Gemini Native | `POST ...:generateContent` / `streamGenerateContent` | `contents[].parts`、角色 `user/model` |

还会核对：鉴权头是否匹配协议、`assistant` ↔ `model` 角色映射、工具参数是 JSON 字符串还是对象、流式信封有没有被改写。

### 2. Schema 一致性

同一份 JSON Schema，四家挂载点不同：

- Chat Completions：`response_format.json_schema`
- Responses：`text.format`
- Anthropic：`output_config.format`
- Gemini：`response_schema`（数组 `items` 必须带 `type`）

### 3. 参数透传与 Token Probe

看字段是被网关改写、被忽略，还是统计不稳。

- `tool_choice=none` 是否仍触发工具
- `stop` 是否真截断
- Chat Completions 的 `max_tokens` 到 Responses 有没有映射成 `max_output_tokens`
- 相同请求的 `prompt_tokens` 是否抖动
- 流式 `usage` 是否带回
- **响应一致性**：默认 `prompt=Hi`、`max_tokens=16`，重复 100 次，对比字段路径 + 类型，统计 `id` / `created` / `content` 稳定性

判定时区分：网关改写、参数不生效、能力缺口、Schema 漂移。看不到实际上游请求时，不能判改写。

### 4. 多模态与视频任务

- 视频理解：不支持时要有清晰错误码
- 视频生成：保留原厂 task id、媒体 URL、终态枚举（例如 Seedance 为 `succeeded`，不要只认 `completed`）

### 5. 供应商验收 · 性能压测

对齐 TokenHub Vendor Verifier（THVV）口径。不考会不会做题，考接口稳不稳、快不快。

- 输入档位：`1k / 9k / 16k / 32k / 64k / 128k / 200k`
- 并发梯度压测，指标含 TTFT（P50/P90 等）、TTLT、OTPS、成功率
- SLA 按 InputTokens（不含 cache）分档，例如 `<4K` 要求 TTFT P90 &lt; 5s
- OTPS：激活参数 &gt;10B 的 L1 ≥ 30 tok/s，L2 ≥ 10；≤10B ≥ 100
- 建议低并发预热 5 分钟，正式档采集 10–15 分钟
- 失败拆分：429 限流、超时、5xx、上下文溢出

报告结构：总体结论 → 并发梯度指标 → 失败分析 → 失败请求明细。

### 6. 供应商验收 · 效果评测

考答案质量是否落在基线的 ±2–4% 容差内。数据集是拆开能力的考卷，不是展示名单。

| 数据集 | 作用 |
|---|---|
| AIME25 / AIME26 | 竞赛数学，硬推理；repeats=16，看 pass@k |
| GPQA-Diamond | 研究生级科学问答 |
| MMLU-Pro | 多学科综合知识 |
| HLE | 极难综合题，需要独立 LLM Judge |
| SimpleQA | 事实准确性 / 幻觉，需要 Judge |
| LongBench v2 | 长上下文检索与理解 |
| τ²-Bench | 多轮 Agent（零售 / 电信 / 航空） |
| LiveCodeBench | 代码生成与单测 |
| SWE-Bench Mini / Pro | 真实仓库改 bug，接近工程落地 |

HLE / SimpleQA 没有 Judge 不能当验收结论；LiveCodeBench / SWE 建议 Docker。限流 429 应等待后续跑，而不是直接判失败。

报告结构：核心结论 → 稳定性 → 体验与性能 → 评测配置（凭证脱敏）→ 逐题证据 → 异常跳过。

### 7. 其他页面

- Provider 配置、模型能力矩阵
- 测试套件（连通性 / 透传 / Token / 视频 / 协议 / Schema）
- A/B Compare
- 客户问询：上传用例后写入本地知识库
- 报告中心：查看模拟运行结论

---

## 安装与打开

环境：现代浏览器（Chrome / Edge / Safari / Firefox）。无需 Node、无需构建。

### 方式 A：直接打开

```bash
git clone https://github.com/adam1943/TokenScope.git
cd TokenScope
```

用浏览器打开 `index.html`（`file://` 即可）。

### 方式 B：本地 HTTP（推荐）

部分浏览器对 `file://` 下的 ES 模块或本地存储更严格，建议起一个静态服务：

```bash
cd TokenScope
python3 -m http.server 8766
```

浏览器访问 <http://127.0.0.1:8766>

### 方式 C：任意静态托管

把仓库根目录（含 `index.html`、`app.js`、`data.js`、`styles.css`、`assets/`）放到 Nginx、GitHub Pages、对象存储静态网站即可，没有后端。

---

## 使用注意

- 页面里的运行结果是**工作台演示数据**，不会调用你的真实 API。
- 若在 Provider 表单填写 Key，只存在当前浏览器 `localStorage`（键 `tokenscope-v3`），不会上传、不会进 Git。
- 清站点数据或换浏览器后，本地改过的 Provider / 知识库会丢失，种子数据会重新加载。

## 仓库结构

```
index.html    # 页面壳
app.js        # 交互与视图
data.js       # 用例、协议、SLA、数据集
styles.css
assets/       # Logo
```
