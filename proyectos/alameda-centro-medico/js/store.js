/* Aura Clínica · datos compartidos (servicios, doctores y citas en localStorage) */
const Aura = (() => {
  const PX = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=640&h=800`;
  const SERVICES = [
    { id: 'gen', name: 'Consulta de medicina general', spec: 'Medicina general', mins: 30, price: 650, doc: 'valeria', desc: 'Chequeos, diagnóstico y seguimiento de enfermedades comunes y crónicas.' },
    { id: 'den', name: 'Limpieza y revisión dental', spec: 'Odontología', mins: 45, price: 850, doc: 'andres', desc: 'Profilaxis, valoración de caries y plan de tratamiento personalizado.' },
    { id: 'nut', name: 'Consulta de nutrición clínica', spec: 'Nutrición', mins: 45, price: 700, doc: 'camila', desc: 'Planes alimenticios basados en tus estudios, metas y estilo de vida.' },
    { id: 'psi', name: 'Sesión de psicología', spec: 'Psicología', mins: 50, price: 900, doc: 'rodrigo', desc: 'Terapia individual para ansiedad, estrés y bienestar emocional.' }
  ];
  const DOCTORS = {
    valeria: { name: 'Dra. Valeria Montes', ini: 'VM', role: 'Medicina general', exp: '12 años de experiencia', ced: 'Cédula prof. 8412905', photo: PX(19963165), color: '#12408a' },
    andres: { name: 'Dr. Andrés Beltrán', ini: 'AB', role: 'Odontología', exp: '9 años de experiencia', ced: 'Cédula prof. 7730418', photo: PX(14438788), color: '#0e6b70' },
    camila: { name: 'Dra. Camila Ortega', ini: 'CO', role: 'Nutrición clínica', exp: '7 años de experiencia', ced: 'Cédula prof. 9056127', photo: PX(19218034), color: '#5b4a9e' },
    rodrigo: { name: 'Dr. Rodrigo Salinas', ini: 'RS', role: 'Psicología', exp: '10 años de experiencia', ced: 'Cédula prof. 8120763', photo: PX(6129497), color: '#8a4b1f' }
  };
  const face = (d, c = '') => `<div class="face ${c}" style="background:${d.color}"><span>${d.ini}</span><img src="${d.photo}" alt="${d.name}" loading="lazy" onerror="this.remove()"></div>`;
  const KEY = 'aura.citas.v1';
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const money = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fdate = (d, o = { weekday: 'long', day: 'numeric', month: 'long' }) => new Date(d + 'T12:00').toLocaleDateString(typeof I18N !== 'undefined' && I18N.lang() === 'en' ? 'en-US' : 'es-MX', o);

  function seed() {
    const day = n => iso(new Date(Date.now() + n * 864e5)), list = [
      ['gen', 0, '10:00', 'Mariana López', 'confirmada'], ['den', 0, '12:30', 'Jorge Navarro', 'pendiente'],
      ['psi', 1, '11:00', 'Daniela Ruiz', 'confirmada'], ['nut', 1, '16:00', 'Carlos Medina', 'pendiente'],
      ['gen', 2, '09:30', 'Paola Fernández', 'pendiente'], ['den', 3, '17:00', 'Luis Ortega', 'confirmada'],
      ['psi', 3, '10:00', 'Andrea Solís', 'cancelada']
    ];
    return list.map(([s, d, t, n, st], i) => ({ id: 'seed' + i, code: 'AUR-' + (4100 + i * 37), serviceId: s, doctorId: SERVICES.find(x => x.id === s).doc, date: day(d), time: t, name: n, phone: '33 1234 56' + (10 + i), email: n.split(' ')[0].toLowerCase() + '@correo.com', notes: '', status: st }));
  }
  let mem = null;
  const list = () => {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY)); } catch (e) { }
    if (!Array.isArray(mem)) { mem = seed(); persist(); }
    return mem;
  };
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { } };

  // Horarios de 9:00 a 18:00 cada 30 min, con descanso de 14:00 a 15:00
  const TIMES = []; for (let h = 9; h < 18; h++) { if (h === 14) continue; TIMES.push(`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`); }
  function slotsFor(date, doc) {
    const taken = list().filter(a => a.date === date && a.doctorId === doc && a.status !== 'cancelada').map(a => a.time);
    const n = new Date(), isToday = date === iso(n), cur = n.getHours() * 60 + n.getMinutes() + 60;
    return TIMES.map(t => { const [h, m] = t.split(':'); return { t, free: !taken.includes(t) && !(isToday && +h * 60 + +m < cur) }; });
  }
  return {
    SERVICES, DOCTORS, TIMES, face, PX, iso, money, esc, fdate, slotsFor, list,
    add(a) { list().push(a); persist(); },
    update(id, p) { Object.assign(list().find(a => a.id === id) || {}, p); persist(); },
    remove(id) { mem = list().filter(a => a.id !== id); persist(); }
  };
})();
