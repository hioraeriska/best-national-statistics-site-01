// Indonesia in Numbers — single-page statistics site.
// Hash-routed views, hand-drawn SVG charts, every control wired to real data.
// No network requests: all figures live in data.js.

import {
  COUNTRY, KPIS, POPULATION_SERIES, GDP_SERIES, GROWTH_SERIES, GDP_PC_SERIES,
  AGE_STRUCTURE, RELIGION, SECTORS, POVERTY_SERIES, UNEMPLOYMENT_SERIES,
  INFLATION_SERIES, TRADE, PROVINCES, ISLAND_GROUPS, HEALTH, EDUCATION,
  ENVIRONMENT, SOURCES,
} from './data.js';

const view = document.getElementById('view');

/* ---------------- helpers ---------------- */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const srcLine = (s) => `<p class="src-line">Source: ${esc(s)}</p>`;

function segButtons(id, options, current) {
  return `<div class="controls" role="group" aria-label="${esc(id)}">
    <span class="ctl-label">${esc(id)}:</span>
    ${options.map((o) => `<button type="button" class="seg${o.value === current ? ' on' : ''}" data-seg="${esc(o.value)}">${esc(o.label)}</button>`).join('')}
  </div>`;
}

/* ---------------- SVG charts ---------------- */

function barChart(series, { height = 260, format = (v) => fmt(v), color = '#0b5e57', yLabel = '' } = {}) {
  const W = 640, H = height, padL = 52, padR = 14, padT = 14, padB = 30;
  const values = series.map((d) => d.value);
  const max = Math.max(...values, 0) * 1.08;
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const iw = W - padL - padR, ih = H - padT - padB;
  const y = (v) => padT + ih - ((v - min) / span) * ih;
  const bw = Math.min(44, (iw / series.length) * 0.62);
  const step = iw / series.length;
  const ticks = 4;
  let g = '';
  for (let i = 0; i <= ticks; i++) {
    const v = min + (span * i) / ticks;
    const yy = y(v);
    g += `<line class="grid" x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}"/>`;
    g += `<text class="tick" x="${padL - 8}" y="${yy + 4}" text-anchor="end">${format(v)}</text>`;
  }
  let bars = '';
  series.forEach((d, i) => {
    const x = padL + step * i + (step - bw) / 2;
    const top = y(Math.max(d.value, 0));
    const bot = y(Math.min(d.value, 0));
    const cls = d.value < 0 ? 'bar neg' : 'bar';
    bars += `<rect class="${cls}" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(bot - top, 1).toFixed(1)}" rx="2"/>`;
    bars += `<text class="val-label" x="${(x + bw / 2).toFixed(1)}" y="${(top - 5).toFixed(1)}" text-anchor="middle">${format(d.value)}</text>`;
    bars += `<text class="tick" x="${(x + bw / 2).toFixed(1)}" y="${H - 10}" text-anchor="middle">${esc(d.year ?? d.label)}</text>`;
  });
  const zero = y(0);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart${yLabel ? ': ' + esc(yLabel) : ''}">
    ${g}<line class="axis" x1="${padL}" y1="${zero}" x2="${W - padR}" y2="${zero}"/>${bars}</svg>`;
}

function lineChart(series, { height = 260, format = (v) => fmt(v), yLabel = '' } = {}) {
  const W = 640, H = height, padL = 52, padR = 18, padT = 18, padB = 30;
  const values = series.map((d) => d.value);
  let max = Math.max(...values), min = Math.min(...values);
  const pad = (max - min) * 0.12 || 1;
  max += pad; min -= pad;
  const span = max - min || 1;
  const iw = W - padL - padR, ih = H - padT - padB;
  const x = (i) => padL + (iw * i) / (series.length - 1);
  const y = (v) => padT + ih - ((v - min) / span) * ih;
  let g = '';
  for (let i = 0; i <= 4; i++) {
    const v = min + (span * i) / 4;
    const yy = y(v);
    g += `<line class="grid" x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}"/>`;
    g += `<text class="tick" x="${padL - 8}" y="${yy + 4}" text-anchor="end">${format(v)}</text>`;
  }
  const pts = series.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  let dots = '';
  series.forEach((d, i) => {
    dots += `<circle class="dot" cx="${x(i).toFixed(1)}" cy="${y(d.value).toFixed(1)}" r="4.5"/>`;
    dots += `<text class="val-label" x="${x(i).toFixed(1)}" y="${(y(d.value) - 10).toFixed(1)}" text-anchor="middle">${format(d.value)}</text>`;
    dots += `<text class="tick" x="${x(i).toFixed(1)}" y="${H - 10}" text-anchor="middle">${esc(d.year)}</text>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Line chart${yLabel ? ': ' + esc(yLabel) : ''}">
    ${g}<polyline class="line-path" points="${pts}"/>${dots}</svg>`;
}

function hbarChart(rows, { format = (v) => fmt(v) + '%', maxValue = 100 } = {}) {
  const W = 640, rowH = 34, padL = 190, padR = 64, H = rows.length * rowH + 12;
  let out = '';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const w = Math.max(2, ((r.value / maxValue) * (W - padL - padR)));
    out += `<text class="tick" x="${padL - 10}" y="${y + 16}" text-anchor="end" style="font-size:13px;fill:#14202b">${esc(r.label)}</text>`;
    out += `<rect class="bar" x="${padL}" y="${y + 4}" width="${w.toFixed(1)}" height="18" rx="3"/>`;
    out += `<text class="val-label" x="${padL + w + 8}" y="${y + 18}">${format(r.value)}</text>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Horizontal bar chart">${out}</svg>`;
}

/* ---------------- shared pieces ---------------- */

function kpiCards(list) {
  return `<div class="kpi-grid">${list.map((k) => `<div class="kpi">
    <div class="k-label">${esc(k.label)}</div>
    <div class="k-value">${esc(k.value)}</div>
    <div class="k-sub">${esc(k.sub)}</div>
    <div class="k-src">${esc(k.source)}</div>
  </div>`).join('')}</div>`;
}

function factCards(list) {
  return `<div class="kpi-grid">${list.map((f) => `<div class="kpi">
    <div class="k-label">${esc(f.label)}</div>
    <div class="k-value" style="font-size:24px">${esc(f.value)}</div>
    <div class="k-src">${esc(f.source)}</div>
  </div>`).join('')}</div>`;
}

function provincesTable(rows, idPrefix) {
  const maxPop = Math.max(...PROVINCES.map((p) => p.population));
  return `<table class="data" id="${idPrefix}-table">
    <thead><tr>
      <th class="sortable" data-sort="name" data-dir="asc">#</th>
      <th class="sortable" data-sort="name" data-dir="asc">Province &#8597;</th>
      <th>Capital</th><th>Island</th>
      <th class="num sortable" data-sort="population" data-dir="desc">Population (millions) &#8597;</th>
      <th class="num sortable" data-sort="density" data-dir="desc">Density /km² &#8597;</th>
      <th>Share</th>
    </tr></thead>
    <tbody>${rows.map((p, i) => `<tr class="${i < 3 ? 'top' : ''}">
      <td>${i + 1}</td><td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td>${esc(p.island)}</td>
      <td class="num">${fmt(p.population, 1)}</td><td class="num">${fmt(p.density)}</td>
      <td><span class="bar-cell"><span class="mini-bar" style="width:${Math.round((p.population / maxPop) * 90)}px"></span>${fmt((p.population / 283.5) * 100, 1)}%</span></td>
    </tr>`).join('')}</tbody>
  </table>`;
}

function bindProvinceTable(prefix) {
  const table = document.getElementById(`${prefix}-table`);
  if (!table) return;
  const search = document.getElementById(`${prefix}-search`);
  let rows = [...PROVINCES];
  let sortKey = 'population', sortDir = -1;
  const render = () => {
    const q = (search?.value || '').trim().toLowerCase();
    let list = rows.filter((p) => !q || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q) || p.island.toLowerCase().includes(q));
    list = [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return (typeof av === 'string' ? av.localeCompare(bv) : av - bv) * sortDir;
    });
    const tbody = table.querySelector('tbody');
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty">No province matches “${esc(search.value)}”. Try another search.</td></tr>`;
      return;
    }
    const maxPop = Math.max(...PROVINCES.map((p) => p.population));
    tbody.innerHTML = list.map((p, i) => `<tr class="${sortKey === 'population' && sortDir === -1 && i < 3 ? 'top' : ''}">
      <td>${i + 1}</td><td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td>${esc(p.island)}</td>
      <td class="num">${fmt(p.population, 1)}</td><td class="num">${fmt(p.density)}</td>
      <td><span class="bar-cell"><span class="mini-bar" style="width:${Math.round((p.population / maxPop) * 90)}px"></span>${fmt((p.population / 283.5) * 100, 1)}%</span></td>
    </tr>`).join('');
  };
  search?.addEventListener('input', render);
  table.querySelectorAll('th.sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) sortDir = -sortDir; else { sortKey = key; sortDir = key === 'name' ? 1 : -1; }
      render();
    });
  });
}

function bindSegments(container, onChange) {
  container.querySelectorAll('button.seg').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('button.seg').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      onChange(btn.dataset.seg);
    });
  });
}

/* ---------------- views ---------------- */

const state = { overviewMetric: 'population', overviewRange: 'all', gdpMetric: 'total', popRange: 'all' };

function overview() {
  return `
  <section class="hero">
    <h1>Indonesia in Numbers</h1>
    <p class="lede">The fourth-largest country on Earth, by the numbers: 283.5 million people across
    17,508 islands, a $1.40 trillion economy growing at 5% a year, and 38 provinces from
    Aceh to Papua. Every figure below is a published statistic, with its source.</p>
    <div class="hero-stats">
      <div><b>283.5M</b><span>Population, 2024</span></div>
      <div><b>$1.40T</b><span>GDP, 2024</span></div>
      <div><b>38</b><span>Provinces</span></div>
      <div><b>17,508</b><span>Islands</span></div>
      <div><b>71.3</b><span>Life expectancy</span></div>
    </div>
  </section>
  ${kpiCards(KPIS)}
  <section class="card wide">
    <h2 class="chart-title" id="ov-chart-title">Population, 2015–2024</h2>
    <p class="chart-sub" id="ov-chart-sub">Millions of people — World Bank WDI</p>
    <div id="ov-controls">${segButtons('Show', [
      { value: 'population', label: 'Population' },
      { value: 'gdp', label: 'GDP' },
      { value: 'gdppc', label: 'GDP per capita' },
    ], state.overviewMetric)}</div>
    <div id="ov-chart"></div>
    ${srcLine('World Bank, World Development Indicators (2024). GDP in current US dollars.')}
  </section>
  <div class="grid-2">
    <section class="card">
      <h2>Who lives here</h2>
      <p class="section-intro">Age structure, 2024 — World Bank WDI.</p>
      ${hbarChart(AGE_STRUCTURE)}
      <p class="note">Two in three Indonesians are of working age; one in four is a child. Median age is about 30.</p>
    </section>
    <section class="card">
      <h2>What people believe</h2>
      <p class="section-intro">Religious composition, % of population — Ministry of Home Affairs, 2023.</p>
      ${hbarChart(RELIGION)}
      <p class="note">Indonesia is the world’s largest Muslim-majority country, with six officially recognised religions.</p>
    </section>
  </div>
  <section class="callout"><b>Did you know?</b> West Java alone has 50.3 million people — more than
  Spain, Canada or Poland. Java, one island, holds 55.5% of the whole country’s population.</section>
  <section class="card">
    <h2>Explore the country</h2>
    <p class="section-intro">Start with the <a href="#/population">people</a>, the
    <a href="#/economy">economy</a>, <a href="#/health">health</a>, <a href="#/education">education</a>,
    the <a href="#/environment">environment</a> — or jump straight to the
    <a href="#/regions">provinces and island groups</a>. Every page names its sources.</p>
  </section>`;
}

function renderOverviewChart() {
  const host = document.getElementById('ov-chart');
  if (!host) return;
  const title = document.getElementById('ov-chart-title');
  const sub = document.getElementById('ov-chart-sub');
  if (state.overviewMetric === 'population') {
    title.textContent = 'Population, 2015–2024';
    sub.textContent = 'Millions of people — World Bank WDI';
    host.innerHTML = lineChart(POPULATION_SERIES, { format: (v) => fmt(v, 1), yLabel: 'population, millions' });
  } else if (state.overviewMetric === 'gdp') {
    title.textContent = 'GDP, 2015–2024';
    sub.textContent = 'Billions of current US dollars — World Bank WDI';
    host.innerHTML = lineChart(GDP_SERIES, { format: (v) => '$' + fmt(v), yLabel: 'GDP, US$ billions' });
  } else {
    title.textContent = 'GDP per capita, 2015–2024';
    sub.textContent = 'Current US dollars per person — World Bank WDI';
    host.innerHTML = lineChart(GDP_PC_SERIES, { format: (v) => '$' + fmt(v), yLabel: 'GDP per capita, US$' });
  }
}

function population() {
  return `
  <h1 class="page-title">Population</h1>
  <p class="section-intro">Indonesia had <b>283.5 million people in 2024</b> (World Bank) — the world’s
  fourth-largest population — growing about 0.8% a year. One in four Indonesians is under 15,
  and 58.8% live in towns and cities.</p>
  ${kpiCards([
    { label: 'Population, 2024', value: '283.5M', sub: 'World rank: 4th', source: 'World Bank WDI, 2024' },
    { label: 'Growth', value: '0.8%', sub: 'Per year, 2024', source: 'World Bank WDI, 2024' },
    { label: 'Urban share', value: '58.8%', sub: 'Living in urban areas', source: 'World Bank WDI, 2024' },
    { label: 'Density', value: '149/km²', sub: 'People per square kilometre', source: 'World Bank, 2023' },
  ])}
  <section class="card wide">
    <h2 class="chart-title">Population growth, 2015–2024</h2>
    <p class="chart-sub">Millions of people — World Bank WDI</p>
    <div id="pop-controls">${segButtons('Range', [
      { value: 'all', label: '2015–2024' },
      { value: 'recent', label: '2020–2024' },
    ], state.popRange)}</div>
    <div id="pop-chart"></div>
    ${srcLine('World Bank, World Development Indicators. 2024: 283.5 million.')}
  </section>
  <section class="card">
    <h2>Age structure</h2>
    <p class="section-intro">Share of the population by age group, 2024 — World Bank WDI.</p>
    ${hbarChart(AGE_STRUCTURE)}
    <p class="note">The working-age bulge is the demographic dividend: a large labour force relative
    to dependants, if jobs and skills keep up.</p>
  </section>
  <section class="card wide">
    <h2>Largest provinces</h2>
    <p class="section-intro">Population in millions, mid-2024 — BPS estimates. Search, or click a column
    heading to sort. The share column is each province’s share of the national population.</p>
    <div class="controls"><input type="search" id="pop-search" placeholder="Search provinces, capitals, islands…" aria-label="Search provinces"></div>
    ${provincesTable(PROVINCES, 'pop')}
    ${srcLine('BPS — Statistics Indonesia, provincial population estimates, mid-2024. Densities are people per km².')}
  </section>`;
}

function renderPopChart() {
  const host = document.getElementById('pop-chart');
  if (!host) return;
  const series = state.popRange === 'recent' ? POPULATION_SERIES.slice(-5) : POPULATION_SERIES;
  host.innerHTML = barChart(series, { format: (v) => fmt(v, 1), yLabel: 'population, millions' });
}

function economy() {
  return `
  <h1 class="page-title">Economy</h1>
  <p class="section-intro">A <b>$1.40 trillion economy</b> (World Bank, 2024) — the 16th largest in the
  world — growing 5.0% in 2024, its fifth straight year at or above 5% outside the pandemic dip.
  GDP per person reached <b>$4,925</b>, in the World Bank’s upper-middle-income group.</p>
  ${kpiCards([
    { label: 'GDP, 2024', value: '$1.40T', sub: 'World rank: 16th', source: 'World Bank WDI, 2024' },
    { label: 'GDP per capita', value: '$4,925', sub: 'Upper-middle income', source: 'World Bank WDI, 2024' },
    { label: 'Growth, 2024', value: '5.0%', sub: 'Real GDP growth', source: 'World Bank / BPS, 2024' },
    { label: 'Inflation, 2024', value: '2.3%', sub: 'Annual average CPI', source: 'BPS / IMF, 2024' },
  ])}
  <section class="card wide">
    <h2 class="chart-title" id="gdp-chart-title">GDP, 2015–2024</h2>
    <p class="chart-sub" id="gdp-chart-sub">Billions of current US dollars — World Bank WDI</p>
    <div id="gdp-controls">${segButtons('Show', [
      { value: 'total', label: 'Total GDP' },
      { value: 'gdppc', label: 'GDP per capita' },
      { value: 'growth', label: 'Growth %' },
    ], state.gdpMetric)}</div>
    <div id="gdp-chart"></div>
    ${srcLine('World Bank, World Development Indicators.')}
  </section>
  <div class="grid-2">
    <section class="card">
      <h2>What the economy makes</h2>
      <p class="section-intro">Share of GDP by sector, % — BPS, 2024.</p>
      ${hbarChart(SECTORS)}
      ${srcLine('BPS — Statistics Indonesia, 2024.')}
    </section>
    <section class="card">
      <h2>Trade &amp; investment, 2024</h2>
      <ul class="fact-list">${TRADE.map((t) => `<li><span>${esc(t.label)}<span class="f-src">${esc(t.source)}</span></span><b>${esc(t.value)}</b></li>`).join('')}</ul>
      <p class="note">Exports are led by coal, palm oil, nickel and manufactured goods; the 2024
      surplus was the fifth in a row.</p>
    </section>
  </div>
  <div class="grid-2">
    <section class="card">
      <h2 class="chart-title">Poverty is falling</h2>
      <p class="chart-sub">Poverty rate, % — BPS, March each year</p>
      ${lineChart(POVERTY_SERIES, { format: (v) => fmt(v, 2) + '%', yLabel: 'poverty rate, %' })}
      <p class="note">8.47% in March 2025 — 23.85 million people, the lowest in the BPS series.
      Extreme poverty (US$2.15/day) was 0.85%.</p>
    </section>
    <section class="card">
      <h2 class="chart-title">Jobs are recovering</h2>
      <p class="chart-sub">Open unemployment, % — BPS, August each year (2025: February)</p>
      ${lineChart(UNEMPLOYMENT_SERIES, { format: (v) => fmt(v, 2) + '%', yLabel: 'unemployment, %' })}
      <p class="note">Unemployment has stayed below 5% since February 2024, but most new work is
      informal: roughly 58% of workers are informal (BPS).</p>
    </section>
  </div>
  <section class="card">
    <h2 class="chart-title">Inflation, 2019–2024</h2>
    <p class="chart-sub">Consumer prices, annual average % — BPS / IMF</p>
    ${barChart(INFLATION_SERIES, { format: (v) => fmt(v, 1) + '%', yLabel: 'inflation, %' })}
    <p class="note">Inflation spiked to 5.5% in 2022 as fuel subsidies were cut, then eased back
    inside Bank Indonesia’s 1.5–3.5% target range.</p>
  </section>`;
}

function renderGdpChart() {
  const host = document.getElementById('gdp-chart');
  if (!host) return;
  const title = document.getElementById('gdp-chart-title');
  const sub = document.getElementById('gdp-chart-sub');
  if (state.gdpMetric === 'total') {
    title.textContent = 'GDP, 2015–2024';
    sub.textContent = 'Billions of current US dollars — World Bank WDI';
    host.innerHTML = lineChart(GDP_SERIES, { format: (v) => '$' + fmt(v), yLabel: 'GDP, US$ billions' });
  } else if (state.gdpMetric === 'gdppc') {
    title.textContent = 'GDP per capita, 2015–2024';
    sub.textContent = 'Current US dollars per person — World Bank WDI';
    host.innerHTML = lineChart(GDP_PC_SERIES, { format: (v) => '$' + fmt(v), yLabel: 'GDP per capita, US$' });
  } else {
    title.textContent = 'Real GDP growth, 2015–2024';
    sub.textContent = 'Annual % change — World Bank WDI';
    host.innerHTML = barChart(GROWTH_SERIES, { format: (v) => fmt(v, 1) + '%', yLabel: 'growth, %' });
  }
}

function health() {
  return `
  <h1 class="page-title">Health</h1>
  <p class="section-intro">Indonesians live <b>71.3 years</b> on average (World Bank, 2024). The country
  runs the world’s largest single-payer health scheme, BPJS Kesehatan, covering most of the
  population — but child stunting and a double burden of infectious and lifestyle disease remain.</p>
  ${factCards(HEALTH)}
  <section class="card">
    <h2>What the numbers mean</h2>
    <ul class="fact-list">
      <li><span>Life expectancy has risen by about 4 years since 2000.</span><b>71.3 yrs</b></li>
      <li><span>One in five children under five is stunted — down from one in three a decade ago, still high for the region.</span><b>19.8%</b></li>
      <li><span>Nearly every household has electricity, the backbone for cold chains, clinics and clean water pumps.</span><b>99.9%</b></li>
    </ul>
    ${srcLine('World Bank WDI; WHO; BPS / SSGI 2024.')}
  </section>
  <section class="callout"><b>Reading the figures:</b> mortality and stunting are national averages —
  they hide wide gaps. Papua’s under-5 mortality is roughly twice Java’s, and stunting is
  highest in the eastern provinces. See <a href="#/regions">Regions</a> for where people live.</section>`;
}

function education() {
  return `
  <h1 class="page-title">Education</h1>
  <p class="section-intro">Nearly every Indonesian adult can read and write, and the average adult has
  <b>9.0 years of schooling</b> (BPS, 2024). The challenge is quality: learning outcomes trail
  the region even as enrolment has become near-universal.</p>
  ${factCards(EDUCATION)}
  <section class="card">
    <h2>Schooling in numbers</h2>
    <ul class="fact-list">
      <li><span>Children now stay in school for 13.6 years on average — up from 11.6 a generation ago.</span><b>13.6 yrs</b></li>
      <li><span>Primary enrolment is near-universal, but the dropout risk rises sharply after lower secondary.</span><b>99.4%</b></li>
      <li><span>Indonesia has 221.6 million internet users — classrooms, homework and job-hunting now run online.</span><b>221.6M</b></li>
    </ul>
    ${srcLine('UNESCO; BPS; UNDP HDR 2023; APJII 2024.')}
  </section>`;
}

function environment() {
  return `
  <h1 class="page-title">Environment</h1>
  <p class="section-intro">An archipelago of <b>17,508 islands</b> spanning 1.90 million km², holding the
  world’s third-largest tropical rainforest — and one of its fastest-shrinking ones. Half the
  country is still forest; the other half is the story of palm oil, coal and nickel.</p>
  ${factCards(ENVIRONMENT)}
  <section class="card">
    <h2>A country made of water and forest</h2>
    <p class="section-intro">Indonesia sits on the Ring of Fire: more than 130 active volcanoes, frequent
    earthquakes, and some of the richest marine life on Earth — the Coral Triangle, centred on
    its eastern seas, holds 76% of the world’s coral species.</p>
    <ul class="fact-list">
      <li><span>Forest still covers about half the land — down from roughly two-thirds in 1990.</span><b>50.7%</b></li>
      <li><span>Indonesia is the world’s largest producer of palm oil and nickel, and a top-three coal exporter.</span><b>#1 nickel</b></li>
      <li><span>The new capital, Nusantara, is being built in East Kalimantan rainforest, planned as a green city.</span><b>2022–</b></li>
    </ul>
    ${srcLine('World Bank; Government of Indonesia.')}
  </section>`;
}

function regions() {
  return `
  <h1 class="page-title">Regions</h1>
  <p class="section-intro">Indonesia has <b>38 provinces</b> grouped into six island groups. More than half
  the country lives on Java — an island smaller than the UK — while Papua’s four provinces
  hold fewer people than Jakarta alone.</p>
  <section class="card wide">
    <h2>Island groups</h2>
    <p class="section-intro">Population in millions and share of the national total, mid-2024 — BPS.</p>
    <table class="data">
      <thead><tr><th>Island group</th><th class="num">Population (M)</th><th class="num">Share</th><th>Note</th></tr></thead>
      <tbody>${ISLAND_GROUPS.map((g) => `<tr><td><b>${esc(g.group)}</b></td><td class="num">${fmt(g.population, 1)}</td>
        <td class="num">${fmt(g.share, 1)}%</td><td>${esc(g.note)}</td></tr>`).join('')}</tbody>
    </table>
    ${srcLine('BPS — Statistics Indonesia, mid-2024. Shares are of the BPS national total of 281.6 million; the World Bank total used elsewhere on this site is 283.5 million — the two differ slightly by data vintage.')}
  </section>
  <section class="card wide">
    <h2>Ten largest provinces</h2>
    <p class="section-intro">Population in millions, mid-2024 — BPS estimates. Search, or click a column
    heading to sort.</p>
    <div class="controls"><input type="search" id="reg-search" placeholder="Search provinces, capitals, islands…" aria-label="Search provinces"></div>
    ${provincesTable(PROVINCES, 'reg')}
    ${srcLine('BPS — Statistics Indonesia, provincial population estimates, mid-2024.')}
  </section>
  <section class="callout"><b>Density tells the story:</b> Jakarta packs 16,165 people into each km²;
  Riau has 75. The country’s future — the new capital, nickel, food estates — is mostly being
  built where the people are not.</section>`;
}

function sources() {
  return `
  <h1 class="page-title">Sources &amp; method</h1>
  <p class="section-intro">Every figure on this site comes from a published source below. Reference year
  is 2024 unless a figure says otherwise. Figures are rounded for display; the underlying values
  are the publishers’ own. Use the buttons to filter by publisher.</p>
  <div id="src-controls">${segButtons('Publisher', [
    { value: 'all', label: 'All sources' },
    { value: 'World Bank', label: 'World Bank' },
    { value: 'BPS — Statistics Indonesia', label: 'BPS' },
    { value: 'UNDP', label: 'UNDP' },
    { value: 'Other', label: 'Other' },
  ], 'all')}</div>
  <div id="src-list">
    ${SOURCES.map((g) => `<section class="card src-group" data-publisher="${esc(g.publisher)}">
      <h3>${esc(g.publisher)}</h3>
      <ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </section>`).join('')}
  </div>
  <section class="card">
    <h2>Method notes</h2>
    <ul class="fact-list">
      <li><span>Population and GDP series use the World Bank’s World Development Indicators, 2015–2024.</span><b>WDI</b></li>
      <li><span>Poverty and unemployment use BPS releases; the poverty series is March each year, unemployment August (2025: February).</span><b>BPS</b></li>
      <li><span>Provincial populations are BPS mid-2024 estimates, rounded to 0.1 million.</span><b>BPS</b></li>
      <li><span>Where publishers disagree (for example population vintages), the site uses the World Bank WDI value and says so.</span><b>Note</b></li>
    </ul>
  </section>`;
}

function about() {
  return `
  <h1 class="page-title">About this site</h1>
  <p class="section-intro"><b>Indonesia in Numbers</b> is an independent statistics site built for the
  make.fun “Make the best national statistics site” bounty. It is a data presentation, not an
  official government publication, and it is not affiliated with BPS, the World Bank or UNDP.</p>
  <section class="card">
    <h2>What it is</h2>
    <p>A static site — plain HTML, CSS and JavaScript, no build step, no network requests. Every
    figure is stored in its own files and cited on the <a href="#/sources">Sources</a> page.
    Charts are drawn by hand as SVG; nothing is fetched from another origin.</p>
    <h2>What it covers</h2>
    <ul class="fact-list">
      <li><span>Overview — the country at a glance</span><b><a href="#/">Open</a></b></li>
      <li><span>Population — growth, age structure, provinces</span><b><a href="#/population">Open</a></b></li>
      <li><span>Economy — GDP, sectors, trade, poverty, jobs, inflation</span><b><a href="#/economy">Open</a></b></li>
      <li><span>Health, education and environment</span><b><a href="#/health">Open</a></b></li>
      <li><span>Regions — island groups and the ten largest provinces</span><b><a href="#/regions">Open</a></b></li>
    </ul>
    <h2>Country facts</h2>
    <ul class="fact-list">
      <li><span>Full name</span><b>${esc(COUNTRY.nameId)}</b></li>
      <li><span>National motto</span><b>${esc(COUNTRY.motto)}</b></li>
      <li><span>Capital</span><b>${esc(COUNTRY.capital)}</b></li>
      <li><span>Land area</span><b>${fmt(COUNTRY.areaKm2)} km²</b></li>
      <li><span>Islands</span><b>${fmt(COUNTRY.islands)}</b></li>
      <li><span>Provinces</span><b>${COUNTRY.provinces}</b></li>
      <li><span>Languages</span><b>${esc(COUNTRY.languages)} living languages</b></li>
      <li><span>Currency</span><b>${esc(COUNTRY.currency)}</b></li>
      <li><span>Time zones</span><b>${esc(COUNTRY.timezone)}</b></li>
      <li><span>Independence</span><b>${esc(COUNTRY.independence)}</b></li>
    </ul>
  </section>`;
}

/* ---------------- router ---------------- */

const ROUTES = {
  overview, population, economy, health, education, environment, regions, sources, about,
};

function route() {
  const name = (location.hash || '#/').replace(/^#\//, '').split('?')[0] || 'overview';
  const fn = ROUTES[name] || ROUTES.overview;
  view.innerHTML = fn();
  document.querySelectorAll('.main-nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === (ROUTES[name] ? name : 'overview'));
  });
  window.scrollTo(0, 0);
  if (name === 'overview') {
    renderOverviewChart();
    bindSegments(document.getElementById('ov-controls'), (v) => { state.overviewMetric = v; renderOverviewChart(); });
  }
  if (name === 'population') {
    renderPopChart();
    bindSegments(document.getElementById('pop-controls'), (v) => { state.popRange = v; renderPopChart(); });
    bindProvinceTable('pop');
  }
  if (name === 'economy') {
    renderGdpChart();
    bindSegments(document.getElementById('gdp-controls'), (v) => { state.gdpMetric = v; renderGdpChart(); });
  }
  if (name === 'regions') bindProvinceTable('reg');
  if (name === 'sources') {
    bindSegments(document.getElementById('src-controls'), (v) => {
      document.querySelectorAll('#src-list .src-group').forEach((g) => {
        g.style.display = v === 'all' || g.dataset.publisher === v || (v === 'Other' && !['World Bank', 'BPS — Statistics Indonesia', 'UNDP'].includes(g.dataset.publisher)) ? '' : 'none';
      });
    });
  }
}

window.addEventListener('hashchange', route);
route();
