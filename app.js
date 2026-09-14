const state = {
  range: '1h',
  metric: 'trend',
  region: 'all',
  topic: 'all',
  query: '',
  data: []
};

const ranges = [
  ['1h','1小時'], ['1d','1天'], ['1w','1週'], ['1m','1個月'], ['6m','6個月'],
  ['1y','1年'], ['5y','5年'], ['10y','10年'], ['all','全部']
];
const metrics = [
  ['trend','🔥 爆紅'], ['views','👀 瀏覽'], ['likes','❤️ 按讚'], ['replies','💬 留言'], ['shares','🔁 分享']
];

const els = {
  rangeTabs: document.querySelector('#rangeTabs'), metricTabs: document.querySelector('#metricTabs'),
  region: document.querySelector('#regionFilter'), topic: document.querySelector('#topicFilter'),
  search: document.querySelector('#searchInput'), list: document.querySelector('#rankingList'),
  template: document.querySelector('#postTemplate'), empty: document.querySelector('#emptyState'),
  title: document.querySelector('#rankingTitle'), subtitle: document.querySelector('#rankingSubtitle'),
  heroTitle: document.querySelector('#heroTitle'), heroMeta: document.querySelector('#heroMeta'), heroStats: document.querySelector('#heroStats'),
  tracked: document.querySelector('#trackedCount'), newEntry: document.querySelector('#newEntryCount'), updatedAt: document.querySelector('#updatedAt'),
  refresh: document.querySelector('#refreshBtn')
};

function compact(n) {
  return new Intl.NumberFormat('zh-TW', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}
function pct(n) { return `${n >= 0 ? '+' : ''}${n.toFixed(0)}%`; }
function metricValue(post, metric) {
  if (metric === 'trend') return post.ranges[state.range]?.trend ?? 0;
  return post.ranges[state.range]?.[metric] ?? 0;
}
function deltaValue(post, metric) {
  return post.ranges[state.range]?.deltas?.[metric] ?? 0;
}

function makeTabs(target, items, key) {
  target.innerHTML = '';
  items.forEach(([value, label]) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = state[key] === value ? 'active' : '';
    btn.addEventListener('click', () => { state[key] = value; makeTabs(target, items, key); render(); });
    target.appendChild(btn);
  });
}

function render() {
  const filtered = state.data
    .filter(p => state.region === 'all' || p.region === state.region)
    .filter(p => state.topic === 'all' || p.topic === state.topic)
    .filter(p => !state.query || `${p.author} ${p.handle} ${p.text}`.toLowerCase().includes(state.query.toLowerCase()))
    .sort((a,b) => metricValue(b, state.metric) - metricValue(a, state.metric))
    .slice(0, 20);

  const rangeLabel = ranges.find(x => x[0] === state.range)?.[1] || '';
  const metricLabel = metrics.find(x => x[0] === state.metric)?.[1] || '';
  els.title.textContent = `${metricLabel} Top ${Math.min(20, filtered.length || 20)}`;
  els.subtitle.textContent = `依最近 ${rangeLabel} 的數據排序；資料架構已預留每小時快照。`;
  els.list.innerHTML = '';
  els.empty.hidden = filtered.length > 0;

  filtered.forEach((post, i) => {
    const node = els.template.content.cloneNode(true);
    const range = post.ranges[state.range];
    node.querySelector('.rank').textContent = `#${i+1}`;
    node.querySelector('.avatar').src = post.avatar;
    node.querySelector('.author').textContent = post.author;
    node.querySelector('.handle').textContent = post.handle;
    node.querySelector('.post-text').textContent = post.text;
    node.querySelector('.posted-at').textContent = `${post.postedAt} · ${post.region.toUpperCase()}`;
    node.querySelector('.open-link').href = post.url;
    const badges = node.querySelector('.badges');
    if (post.newEntry) badges.insertAdjacentHTML('beforeend', '<span class="badge">NEW</span>');
    badges.insertAdjacentHTML('beforeend', `<span class="badge">${post.topicLabel}</span>`);

    for (const m of ['views','likes','replies','shares']) {
      node.querySelector(`.${m}`).textContent = compact(range[m]);
      node.querySelector(`.${m}Delta`).textContent = `${range.deltas[m] >= 0 ? '+' : ''}${compact(range.deltas[m])}`;
    }
    node.querySelector('.trendScore').textContent = Math.round(range.trend).toLocaleString('zh-TW');
    node.querySelector('.growth').textContent = `${pct(range.growth)} 成長`;
    els.list.appendChild(node);
  });

  const top = filtered[0];
  if (top) {
    const r = top.ranges[state.range];
    els.heroTitle.textContent = top.text;
    els.heroMeta.textContent = `${top.author} ${top.handle} · ${top.postedAt}`;
    els.heroStats.innerHTML = `<span>Trend ${Math.round(r.trend)}</span><span>👀 ${compact(r.views)}</span><span>❤️ ${compact(r.likes)}</span><span>💬 ${compact(r.replies)}</span><span>🔁 ${compact(r.shares)}</span>`;
  }

  els.tracked.textContent = state.data.length.toLocaleString('zh-TW');
  els.newEntry.textContent = state.data.filter(p => p.newEntry).length.toString();
  els.updatedAt.textContent = new Date().toLocaleTimeString('zh-TW', {hour:'2-digit', minute:'2-digit'});
}

async function loadData() {
  const res = await fetch(`data/sample-posts.json?ts=${Date.now()}`);
  state.data = await res.json();
  render();
}

els.region.addEventListener('change', e => { state.region = e.target.value; render(); });
els.topic.addEventListener('change', e => { state.topic = e.target.value; render(); });
els.search.addEventListener('input', e => { state.query = e.target.value.trim(); render(); });
els.refresh.addEventListener('click', loadData);

makeTabs(els.rangeTabs, ranges, 'range');
makeTabs(els.metricTabs, metrics, 'metric');
loadData();
