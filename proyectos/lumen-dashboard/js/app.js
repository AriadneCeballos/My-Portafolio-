/* Lumen · Dashboard de finanzas personales
   Datos de ejemplo + persistencia en localStorage. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const fmt = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sum = a => a.reduce((s, t) => s + t.amount, 0);
  const CATS = { Vivienda: '#6c8cff', Comida: '#34d399', Transporte: '#fbbf24', Ocio: '#f472b6', Salud: '#22d3ee', Suscripciones: '#a78bfa', Ingresos: '#10b981' };
  const KEY = 'lumen.v1', now = new Date(), MK = iso(now).slice(0, 7);

  /* ---------- Datos ---------- */
  function seed() {
    let x = 11; const r = () => (x = x * 16807 % 2147483647) / 2147483647, tx = []; let id = 1;
    for (let m = 5; m >= 0; m--) {
      const b = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const a = (d, desc, cat, amt) => { const dt = new Date(b.getFullYear(), b.getMonth(), d); if (dt <= now) tx.push({ id: id++, date: iso(dt), desc, cat, amount: amt }); };
      a(1, 'Nómina', 'Ingresos', 28500);
      if (r() > .45) a(15, 'Proyecto freelance', 'Ingresos', Math.round(3500 + r() * 4500));
      a(2, 'Renta', 'Vivienda', -8500); a(6, 'Luz e internet', 'Vivienda', -Math.round(950 + r() * 350));
      ['Walmart', 'Mercado local', 'Soriana', 'Costco'].forEach((n, i) => a(3 + i * 7, n, 'Comida', -Math.round(700 + r() * 650)));
      a(9, 'Restaurante', 'Comida', -Math.round(350 + r() * 400));
      a(5, 'Gasolina', 'Transporte', -Math.round(600 + r() * 300)); a(18, 'Uber', 'Transporte', -Math.round(250 + r() * 400));
      a(11, 'Cine y cena', 'Ocio', -Math.round(500 + r() * 700)); a(22, 'Concierto', 'Ocio', -Math.round(300 + r() * 900));
      a(13, 'Farmacia', 'Salud', -Math.round(250 + r() * 400));
      a(4, 'Netflix', 'Suscripciones', -219); a(4, 'Spotify', 'Suscripciones', -129); a(20, 'iCloud', 'Suscripciones', -49);
    }
    const U = 'https://images.unsplash.com/';
    return {
      open: 18000, tx,
      budgets: { Vivienda: 10000, Comida: 5500, Transporte: 2200, Ocio: 2500, Salud: 1500, Suscripciones: 900 },
      goals: [
        { id: 1, name: 'Viaje a Oaxaca', target: 25000, saved: 14200, img: U + 'photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75', fb: 'linear-gradient(135deg,#0e7490,#1e3a8a)' },
        { id: 2, name: 'Laptop nueva', target: 32000, saved: 9800, img: U + 'photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=75', fb: 'linear-gradient(135deg,#4338ca,#0f172a)' },
        { id: 3, name: 'Fondo de emergencia', target: 90000, saved: 41500, img: U + 'photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=75', fb: 'linear-gradient(135deg,#047857,#064e3b)' }
      ]
    };
  }
  let S; try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { }
  S = S || seed();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
  const mon = k => S.tx.filter(t => t.date.startsWith(k));
  const pk = n => iso(new Date(now.getFullYear(), now.getMonth() - n, 1)).slice(0, 7);

  /* ---------- Render ---------- */
  function delta(sel, cur, prev, inverse) {
    const p = prev ? Math.round((cur - prev) / prev * 100) : 0, el = $(sel);
    el.textContent = `${p >= 0 ? '▲' : '▼'} ${Math.abs(p)}% vs. mes anterior`;
    el.classList.toggle('bad', (p >= 0) === !!inverse);
  }
  function kpis() {
    const c = mon(MK), p = mon(pk(1));
    const inc = sum(c.filter(t => t.amount > 0)), exp = -sum(c.filter(t => t.amount < 0));
    $('#bal').textContent = fmt(S.open + sum(S.tx));
    $('#inc').textContent = fmt(inc); $('#exp').textContent = fmt(exp);
    $('#sav').textContent = (inc ? Math.max(0, Math.round((inc - exp) / inc * 100)) : 0) + '%';
    delta('#dinc', inc, sum(p.filter(t => t.amount > 0)));
    delta('#dexp', exp, -sum(p.filter(t => t.amount < 0)), true);
  }

  let c1, c2;
  function charts() {
    if (!window.Chart) return;
    const cs = getComputedStyle(document.documentElement), mut = cs.getPropertyValue('--muted').trim(), grid = cs.getPropertyValue('--line').trim();
    Chart.defaults.font.family = 'Manrope, sans-serif'; Chart.defaults.color = mut;
    const keys = [5, 4, 3, 2, 1, 0].map(pk);
    const labels = keys.map(k => new Date(k + '-01T12:00').toLocaleDateString('es-MX', { month: 'short' }));
    const ds = (label, data, color) => ({ label, data, borderColor: color, backgroundColor: color + '22', fill: true, tension: .4, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5 });
    const legend = { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 16 } };
    c1 && c1.destroy();
    c1 = new Chart($('#c1'), {
      type: 'line',
      data: { labels, datasets: [ds('Ingresos', keys.map(k => sum(mon(k).filter(t => t.amount > 0))), '#34d399'), ds('Gastos', keys.map(k => -sum(mon(k).filter(t => t.amount < 0))), '#818cf8')] },
      options: { maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${fmt(c.raw)}` } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: grid }, border: { display: false }, ticks: { callback: v => fmt(v) } } } }
    });
    const by = {}; mon(MK).filter(t => t.amount < 0).forEach(t => by[t.cat] = (by[t.cat] || 0) - t.amount);
    const ks = Object.keys(by);
    c2 && c2.destroy();
    c2 = new Chart($('#c2'), {
      type: 'doughnut',
      data: { labels: ks, datasets: [{ data: ks.map(k => by[k]), backgroundColor: ks.map(k => CATS[k]), borderWidth: 0, spacing: 3, borderRadius: 6 }] },
      options: { maintainAspectRatio: false, cutout: '72%', plugins: { legend, tooltip: { callbacks: { label: c => ` ${c.label}: ${fmt(c.raw)}` } } } }
    });
    $('#donutTot').textContent = fmt(ks.reduce((s, k) => s + by[k], 0));
  }

  function table() {
    const q = $('#q').value.toLowerCase(), c = $('#fc').value;
    const rows = S.tx.filter(t => (!c || t.cat === c) && (t.desc + t.cat).toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
    $('#rows').innerHTML = rows.map(t => `<tr><td><span class="dotc" style="background:${CATS[t.cat]}"></span>${esc(t.desc)}</td><td>${t.cat}</td>
      <td>${new Date(t.date + 'T12:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</td>
      <td class="amt ${t.amount > 0 ? 'pos' : ''}">${t.amount > 0 ? '+' : ''}${fmt(t.amount)}</td>
      <td><button class="x" data-id="${t.id}" aria-label="Eliminar">×</button></td></tr>`).join('') || '<tr><td colspan="5" class="empty">Sin resultados</td></tr>';
  }

  function budgets() {
    const cur = mon(MK);
    $('#budgets').innerHTML = Object.entries(S.budgets).map(([k, lim]) => {
      const sp = -sum(cur.filter(t => t.cat === k && t.amount < 0)), p = Math.min(100, Math.round(sp / lim * 100));
      return `<div class="bud" data-k="${k}"><div class="bh"><b>${k}</b><span>${fmt(sp)} / ${fmt(lim)}</span></div>
        <div class="bar"><i class="${sp > lim ? 'over' : p > 80 ? 'warn' : ''}" style="width:${p}%;--c:${CATS[k]}"></i></div></div>`;
    }).join('');
  }

  function goals() {
    $('#goals').innerHTML = S.goals.map(g => {
      const p = Math.min(100, Math.round(g.saved / g.target * 100));
      return `<article class="goal" style="--img:url('${g.img}');--fb:${g.fb}"><div><span class="pill">${p}%</span></div>
        <div><h3>${g.name}</h3><div class="bar"><i style="width:${p}%"></i></div><p>${fmt(g.saved)} de ${fmt(g.target)}</p>
        <button class="ghost sm" data-g="${g.id}">+ Aportar</button></div></article>`;
    }).join('');
  }

  const all = () => { kpis(); charts(); table(); budgets(); goals(); save(); };

  /* ---------- Eventos ---------- */
  $('#today').textContent = now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const cats = Object.keys(CATS);
  $('#fc').innerHTML = '<option value="">Todas</option>' + cats.map(c => `<option>${c}</option>`).join('');
  $('#catSel').innerHTML = cats.map(c => `<option>${c}</option>`).join('');
  $('#q').oninput = $('#fc').onchange = table;

  $('#rows').onclick = e => {
    const b = e.target.closest('.x'); if (!b) return;
    S.tx = S.tx.filter(t => t.id !== +b.dataset.id); all();
  };
  $('#budgets').onclick = e => {
    const el = e.target.closest('.bud'); if (!el) return;
    const v = parseFloat(prompt(`Nuevo límite mensual para ${el.dataset.k}`, S.budgets[el.dataset.k]));
    if (v > 0) { S.budgets[el.dataset.k] = v; all(); }
  };
  $('#goals').onclick = e => {
    const b = e.target.closest('[data-g]'); if (!b) return;
    const g = S.goals.find(x => x.id === +b.dataset.g), v = parseFloat(prompt(`¿Cuánto quieres aportar a "${g.name}"?`, '500'));
    if (v > 0) { g.saved = Math.min(g.target, g.saved + v); all(); }
  };

  const dlg = $('#dlg'), form = $('#form');
  $('#new').onclick = () => { form.reset(); form.date.value = iso(now); dlg.showModal(); };
  $('#cancel').onclick = () => dlg.close();
  form.onsubmit = () => {
    const f = new FormData(form), sign = +f.get('type'), cat = f.get('cat');
    const amount = Math.abs(parseFloat(f.get('amount'))) * (cat === 'Ingresos' ? 1 : sign);
    S.tx.push({ id: Date.now(), date: f.get('date'), desc: f.get('desc').trim(), cat: sign > 0 && cat !== 'Ingresos' ? 'Ingresos' : cat, amount: sign > 0 ? Math.abs(amount) : -Math.abs(amount) });
    all();
  };

  $('#csv').onclick = () => {
    const rows = [['Fecha', 'Descripción', 'Categoría', 'Monto'], ...S.tx.map(t => [t.date, `"${t.desc}"`, t.cat, t.amount])];
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' })), download: 'lumen-movimientos.csv' });
    a.click();
  };

  $('#theme').onclick = () => {
    const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
    r.dataset.theme = dark ? 'light' : 'dark'; charts();
  };
  $('#nav').onclick = e => { const a = e.target.closest('a'); if (a) { [...$('#nav').children].forEach(x => x.classList.toggle('on', x === a)); } };

  all();
  window.addEventListener('load', charts);
})();
