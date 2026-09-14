# TokenScope

大模型 API 兼容性、协议支持与原厂参数透传测试工作台。静态页面，可用 `file://` 直接打开。

## 打开

用浏览器打开 [`index.html`](index.html)，或在目录里起一个本地服务：

```bash
python3 -m http.server 8766
```

然后访问 http://127.0.0.1:8766

## 功能

- Provider 配置与模型能力矩阵（含原厂标识）
- Token Probe：参数透传、Token 一致性、响应体结构稳定性
- 测试套件：文本 / 视频 / 协议分类
- 协议测试：OpenAI Chat Completions、OpenAI Responses、Anthropic Messages、Gemini Native、Schema 一致性
- 客户问询：上传用例后写入文档知识库
- 报告中心与文档说明（含 VOD 区域开通手册）
- 性能压测：1k–200k 档位 × 并发梯度，TTFT P50/P90 与 OTPS SLA（对齐 THVV）
- 效果评测：AIME / GPQA / HLE / MMLU-Pro / τ²-Bench / LongBench / SWE 等 11 数据集

供应商验收口径参考 TokenHub Vendor Verifier（THVV）：perf 四章报告、eval 六章报告、凭证脱敏。本仓库是静态工作台，不发起真实压测，也不保存 API Key。

数据保存在浏览器 `localStorage` 键 `tokenscope-v3`，不会把 API Key 发到外网。
