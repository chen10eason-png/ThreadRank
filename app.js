const state={range:'1h',metric:'trend',region:'all',topic:'all',query:'',data:[]};
const ranges=[['1h','1小時'],['1d','1天'],['1w','1週'],['1m','1個月'],['6m','6個月'],['1y','1年'],['5y','5年'],['10y','10年'],['all','全部']];
const metrics=[['trend','🔥 爆紅'],['views','◉ 瀏覽'],['likes','♥ 按讚'],['replies','▣ 留言'],['shares','↗ 分享']];
const photos=[
'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85',
'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=85',
'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85',
'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80',
'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=700&q=80',
'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=700&q=80'
];
const avatarPhotos=[
'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
];
const $=s=>document.querySelector(s);
const els={rangeTabs:$('#rangeTabs'),metricTabs:$('#metricTabs'),region:$('#regionFilter'),topic:$('#topicFilter'),search:$('#searchInput'),list:$('#rankingList'),topThree:$('#topThree'),template:$('#postRowTemplate'),empty:$('#emptyState'),subtitle:$('#rankingSubtitle'),tracked:$('#trackedCount'),newEntry:$('#newEntryCount'),score:$('#spotlightScore'),topTopic:$('#topTopic'),refresh:$('#refreshBtn'),updated:$('#updatedLabel'),searchToggle:$('#searchToggle'),searchPanel:$('#searchPanel')};
function compact(n){return new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(n||0)}
function metricValue(p){const r=p.ranges[state.range]||{};return state.metric==='trend'?(r.trend||0):(r[state.metric]||0)}
function makeTabs(target,items,key){target.innerHTML='';for(const [value,label] of items){const b=document.createElement('button');b.textContent=label;b.className=state[key]===value?'active':'';b.onclick=()=>{state[key]=value;makeTabs(target,items,key);render()};target.appendChild(b)}}
function filtered(){return state.data.filter(p=>state.region==='all'||p.region===state.region).filter(p=>state.topic==='all'||p.topic===state.topic).filter(p=>!state.query||`${p.author} ${p.handle} ${p.text}`.toLowerCase().includes(state.query.toLowerCase())).sort((a,b)=>metricValue(b)-metricValue(a)).slice(0,20)}
function cardMarkup(p,i){const r=p.ranges[state.range]||{};return `<article class="post-card ${i===0?'featured':''}"><div class="post-media" style="background-image:url('${photos[i%photos.length]}')"><div class="rank-medal">${i+1}</div>${i===0?'<span class="live-tag">LIVE</span>':''}</div><div class="post-body"><div class="author-line"><img src="${avatarPhotos[i%avatarPhotos.length]}" alt=""><div><strong>${p.author}</strong><span>${p.handle} · ${p.postedAt}</span></div></div><p>${p.text}</p><div class="post-metrics"><span>◉ <b>${compact(r.views)}</b></span><span>♥ <b>${compact(r.likes)}</b></span><span>▣ <b>${compact(r.replies)}</b></span><span>↗ <b>${compact(r.shares)}</b></span></div></div></article>`}
function render(){const data=filtered();const rangeLabel=ranges.find(x=>x[0]===state.range)?.[1]||'';const metricLabel=metrics.find(x=>x[0]===state.metric)?.[1].replace(/^[^\s]+\s?/,'')||'';els.subtitle.textContent=`${rangeLabel} · ${metricLabel}排名 · 每小時更新`;els.topThree.innerHTML=data.slice(0,3).map(cardMarkup).join('');els.list.innerHTML='';els.empty.hidden=!!data.length;data.slice(1).forEach((p,i)=>{const r=p.ranges[state.range]||{};const node=els.template.content.cloneNode(true);node.querySelector('.rank-number').textContent=i+2;node.querySelector('.avatar').src=avatarPhotos[(i+1)%avatarPhotos.length];node.querySelector('.author').textContent=p.author;node.querySelector('.handle').textContent=p.handle;node.querySelector('.post-text').textContent=p.text;node.querySelector('.meta').textContent=`${p.postedAt} · ${p.topicLabel}`;node.querySelector('.thumb').src=photos[(i+1)%photos.length];node.querySelector('.trendScore').textContent=Math.round(r.trend||0);els.list.appendChild(node)});updateOverview(data)}
function updateOverview(data){els.tracked.textContent=state.data.length.toLocaleString('zh-TW');els.newEntry.textContent=state.data.filter(p=>p.newEntry).length;els.updated.textContent=`更新於 ${new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}`;if(data[0]){const r=data[0].ranges[state.range]||{};els.score.textContent=(r.trend||0).toFixed(1)}const counts={};data.forEach(p=>counts[p.topicLabel]=(counts[p.topicLabel]||0)+1);els.topTopic.textContent=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||'—'}
async function load(){els.refresh?.classList.add('loading');try{const res=await fetch(`data/sample-posts.json?${Date.now()}`);state.data=await res.json();render()}catch(e){console.error(e);els.empty.hidden=false;els.empty.textContent='資料載入失敗，請重新整理。'}finally{els.refresh?.classList.remove('loading')}}
els.region.onchange=e=>{state.region=e.target.value;render()};els.topic.onchange=e=>{state.topic=e.target.value;render()};els.search.oninput=e=>{state.query=e.target.value.trim();render()};els.refresh.onclick=load;els.searchToggle.onclick=()=>{els.searchPanel.classList.toggle('open');if(els.searchPanel.classList.contains('open'))els.search.focus()};
makeTabs(els.rangeTabs,ranges,'range');makeTabs(els.metricTabs,metrics,'metric');load();
