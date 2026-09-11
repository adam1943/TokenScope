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

数据保存在浏览器 `localStorage` 键 `tokenscope-v3`，不会把 API Key 发到外网。
