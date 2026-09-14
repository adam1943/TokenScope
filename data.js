window.TokenScopeData = (() => {
  const providers = [
    { id:'openai', brand:'openai', name:'OpenAI', type:'OpenAI 兼容 / Responses', endpoint:'https://api.openai.com/v1', models:3, status:'正常', key:'', checked:'今天 09:40' },
    { id:'anthropic', brand:'anthropic', name:'Anthropic', type:'Messages 原厂', endpoint:'https://api.anthropic.com/v1', models:2, status:'正常', key:'', checked:'今天 09:41' },
    { id:'google', brand:'google', name:'Google Gemini', type:'generateContent 原厂', endpoint:'https://generativelanguage.googleapis.com/v1beta', models:2, status:'正常', key:'', checked:'今天 09:42' },
    { id:'qianfan', brand:'baidu', name:'百度千帆', type:'OpenAI 兼容 + 视频任务', endpoint:'https://qianfan.baidubce.com/v2', models:3, status:'需检查', key:'', checked:'今天 10:18' },
    { id:'vod-bj', brand:'baidu', name:'百度智能云 VOD 北京', type:'OpenAI 兼容 / 多模态', endpoint:'https://vod.bj.baidubce.com', models:1, status:'正常', key:'', checked:'今天 09:55' },
    { id:'vod-hk', brand:'baidu', name:'VOD 国际站香港', type:'Gemini Native', endpoint:'https://vod2.hkg.baidubce.com', models:1, status:'正常', key:'', checked:'昨天 18:12' },
    { id:'vod-us', brand:'baidu', name:'VOD 美国站', type:'Gemini Native', endpoint:'https://overseas.exp.bcevod.com', models:1, status:'正常', key:'', checked:'昨天 18:14' },
    { id:'vod-de', brand:'baidu', name:'VOD 德国站', type:'Anthropic Messages', endpoint:'https://overseas-de.exp.bcevod.com', models:1, status:'正常', key:'', checked:'昨天 18:16' },
    { id:'ark', brand:'volc', name:'火山方舟', type:'Chat + 视频任务原厂', endpoint:'https://ark.cn-beijing.volces.com/api/v3', models:4, status:'正常', key:'', checked:'今天 10:02' }
  ];

  const S = 'support', P = 'partial', U = 'unsupported', K = 'unknown';
  const models = [
    { id:'gpt-4o', name:'gpt-4o', provider:'OpenAI', brand:'openai', kind:'文本 / 视觉', modality:'text', context:'128K', tags:['Chat Completions','Responses','tools','视觉'], protocols:['openai-chat','openai-responses'], capability:{stream:S, tools:S, video:P, schema:S, usage:S} },
    { id:'gpt-4.1', name:'gpt-4.1', provider:'OpenAI', brand:'openai', kind:'文本', modality:'text', context:'1M', tags:['Chat Completions','Responses','JSON Schema'], protocols:['openai-chat','openai-responses'], capability:{stream:S, tools:S, video:U, schema:S, usage:S} },
    { id:'o4-mini', name:'o4-mini', provider:'OpenAI', brand:'openai', kind:'文本', modality:'text', context:'200K', tags:['推理','Responses'], protocols:['openai-chat','openai-responses'], capability:{stream:S, tools:S, video:U, schema:S, usage:S} },
    { id:'claude-3-5-sonnet', name:'claude-3.5-sonnet', provider:'Anthropic', brand:'anthropic', kind:'文本 / 视觉', modality:'text', context:'200K', tags:['Messages','tools','thinking'], protocols:['anthropic'], capability:{stream:S, tools:S, video:U, schema:S, usage:S} },
    { id:'claude-sonnet-4', name:'claude-sonnet-4', provider:'Anthropic', brand:'anthropic', kind:'文本 / 视觉', modality:'text', context:'200K', tags:['Messages','output_config'], protocols:['anthropic'], capability:{stream:S, tools:S, video:U, schema:S, usage:S} },
    { id:'gemini-2.5-pro', name:'gemini-2.5-pro', provider:'Google Gemini', brand:'google', kind:'文本 / 视觉', modality:'text', context:'1M', tags:['generateContent','response_schema'], protocols:['gemini'], capability:{stream:S, tools:S, video:P, schema:S, usage:S} },
    { id:'gemini-2.0-flash', name:'gemini-2.0-flash', provider:'Google Gemini', brand:'google', kind:'文本 / 视觉', modality:'text', context:'1M', tags:['streamGenerateContent'], protocols:['gemini'], capability:{stream:S, tools:S, video:P, schema:P, usage:S} },
    { id:'ernie-4.5-turbo-128k', name:'ernie-4.5-turbo-128k', provider:'百度千帆', brand:'baidu', kind:'文本', modality:'text', context:'128K', tags:['OpenAI 兼容'], protocols:['openai-chat'], capability:{stream:S, tools:P, video:U, schema:P, usage:P} },
    { id:'qianfan-vl-v1', name:'qianfan-vl-v1', provider:'百度千帆', brand:'baidu', kind:'视觉', modality:'vision', context:'32K', tags:['流式','tools','JSON Schema'], protocols:['openai-chat'], capability:{stream:S, tools:S, video:U, schema:P, usage:P} },
    { id:'KO1', name:'KO1', provider:'百度千帆', brand:'baidu', kind:'视频生成', modality:'video', context:'—', tags:['omni-video','task_id'], protocols:['qianfan-video'], capability:{stream:U, tools:U, video:S, schema:K, usage:P} },
    { id:'G3FP', name:'G3FP', provider:'百度智能云 VOD 北京', brand:'baidu', kind:'文本 / 视觉', modality:'text', context:'1M', tags:['VOD Chat Completions'], protocols:['openai-chat'], capability:{stream:S, tools:P, video:P, schema:P, usage:S} },
    { id:'BG', name:'BG', provider:'VOD 国际站香港', brand:'baidu', kind:'文本 / 视觉', modality:'text', context:'1M', tags:['generateContent'], protocols:['gemini'], capability:{stream:S, tools:P, video:U, schema:P, usage:P} },
    { id:'BGL', name:'BGL', provider:'VOD 德国站', brand:'baidu', kind:'文本', modality:'text', context:'200K', tags:['Messages'], protocols:['anthropic'], capability:{stream:S, tools:P, video:U, schema:P, usage:P} },
    { id:'doubao-seed-1-6', name:'doubao-seed-1.6', provider:'火山方舟', brand:'volc', kind:'文本 / 视觉', modality:'text', context:'256K', tags:['Chat Completions','tool_choice'], protocols:['openai-chat'], capability:{stream:S, tools:S, video:P, schema:S, usage:S} },
    { id:'doubao-seed-2-5', name:'doubao-seed-2.5', provider:'火山方舟', brand:'volc', kind:'文本 / 视觉', modality:'text', context:'128K', tags:['流式','tools'], protocols:['openai-chat'], capability:{stream:S, tools:P, video:U, schema:S, usage:S} },
    { id:'seedance-1-0', name:'doubao-seedance-1-0-pro', provider:'火山方舟', brand:'volc', kind:'视频生成', modality:'video', context:'—', tags:['cgt task id','video_url'], protocols:['ark-video'], capability:{stream:U, tools:U, video:S, schema:K, usage:S} },
    { id:'seedance-2-0', name:'doubao-seedance-2-0', provider:'火山方舟', brand:'volc', kind:'视频生成', modality:'video', context:'—', tags:['generate_audio','1080p'], protocols:['ark-video'], capability:{stream:U, tools:P, video:S, schema:K, usage:S} }
  ];

  const cases = [
    {
      id:'as-cons-001', code:'TK-010', name:'响应一致性测试：极短输入/输出',
      category:'Token Probe', model:'qianfan-vl-v1', provider:'百度千帆', status:'fail',
      summary:'默认 prompt=Hi、max_tokens=16，重复 100 次。字段结构出现 3 种样式，id/created/content 均不稳定。第 1 次尝试 · 第 1 轮 ✗',
      type:'consistency', modality:'text', protocol:'openai-chat',
      params:{ prompt:'Hi', max_tokens:16, n:100, attempts:'第1次尝试 · 第1轮' }
    },
    {
      id:'as-is6jhv0sez', code:'TP-001', name:'tool_choice=none 行为验证',
      category:'参数透传', model:'qianfan-vl-v1', provider:'百度千帆', status:'fail',
      summary:'期望不调用工具，实际发生了工具调用；疑似网关把 tool_choice 改写为 auto。',
      type:'text', modality:'text', protocol:'openai-chat'
    },
    {
      id:'as-6gwwxbi5qg', code:'TP-003', name:'stop 参数生效性',
      category:'参数透传', model:'qianfan-vl-v1', provider:'百度千帆', status:'fail',
      summary:'stop 序列已发送，但输出仍越过“橘子”。',
      type:'stop', modality:'text', protocol:'openai-chat'
    },
    {
      id:'as-gxmvj1d7ge', code:'TK-004', name:'Prompt Token 一致性',
      category:'Token Probe', model:'qianfan-vl-v1', provider:'百度千帆', status:'fail',
      summary:'相同请求出现 86 / 87 / 89 三种 prompt_tokens。',
      type:'token', modality:'text', protocol:'openai-chat'
    },
    {
      id:'as-ykyg3ew1n1', code:'TK-005', name:'流式 usage 透传',
      category:'Token Probe', model:'gpt-4o', provider:'OpenAI', status:'pass',
      summary:'stream_options.include_usage 在最后一个 chunk 正常返回 usage。',
      type:'text', modality:'text', protocol:'openai-chat'
    },
    {
      id:'as-vjb32gh0ze', code:'MM-002', name:'视频理解能力探测',
      category:'多模态', model:'qianfan-vl-v1', provider:'百度千帆', status:'warn',
      summary:'当前模型不支持视频理解，错误码清晰，判定为能力缺口而非网关改写。',
      type:'video-understanding', modality:'vision', protocol:'openai-chat'
    },
    {
      id:'as-ykyg3ewvd6', code:'VD-006', name:'Seedance 原厂任务链路',
      category:'视频生成', model:'seedance-1-0', provider:'火山方舟', status:'pass',
      summary:'cgt task id 与原厂 video_url 均保留，状态值为 succeeded。',
      type:'video', modality:'video', protocol:'ark-video'
    },
    {
      id:'as-px-001', code:'PX-001', name:'OpenAI Chat Completions 握手',
      category:'协议支持', model:'gpt-4o', provider:'OpenAI', status:'pass',
      summary:'POST /v1/chat/completions 返回 object=chat.completion，choices[0].message 结构完整。',
      type:'protocol', modality:'text', protocol:'openai-chat'
    },
    {
      id:'as-px-002', code:'PX-002', name:'Google Gemini Native generateContent',
      category:'协议支持', model:'gemini-2.5-pro', provider:'Google Gemini', status:'pass',
      summary:'contents[].parts 与 role=user/model 被正确接受，未误转成 messages。',
      type:'protocol', modality:'text', protocol:'gemini'
    },
    {
      id:'as-px-003', code:'PX-003', name:'Gemini streamGenerateContent SSE',
      category:'协议支持', model:'gemini-2.0-flash', provider:'Google Gemini', status:'warn',
      summary:'流式 chunk 可用，但网关把 named SSE 转成了 OpenAI data: 行，丢失 candidates[0].finishReason。',
      type:'protocol', modality:'text', protocol:'gemini'
    },
    {
      id:'as-px-004', code:'PX-004', name:'Anthropic Messages 协议',
      category:'协议支持', model:'claude-3-5-sonnet', provider:'Anthropic', status:'pass',
      summary:'system 顶层字段、max_tokens 必填、x-api-key 鉴权均按原厂协议通过。',
      type:'protocol', modality:'text', protocol:'anthropic'
    },
    {
      id:'as-px-005', code:'PX-005', name:'OpenAI Responses 协议',
      category:'协议支持', model:'gpt-4.1', provider:'OpenAI', status:'warn',
      summary:'POST /v1/responses 可用；previous_response_id 被忽略，多轮需自管 input。',
      type:'protocol', modality:'text', protocol:'openai-responses'
    },
    {
      id:'as-px-006', code:'PX-006', name:'Schema 一致性 · Chat Completions json_schema',
      category:'Schema 一致性', model:'gpt-4o', provider:'OpenAI', status:'pass',
      summary:'response_format.json_schema.strict=true 输出完全匹配 schema。',
      type:'schema', modality:'text', protocol:'openai-chat'
    },
    {
      id:'as-px-007', code:'PX-007', name:'Schema 一致性 · Responses text.format',
      category:'Schema 一致性', model:'gpt-4.1', provider:'OpenAI', status:'pass',
      summary:'text.format.type=json_schema 与 Chat Completions 的 response_format 字段路径不同，但输出一致。',
      type:'schema', modality:'text', protocol:'openai-responses'
    },
    {
      id:'as-px-008', code:'PX-008', name:'Schema 一致性 · Anthropic output_config.format',
      category:'Schema 一致性', model:'claude-sonnet-4', provider:'Anthropic', status:'pass',
      summary:'output_config.format 约束解码生效；不接受 name 字段。',
      type:'schema', modality:'text', protocol:'anthropic'
    },
    {
      id:'as-px-009', code:'PX-009', name:'Schema 一致性 · Gemini response_schema',
      category:'Schema 一致性', model:'gemini-2.5-pro', provider:'Google Gemini', status:'fail',
      summary:'items:{} 被 Gemini 拒绝，必须给数组元素显式 type。网关未做 schema 归一化。',
      type:'schema', modality:'text', protocol:'gemini'
    },
    {
      id:'as-px-010', code:'PX-010', name:'工具调用参数编码',
      category:'协议支持', model:'claude-3-5-sonnet', provider:'Anthropic', status:'fail',
      summary:'OpenAI arguments 是 JSON 字符串，Anthropic input 是对象。网关把对象原样塞进 arguments，下游解析失败。',
      type:'protocol', modality:'text', protocol:'anthropic'
    },
    {
      id:'as-px-011', code:'PX-011', name:'角色映射 assistant ↔ model',
      category:'协议支持', model:'gemini-2.5-pro', provider:'Google Gemini', status:'pass',
      summary:'历史里的 assistant 被正确映射为 Gemini role=model。',
      type:'protocol', modality:'text', protocol:'gemini'
    },
    {
      id:'as-px-012', code:'PX-012', name:'鉴权头协议匹配',
      category:'协议支持', model:'claude-3-5-sonnet', provider:'Anthropic', status:'warn',
      summary:'向 Messages 端点发送 Authorization: Bearer 时，部分网关未改写成 x-api-key。',
      type:'protocol', modality:'text', protocol:'anthropic'
    },
    {
      id:'as-vod-001', code:'VOD-001', name:'香港站 generateContent 路径',
      category:'协议支持', model:'BG', provider:'VOD 国际站香港', status:'pass',
      summary:'POST /v3/chat/gc/v1beta/models/{model}:generateContent，Bearer 鉴权成功。',
      type:'protocol', modality:'text', protocol:'gemini'
    },
    {
      id:'as-vod-002', code:'VOD-002', name:'德国站 Messages 路径',
      category:'协议支持', model:'BGL', provider:'VOD 德国站', status:'pass',
      summary:'POST /v1/messages，模型 BGL/BD 可用。',
      type:'protocol', modality:'text', protocol:'anthropic'
    },
    {
      id:'as-vd-008', code:'VD-008', name:'视频任务终态字段',
      category:'视频生成', model:'seedance-2-0', provider:'火山方舟', status:'warn',
      summary:'原厂终态是 succeeded，部分兼容层改成 completed，轮询逻辑会空转。',
      type:'video', modality:'video', protocol:'ark-video'
    },
    {
      id:'as-tp-009', code:'TP-009', name:'max_tokens 在 Responses 中的映射',
      category:'参数透传', model:'gpt-4.1', provider:'OpenAI', status:'fail',
      summary:'Chat Completions 的 max_tokens 未映射到 Responses 的 max_output_tokens。',
      type:'protocol', modality:'text', protocol:'openai-responses'
    }
  ];

  const suites = [
    { id:'S1', name:'基础连通性', desc:'鉴权、HTTP 状态、最小响应、延迟冒烟', filter:'text', status:'pass', pass:12, total:12, icon:'check-circle-2', cases:['as-px-001','as-px-004','as-px-002','as-vod-001'] },
    { id:'S2', name:'原厂参数透传', desc:'stop、tool_choice、extra_body、Header 是否被改写', filter:'text', status:'warn', pass:9, total:12, icon:'waypoints', cases:['as-is6jhv0sez','as-6gwwxbi5qg','as-tp-009'] },
    { id:'S3', name:'多模态输入', desc:'图片、视频理解和文件上传能力探测', filter:'text', status:'warn', pass:7, total:10, icon:'image', cases:['as-vjb32gh0ze'] },
    { id:'S4', name:'Token 统计与一致性', desc:'usage 字段、重复请求、响应体结构稳定性', filter:'text', status:'fail', pass:6, total:9, icon:'activity', cases:['as-gxmvj1d7ge','as-ykyg3ew1n1','as-cons-001'] },
    { id:'S5', name:'视频生成任务', desc:'Seedance task id、轮询终态、video_url 保留', filter:'video', status:'pass', pass:6, total:7, icon:'clapperboard', cases:['as-ykyg3ewvd6','as-vd-008'] },
    { id:'S6', name:'协议支持矩阵', desc:'Chat Completions / Responses / Messages / Gemini Native', filter:'protocol', status:'warn', pass:8, total:12, icon:'waypoints', cases:['as-px-001','as-px-002','as-px-003','as-px-004','as-px-005','as-px-010','as-px-011','as-px-012'] },
    { id:'S7', name:'Schema 一致性', desc:'四家结构化输出字段路径与校验规则对齐', filter:'protocol', status:'warn', pass:3, total:4, icon:'braces', cases:['as-px-006','as-px-007','as-px-008','as-px-009'] }
  ];

  const reports = [
    { id:'#1783', name:'标准准入测试', kind:'准入测试', target:'百度千帆 / qianfan-vl-v1', status:'fail', label:'部分失败', icon:'file-check-2', time:'今天 10:24', passed:4, total:5, note:'tool_choice 与 stop 未按预期生效。' },
    { id:'#1784', name:'响应一致性 · Hi×100', kind:'准入测试', target:'百度千帆 / qianfan-vl-v1', status:'fail', label:'未通过', icon:'scan-search', time:'今天 11:06', passed:1, total:3, note:'第1次尝试 · 第1轮 ✗，发现 3 种响应体样式。' },
    { id:'#1782', name:'Seedance 端到端链路', kind:'准入测试', target:'火山方舟 / seedance-1-0', status:'pass', label:'通过', icon:'clapperboard', time:'昨天 16:42', passed:6, total:6, note:'cgt id 与 video_url 完整。' },
    { id:'#1781', name:'Token 统计回归', kind:'性能对比', target:'OpenAI / gpt-4o', status:'pass', label:'通过', icon:'activity', time:'昨天 14:18', passed:8, total:8, note:'stream usage 稳定。' },
    { id:'#1780', name:'四协议 Schema 对齐', kind:'准入测试', target:'OpenAI / Anthropic / Gemini', status:'warn', label:'部分通过', icon:'braces', time:'昨天 11:02', passed:3, total:4, note:'Gemini items:{} 被拒。' },
    { id:'W36', name:'Provider 健康周报', kind:'周报', target:'9 个 Provider / 17 个模型', status:'normal', label:'可查看', icon:'chart-no-axes-combined', time:'周一 09:00', passed:14, total:17, note:'千帆透传与一致性需跟进。' },
    { id:'#P01', name:'性能测试报告 · 1k–200k', kind:'性能压测', target:'火山方舟 / doubao-seed-1.6', status:'warn', label:'部分通过', icon:'gauge', time:'今天 15:40', passed:10, total:12, note:'128k 档 TTFT P90=41.2s，超过 <128K 的 35s 阈值。' },
    { id:'#E01', name:'效果评测报告 · 11 数据集', kind:'效果评测', target:'火山方舟 / doubao-seed-1.6', status:'warn', label:'部分通过', icon:'graduation-cap', time:'今天 16:12', passed:8, total:11, note:'HLE / SimpleQA 低于基线超过 ±4%。' }
  ];

  const protocols = [
    { id:'openai-chat', name:'OpenAI Chat Completions', path:'POST /v1/chat/completions', auth:'Authorization: Bearer', system:'messages[] role=system', history:'messages', roles:'system / user / assistant / tool', tools:'tool_calls[].function.arguments 为 JSON 字符串', schema:'response_format.json_schema', stream:'SSE data: chat.completion.chunk + [DONE]', native:'OpenAI 及绝大多数兼容层' },
    { id:'openai-responses', name:'OpenAI Responses', path:'POST /v1/responses', auth:'Authorization: Bearer', system:'instructions', history:'input / previous_response_id', roles:'user / assistant', tools:'内置 web_search / file_search + function_call', schema:'text.format.json_schema', stream:'Responses SSE events', native:'OpenAI 原厂新协议' },
    { id:'anthropic', name:'Anthropic Messages', path:'POST /v1/messages', auth:'x-api-key + anthropic-version', system:'顶层 system', history:'messages 仅 user/assistant 交替', roles:'user / assistant', tools:'content[].type=tool_use，input 为对象', schema:'output_config.format', stream:'named SSE: message_start / content_block_* / message_stop', native:'Claude、VOD 德国站 /v1/messages' },
    { id:'gemini', name:'Google Gemini Native', path:'POST /v1beta/models/{model}:generateContent', auth:'x-goog-api-key 或 Bearer', system:'systemInstruction.parts', history:'contents[].parts，role=user/model', roles:'user / model', tools:'functionCall.args 为对象，按 name 配对', schema:'generationConfig.response_schema + response_mime_type', stream:':streamGenerateContent?alt=sse', native:'Gemini、VOD 香港/美国站' }
  ];

  const docs = [
    { id:'quickstart', title:'快速开始', group:'手册' },
    { id:'judge', title:'判定规则', group:'手册' },
    { id:'protocols', title:'四协议对照', group:'协议' },
    { id:'schema', title:'Schema 一致性', group:'协议' },
    { id:'consistency', title:'响应一致性测试', group:'用例' },
    { id:'cases', title:'测试用例库', group:'用例' },
    { id:'examples', title:'示例详情', group:'用例' },
    { id:'vod-overview', title:'VOD 开通与区域', group:'用户手册' },
    { id:'vod-auth', title:'鉴权', group:'用户手册' },
    { id:'vod-billing', title:'计费', group:'用户手册' },
    { id:'vod-task', title:'查询任务详情', group:'用户手册' },
    { id:'vod-media', title:'媒资上传', group:'用户手册' },
    { id:'vod-api', title:'API 调用', group:'用户手册' },
    { id:'vod-mm', title:'多模态模型', group:'用户手册' },
    { id:'vod-sr', title:'视频超分 / 字幕擦除', group:'用户手册' },
    { id:'kb', title:'客户知识库', group:'知识库' },
    { id:'perf-sla', title:'性能验收 SLA', group:'供应商验收' },
    { id:'eval-bench', title:'效果评测数据集', group:'供应商验收' },
    { id:'thvv', title:'THVV 对照', group:'供应商验收' }
  ];

  const kbSeed = [
    { id:'kb-1', title:'tool_choice=none 仍触发工具', source:'客户工单 #4412', tags:['参数透传','tools'], body:'客户在千帆兼容层设置 tool_choice=none，模型仍返回 tool_calls。期望网关原样透传。', analysis:'高概率是网关默认改写为 auto，或模型忽略 none。对应 TP-001。' },
    { id:'kb-2', title:'相同 prompt 的 token 抖动', source:'客户工单 #4388', tags:['Token Probe'], body:'同一段中文 system+user，prompt_tokens 在 86/87/89 间跳。影响计费对账。', analysis:'可能是 BPE 边界、隐式 system 注入或网关包装消息。对应 TK-004。' },
    { id:'kb-3', title:'Gemini contents 被转成 messages', source:'客户工单 #4501', tags:['协议','Gemini'], body:'原生 generateContent 请求被 400。抓包发现 contents 被改成 messages。', analysis:'协议转换层把 Gemini Native 误当成 Chat Completions。对应 PX-002。' }
  ];


  const slaTiers = [
    { id:'<4K', lo:1000, hi:4000, p50:2.0, p90:5.0, bucket:'1k' },
    { id:'<8K', lo:4000, hi:8000, p50:2.5, p90:5.0, bucket:'9k' },
    { id:'<32K', lo:8000, hi:32000, p50:4.0, p90:8.0, bucket:'16k' },
    { id:'<64K', lo:32000, hi:64000, p50:8.0, p90:15.0, bucket:'32k' },
    { id:'<128K', lo:64000, hi:128000, p50:15.0, p90:35.0, bucket:'64k' },
    { id:'<256K', lo:128000, hi:256000, p50:30.0, p90:70.0, bucket:'128k' }
  ];
  const perfBuckets = [
    { id:'1k', tokens:1000, label:'1k 中文对话', scene:'最小上下文冒烟' },
    { id:'9k', tokens:9000, label:'9k 标准对话', scene:'含 cold / hot / mix50 前缀缓存' },
    { id:'16k', tokens:16000, label:'16k 长对话', scene:'中长上下文' },
    { id:'32k', tokens:32000, label:'32k 长文档', scene:'文档问答' },
    { id:'64k', tokens:64000, label:'64k 长文档', scene:'多文件汇总' },
    { id:'128k', tokens:128000, label:'128k 超长上下文', scene:'全书理解' },
    { id:'200k', tokens:200000, label:'200k 极限档', scene:'最大窗口压测' }
  ];
  const evalDatasets = [
    { id:'aime25', name:'AIME25', desc:'数学竞赛题', repeats:16, judge:false, docker:false, baseline:95.67 },
    { id:'aime26', name:'AIME26', desc:'AIME 2026 数学竞赛', repeats:16, judge:false, docker:false, baseline:95 },
    { id:'gpqa_diamond', name:'GPQA-Diamond', desc:'研究生级问答', repeats:3, judge:false, docker:false, baseline:89.73 },
    { id:'hle', name:'HLE', desc:"Humanity's Last Exam", repeats:1, judge:true, docker:false, baseline:32.35 },
    { id:'tau2_bench', name:'τ²-Bench', desc:'Agent 对话 · retail/telecom/airline', repeats:5, judge:false, docker:false, baseline:88.7 },
    { id:'mmlu_pro', name:'MMLU-Pro', desc:'多学科多选题', repeats:1, judge:false, docker:false, baseline:87.25 },
    { id:'simple_qa', name:'SimpleQA', desc:'事实准确性 · LLM Judge', repeats:1, judge:true, docker:false, baseline:37.56 },
    { id:'longbench_v2', name:'LongBench v2', desc:'长上下文理解', repeats:1, judge:false, docker:false, baseline:68.89 },
    { id:'live_code_bench', name:'LiveCodeBench', desc:'实时代码生成', repeats:1, judge:false, docker:true, baseline:86.92 },
    { id:'swe_bench_verified_mini_agentic', name:'SWE-Bench Mini', desc:'Agentic 软件工程', repeats:1, judge:false, docker:true, baseline:85.42 },
    { id:'swe_bench_pro', name:'SWE-Bench Pro', desc:'软件工程 Pro', repeats:1, judge:false, docker:true, baseline:0 }
  ];
  const perfRuns = [
    { bucket:'1k', conc:1, n:20, ok:20, fail:0, ttftP50:0.42, ttftP90:0.81, ttltP90:1.6, otps:52.4, tpm:88000, failReason:'' },
    { bucket:'1k', conc:32, n:200, ok:198, fail:2, ttftP50:0.68, ttftP90:1.45, ttltP90:2.4, otps:41.2, tpm:312000, failReason:'429 限流 x2' },
    { bucket:'9k', conc:16, n:120, ok:120, fail:0, ttftP50:1.12, ttftP90:2.08, ttltP90:4.1, otps:38.6, tpm:246000, failReason:'' },
    { bucket:'16k', conc:16, n:80, ok:79, fail:1, ttftP50:1.84, ttftP90:3.62, ttltP90:7.8, otps:36.1, tpm:198000, failReason:'超时 x1' },
    { bucket:'32k', conc:16, n:60, ok:58, fail:2, ttftP50:3.40, ttftP90:7.15, ttltP90:14.2, otps:33.8, tpm:154000, failReason:'5xx x2' },
    { bucket:'64k', conc:8, n:40, ok:38, fail:2, ttftP50:8.90, ttftP90:18.4, ttltP90:32.0, otps:31.2, tpm:92000, failReason:'超时 x2' },
    { bucket:'128k', conc:8, n:30, ok:24, fail:6, ttftP50:22.1, ttftP90:41.2, ttltP90:68.0, otps:22.4, tpm:41000, failReason:'超时 x4 · 429 x2' },
    { bucket:'200k', conc:4, n:16, ok:13, fail:3, ttftP50:38.6, ttftP90:62.0, ttltP90:96.0, otps:18.1, tpm:22000, failReason:'context overflow x3' }
  ];
  const evalRuns = [
    { id:'aime25', score:94.8, n:30, skipped:0, status:'pass' },
    { id:'aime26', score:93.3, n:30, skipped:0, status:'pass' },
    { id:'gpqa_diamond', score:88.1, n:198, skipped:2, status:'pass' },
    { id:'hle', score:26.4, n:100, skipped:6, status:'fail' },
    { id:'tau2_bench', score:86.2, n:90, skipped:0, status:'pass' },
    { id:'mmlu_pro', score:86.9, n:200, skipped:0, status:'pass' },
    { id:'simple_qa', score:31.2, n:200, skipped:4, status:'fail' },
    { id:'longbench_v2', score:67.4, n:150, skipped:1, status:'pass' },
    { id:'live_code_bench', score:84.0, n:80, skipped:3, status:'pass' },
    { id:'swe_bench_verified_mini_agentic', score:81.6, n:50, skipped:0, status:'pass' },
    { id:'swe_bench_pro', score:null, n:0, skipped:0, status:'skip' }
  ];

  return { providers, models, cases, suites, reports, protocols, docs, kbSeed, slaTiers, perfBuckets, evalDatasets, perfRuns, evalRuns };

})();
