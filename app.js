const DATA_KEY = 'tokenscope-v3';
const seed = window.TokenScopeData;

const BRANDS = {
  openai: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#10A37F" d="M12.4 2.4c.8-1.4 2.8-1.4 3.6 0l1.7 3c.2.3.5.6.8.7l3.3.8c1.5.4 2.1 2.2 1.1 3.4l-2.2 2.6c-.3.3-.4.7-.4 1.1l.3 3.4c.1 1.6-1.4 2.8-2.9 2.3l-3.2-1.1c-.4-.1-.8-.1-1.1 0l-3.2 1.1c-1.5.5-3-0.7-2.9-2.3l.3-3.4c0-.4-.1-.8-.4-1.1L4.1 10.3C3.1 9.1 3.7 7.3 5.2 6.9l3.3-.8c.3-.1.6-.4.8-.7l1.7-3z"/></svg>`,
  anthropic: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#D4A27F" d="M12 3 4 21h3.2l1.5-3.4h6.6L16.8 21H20L12 3zm-2.1 11.4L12 8.2l2.1 6.2h-4.2z"/></svg>`,
  google: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 13.9A6 6 0 0 1 6.1 12c0-.7.1-1.3.3-1.9V7.5H3.1A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.5l3.3-2.6z"/><path fill="#EA4335" d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.8 14.7 2 12 2A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.6 9.4 5.8 12 5.8z"/></svg>`,
  baidu: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="2.2" fill="#2932E1"/><circle cx="16" cy="8" r="2.2" fill="#2932E1"/><circle cx="5.5" cy="14" r="2.3" fill="#2932E1"/><circle cx="18.5" cy="14" r="2.3" fill="#2932E1"/><ellipse cx="12" cy="16.5" rx="3.2" ry="3.6" fill="#2932E1"/></svg>`,
  volc: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1664FF" d="M4 18 12 4l8 14H4zm5.2-2h5.6L12 9.6 9.2 16z"/><path fill="#00C8D2" d="M9 19h6l-3 3-3-3z"/></svg>`
};

const state = {
  route: (location.hash.replace('#','') || 'dashboard'),
  data: loadData(),
  probeCase: 'as-cons-001',
  providerFilter: '全部',
  modelFilter: '全部',
  suiteTab: 'all',
  providerTab: 'all',
  reportTab: '全部报告',
  reportQuery: '',
  probeFilter: 'all',
  providerQuery: '',
  docId: 'quickstart',
  compare: { A:'gpt-4o', B:'claude-3-5-sonnet' },
  runInProgress: false,
  inquiry: '',
  analysis: null
};

function loadData(){
  const base = structuredClone(seed);
  try {
    const stored = JSON.parse(localStorage.getItem(DATA_KEY) || 'null');
    if (!stored) return { ...base, knowledge: base.kbSeed };
    return {
      ...base,
      providers: stored.providers || base.providers,
      models: stored.models || base.models,
      knowledge: stored.knowledge || base.kbSeed,
      inquiryLog: stored.inquiryLog || []
    };
  } catch { return { ...base, knowledge: base.kbSeed }; }
}
function persist(){
  localStorage.setItem(DATA_KEY, JSON.stringify({
    providers: state.data.providers,
    models: state.data.models,
    knowledge: state.data.knowledge,
    inquiryLog: state.data.inquiryLog || []
  }));
}
function esc(v=''){ return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function icon(name, cls=''){ return `<i data-lucide="${name}" class="${cls}"></i>`; }
function brandLogo(brand){ return `<span class="brand-logo">${BRANDS[brand] || BRANDS.baidu}</span>`; }
function statusPill(status, label){
  const map = { pass:['通过',''], warn:['部分通过','warn'], fail:['未通过','fail'], normal:['正常',''], check:['需检查','warn'] };
  const [text, cls] = map[status] || [label || status, ''];
  return `<span class="status-pill ${cls}">${label || text}</span>`;
}
function pageHead(kicker,title,subtitle,actions=''){
  return `<div class="page-head"><div><div class="eyebrow">${esc(kicker)}</div><h1 class="page-title">${esc(title)}</h1><p class="page-subtitle">${esc(subtitle)}</p></div><div class="head-actions">${actions}</div></div>`;
}
function btn(label, action='', cls='', ico=''){ return `<button class="btn ${cls}" ${action ? `data-action="${action}"` : ''}>${ico ? icon(ico) : ''}<span>${label}</span></button>`; }
function metric(a,b){ return `<div class="metric"><small>${a}</small><strong>${b}</strong></div>`; }

const routeLabels = {
  dashboard:'总览', providers:'Provider 配置', matrix:'模型能力矩阵', probe:'Token Probe',
  suites:'测试套件', perf:'性能压测', eval:'效果评测', protocols:'协议测试', compare:'A/B Compare', customers:'客户问询',
  reports:'报告中心', docs:'文档说明'
};

function statsFromData(){
  const { providers, models, cases } = state.data;
  const text = models.filter(m => m.modality === 'text' || m.kind.includes('文本')).length;
  const video = models.filter(m => m.modality === 'video').length;
  const vision = models.filter(m => m.kind.includes('视觉') || m.modality === 'vision').length;
  const fails = cases.filter(c => c.status === 'fail').length;
  const pass = cases.filter(c => c.status === 'pass').length;
  const rate = Math.round((pass / cases.length) * 100);
  const endpoints = new Set(providers.map(p => p.endpoint)).size;
  return { providers: providers.length, models: models.length, endpoints, text, video, vision, fails, rate, cases: cases.length };
}

function slaPass(row){
  const buckets = { '1k':'<4K','9k':'<8K','16k':'<32K','32k':'<64K','64k':'<128K','128k':'<256K','200k':'<256K' };
  const tier = (state.data.slaTiers||[]).find(t => t.id === buckets[row.bucket]);
  const p90Limit = tier ? tier.p90 : 70;
  const ok = row.ttftP90 < p90Limit && row.otps >= 30;
  return { ok, p90Limit, tier: tier?tier.id:'—' };
}
function coverageOf(key){
  const vals = state.data.models.map(m => m.capability[key]);
  const score = vals.reduce((s,v)=> s + (v==='support'?1:v==='partial'?0.5:0), 0);
  return Math.round((score / vals.length) * 100);
}

const views = {
  dashboard(){
    const s = statsFromData();
    const hour = new Date().getHours();
    const hello = hour < 12 ? '早上好！' : hour < 18 ? '下午好！' : '晚上好！';
    const recents = [
      { provider:'OpenAI', model:'gpt-4o', ttft:620, rate:92, time:'今天 09:24', report:'#1781' },
      { provider:'Anthropic', model:'claude-3.5-sonnet', ttft:842, rate:88, time:'昨天 18:03', report:'#1780' },
      { provider:'百度千帆', model:'qianfan-vl-v1', ttft:530, rate:68, time:'今天 10:24', report:'#1783' },
      { provider:'Google Gemini', model:'gemini-2.5-pro', ttft:776, rate:86, time:'昨天 20:17', report:'#1780' }
    ];
    const steps = [
      ['配置 Provider','填写中转站信息并验证连接','providers'],
      ['选择模型','从预置模型中选择或自定义配置','matrix'],
      ['运行测试','选择测试套件开始自动化测试','suites'],
      ['性能压测','1k–200k × 并发梯度 + SLA','perf'],
      ['效果评测','AIME / GPQA / HLE 等 11 数据集','eval'],
      ['导出报告','生成 HTML 测试报告','reports']
    ];
    return `<div class="page-head dash-head">
        <div><h1 class="hero-title">${hello}</h1><p class="page-subtitle">欢迎使用 TokenScope。协议验真之外，按 THVV 口径做 1k–200k 性能压测与 11 数据集效果评测。</p></div>
        <div class="head-actions">
          ${btn('单发探针','go-probe','btn-primary','play')}
          ${btn('性能压测','go-perf','btn-primary','gauge')}
          ${btn('效果评测','go-eval','btn-ghost','graduation-cap')}
          ${btn('导出 HTML','export-report','btn-ghost','download')}
        </div>
      </div>
      <section class="stat-grid">
        ${statCard('供应商数', s.providers, '已配置并可测试的供应商', 'users', 'blue', 'providers')}
        ${statCard('模型预置', s.models, '已集成的模型配置', 'boxes', 'green', 'matrix')}
        ${statCard('测试套件', state.data.suites.length, '覆盖核心能力场景', 'file-text', 'purple', 'suites')}
        ${statCard('最近通过率', s.rate + '%', '近 7 天测试平均通过率', 'clock-3', 'amber', 'reports')}
      </section>
      <section class="dash-block">
        <div class="section-head"><h2>测试套件状态</h2><button class="text-link" data-route="suites">查看全部 ${icon('chevron-right')}</button></div>
        <div class="suite-strip">${state.data.suites.map(suiteMini).join('')}</div>
      </section>
      <section class="dash-block">
        <div class="section-head"><h2>推荐流程</h2></div>
        <div class="flow-rail">${steps.map((st,i)=>`<button class="flow-item" data-route="${st[2]}"><span class="flow-num">${i+1}</span><b>${st[0]}</b><small>${st[1]}</small></button>${i<steps.length-1?'<span class="flow-next">›</span>':''}`).join('')}</div>
      </section>
      <section class="dash-block">
        <div class="section-head"><h2>最近测试记录</h2><button class="text-link" data-route="reports">查看更多 ${icon('chevron-right')}</button></div>
        <div class="table-wrap recent-wrap"><table class="data-table recent-table"><thead><tr><th>Provider</th><th>Model</th><th>TTFT p50 (ms)</th><th>通过率</th><th>报告</th><th></th></tr></thead>
        <tbody>${recents.map(r=>`<tr><td>${esc(r.provider)}</td><td>${esc(r.model)}</td><td>${r.ttft}</td><td>${statusPill(r.rate>=90?'pass':r.rate>=80?'warn':'fail', r.rate+'%')}</td><td><button class="cell-action" data-view-report="${r.report}">${icon('file-text')} 查看</button></td><td class="muted">${esc(r.time)}</td></tr>`).join('')}</tbody></table></div>
      </section>`;
  },
  providers(){
    const tab = state.providerTab;
    const q = (state.providerQuery||'').toLowerCase();
    const rows = state.data.providers.filter(p => (tab==='all' || (tab==='native' ? !p.type.includes('兼容') : p.type.includes('兼容'))) && (!q || (p.name+p.type+p.endpoint).toLowerCase().includes(q)));
    return `${pageHead('Connection center','Provider 配置','标准协议与原厂端点分开管理，保留鉴权头、原始响应和异步任务字段。',btn('导入配置','import-provider','btn-soft','upload')+btn('添加 Provider','add-provider','btn-primary','plus'))}
      <section class="page-card"><div class="toolbar"><div class="toolbar-left"><div class="segmented">
        <button class="${tab==='all'?'active':''}" data-provider-tab="all">全部 Provider</button>
        <button class="${tab==='native'?'active':''}" data-provider-tab="native">原厂 API</button>
        <button class="${tab==='compat'?'active':''}" data-provider-tab="compat">OpenAI 兼容</button>
      </div></div><div class="toolbar-right"><input class="input search-input" id="provider-search" value="${esc(state.providerQuery)}" placeholder="搜索 Provider"/><button class="btn" data-action="refresh-providers">${icon('refresh-cw')}<span>刷新状态</span></button></div></div>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Provider</th><th>接入方式</th><th>Endpoint</th><th>模型数</th><th>状态</th><th>最近检查</th><th></th></tr></thead>
      <tbody>${rows.map(providerRow).join('')}</tbody></table></div></section>`;
  },
  matrix(){
    const providers=['全部',...new Set(state.data.models.map(m=>m.provider))];
    const kinds=['全部','文本','文本 / 视觉','视觉','视频生成'];
    const filtered=state.data.models.filter(m=>(state.providerFilter==='全部'||m.provider===state.providerFilter)&&(state.modelFilter==='全部'||m.kind===state.modelFilter||(state.modelFilter==='文本'&&m.kind==='文本')));
    return `${pageHead('Model catalog','模型能力矩阵','供应商列使用原厂标识。能力值来自当前用例库与公开协议差异，不是首页那组虚假 24/6/8。',btn('添加模型','add-model','btn-primary','plus'))}
      <section class="page-card"><div class="matrix-filters"><strong>供应商</strong>${providers.map(x=>`<button class="chip ${state.providerFilter===x?'active':''}" data-provider-filter="${esc(x)}">${esc(x)}</button>`).join('')}</div>
      <div class="matrix-filters"><strong>模型类型</strong>${kinds.map(x=>`<button class="chip ${state.modelFilter===x?'active':''}" data-model-filter="${esc(x)}">${esc(x)}</button>`).join('')}</div>
      <div class="capability-legend"><span class="legend-item"><i class="legend-dot"></i>支持</span><span class="legend-item"><i class="legend-dot warn"></i>部分支持</span><span class="legend-item"><i class="legend-dot fail"></i>不支持</span><span class="legend-item"><i class="legend-dot unknown"></i>未知</span></div></section>
      <section class="page-card"><div class="table-wrap"><table class="data-table"><thead><tr><th>模型</th><th>供应商</th><th>上下文</th><th>流式</th><th>tools</th><th>视频</th><th>JSON Schema</th><th>usage</th><th></th></tr></thead>
      <tbody>${filtered.map(modelRow).join('')}</tbody></table></div>${filtered.length?'':'<div class="empty-state">没有符合筛选条件的模型</div>'}</section>`;
  },
  probe(){
    const list = filteredCasesForProbe();
    const c = list.find(x=>x.id===state.probeCase) || list[0] || state.data.cases[0];
    state.probeCase = c.id;
    return `${pageHead('Token Probe','参数透传与一致性探测','按原始请求验证参数是否到达 Provider，并对响应结构、Token 和异步任务做断言。',btn('新建探测','new-probe','btn-soft','plus')+btn(state.runInProgress?'运行中…':'运行当前用例','run-probe','btn-primary',state.runInProgress?'loader-circle':'play'))}
      <section class="probe-layout"><div class="panel"><div class="toolbar"><h2 class="panel-title" style="margin:0">测试用例 <small>${list.length} 个</small></h2>
        <select class="select" data-probe-filter>
          <option value="all" ${state.probeFilter==='all'?'selected':''}>全部</option>
          <option value="text" ${state.probeFilter==='text'?'selected':''}>文本模型</option>
          <option value="video" ${state.probeFilter==='video'?'selected':''}>视频模型</option>
          <option value="protocol" ${state.probeFilter==='protocol'?'selected':''}>协议测试</option>
        </select></div>
        <div class="probe-nav">${list.map(probeCaseRow).join('')}</div></div>
        <div class="probe-detail">${probeDetail(c)}</div></section>`;
  },
  suites(){
    const tab = state.suiteTab;
    const list = state.data.suites.filter(s => tab==='all' || s.filter===tab);
    return `${pageHead('Test suites','测试套件','连通性、透传、Token、视频与协议套件可按模型类型切换。',btn('导入套件','import-suite','btn-soft','upload')+btn('新建套件','new-suite','btn-primary','plus'))}
      <section class="page-card"><div class="toolbar"><div class="toolbar-left"><div class="segmented">
        <button class="${tab==='all'?'active':''}" data-suite-tab="all">全部</button>
        <button class="${tab==='text'?'active':''}" data-suite-tab="text">文本模型</button>
        <button class="${tab==='video'?'active':''}" data-suite-tab="video">视频模型</button>
        <button class="${tab==='protocol'?'active':''}" data-suite-tab="protocol">协议测试</button>
      </div></div><div class="toolbar-right"><select class="select" id="suite-sort"><option>最近更新</option><option>通过率</option><option>失败数</option></select>
      <button class="btn btn-primary" data-action="run-suite">${icon('play')}<span>运行选中套件</span></button></div></div>
      <div class="kb-grid">${list.map(suiteCard).join('')}</div>${list.length?'':'<div class="empty-state">该分类下暂无套件</div>'}</section>`;
  },
  perf(){
    const rows = state.data.perfRuns || [];
    const sla = state.data.slaTiers || [];
    const buckets = state.data.perfBuckets || [];
    const pass = rows.filter(r => slaPass(r).ok).length;
    return `${pageHead('Vendor perf','性能压测','对齐 THVV：7 档中文输入（1k–200k）× 并发梯度。指标含 TTFT / TTLT / OTPS，并按输入档位做 SLA 判定。协议支持 OpenAI Chat Completions 与 Anthropic Messages。',btn('重新生成报告','view-perf-report','btn-soft','file-text')+btn('运行 bench-all','run-perf','btn-primary','play'))}
      <section class="stat-grid">
        ${statCard('档位', buckets.length, '1k / 9k / 16k / 32k / 64k / 128k / 200k', 'layers', 'blue', 'perf')}
        ${statCard('矩阵行', rows.length, `${pass} 行达标 · ${rows.length-pass} 行违规`, 'table-properties', 'green', 'perf')}
        ${statCard('OTPS 下限', '≥ 30', '>10B 模型 L1；L2 ≥ 10', 'gauge', 'purple', 'perf')}
        ${statCard('总体 SLA', pass===rows.length?'通过':'部分通过', 'TTFT P50/P90 + OTPS 联合判定', 'shield-check', pass===rows.length?'green':'amber', 'reports')}
      </section>
      <section class="page-card">
        <h2 class="panel-title">输入档位</h2>
        <div class="suite-strip">${buckets.map(b=>`<article class="suite-mini"><b>${esc(b.id)}</b><span>${esc(b.label)}</span><small class="muted">${esc(b.scene)}</small></article>`).join('')}</div>
      </section>
      <section class="page-card">
        <div class="section-head"><h2>并发梯度对比</h2><span class="muted">口径：TTFT 秒 · OTPS tokens/s</span></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>档位</th><th>并发</th><th>请求</th><th>成功</th><th>失败</th><th>TTFT P50</th><th>TTFT P90</th><th>P90 阈值</th><th>OTPS</th><th>SLA</th><th>失败原因</th></tr></thead>
        <tbody>${rows.map(r=>{
          const j = slaPass(r);
          return `<tr><td>${esc(r.bucket)}</td><td>${r.conc}</td><td>${r.n}</td><td>${r.ok}</td><td>${r.fail}</td><td>${r.ttftP50.toFixed(2)}</td><td>${r.ttftP90.toFixed(2)}</td><td>${j.p90Limit}</td><td>${r.otps.toFixed(1)}</td><td>${statusPill(j.ok?'pass':'fail', j.ok?'达标':'违规')}</td><td class="muted">${esc(r.failReason||'—')}</td></tr>`;
        }).join('')}</tbody></table></div>
      </section>
      <section class="page-card">
        <h2 class="panel-title">SLA 阈值（THVV sla_eval）</h2>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>档位</th><th>Input tokens</th><th>TTFT P50</th><th>TTFT P90</th></tr></thead>
        <tbody>${sla.map(t=>`<tr><td>${esc(t.id)}</td><td>${t.lo.toLocaleString()} – ${t.hi.toLocaleString()}</td><td>&lt; ${t.p50}s</td><td>&lt; ${t.p90}s</td></tr>`).join('')}</tbody></table></div>
        <p class="muted" style="margin-top:10px">另需低并发预热 5 分钟；正式档压测 10–15 分钟，稳定后再采集。OTPS：激活参数 &gt;10B 的 L1 ≥ 30 tok/s，L2 ≥ 10；≤10B ≥ 100。</p>
      </section>`;
  },
  eval(){
    const ds = state.data.evalDatasets || [];
    const runs = state.data.evalRuns || [];
    const pass = runs.filter(r=>r.status==='pass').length;
    const fail = runs.filter(r=>r.status==='fail').length;
    return `${pageHead('Vendor eval','效果评测','对齐 THVV / EvalScope：11 个主流数据集。基线允许 ±2–4% 浮动。HLE / SimpleQA 需要独立 LLM Judge；代码与 SWE 数据集建议 Docker。',btn('查看评测报告','view-eval-report','btn-soft','file-text')+btn('运行全部数据集','run-eval','btn-primary','play'))}
      <section class="stat-grid">
        ${statCard('数据集', ds.length, 'AIME / GPQA / HLE / MMLU-Pro / τ² / SWE…', 'library', 'blue', 'eval')}
        ${statCard('达标', pass, `${fail} 个低于基线 · ${runs.filter(r=>r.status==='skip').length} 个跳过`, 'check-circle-2', 'green', 'eval')}
        ${statCard('需 Judge', ds.filter(d=>d.judge).length, 'HLE、SimpleQA 强制配置 Judge', 'sparkles', 'purple', 'eval')}
        ${statCard('需 Docker', ds.filter(d=>d.docker).length, 'LiveCodeBench / SWE-Bench', 'container', 'amber', 'eval')}
      </section>
      <section class="page-card">
        <div class="section-head"><h2>数据集与基线对照</h2><span class="muted">基线来自 THVV 效果验收标准，容差 ±4%</span></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>数据集</th><th>说明</th><th>repeats</th><th>Judge</th><th>Docker</th><th>基线</th><th>本次得分</th><th>题目</th><th>跳过</th><th>判定</th></tr></thead>
        <tbody>${ds.map(d=>{
          const r = runs.find(x=>x.id===d.id) || {score:null,n:0,skipped:0,status:'skip'};
          const label = r.status==='pass'?'达标':r.status==='fail'?'低于基线':'未跑';
          return `<tr><td><b>${esc(d.name)}</b></td><td class="muted">${esc(d.desc)}</td><td>${d.repeats}</td><td>${d.judge?'需要':'—'}</td><td>${d.docker?'需要':'—'}</td><td>${d.baseline||'—'}</td><td>${r.score==null?'—':r.score}</td><td>${r.n||'—'}</td><td>${r.skipped||0}</td><td>${statusPill(r.status==='pass'?'pass':r.status==='fail'?'fail':'warn', label)}</td></tr>`;
        }).join('')}</tbody></table></div>
      </section>
      <section class="page-card">
        <h2 class="panel-title">报告结构（eval_report_v2）</h2>
        <div class="suite-strip" style="grid-template-columns:repeat(6,minmax(0,1fr))">
          ${[['1','核心结论','正确率 / 题数 / 跳过 KPI'],['2','效果与稳定性','repeats / pass@k 对比'],['3','体验与性能','TTFT / TPOT / 吞吐'],['4','评测配置','生效参数，凭证脱敏'],['5','逐题证据','思维链 / 答案 / 评分'],['6','异常跳过','ignore_errors 原因分类']].map(x=>`<article class="suite-mini"><b>${x[0]}</b><span>${x[1]}</span><small class="muted">${x[2]}</small></article>`).join('')}
        </div>
      </section>`;
  },
    protocols(){
    return `${pageHead('Protocols','API 协议支持测试','覆盖 Chat Completions、Responses、Anthropic Messages、Gemini Native，以及 Schema / SSE / 工具参数编码。',btn('运行协议套件','run-protocol-suite','btn-primary','play'))}
      <section class="proto-grid">${state.data.protocols.map(protocolCard).join('')}</section>
      <section class="page-card"><h2 class="panel-title">协议用例</h2>
        ${state.data.cases.filter(c=>['协议支持','Schema 一致性'].includes(c.category)).map(c=>`<div class="record-row"><div class="record-main"><b>${esc(c.code)} · ${esc(c.name)}</b><small>${esc(c.provider)} / ${esc(c.model)} · ${esc(c.summary)}</small></div><div>${statusPill(c.status)}<button class="cell-action" data-open-case="${c.id}">查看</button></div></div>`).join('')}
      </section>`;
  },
  compare(){
    return `${pageHead('Benchmark','A/B Compare','相同请求对比延迟、Token 与原厂字段完整性。',btn('保存对比','save-compare','btn-soft','bookmark')+btn('开始对比','run-compare','btn-primary','play'))}
      <section class="compare-grid"><div class="page-card"><h2 class="panel-title">模型 A</h2>${compareSelector('A', state.compare.A)}</div><div class="page-card"><h2 class="panel-title">模型 B</h2>${compareSelector('B', state.compare.B)}</div></section>
      <section class="page-card"><h2 class="panel-title">对比指标 <span class="status-pill">相同请求 · 10 次采样</span></h2>
        <div class="metric-grid">${metric('平均首 Token','620 ms')}${metric('平均输出速度','48.6 tok/s')}${metric('字段完整率','92%')}${metric('断言通过率','<span class="up">90%</span>')}</div>
        <div class="chart"><div class="bar-col"><i style="height:68%"></i><small>TTFT</small></div><div class="bar-col"><i style="height:52%"></i><small>总耗时</small></div><div class="bar-col"><i style="height:80%"></i><small>Token</small></div><div class="bar-col"><i style="height:35%"></i><small>丢失字段</small></div></div>
      </section>`;
  },
  customers(){
    const kb = state.data.knowledge || [];
    return `${pageHead('Customer desk','客户用例问询','上传客户用例或粘贴问题，工作台用已沉淀的测试知识库推断可能原因，并回写到文档中心。',btn('清空分析','clear-analysis','btn-soft','eraser'))}
      <section class="dashboard-grid">
        <div class="page-card">
          <h2 class="panel-title">提交问题</h2>
          <div class="dropzone" data-action="pick-customer-file">将日志、HAR 摘要或用例说明拖到此处，或点击选择文件<input id="customer-file" type="file" multiple accept=".txt,.md,.json,.log,.csv" hidden></div>
          <div class="form-field" style="margin-top:14px"><label>问题描述</label><textarea class="textarea" id="inquiry-text" placeholder="例如：香港站 generateContent 返回 400，contents 好像被改成了 messages...">${esc(state.inquiry)}</textarea></div>
          <div class="head-actions" style="margin-top:12px">${btn('分析可能性','analyze-inquiry','btn-primary','sparkles')}</div>
          ${state.analysis ? renderAnalysis(state.analysis) : '<p class="muted" style="margin-top:14px">分析会匹配协议差异、透传失败和历史工单，不会把密钥发到外网。</p>'}
        </div>
        <div class="page-card">
          <h2 class="panel-title">知识库 <small data-route="docs">${kb.length} 条</small></h2>
          ${kb.map(k=>`<article class="kb-card" style="margin-bottom:10px"><div><h4>${esc(k.title)}</h4><p>${esc(k.body)}</p><small class="muted">${esc(k.source)} · ${(k.tags||[]).join(' / ')}</small></div></article>`).join('')}
        </div>
      </section>`;
  },
  reports(){
    const tab = state.reportTab;
    const q = state.reportQuery.trim().toLowerCase();
    const list = state.data.reports.filter(r => (tab==='全部报告'||r.kind===tab) && (!q || (r.name+r.target+r.id).toLowerCase().includes(q)));
    return `${pageHead('Report center','报告中心','集中查看测试结论、失败证据和可分享摘要。',btn('导出全部','export-report','btn-soft','download')+btn('生成报告','generate-report','btn-primary','file-plus-2'))}
      <section class="page-card"><div class="toolbar"><div class="filter-tabs" style="margin:0">
        ${['全部报告','准入测试','性能压测','效果评测','性能对比','周报'].map(x=>`<button class="filter-tab ${tab===x?'is-active':''}" data-report-tab="${x}">${x}</button>`).join('')}
      </div><input class="input search-input" id="report-search" value="${esc(state.reportQuery)}" placeholder="搜索报告名称"/></div>
      <div class="report-list">${list.map(reportCard).join('') || '<div class="empty-state">没有符合筛选的报告</div>'}</div></section>`;
  },
  docs(){
    const groups = [...new Set(state.data.docs.map(d=>d.group))];
    const current = state.data.docs.find(d=>d.id===state.docId) || state.data.docs[0];
    return `${pageHead('Documentation','文档说明','测试判定、四协议手册、VOD 用户手册、THVV 性能/效果验收与客户知识库。')}
      <section class="doc-layout">
        <nav class="doc-nav">${groups.map(g=>`<div class="doc-nav-group">${esc(g)}</div>${state.data.docs.filter(d=>d.group===g).map(d=>`<button class="${d.id===current.id?'active':''}" data-doc="${d.id}">${esc(d.title)}</button>`).join('')}`).join('')}</nav>
        <div class="doc-main">
          <header class="doc-title-bar">
            <span class="doc-kicker">${esc(current.group)}</span>
            <h2>${esc(current.title)}</h2>
          </header>
          <article class="doc-article">${renderDoc(current.id)}</article>
        </div>
      </section>`;
  }
};

function statCard(label,value,foot,ico,tone='blue',route='dashboard'){ return `<button class="stat-card tone-${tone}" data-route="${route}"><div class="stat-top"><span class="stat-icon">${icon(ico)}</span><span class="stat-label">${label}</span>${icon('chevron-right')}</div><div class="stat-value">${value}</div><div class="stat-foot">${foot}</div></button>`; }
function suiteMini(s){ return `<button class="suite-mini" data-view-suite="${s.id}"><b>${esc(s.id)}</b><span>${esc(s.name)}</span>${statusPill(s.status)}</button>`; }
function suiteRow(ico,title,sub,status){ return `<div class="suite-row"><div class="suite-main"><span class="suite-icon">${icon(ico)}</span><div><b>${title}</b><small>${sub}</small></div></div>${statusPill(status)}</div>`; }
function coverage(label,num,color=''){ return `<div class="coverage-row"><div class="coverage-meta"><span>${label}</span><strong>${num}%</strong></div><div class="progress"><i class="${color}" style="width:${num}%"></i></div></div>`; }
function dashboardRecords(filter){
  const items=state.data.cases.filter(c=>filter==='全部'||c.category===filter).slice(0,6);
  return items.map(c=>`<div class="record-row"><div class="record-main"><b>${esc(c.name)}</b><small>${esc(c.model)} · ${esc(c.code)} · ${esc(c.summary)}</small></div>${statusPill(c.status)}</div>`).join('') || '<div class="empty-state">该分类暂无记录</div>';
}
function providerRow(p){
  const modelCount = state.data.models.filter(m=>m.provider===p.name).length;
  return `<tr><td><div class="provider-cell">${brandLogo(p.brand)}<strong>${esc(p.name)}</strong></div></td><td>${esc(p.type)}</td><td><span class="muted">${esc(p.endpoint)}</span></td><td>${modelCount}</td><td>${statusPill(p.status==='正常'?'normal':'check')}</td><td class="muted">${esc(p.checked)}</td><td><button class="cell-action" data-provider-edit="${p.id}">编辑</button><button class="cell-action" data-provider-test="${p.id}">测试连接</button></td></tr>`;
}
function modelRow(m){
  return `<tr><td><div class="model-cell"><strong>${esc(m.name)}</strong><small class="muted">${esc(m.kind)}</small></div></td><td><div class="provider-cell">${brandLogo(m.brand)}${esc(m.provider)}</div></td><td>${m.context}</td>${capCell(m.capability.stream)}${capCell(m.capability.tools)}${capCell(m.capability.video)}${capCell(m.capability.schema)}${capCell(m.capability.usage)}<td><button class="cell-action" data-model-detail="${m.id}">详情 ${icon('chevron-right')}</button></td></tr>`;
}
function capCell(s){ const map={support:['check-circle-2','支持','support'],partial:['minus-circle','部分支持','partial'],unsupported:['x-circle','不支持','unsupported'],unknown:['help-circle','未知','unknown']}; const x=map[s]||map.unknown; return `<td class="capability-cell ${x[2]}"><span>${icon(x[0])}${x[1]}</span></td>`; }
function probeCaseRow(c){ return `<button class="probe-case ${state.probeCase===c.id?'active':''}" data-probe-case="${c.id}"><span class="case-index">${esc(c.code.split('-')[1]||c.code)}</span><span><b>${esc(c.name)}</b><small>${esc(c.summary)}</small><small>${esc(c.model)} · ${esc(c.code)}</small></span>${statusPill(c.status)}</button>`; }
function suiteCard(s){
  return `<article class="suite-card"><div><h4>${esc(s.id)} · ${esc(s.name)}</h4><p>${esc(s.desc)}</p><div style="margin-top:10px" class="muted">最近运行：今天 10:24 · ${s.pass}/${s.total}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">${statusPill(s.status)}<button class="cell-action" data-view-suite="${s.id}">详情 ${icon('chevron-right')}</button></div></article>`;
}
function protocolCard(p){
  const related = state.data.cases.filter(c=>c.protocol===p.id);
  const fail = related.filter(c=>c.status!=='pass').length;
  return `<article class="proto-card page-card" style="margin:0"><div><div class="proto-icon">${icon('waypoints')}</div><h3 style="margin-top:12px">${esc(p.name)}</h3><p>${esc(p.path)}</p><div class="muted" style="margin-top:8px">${esc(p.auth)}</div></div><div>${statusPill(fail?'warn':'pass', fail?`${fail} 项待跟进`:'协议可用')}<div><button class="cell-action" data-doc="protocols">手册</button></div></div></article>`;
}
function reportCard(r){
  return `<article class="report-card"><div><h4>${esc(r.name)} · ${esc(r.id)}</h4><p>${esc(r.target)}</p><div style="margin-top:10px">${statusPill(r.status,r.label)} <span class="muted">${esc(r.time)}</span></div></div><div><span class="report-icon">${icon(r.icon)}</span><button class="cell-action" data-view-report="${r.id}">查看</button></div></article>`;
}
function compareSelector(letter,id){
  const m=state.data.models.find(x=>x.id===id)||state.data.models[0];
  return `<div class="compare-model">${brandLogo(m.brand)}<div style="flex:1"><strong>${letter} · ${esc(m.name)}</strong><div class="muted">${esc(m.provider)} · ${esc(m.kind)}</div></div><select class="select compare-select" data-compare="${letter}">${state.data.models.map(x=>`<option value="${x.id}" ${x.id===id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div>`;
}
function filteredCasesForProbe(){
  const f = state.probeFilter || 'all';
  return state.data.cases.filter(c => {
    if (f==='all') return true;
    if (f==='video') return c.modality==='video' || c.type==='video';
    if (f==='protocol') return c.category==='协议支持' || c.category==='Schema 一致性' || c.type==='protocol' || c.type==='schema';
    return c.modality!=='video' && c.type!=='video';
  });
}

function simulateConsistency(n=100){
  const styles = [
    { id:'A', title:'标准 chat.completion', sample:{ id:'chatcmpl-xxx', object:'chat.completion', created:1710000000, model:'qianfan-vl-v1', choices:[{index:0, message:{role:'assistant', content:'Hello! How can I help?'}, finish_reason:'length'}], usage:{prompt_tokens:1, completion_tokens:8, total_tokens:9} } },
    { id:'B', title:'content 变为数组', sample:{ id:'chatcmpl-xxx', object:'chat.completion', created:1710000000, model:'qianfan-vl-v1', choices:[{index:0, message:{role:'assistant', content:[{type:'text', text:'Hello!'}]}, finish_reason:'length'}], usage:{prompt_tokens:1, completion_tokens:8, total_tokens:9} } },
    { id:'C', title:'缺 usage，多 system_fingerprint', sample:{ id:'chatcmpl-xxx', object:'chat.completion', created:1710000000, choices:[{index:0, message:{role:'assistant', content:''}, finish_reason:'length'}], system_fingerprint:'fp_9c8' } }
  ];
  const counts = { A:72, B:19, C:9 };
  const fields = [
    { path:'id', type:'string', stable:'always-change', note:'每次请求都不同' },
    { path:'created', type:'number', stable:'always-change', note:'时间戳递增' },
    { path:'object', type:'string', stable:'stable', note:'始终 chat.completion' },
    { path:'model', type:'string', stable:'unstable', note:'样式 C 缺失' },
    { path:'choices[].message.content', type:'string | array | empty', stable:'unstable', note:'字符串 / 数组 / 空串' },
    { path:'usage', type:'object | missing', stable:'unstable', note:'9 次缺失' },
    { path:'system_fingerprint', type:'string | missing', stable:'unstable', note:'仅样式 C 出现' }
  ];
  return { n, counts, styles, fields, prompt:'Hi', max_tokens:16 };
}

function casePayload(c){
  if (c.type==='consistency') {
    return {
      request: { model:c.model, messages:[{role:'user', content:'Hi'}], max_tokens:16, temperature:0 },
      actual: { model:c.model, messages:[{role:'user', content:'Hi'}], max_tokens:16, temperature:0 },
      response: simulateConsistency(),
      assertions: [
        ['fail','字段结构一致','100 次出现 3 种响应体样式：content 字符串 / content 数组 / 缺 usage'],
        ['fail','取值稳定性','id、created 必变；content、model、usage 不稳定'],
        ['warn','短输出截断','max_tokens=16 导致部分 content 为空串，finish_reason=length']
      ]
    };
  }
  if (c.id==='as-is6jhv0sez') return {
    request:{ model:'qianfan-vl-v1', stream:true, stream_options:{include_usage:true}, tool_choice:'none', tools:[{type:'function', function:{name:'get_weather'}}], messages:[{role:'user', content:'请查询北京的天气，必须调用 get_weather 工具，不要直接回答。'}] },
    actual:{ model:'qianfan-vl-v1', stream:true, stream_options:{include_usage:true}, tool_choice:'auto', tools:[{type:'function', function:{name:'get_weather'}}], messages:[{role:'user', content:'请查询北京的天气，必须调用 get_weather 工具，不要直接回答。'}] },
    assertions:[['pass','tools 已发送','实际请求包含 get_weather'],['fail','tool_choice=none 生效','被改写为 auto，发生 1 次工具调用'],['warn','响应兼容性','返回 tool_calls，与预期冲突']]
  };
  if (c.type==='stop') return {
    request:{ model:'qianfan-vl-v1', stop:['橘子'], stream:true, messages:[{role:'user', content:'请依次说出：苹果、香蕉、橘子、西瓜、葡萄。'}] },
    actual:{ model:'qianfan-vl-v1', stop:['橘子'], stream:true, messages:[{role:'user', content:'请依次说出：苹果、香蕉、橘子、西瓜、葡萄。'}] },
    assertions:[['pass','stop 字段已发送','实际请求包含 stop 序列'],['fail','响应在 stop 前结束','仍返回“橘子、西瓜、葡萄”'],['warn','finish_reason','Provider 返回 stop，但内容未截断']]
  };
  if (c.type==='token') return {
    request:{ model:'qianfan-vl-v1', messages:[{role:'user', content:'用一句话介绍北京。'}] },
    actual:{ model:'qianfan-vl-v1', messages:[{role:'user', content:'用一句话介绍北京。'}] },
    assertions:[['pass','请求体完全一致','连续 100 次输入相同'],['fail','usage.prompt_tokens 稳定','观察到 86 / 87 / 89'],['warn','响应文本一致','内容一致但 usage 抖动']]
  };
  if (c.type==='video') return {
    request:{ model:'doubao-seedance-1-0-pro-250528', content:[{type:'text', text:'一只白色纸飞机飞过城市'}], duration:5, resolution:'1080p', watermark:false },
    actual:{ model:'doubao-seedance-1-0-pro-250528', content:[{type:'text', text:'一只白色纸飞机飞过城市'}], duration:5, resolution:'1080p', watermark:false },
    assertions:[['pass','原厂 task id 保留','cgt-20260606160057-6bbjd'],['pass','视频地址保留','content.video_url 可访问，24h 过期'],['warn','终态枚举','部分兼容层把 succeeded 改成 completed']]
  };
  if (c.protocol==='gemini') return {
    request:{ contents:[{role:'user', parts:[{text:'What is JSON?'}]}], generationConfig:{ maxOutputTokens:64 } },
    actual: c.status==='fail' ? { messages:[{role:'user', content:'What is JSON?'}] } : { contents:[{role:'user', parts:[{text:'What is JSON?'}]}], generationConfig:{ maxOutputTokens:64 } },
    assertions: c.status==='fail'
      ? [['fail','保持 Gemini Native','contents 被改写成 messages'],['pass','鉴权头存在','Bearer / API key 已发送'],['warn','错误可诊断','400 明确指向未知字段 messages']]
      : [['pass','Native 路径','generateContent 被原样接受'],['pass','角色映射','assistant → model'],['pass','parts 结构','未扁平化为 string']]
  };
  if (c.protocol==='anthropic') return {
    request:{ model:'claude-3-5-sonnet-20241022', max_tokens:256, system:'You are a protocol probe.', messages:[{role:'user', content:'ping'}] },
    actual:{ model:'claude-3-5-sonnet-20241022', max_tokens:256, system:'You are a protocol probe.', messages:[{role:'user', content:'ping'}] },
    assertions:[['pass','max_tokens 必填','未丢字段'],['pass','system 顶层','没有塞进 messages'],['warn','鉴权头','需确认 x-api-key 而非仅 Bearer']]
  };
  if (c.protocol==='openai-responses') return {
    request:{ model:'gpt-4.1', instructions:'Return JSON.', input:[{role:'user', content:'ping'}], text:{ format:{ type:'json_schema', name:'Probe', schema:{type:'object', properties:{ok:{type:'boolean'}}, required:['ok'], additionalProperties:false } } } },
    actual:{ model:'gpt-4.1', instructions:'Return JSON.', input:[{role:'user', content:'ping'}] },
    assertions:[['pass','/v1/responses 可达','HTTP 200'],['fail','max_tokens 映射','未转成 max_output_tokens'],['warn','会话状态','previous_response_id 被忽略']]
  };
  return {
    request:{ model:c.model, messages:[{role:'user', content:'protocol probe'}] },
    actual:{ model:c.model, messages:[{role:'user', content:'protocol probe'}] },
    assertions:[['pass','最小请求成功','HTTP 200'],['pass','object 字段','符合目标协议'],['pass','无多余改写','关键字段保持原样']]
  };
}

function probeDetail(c){
  const payload = casePayload(c);
  const cons = c.type==='consistency' ? payload.response : null;
  const isVideo = c.type==='video';
  return `<div class="panel">
    <div class="run-banner"><div><strong>${esc(c.name)}</strong><div class="muted">${esc(c.code)} · ${esc(c.provider)} / ${esc(c.model)}${c.params?` · ${esc(c.params.attempts)} ✗`:''}</div></div>${statusPill(c.status)}</div>
    <div class="toolbar"><div class="toolbar-left"><span class="muted">${esc(c.summary)}</span></div><div class="toolbar-right"><button class="btn" data-action="rerun-case">${icon('rotate-cw')}<span>重跑</span></button><button class="btn" data-action="copy-request">${icon('copy')}<span>复制请求</span></button></div></div>
    <div class="metric-grid" style="margin-bottom:16px">${metric('协议', c.protocol||'openai-chat')}${metric(cons?'重复次数':'HTTP', cons?cons.n:(isVideo?'202':'200'))}${metric(cons?'响应样式':'TTFT', cons?Object.keys(cons.counts).length:'620 ms')}${metric('结论', c.status==='pass'?'通过':c.status==='warn'?'部分通过':'失败')}</div>
    <h3 class="panel-title">请求与实际发送</h3>
    <div class="diff-grid"><div class="diff-box"><header>用户配置请求</header><pre>${esc(JSON.stringify(payload.request,null,2))}</pre></div><div class="diff-box actual"><header>实际发送请求</header><pre>${esc(JSON.stringify(payload.actual,null,2))}</pre></div></div>
    ${cons ? consistencyBlock(cons) : ''}
    ${isVideo ? `<h3 class="panel-title" style="margin-top:18px">视频任务链路</h3><div class="flow"><div class="flow-step"><small>01 · POST</small><b>/contents/generations/tasks</b><span>202</span></div><div class="flow-arrow">›</div><div class="flow-step"><small>02 · id</small><b>cgt-2026…-6bbjd</b><span>已保留</span></div><div class="flow-arrow">›</div><div class="flow-step"><small>03 · GET</small><b>succeeded</b><span>32 秒</span></div><div class="flow-arrow">›</div><div class="flow-step"><small>04 · media</small><b>video_url</b><span>24h 过期</span></div></div>` : ''}
    <h3 class="panel-title" style="margin-top:18px">断言结果</h3>
    <div class="assertion-list">${payload.assertions.map(a=>`<div class="assertion ${a[0]}">${icon(a[0]==='pass'?'check-circle-2':a[0]==='fail'?'x-circle':'alert-circle')}<p><b>${a[1]}</b><br><span class="muted">${a[2]}</span></p></div>`).join('')}</div>
  </div>`;
}
function consistencyBlock(cons){
  return `<h3 class="panel-title" style="margin-top:18px">字段稳定性 · prompt=${esc(cons.prompt)} · max_tokens=${cons.max_tokens}</h3>
    <div class="table-wrap"><table class="data-table field-table"><thead><tr><th>字段路径</th><th>类型</th><th>稳定性</th><th>说明</th></tr></thead><tbody>
      ${cons.fields.map(f=>`<tr><td>${esc(f.path)}</td><td>${esc(f.type)}</td><td>${esc(f.stable)}</td><td class="muted">${esc(f.note)}</td></tr>`).join('')}
    </tbody></table></div>
    <h3 class="panel-title" style="margin-top:18px">出现过的响应体样式</h3>
    ${cons.styles.map(s=>`<div class="diff-box" style="margin-bottom:10px"><header>样式 ${s.id} · ${esc(s.title)} · ${cons.counts[s.id]} / ${cons.n}</header><pre>${esc(JSON.stringify(s.sample,null,2))}</pre></div>`).join('')}`;
}

function analyzeText(text){
  const t = text.toLowerCase();
  const hits = [];
  const add = (conf, title, why, cases) => hits.push({ conf, title, why, cases });
  if (/tool_choice|tool_calls|get_weather/.test(t)) add(92,'tool_choice 被改写或被模型忽略','兼容层常把 none 变成 auto。',['TP-001']);
  if (/prompt_tokens|token 抖|86|87|89/.test(t)) add(88,'Prompt Token 不稳定','相同请求出现多档 usage，优先查隐式 system 注入。',['TK-004']);
  if (/\bhi\b|max_tokens|一致性|字段结构/.test(t)) add(90,'响应体 Schema 漂移','短请求重复采样最容易暴露 content 类型不一致。',['TK-010']);
  if (/contents|generatecontent|gemini/.test(t)) add(86,'Gemini Native 被转成 Chat Completions','contents/parts/role=model 是原厂结构，不能改成 messages。',['PX-002','VOD-001']);
  if (/x-api-key|anthropic|\/v1\/messages|max_tokens 必填/.test(t)) add(84,'Messages 协议鉴权或必填项丢失','德国站走 /v1/messages，需要 x-api-key 与 max_tokens。',['PX-004','VOD-002','PX-012']);
  if (/responses|previous_response_id|max_output_tokens/.test(t)) add(80,'Responses 字段未映射','max_tokens ≠ max_output_tokens，会话状态常被丢掉。',['PX-005','TP-009']);
  if (/json_schema|response_schema|output_config|structured/.test(t)) add(83,'Schema 字段路径不一致','四家参数名不同；Gemini 拒绝 items:{}。',['PX-006','PX-007','PX-008','PX-009']);
  if (/cgt|video_url|seedance|succeeded|completed/.test(t)) add(87,'视频任务终态/字段丢失','原厂 id 在 cgt-*，终态 succeeded，URL 24h 过期。',['VD-006','VD-008']);
  if (/stop|截断|橘子/.test(t)) add(78,'stop 已发送但不生效','属于行为不生效，不一定是字段丢失。',['TP-003']);
  if (/ttft|p90|压测|otps|sla/.test(t)) add(82,'性能 SLA 未达标','按输入档位看 TTFT P90 与 OTPS≥30。128k 常见超时。',['#P01']);
  if (/aime|hle|mmlu|评测|judge/.test(t)) add(81,'效果评测低于基线','HLE/SimpleQA 需 Judge；允许 ±4% 浮动。',['#E01']);
  if (!hits.length) add(42,'信息不足，先跑协议冒烟','建议先跑 S1 连通性 + S6 协议矩阵，再针对错误码缩小范围。',['PX-001']);
  hits.sort((a,b)=>b.conf-a.conf);
  return { hits, excerpt: text.slice(0,240) };
}
function renderAnalysis(a){
  return `<div style="margin-top:16px"><h3 class="panel-title">可能性分析</h3>
    ${a.hits.map(h=>`<div class="assertion ${h.conf>=85?'fail':h.conf>=70?'warn':'pass'}"><p><b>${h.conf}% · ${esc(h.title)}</b><br><span class="muted">${esc(h.why)}</span><br><span class="muted">关联用例 ${h.cases.join(' / ')}</span></p></div>`).join('')}
  </div>`;
}

function renderDoc(id){
  const kb = (state.data.knowledge||[]).map(k=>`<h3>${esc(k.title)}</h3><p>${esc(k.body)}</p><p class="muted">${esc(k.source)} · ${esc(k.analysis||'')}</p>`).join('');
  const map = {
    quickstart: `<h2>快速开始</h2><p>配置 Provider → 核对模型能力矩阵 → 选择套件或单条 Probe → 对比“用户配置请求 / 实际发送请求”→ 把失败证据沉淀进报告和客户知识库。</p><h3>本地原型约定</h3><ul><li>页面可直接用 file:// 打开，数据写在 localStorage 键 ${esc(DATA_KEY)}。</li><li>不会把 API Key 发到外网；连接测试是模拟结果。</li><li>首页统计全部由当前 providers / models / cases 计算。</li></ul>`,
    judge: `<h2>判定规则</h2><table><thead><tr><th>现象</th><th>判定</th></tr></thead><tbody>
      <tr><td>实际请求字段被改名/改值</td><td>网关改写</td></tr>
      <tr><td>字段在请求中，但模型行为不变</td><td>参数不生效</td></tr>
      <tr><td>Provider 返回明确 unsupported</td><td>能力缺口</td></tr>
      <tr><td>响应缺字段或类型漂移</td><td>Schema 不一致</td></tr>
      <tr><td>无法看到实际上游请求</td><td>证据不足，不能判改写</td></tr>
    </tbody></table>`,
    protocols: `<h2>四协议对照</h2><table><thead><tr><th></th>${state.data.protocols.map(p=>`<th>${esc(p.name)}</th>`).join('')}</tr></thead><tbody>
      ${[['路径','path'],['鉴权','auth'],['System','system'],['历史','history'],['角色','roles'],['工具','tools'],['Schema','schema'],['流式','stream']].map(([label,key])=>`<tr><th>${label}</th>${state.data.protocols.map(p=>`<td>${esc(p[key])}</td>`).join('')}</tr>`).join('')}
    </tbody></table><p>Chat Completions 是兼容层事实标准；要原厂能力（Claude thinking、Gemini thought signature、OpenAI 内置工具）必须走 Native。</p>`,
    schema: `<h2>Schema 一致性</h2><p>同一份 JSON Schema 在四家里的挂载点不同：</p><ul><li>Chat Completions：<code>response_format.json_schema</code>，通常需要 name + strict + additionalProperties:false</li><li>Responses：<code>text.format</code></li><li>Anthropic：<code>output_config.format</code>，不要 name</li><li>Gemini：<code>response_schema</code> + <code>response_mime_type</code>，数组 items 必须有 type</li></ul><p>PX-009 失败就是把 OpenAI 风格 <code>items:{}</code> 直接打到 Gemini。</p>`,
    consistency: `<h2>响应一致性测试</h2><p>默认 prompt=<code>Hi</code>，<code>max_tokens=16</code>，重复 N=100。对比每次响应的字段路径+类型，统计 id/created/content 稳定性，并展示全部出现过的响应体样式。</p><p>当前样本：第 1 次尝试 · 第 1 轮 ✗。样式 A 72 次、B 19 次、C 9 次。</p>`,
    cases: `<h2>测试用例库</h2>${state.data.cases.map(c=>`<h3>${esc(c.code)} ${esc(c.name)}</h3><p>${esc(c.summary)}</p>`).join('')}`,
    examples: `<h2>示例详情</h2>
      <h3>Chat Completions</h3><pre class="code-block">${esc(`POST /v1/chat/completions
{"model":"gpt-4o","messages":[{"role":"user","content":"Hi"}],"max_tokens":16}`)}</pre>
      <h3>Gemini Native</h3><pre class="code-block">${esc(`POST /v1beta/models/gemini-2.5-pro:generateContent
{"contents":[{"role":"user","parts":[{"text":"Hi"}]}],"generationConfig":{"maxOutputTokens":16}}`)}</pre>
      <h3>Anthropic Messages</h3><pre class="code-block">${esc(`POST /v1/messages
{"model":"claude-3-5-sonnet","max_tokens":16,"messages":[{"role":"user","content":"Hi"}]}`)}</pre>
      <h3>OpenAI Responses</h3><pre class="code-block">${esc(`POST /v1/responses
{"model":"gpt-4.1","input":[{"role":"user","content":"Hi"}],"max_output_tokens":16}`)}</pre>
      <h3>Seedance 视频任务</h3><pre class="code-block">${esc(`POST /api/v3/contents/generations/tasks
{"model":"doubao-seedance-1-0-pro-250528","content":[{"type":"text","text":"纸飞机飞过城市"}],"duration":5,"watermark":false}
# 轮询 GET /api/v3/contents/generations/tasks/{id}
# 终态 succeeded，视频在 content.video_url`)}</pre>`,
    'vod-overview': `<h2>VOD 开通与区域</h2><p>来源：飞书用户手册总览（计费 / 鉴权 / 任务详情 / 媒资上传 / API / 多模态 / 视频超分 / 字幕擦除）。</p>
      <h3>国内站（北京）</h3><p>进入 VOD 控制台即开通。文档：cloud.baidu.com/product/vod.html。API 域名：<code>https://vod.bj.baidubce.com</code>。</p>
      <h3>国际站（香港）</h3><p>海外对海外，美元结算。模型：BG、BO、BGL、BD。登录海外账号后到 VOD 控制台创建 API Key。调用：</p>
      <pre class="code-block">${esc(`curl -X POST "https://vod2.hkg.baidubce.com/v3/chat/gc/v1beta/models/{model}:generateContent" \\
  -H "Authorization: Bearer {your_api_key}" -d "{your_request_body}"`)}</pre>
      <h3>美国站</h3><p>通过北京控制台创建 API Key，人民币结算，模型 BG、BO、BGL。域名：<code>https://overseas.exp.bcevod.com</code>，路径 <code>/v1beta/models/{model}:generateContent</code>。</p>
      <h3>德国站</h3><p>通过香港控制台创建德国 API Key，模型 BGL、BD。调用：</p>
      <pre class="code-block">${esc(`curl -X POST "https://overseas-de.exp.bcevod.com/v1/messages" \\
  -H "Authorization: Bearer {your_api_key}" -d "{your_request_body}"`)}</pre>`,
    'vod-auth': `<h2>鉴权</h2><p>国内站常见 BCE 签名头：<code>Authorization</code>、<code>x-bce-date</code>、<code>x-bce-request-id</code>。海外对话接口多用 <code>Authorization: Bearer {API Key}</code>。</p><p>协议与鉴权必须成对：Messages 原厂期望 <code>x-api-key</code>；Gemini 原厂期望 <code>x-goog-api-key</code> 或 query key。网关若只转发 Bearer，可能在原厂侧 401。</p>`,
    'vod-billing': `<h2>计费</h2><p>VOD 视频处理按次数，视频合成按输出时长与分辨率档位（LD/SD/HD）。大模型对话按 token：prompt_tokens / completion_tokens，可能含 cached / audio / image / reasoning 分项。</p><p>视频生成成功才计费；Seedance 类任务看 <code>usage.completion_tokens</code>，URL 通常 24 小时过期，过期重拉会失败但不一定再计费。</p>`,
    'vod-task': `<h2>查询任务详情</h2><p>异步任务（视频生成、超分、字幕擦除）都是「提交得到 task id → GET 详情」。注意终态枚举：方舟 Seedance 为 <code>succeeded</code>，不要只认 <code>completed</code>。详情里应保留原厂 id、状态时间线、错误码和媒资 URL。</p>`,
    'vod-media': `<h2>媒资上传</h2><p>先拿上传凭证，再传文件，最后把媒资 id 写进多模态 <code>image_url</code> / <code>video_url</code> / Gemini <code>fileData</code>。不要把一次性签名 URL 存成永久地址。</p>`,
    'vod-api': `<h2>API 调用</h2><p>北京站多模态对话示例（OpenAI 兼容）：<code>POST /v2/chat/completions</code>，host <code>vod.bj.baidubce.com</code>。角色支持 model / user / assistant。香港站走 Gemini Native generateContent；德国站走 Anthropic Messages。</p>`,
    'vod-mm': `<h2>多模态模型</h2><p>G3FP / G3PP / G31PP 走 Chat Completions。海外 BG/BO/BGL/BD 按站点协议不同。视频理解与视频生成不是同一条 API：理解走对话，生成走任务接口。</p>`,
    'vod-sr': `<h2>视频超分 / 字幕擦除</h2><p>超分按输出分辨率时长计费；字幕擦除识别对白区域后还原被遮挡画面，支持中英文字幕常见字体与特效。两者都是异步任务，查询方式与视频生成相同。</p>`,
    'perf-sla': `<h2>性能验收 SLA</h2><p>口径对齐 THVV <code>sla_eval.py</code>。按 InputTokens（不含 cache）分档，TTFT 单位为秒。</p>
      <table><thead><tr><th>档位</th><th>P50</th><th>P90</th></tr></thead><tbody>
      ${(state.data.slaTiers||[]).map(t=>`<tr><td>${esc(t.id)}（${t.lo}–${t.hi}）</td><td>&lt; ${t.p50}s</td><td>&lt; ${t.p90}s</td></tr>`).join('')}
      </tbody></table>
      <h3>测试要求</h3><ul><li>低并发预热 5 分钟，排除冷启动</li><li>按并发梯度压测 10–15 分钟，稳定后采集</li><li>TPM/RPM 未达承诺时，请求成功率仍须满足 SLA</li><li>OTPS：&gt;10B 模型 L1 ≥ 30 tok/s，L2 ≥ 10；≤10B ≥ 100</li></ul>
      <p>性能页当前样本：128k 档 P90=41.2s，超过 &lt;128K 的 35s 阈值，总体部分通过。</p>`,
    'eval-bench': `<h2>效果评测数据集</h2><p>11 个数据集，基于 EvalScope。基线允许 ±2–4% 浮动。</p>
      <table><thead><tr><th>数据集</th><th>repeats</th><th>Judge</th><th>Docker</th><th>基线</th></tr></thead><tbody>
      ${(state.data.evalDatasets||[]).map(d=>`<tr><td>${esc(d.name)} · ${esc(d.desc)}</td><td>${d.repeats}</td><td>${d.judge?'是':'否'}</td><td>${d.docker?'是':'否'}</td><td>${d.baseline||'—'}</td></tr>`).join('')}
      </tbody></table>
      <p>HLE / SimpleQA 必须配置独立 Judge（默认 deepseek-v4-pro，密钥不入库）。限流 429 等待 60s 后 <code>--use-cache</code> 续跑。</p>`,
    thvv: `<h2>THVV 对照</h2><p>TokenHub Vendor Verifier 是供应商引入前的 CLI 验证集：<code>perf</code> 做 1k–200k 压测并产出 HTML/xlsx，<code>eval</code> 跑 11 数据集并产出六章效果报告。</p>
      <ul><li>本工作台把 THVV 的档位、SLA、数据集和报告结构做成可浏览的供应商验收页。</li><li>仍保留协议验真、透传 Probe、视频任务和客户问询。</li><li>静态原型不发起真实压测；密钥只允许本机填写，不会写入仓库。</li></ul>
      <p>perf 报告四章：总体结论 / 并发梯度 37 列指标 / 失败分析 / 失败请求明细。eval 报告六章：核心结论 / 稳定性 / 体验性能 / 配置 / 逐题证据 / 异常跳过。</p>`,
    kb: `<h2>客户知识库</h2><p>客户问询页上传的用例会追加到这里，供后续分析复用。</p>${kb || '<p class="muted">暂无条目</p>'}`
  };
  return map[id] || map.quickstart;
}

function perfReportHtml(){
  const rows = state.data.perfRuns||[];
  const pass = rows.filter(r=>slaPass(r).ok).length;
  return `<div class="metric-grid">${metric('总请求', rows.reduce((a,b)=>a+b.n,0))}${metric('成功', rows.reduce((a,b)=>a+b.ok,0))}${metric('失败', rows.reduce((a,b)=>a+b.fail,0))}${metric('SLA', pass+'/'+rows.length)}</div>
    <h4 style="margin:16px 0 8px">一、总体结论</h4><p>128k 档 TTFT P90 超时，OTPS 跌破 30。建议降并发并核对该档 tokenizer 计长。</p>
    <h4 style="margin:16px 0 8px">二、失败分析</h4><p class="muted">超时与 429 为主，context overflow 仅出现在 200k。</p>
    <h4 style="margin:16px 0 8px">三、处置建议</h4><ul><li>128k 以上先跑 conc=1 预热 5 分钟</li><li>429 等待 60s 后续跑</li><li>核对 API_URL 是否为完整 /v1/chat/completions 或 /v1/messages</li></ul>`;
}
function evalReportHtml(){
  const ds = state.data.evalDatasets||[];
  const runs = state.data.evalRuns||[];
  const fail = runs.filter(r=>r.status==='fail');
  return `<div class="metric-grid">${metric('数据集', ds.length)}${metric('达标', runs.filter(r=>r.status==='pass').length)}${metric('低于基线', fail.length)}${metric('跳过', runs.filter(r=>r.status==='skip').length)}</div>
    <h4 style="margin:16px 0 8px">核心结论</h4><p>HLE 26.4 vs 32.35、SimpleQA 31.2 vs 37.56，超出 ±4% 容差。其余数据集在容差内。</p>
    <h4 style="margin:16px 0 8px">配置</h4><p class="muted">PROTOCOL=openai，Judge 已配置（密钥已脱敏）。SWE-Bench Pro 未跑。</p>
    <h4 style="margin:16px 0 8px">异常跳过</h4><p class="muted">HLE 跳过 6 题、SimpleQA 跳过 4 题，多为限流后 ignore_errors。</p>`;
}
function openModal(title, body, foot=''){
  const layer=document.querySelector('#modal-layer');
  layer.innerHTML=`<div class="modal" role="dialog"><div class="modal-head"><h3>${title}</h3><button class="modal-close" data-action="close-modal">×</button></div><div class="modal-body">${body}</div>${foot?`<div class="modal-foot">${foot}</div>`:''}</div>`;
  layer.classList.add('show');
}
function closeModal(){ document.querySelector('#modal-layer').classList.remove('show'); }
function toast(message,type=''){
  const el=document.createElement('div');
  el.className=`toast ${type}`;
  el.innerHTML=`${icon(type==='error'?'x-circle':'check-circle-2')}<span>${esc(message)}</span>`;
  document.querySelector('#toast-region').appendChild(el);
  if (window.lucide) window.lucide.createIcons();
  setTimeout(()=>el.remove(), 2800);
}
function providerForm(p={name:'',type:'OpenAI 兼容',endpoint:'',key:''}){
  return `<form id="provider-form"><div class="form-grid">
    <div class="form-field"><label>名称</label><input class="input" name="name" value="${esc(p.name)}" required></div>
    <div class="form-field"><label>接入方式</label><select class="select" name="type"><option>OpenAI 兼容</option><option>原厂 REST API</option><option>视频 / 原厂 API</option></select></div>
    <div class="form-field full"><label>API Base URL</label><input class="input" name="endpoint" value="${esc(p.endpoint)}" required></div>
    <div class="form-field full"><label>API Key</label><div class="secret-wrap"><input class="input" name="key" type="password" value="${esc(p.key||'')}"><button type="button" data-action="toggle-secret">${icon('eye')}</button></div><span class="hint">仅保存在本机。</span></div>
  </div></form>`;
}

function handleAction(action, el){
  if (action==='toggle-sidebar'){ document.querySelector('.sidebar').classList.toggle('open'); document.querySelector('.mobile-backdrop').classList.toggle('show'); return; }
  if (action==='open-search'){
    openModal('搜索工作台', `<input class="input" id="global-search" placeholder="用例、模型、协议、手册"><div id="search-hits" class="empty-state">输入关键字</div>`);
    const input=document.querySelector('#global-search');
    input?.addEventListener('input', () => {
      const q=input.value.trim().toLowerCase();
      const hits=[
        ...state.data.cases.map(c=>({t:c.name+c.code+c.summary, label:`${c.code} ${c.name}`, go:()=>{state.probeCase=c.id; navigate('probe');}})),
        ...state.data.models.map(m=>({t:m.name+m.provider, label:`模型 ${m.name}`, go:()=>navigate('matrix')})),
        ...state.data.docs.map(d=>({t:d.title+d.group, label:`文档 ${d.title}`, go:()=>{state.docId=d.id; navigate('docs');}})),
        {t:'性能压测 sla ttft', label:'性能压测', go:()=>navigate('perf')},
        {t:'效果评测 aime hle', label:'效果评测', go:()=>navigate('eval')}
      ].filter(x=>q && x.t.toLowerCase().includes(q)).slice(0,8);
      document.querySelector('#search-hits').innerHTML = hits.length ? hits.map((h,i)=>`<button class="probe-case" data-hit="${i}"><b>${esc(h.label)}</b></button>`).join('') : '<div class="empty-state">没有匹配</div>';
      document.querySelectorAll('[data-hit]').forEach((btn,i)=>btn.addEventListener('click',()=>{ closeModal(); hits[i].go(); }));
    });
    return;
  }
  if (action==='show-notifications'){ openModal('通知', `<div class="assertion-list"><div class="assertion fail">${icon('x-circle')}<p><b>TK-010 第1轮失败</b><br><span class="muted">Hi×100 出现 3 种响应体样式。</span></p></div><div class="assertion warn">${icon('alert-circle')}<p><b>PX-009 Gemini Schema</b><br><span class="muted">items:{} 被拒绝。</span></p></div></div>`); return; }
  if (action==='profile-menu'){ openModal('用户', `<div class="row"><span>账号</span><strong>测试员</strong></div><div class="row"><span>工作区</span><strong>本地 file://</strong></div>`, btn('关闭','close-modal','btn-primary')); return; }
  if (action==='open-settings'){ openModal('系统设置', `<div class="form-grid"><div class="form-field"><label>默认区域</label><select class="select"><option>北京</option><option>香港</option><option>美国</option><option>德国</option></select></div><div class="form-field"><label>报告格式</label><select class="select"><option>HTML</option><option>Markdown</option><option>JSON</option></select></div></div>`, btn('保存设置','save-settings','btn-primary')); return; }
  if (action==='close-modal'){ closeModal(); return; }
  if (action==='add-provider'){ openModal('添加 Provider', providerForm(), btn('取消','close-modal')+btn('保存','save-provider','btn-primary')); return; }
  if (action==='save-provider'){ document.querySelector('#provider-form')?.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true})); return; }
  if (action==='import-provider' || action==='import-suite'){ toast('已打开导入模板'); return; }
  if (action==='refresh-providers'){ toast('Provider 状态已刷新'); return; }
  if (action==='add-model'){ openModal('添加模型', `<form id="model-form"><div class="form-grid"><div class="form-field"><label>名称</label><input class="input" name="name" required></div><div class="form-field"><label>Provider</label><select class="select" name="provider">${state.data.providers.map(p=>`<option>${esc(p.name)}</option>`).join('')}</select></div><div class="form-field"><label>类型</label><select class="select" name="kind"><option>文本</option><option>文本 / 视觉</option><option>视觉</option><option>视频生成</option></select></div><div class="form-field"><label>上下文</label><input class="input" name="context" value="128K"></div></div></form>`, btn('取消','close-modal')+btn('保存模型','save-model','btn-primary')); return; }
  if (action==='save-model'){ document.querySelector('#model-form')?.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true})); return; }
  if (action==='new-probe'){ openModal('新建探测', `<form id="case-form"><div class="form-grid"><div class="form-field"><label>名称</label><input class="input" name="name" required></div><div class="form-field"><label>分类</label><select class="select" name="category"><option>参数透传</option><option>Token Probe</option><option>协议支持</option><option>Schema 一致性</option><option>视频生成</option></select></div><div class="form-field full"><label>请求体</label><textarea class="textarea" name="body">{"model":"gpt-4o","messages":[{"role":"user","content":"Hi"}],"max_tokens":16}</textarea></div></div></form>`, btn('取消','close-modal')+btn('创建用例','save-case','btn-primary')); return; }
  if (action==='save-case'){ document.querySelector('#case-form')?.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true})); return; }
  if (action==='run-probe' || action==='rerun-case'){ state.runInProgress=true; render(); setTimeout(()=>{ state.runInProgress=false; toast('用例运行完成'); render(); }, 700); return; }
  if (action==='copy-request'){ const c=state.data.cases.find(x=>x.id===state.probeCase); navigator.clipboard?.writeText(JSON.stringify(casePayload(c).request,null,2)); toast('请求体已复制'); return; }
  if (action==='go-probe'){ navigate('probe'); return; }
  if (action==='go-suites'){ navigate('suites'); return; }
  if (action==='go-compare'){ navigate('compare'); return; }
  if (action==='go-perf'){ navigate('perf'); return; }
  if (action==='go-eval'){ navigate('eval'); return; }
  if (action==='run-perf'){ toast('已按 THVV bench-all 口径生成模拟矩阵'); navigate('perf'); return; }
  if (action==='run-eval'){ toast('已按 11 数据集生成模拟评测'); navigate('eval'); return; }
  if (action==='view-perf-report'){ const r=state.data.reports.find(x=>x.id==='#P01'); if(r) openModal(`${r.name}`, perfReportHtml(), btn('关闭','close-modal','btn-primary')); return; }
  if (action==='view-eval-report'){ const r=state.data.reports.find(x=>x.id==='#E01'); if(r) openModal(`${r.name}`, evalReportHtml(), btn('关闭','close-modal','btn-primary')); return; }
  if (action==='run-suite' || action==='run-protocol-suite'){ toast('套件已开始运行'); navigate('probe'); return; }
  if (action==='new-suite'){ toast('已创建空白套件'); return; }
  if (action==='run-compare'){ toast('A/B 对比完成'); return; }
  if (action==='save-compare'){ toast('对比方案已保存'); return; }
  if (action==='export-report' || action==='generate-report'){ toast('报告已生成'); return; }
  if (action==='save-settings'){ closeModal(); toast('设置已保存'); return; }
  if (action==='toggle-secret'){ const input=el.closest('.secret-wrap').querySelector('input'); input.type=input.type==='password'?'text':'password'; return; }
  if (action==='pick-customer-file'){ document.querySelector('#customer-file')?.click(); return; }
  if (action==='analyze-inquiry'){
    const text=document.querySelector('#inquiry-text')?.value || '';
    if (!text.trim()){ toast('请先填写问题或上传用例','error'); return; }
    state.inquiry=text; state.analysis=analyzeText(text);
    const item={ id:'kb-'+Date.now(), title:text.slice(0,36), source:'客户问询', tags:state.analysis.hits[0]?[state.analysis.hits[0].title]:['未分类'], body:text, analysis:state.analysis.hits.map(h=>`${h.conf}% ${h.title}`).join('；') };
    state.data.knowledge = [item, ...(state.data.knowledge||[])];
    persist(); toast('已写入知识库'); render(); return;
  }
  if (action==='clear-analysis'){ state.analysis=null; state.inquiry=''; render(); return; }
}

function navigate(route){
  state.route=route; location.hash=route;
  document.querySelector('.sidebar')?.classList.remove('open');
  document.querySelector('.mobile-backdrop')?.classList.remove('show');
  render();
}

function render(){
  const view = views[state.route] ? views[state.route]() : views.dashboard();
  document.querySelector('#app-content').innerHTML = view;
  const crumb=document.querySelector('#breadcrumb'); if(crumb) crumb.innerHTML = state.route==='dashboard' ? '' : esc(routeLabels[state.route]||'');
  document.querySelectorAll('.nav-item[data-route]').forEach(el => el.classList.toggle('is-active', el.dataset.route===state.route));
  if (window.lucide) window.lucide.createIcons();
}

document.addEventListener('click', e => {
  const route=e.target.closest('[data-route]')?.dataset.route; if(route){ navigate(route); return; }
  const actionEl=e.target.closest('[data-action]'); if(actionEl){ handleAction(actionEl.dataset.action, actionEl); return; }
  const probe=e.target.closest('[data-probe-case]')?.dataset.probeCase; if(probe){ state.probeCase=probe; render(); return; }
  const pf=e.target.closest('[data-provider-filter]')?.dataset.providerFilter; if(pf!==undefined){ state.providerFilter=pf; render(); return; }
  const mf=e.target.closest('[data-model-filter]')?.dataset.modelFilter; if(mf!==undefined){ state.modelFilter=mf; render(); return; }
  const st=e.target.closest('[data-suite-tab]')?.dataset.suiteTab; if(st){ state.suiteTab=st; render(); return; }
  const pt=e.target.closest('[data-provider-tab]')?.dataset.providerTab; if(pt){ state.providerTab=pt; render(); return; }
  const rt=e.target.closest('[data-report-tab]')?.dataset.reportTab; if(rt){ state.reportTab=rt; render(); return; }
  const doc=e.target.closest('[data-doc]')?.dataset.doc; if(doc){ state.docId=doc; if(state.route!=='docs') navigate('docs'); else render(); return; }
  const dash=e.target.closest('[data-dashboard-filter]')?.dataset.dashboardFilter; if(dash){ document.querySelectorAll('[data-dashboard-filter]').forEach(x=>x.classList.toggle('is-active', x.dataset.dashboardFilter===dash)); document.querySelector('#dashboard-records').innerHTML=dashboardRecords(dash); return; }
  const edit=e.target.closest('[data-provider-edit]')?.dataset.providerEdit; if(edit){ const p=state.data.providers.find(x=>x.id===edit); openModal('编辑 Provider', providerForm(p), btn('取消','close-modal')+btn('保存','save-provider','btn-primary')); return; }
  if (e.target.closest('[data-provider-test]')) { toast('连接测试通过，响应 620 ms'); return; }
  const detail=e.target.closest('[data-model-detail]')?.dataset.modelDetail; if(detail){ const m=state.data.models.find(x=>x.id===detail); openModal(m.name, `<div class="metric-grid">${metric('Provider',m.provider)}${metric('类型',m.kind)}${metric('上下文',m.context)}${metric('协议', (m.protocols||[]).join(', '))}</div><p class="muted" style="margin-top:12px">${(m.tags||[]).join(' · ')}</p>`, btn('关闭','close-modal','btn-primary')); return; }
  const openCase=e.target.closest('[data-open-case]')?.dataset.openCase; if(openCase){ state.probeCase=openCase; navigate('probe'); return; }
  const vs=e.target.closest('[data-view-suite]')?.dataset.viewSuite; if(vs){ const s=state.data.suites.find(x=>x.id===vs); openModal(`${s.id} ${s.name}`, `<p>${esc(s.desc)}</p>${s.cases.map(id=>{const c=state.data.cases.find(x=>x.id===id); return c?`<div class="record-row"><div class="record-main"><b>${esc(c.code)} ${esc(c.name)}</b><small>${esc(c.summary)}</small></div>${statusPill(c.status)}</div>`:''}).join('')}<div class="modal-foot">${btn('打开首条用例','', 'btn-primary')}</div>`, btn('关闭','close-modal')+`<button class="btn btn-primary" data-open-case="${s.cases[0]}">打开用例</button>`); return; }
  const vr=e.target.closest('[data-view-report]')?.dataset.viewReport; if(vr){ const r=state.data.reports.find(x=>x.id===vr); const extra = r.id==='#P01'?perfReportHtml(): r.id==='#E01'?evalReportHtml(): `<p style="margin-top:14px">${esc(r.note)}</p>`; openModal(`${r.name} ${r.id}`, `<div class="metric-grid">${metric('对象',r.target)}${metric('通过', r.passed+'/'+r.total)}${metric('时间', r.time)}${metric('类型', r.kind)}</div>${extra}`, btn('关闭','close-modal','btn-primary')); return; }
});

document.addEventListener('change', e => {
  if (e.target.matches('.compare-select')) { state.compare[e.target.dataset.compare]=e.target.value; render(); }
  if (e.target.id==='customer-file') {
    [...e.target.files].forEach(file => {
      const reader=new FileReader();
      reader.onload=()=>{
        const text=String(reader.result||'');
        state.inquiry = (state.inquiry? state.inquiry+'\n\n' : '') + `# ${file.name}\n` + text.slice(0,4000);
        const item={ id:'kb-'+Date.now()+file.name, title:file.name, source:'客户上传', tags:['上传'], body:text.slice(0,4000), analysis:'' };
        state.data.knowledge=[item, ...(state.data.knowledge||[])]; persist(); render(); toast(`已导入 ${file.name}`);
      };
      reader.readAsText(file);
    });
  }
});
document.addEventListener('change', e => {
  if (e.target.matches('[data-probe-filter]')) { state.probeFilter = e.target.value; render(); }
});
document.addEventListener('input', e => {
  if (e.target.id==='report-search'){
    state.reportQuery = e.target.value;
    const tab = state.reportTab; const q = state.reportQuery.trim().toLowerCase();
    const list = state.data.reports.filter(r => (tab==='全部报告'||r.kind===tab) && (!q || (r.name+r.target+r.id).toLowerCase().includes(q)));
    const box = document.querySelector('.report-list');
    if (box) box.innerHTML = list.map(reportCard).join('') || '<div class="empty-state">没有符合筛选的报告</div>';
    if (window.lucide) window.lucide.createIcons();
  }
  if (e.target.id==='provider-search'){
    state.providerQuery = e.target.value;
    const tab = state.providerTab; const q = state.providerQuery.toLowerCase();
    const rows = state.data.providers.filter(p => (tab==='all' || (tab==='native' ? !p.type.includes('兼容') : p.type.includes('兼容'))) && (!q || (p.name+p.type+p.endpoint).toLowerCase().includes(q)));
    const tb = document.querySelector('.data-table tbody');
    if (tb) tb.innerHTML = rows.map(providerRow).join('');
    if (window.lucide) window.lucide.createIcons();
  }
  if (e.target.id==='inquiry-text') state.inquiry = e.target.value;
});
document.addEventListener('dragover', e => { if (e.target.closest('.dropzone')) { e.preventDefault(); }});
document.addEventListener('drop', e => {
  const zone = e.target.closest('.dropzone');
  if (!zone) return;
  e.preventDefault();
  const files = [...(e.dataTransfer?.files||[])];
  files.forEach(file => {
    const reader=new FileReader();
    reader.onload=()=>{
      const text=String(reader.result||'');
      state.inquiry = (state.inquiry? state.inquiry+'\n\n' : '') + '# ' + file.name + '\n' + text.slice(0,4000);
      state.data.knowledge=[{ id:'kb-'+Date.now()+file.name, title:file.name, source:'客户上传', tags:['上传'], body:text.slice(0,4000), analysis:'' }, ...(state.data.knowledge||[])];
      persist(); render(); toast('已导入 ' + file.name);
    };
    reader.readAsText(file);
  });
});
document.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id==='provider-form'){
    const fd=new FormData(e.target);
    state.data.providers.push({ id:'provider-'+Date.now(), brand:'baidu', name:fd.get('name'), type:fd.get('type'), endpoint:fd.get('endpoint'), key:fd.get('key')||'••••••', models:0, status:'正常', checked:'刚刚' });
    persist(); closeModal(); toast('Provider 已保存'); render();
  }
  if (e.target.id==='model-form'){
    const fd=new FormData(e.target);
    const kind=fd.get('kind');
    state.data.models.push({ id:String(fd.get('name')).toLowerCase().replace(/[^a-z0-9]+/g,'-'), name:fd.get('name'), provider:fd.get('provider'), brand:'baidu', kind, modality: kind==='视频生成'?'video':kind==='视觉'?'vision':'text', context:fd.get('context'), tags:[], protocols:['openai-chat'], capability:{stream:'support', tools:'partial', video:kind==='视频生成'?'support':'unsupported', schema:'unknown', usage:'partial'} });
    persist(); closeModal(); toast('模型已添加'); render();
  }
  if (e.target.id==='case-form'){
    const fd=new FormData(e.target);
    const id='as-'+Date.now();
    state.data.cases.unshift({ id, code:'CS-NEW', name:fd.get('name'), category:fd.get('category'), model:'gpt-4o', provider:'OpenAI', status:'warn', summary:'新创建的探测用例', type:'text', modality:'text', protocol:'openai-chat' });
    state.probeCase=id; closeModal(); toast('测试用例已创建'); render();
  }
});
window.addEventListener('hashchange', () => { const route=location.hash.replace('#',''); if (route && views[route]) { state.route=route; render(); } });
document.addEventListener('keydown', e => { if ((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); handleAction('open-search'); }});
render();
