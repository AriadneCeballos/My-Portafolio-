/* Aura Clínica · flujo de reserva en 4 pasos + router */
(() => {
  const { SERVICES, DOCTORS, iso, money, esc, fdate, slotsFor, face } = Aura;
  const $ = (s, r = document) => r.querySelector(s);
  const wz = $('#wizard');
  const st = { step: 1, svc: null, date: null, time: null, done: null };
  const DAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

  function head() {
    $('#steps').innerHTML = ['Servicio', 'Fecha y hora', 'Tus datos', 'Listo'].map((t, i) =>
      `<li class="${st.step === i + 1 ? 'on' : st.step > i + 1 ? 'ok' : ''}"><span>${st.step > i + 1 ? '✓' : i + 1}</span>${t}</li>`).join('');
  }
  const summary = () => {
    const s = st.svc, d = DOCTORS[s.doc];
    return `<aside class="sum">${face(d, "sm")}<small>Tu especialista</small><h3>${d.name}</h3><p>${d.role} · ${d.exp}</p><hr>
      <b>${s.name}</b><p>${s.mins} min · ${money(s.price)}</p>
      ${st.time ? `<p class="sel">${fdate(st.date, { weekday: 'long', day: 'numeric', month: 'long' })}<br><b>${st.time} h</b></p>` : ''}</aside>`;
  };

  /* Paso 1 · Servicio */
  function s1() {
    wz.innerHTML = `<div class="booking-intro"><span class="eyebrow">Paso 1 · Elige tu consulta</span><h3 class="sub">¿Qué tipo de atención necesitas?</h3><p>Selecciona el servicio para consultar los días y horarios disponibles.</p></div><div class="svcs">${SERVICES.map(s => { const d = DOCTORS[s.doc]; return `<button class="svc" data-s="${s.id}" aria-label="Elegir ${s.name}">${face(d, 'sm')}
      <div class="in"><small>${s.spec}</small><h3>${s.name}</h3><p>${d.name} · ${s.mins} min</p></div><div class="pr"><b>${money(s.price)}</b></div><span class="go">→</span></button>`; }).join('')}</div><p class="booking-note">🔒 Tus datos personales se utilizan únicamente para gestionar tu cita.</p>`;
    wz.querySelectorAll('.svc').forEach(b => b.onclick = () => pick(b.dataset.s));
  }
  function pick(id) { st.svc = SERVICES.find(s => s.id === id); st.date = st.time = null; go(2); }

  /* Paso 2 · Fecha y hora */
  function s2() {
    const t = new Date(), days = [];
    for (let i = 0; days.length < 12; i++) { const x = new Date(t.getFullYear(), t.getMonth(), t.getDate() + i); if (x.getDay() !== 0) days.push(x); }
    if (!st.date) st.date = iso(days[0]);
    wz.innerHTML = `<div class="two">${summary()}<div>
      <div class="booking-intro"><span class="eyebrow">Paso 2 · Disponibilidad</span><h3 class="sub">Selecciona fecha y hora</h3><p>Los horarios se muestran según la disponibilidad del especialista.</p></div><h3 class="mini-label">Fecha de tu consulta</h3><div class="days">${days.map(x => `<button class="day ${iso(x) === st.date ? 'on' : ''}" data-d="${iso(x)}"><small>${DAYS[x.getDay()]}</small><b>${x.getDate()}</b></button>`).join('')}</div>
      <h3 class="mini-label">Horarios disponibles</h3><div class="slots" id="slots"></div>
      <div class="nav2"><button class="link" id="back">← Cambiar servicio</button><button class="btn" id="next" disabled>Continuar</button></div></div></div>`;
    const draw = () => {
      const sl = slotsFor(st.date, st.svc.doc);
      $('#slots').innerHTML = sl.map(s => `<button class="slot ${s.t === st.time ? 'on' : ''}" data-t="${s.t}" ${s.free ? '' : 'disabled'}>${s.t}</button>`).join('');
      $('#next').disabled = !st.time;
      wz.querySelectorAll('.slot').forEach(b => b.onclick = () => { st.time = b.dataset.t; draw(); });
    };
    wz.querySelectorAll('.day').forEach(b => b.onclick = () => { st.date = b.dataset.d; st.time = null; s2(); });
    $('#back').onclick = () => go(1); $('#next').onclick = () => go(3); draw();
  }

  /* Paso 3 · Datos del paciente */
  function s3() {
    wz.innerHTML = `<div class="two">${summary()}<form id="f" class="form" novalidate><div class="booking-intro"><span class="eyebrow">Paso 3 · Datos de contacto</span><h3 class="sub">¿A nombre de quién reservamos?</h3><p>Completa tus datos para dejar registrada la solicitud de cita.</p></div>
      <label>Nombre completo<input name="name" autocomplete="name" required></label>
      <div class="r2"><label>Teléfono<input name="phone" inputmode="tel" autocomplete="tel" required></label><label>Correo electrónico<input name="email" type="email" autocomplete="email" required></label></div>
      <label>Motivo de consulta <em>(opcional)</em><textarea name="notes" rows="3" maxlength="300"></textarea></label>
      <p class="booking-note">🔒 Tu información se mantiene privada y solo se usa para gestionar esta reserva.</p><p class="err" id="err" role="alert"></p>
      <div class="nav2"><button type="button" class="link" id="back">← Volver</button><button class="btn">Confirmar cita</button></div></form></div>`;
    $('#back').onclick = () => go(2);
    $('#f').onsubmit = e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target)), err = $('#err');
      if (f.name.trim().length < 3) return err.textContent = 'Escribe tu nombre completo.';
      if (f.phone.replace(/\D/g, '').length < 10) return err.textContent = 'El teléfono debe tener 10 dígitos.';
      if (!/^\S+@\S+\.\S+$/.test(f.email)) return err.textContent = 'Revisa tu correo electrónico.';
      if (!slotsFor(st.date, st.svc.doc).find(s => s.t === st.time && s.free)) { err.textContent = 'Ese horario acaba de ocuparse. Elige otro.'; return; }
      const a = { id: 'c' + Date.now(), code: 'AUR-' + Math.random().toString(36).slice(2, 6).toUpperCase(), serviceId: st.svc.id, doctorId: st.svc.doc, date: st.date, time: st.time, name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), notes: f.notes.trim(), status: 'pendiente' };
      Aura.add(a); st.done = a; go(4);
    };
  }

  /* Paso 4 · Confirmación + archivo .ics */
  function ics(a) {
    const s = SERVICES.find(x => x.id === a.serviceId), p = n => String(n).padStart(2, '0'), [y, m, d] = a.date.split('-'), [h, mi] = a.time.split(':');
    const e = new Date(+y, m - 1, +d, +h, +mi + s.mins), f = x => `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`;
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', 'DTSTART:' + f(new Date(+y, m - 1, +d, +h, +mi)), 'DTEND:' + f(e), `SUMMARY:${s.name} · Aura Clínica`, 'LOCATION:Av. Chapultepec 480\\, Guadalajara', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  function s4() {
    const a = st.done, s = SERVICES.find(x => x.id === a.serviceId);
    wz.innerHTML = `<div class="done"><div class="check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
      <h3>¡Tu cita está reservada!</h3><p>Te esperamos, ${esc(a.name.split(' ')[0])}. Recibirás una confirmación en ${esc(a.email)}.</p>
      <div class="ticket"><div><small>Código</small><b>${a.code}</b></div><div><small>Servicio</small><b>${s.name}</b></div><div><small>Especialista</small><b>${DOCTORS[a.doctorId].name}</b></div><div><small>Fecha y hora</small><b>${fdate(a.date, { weekday: 'short', day: 'numeric', month: 'long' })} · ${a.time} h</b></div></div>
      <div class="ctas c"><button class="btn" id="cal">Agregar al calendario</button><button class="btn ghost" id="again">Reservar otra cita</button></div></div>`;
    $('#cal').onclick = () => Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([ics(a)], { type: 'text/calendar' })), download: 'cita-aura.ics' }).click();
    $('#again').onclick = () => { st.svc = st.date = st.time = st.done = null; go(1); };
  }

  function go(n) { st.step = n; head(); [null, s1, s2, s3, s4][n](); if (n > 1) $('#reservar').scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  /* Especialidades, equipo y acceso rápido */
  $('#specs').innerHTML = SERVICES.map((s, i) => `<div class="spec"><span class="n">0${i + 1}</span><div><h3>${s.spec}</h3><p>${s.desc}</p></div><div class="sp"><b>${money(s.price)}</b><small>${s.mins} min</small></div><button class="link2" data-pick="${s.id}">Agendar →</button></div>`).join('');
  $('#team').innerHTML = SERVICES.map(s => { const d = DOCTORS[s.doc]; return `<article class="doc">${face(d, 'lg')}<div class="di"><small>${d.role}</small><h3>${d.name}</h3><p>${d.exp}</p><span class="ced">${d.ced}</span><button class="link2" data-pick="${s.id}">Ver horarios →</button></div></article>`; }).join('');
  $('#qsel').innerHTML = SERVICES.map(s => `<option value="${s.id}">${s.spec}</option>`).join('');
  $('#qgo').onclick = () => pick($('#qsel').value);
  document.addEventListener('click', e => { const b = e.target.closest('[data-pick]'); if (b) pick(b.dataset.pick); });

  /* Router: #admin muestra el panel */
  function route() {
    const adm = location.hash === '#admin';
    $('#public').hidden = adm; $('#admin').hidden = !adm;
    if (adm) { Admin.render(); window.scrollTo(0, 0); }
    else if (location.hash.length > 1) { const t = document.getElementById(location.hash.slice(1)); t && t.scrollIntoView(); }
  }
  addEventListener('langchange', () => {
    const f = $('#f'), v = f && Object.fromEntries(new FormData(f));
    head(); [null, s1, s2, s3, s4][st.step]();
    if (v && $('#f')) Object.entries(v).forEach(([k, x]) => $('#f').elements[k].value = x);
    if (!$('#admin').hidden) Admin.render();
  });
  addEventListener('hashchange', route);
  go(1); route();
})();
