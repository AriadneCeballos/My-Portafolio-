/* Alameda · interfaz: idioma ES/EN, tema claro/oscuro y modo blanco y negro.
   La traducción recorre el DOM y reemplaza textos según el diccionario EN,
   así funciona también con el contenido que genera JavaScript. */
const I18N = (() => {
  const EN = {
    'Lun a sáb · 8:00 – 20:00': 'Mon–Sat · 8:00 am – 8:00 pm', 'Av. Chapultepec 480, Guadalajara': '480 Av. Chapultepec, Guadalajara', 'Llámanos: 33 0000 0000': 'Call us: 33 0000 0000',
    'Centro Médico': 'Medical Center', 'Especialidades': 'Specialties', 'Equipo': 'Team', 'Preguntas': 'FAQ', 'Contacto': 'Contact', 'Agendar cita': 'Book appointment', 'Acceso del personal': 'Staff login',
    'Atención médica integral': 'Comprehensive medical care', 'Cuidamos tu salud con': 'We look after your health with', 'cercanía y rigor médico.': 'warmth and medical rigor.',
    'Cuatro especialidades en un mismo lugar, con especialistas certificados y citas en línea disponibles las 24 horas.': 'Four specialties under one roof, with board-certified specialists and online booking available 24/7.',
    '¿Qué necesitas?': 'What do you need?', 'Ver horarios': 'See availability', '12 años': '12 years', 'de trayectoria': 'of experience', '4.9 / 5': '4.9 / 5', 'satisfacción': 'satisfaction', 'pacientes atendidos': 'patients treated',
    'Equipo médico del centro': 'The medical team', 'Cita en menos de 24 h': 'Appointments within 24 h', 'Confirmación inmediata por correo': 'Instant email confirmation',
    'Médicos con cédula profesional': 'Licensed physicians', 'Expediente clínico confidencial': 'Confidential medical records', 'Consultorios equipados y accesibles': 'Equipped, accessible offices', 'Facturación disponible': 'Invoicing available',
    'Todo lo que necesitas, en un solo centro': 'Everything you need, in one center', 'Reserva en línea': 'Online booking', 'Agenda tu cita en cuatro pasos': 'Book your appointment in four steps',
    'Servicio': 'Service', 'Fecha y hora': 'Date & time', 'Tus datos': 'Your details', 'Listo': 'Done',
    'Nuestro equipo': 'Our team', 'Especialistas que te conocen por nombre': 'Specialists who know you by name',
    'Cómo funciona': 'How it works', 'Sencillo desde la primera visita': 'Simple from the very first visit',
    'Reservas en línea': 'Book online', 'Eliges especialidad, día y hora sin llamar.': 'Pick a specialty, day and time without calling.',
    'Recibes confirmación': 'Get confirmation', 'Te llega un correo y puedes agregar la cita a tu calendario.': 'You receive an email and can add the appointment to your calendar.',
    'Te atendemos puntual': 'We see you on time', 'Llega 10 minutos antes con una identificación oficial.': 'Arrive 10 minutes early with a valid photo ID.',
    '“Me dieron cita al día siguiente y la doctora dedicó tiempo real a explicarme todo.”': '“I got an appointment the next day and the doctor took real time to explain everything.”',
    '“Puntualidad, instalaciones impecables y un trato muy humano. Llevo a toda mi familia.”': '“On time, spotless facilities and genuinely caring. I bring my whole family.”',
    'Mariana L. · Paciente de medicina general': 'Mariana L. · General medicine patient', 'Jorge N. · Paciente de odontología': 'Jorge N. · Dentistry patient',
    'Preguntas frecuentes': 'Frequently asked questions', 'Antes de tu visita': 'Before your visit',
    '¿Puedo cancelar o reprogramar mi cita?': 'Can I cancel or reschedule?', 'Sí, con al menos 4 horas de anticipación llamando a recepción o respondiendo tu correo de confirmación.': 'Yes, at least 4 hours in advance by calling reception or replying to your confirmation email.',
    '¿Aceptan seguros de gastos médicos?': 'Do you accept health insurance?', 'Trabajamos con las principales aseguradoras. Confirma con recepción la cobertura de tu póliza antes de la consulta.': 'We work with the main insurers. Check your policy coverage with reception before your visit.',
    '¿Qué debo llevar a mi primera consulta?': 'What should I bring to my first visit?', 'Una identificación oficial, tus estudios previos si los tienes y la lista de medicamentos que tomas actualmente.': 'A valid photo ID, any previous test results and a list of the medications you currently take.',
    '¿Emiten factura?': 'Do you issue invoices?', 'Sí. Solicítala el mismo día de tu consulta con tus datos fiscales.': 'Yes. Request it on the day of your visit with your tax details.',
    'Visítanos en la colonia Americana': 'Visit us in Colonia Americana', 'Dirección': 'Address', 'Av. Chapultepec 480, Col. Americana,': '480 Av. Chapultepec, Col. Americana,', 'Guadalajara, Jalisco': 'Guadalajara, Jalisco',
    'Teléfono': 'Phone', 'Correo': 'Email', 'Horario': 'Hours', 'Lunes a sábado, 8:00 a 20:00': 'Monday to Saturday, 8:00 am – 8:00 pm', 'Cómo llegar': 'Get directions',
    'Personal de la clínica': 'Clinic staff', 'Consulta la agenda del día, confirma citas y administra a tus pacientes desde el panel de recepción.': 'Check the day’s schedule, confirm appointments and manage patients from the reception dashboard.', 'Entrar al panel →': 'Go to dashboard →',
    '© 2026 Alameda Centro Médico · Sitio ficticio de demostración para portafolio': '© 2026 Alameda Medical Center · Fictional demo site for a portfolio', 'Aviso de privacidad': 'Privacy notice',
    'Alameda Centro Médico · Agenda tu cita en línea': 'Alameda Medical Center · Book your appointment online',
    /* servicios y equipo */
    'Medicina general': 'General medicine', 'Odontología': 'Dentistry', 'Nutrición': 'Nutrition', 'Psicología': 'Psychology', 'Nutrición clínica': 'Clinical nutrition',
    'Consulta de medicina general': 'General medicine consultation', 'Limpieza y revisión dental': 'Dental cleaning & check-up', 'Consulta de nutrición clínica': 'Clinical nutrition consultation', 'Sesión de psicología': 'Psychology session',
    'Chequeos, diagnóstico y seguimiento de enfermedades comunes y crónicas.': 'Check-ups, diagnosis and follow-up of common and chronic conditions.',
    'Profilaxis, valoración de caries y plan de tratamiento personalizado.': 'Cleaning, cavity assessment and a personalized treatment plan.',
    'Planes alimenticios basados en tus estudios, metas y estilo de vida.': 'Meal plans based on your lab results, goals and lifestyle.',
    'Terapia individual para ansiedad, estrés y bienestar emocional.': 'Individual therapy for anxiety, stress and emotional well-being.',
    'Agendar →': 'Book →', 'Ver horarios →': 'See availability →',
    /* reserva */
    'Tu especialista': 'Your specialist', 'Elige el día': 'Choose a day', 'Horarios disponibles': 'Available times', '← Cambiar servicio': '← Change service', 'Continuar': 'Continue',
    'Nombre completo': 'Full name', 'Correo electrónico': 'Email address', 'Motivo de consulta': 'Reason for visit', '(opcional)': '(optional)', '← Volver': '← Back', 'Confirmar cita': 'Confirm appointment',
    'Escribe tu nombre completo.': 'Please enter your full name.', 'El teléfono debe tener 10 dígitos.': 'The phone number must have 10 digits.', 'Revisa tu correo electrónico.': 'Please check your email address.', 'Ese horario acaba de ocuparse. Elige otro.': 'That time was just taken. Please pick another.',
    '¡Tu cita está reservada!': 'Your appointment is booked!', 'Código': 'Code', 'Especialista': 'Specialist', 'Agregar al calendario': 'Add to calendar', 'Reservar otra cita': 'Book another appointment',
    'dom': 'Sun', 'lun': 'Mon', 'mar': 'Tue', 'mié': 'Wed', 'jue': 'Thu', 'vie': 'Fri', 'sáb': 'Sat',
    /* panel */
    'Panel de recepción · Alameda': 'Reception dashboard · Alameda', 'Acceso para el personal de la clínica.': 'Access for clinic staff.', 'Entrar': 'Sign in', 'PIN de demostración:': 'Demo PIN:', 'PIN incorrecto.': 'Incorrect PIN.', '← Volver al sitio': '← Back to site',
    'Recepción': 'Reception', 'Panel de citas': 'Appointments', 'Ver sitio': 'View site', 'Salir': 'Sign out', 'Citas hoy': 'Today’s appointments', 'Pendientes': 'Pending', 'Confirmadas': 'Confirmed', 'Ingreso proyectado': 'Projected revenue',
    'Todas': 'All', 'Hoy': 'Today', 'Canceladas': 'Cancelled', 'pendiente': 'pending', 'confirmada': 'confirmed', 'cancelada': 'cancelled', 'Confirmar': 'Confirm', 'Cancelar': 'Cancel', 'Eliminar': 'Delete',
    'No hay citas en esta vista.': 'No appointments in this view.', 'Demo de portafolio: los datos viven en el navegador. En producción se conectaría a una base de datos.': 'Portfolio demo: data lives in the browser. In production it would connect to a database.',
    /* controles */
    'B/N': 'B/W', 'Idioma': 'Language', 'Blanco y negro': 'Black & white', 'Cambiar tema': 'Toggle theme'
  };
  const SUB = [
    [/^Dra\. /, 'Dr. '], [/ · Dra\. /, ' · Dr. '], [/(\d+) años de experiencia/, '$1 years of experience'], [/^Cédula prof\. (\d+)$/, 'Prof. license $1'],
    [/^(\d{1,2}:\d{2}) h$/, '$1'], [/^Te esperamos, (.+)\. Recibirás una confirmación en (.+)\.$/, 'See you soon, $1. A confirmation will be sent to $2.']
  ];
  const ATTRS = ['aria-label', 'placeholder', 'alt', 'title'], store = new WeakMap(), root = document.documentElement;
  let lang = 'es'; try { lang = localStorage.getItem('lang') || 'es'; } catch (e) { }

  const tr = s => {
    const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/), core = m[2]; if (!core) return s;
    let out = EN[core]; if (out === undefined) { out = core; SUB.forEach(([r, v]) => out = out.replace(r, v)); }
    return m[1] + out + m[3];
  };
  const text = n => {
    let o = store.get(n);
    if (!o || (n.data !== o.es && n.data !== o.en)) o = { es: n.data, en: tr(n.data) };
    store.set(n, o); const v = lang === 'en' ? o.en : o.es; if (n.data !== v) n.data = v;
  };
  const attrs = el => ATTRS.forEach(a => {
    if (!el.hasAttribute(a)) return;
    const k = el.__i18n || (el.__i18n = {}), cur = el.getAttribute(a); let o = k[a];
    if (!o || (cur !== o.es && cur !== o.en)) o = k[a] = { es: cur, en: tr(cur) };
    const v = lang === 'en' ? o.en : o.es; if (cur !== v) el.setAttribute(a, v);
  });
  const walk = n => {
    if (n.nodeType === 3) return text(n);
    if (n.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(n.tagName)) return;
    attrs(n); n.childNodes.forEach(walk);
  };
  const mo = new MutationObserver(ms => {
    mo.disconnect();
    ms.forEach(m => m.type === 'characterData' ? text(m.target) : m.addedNodes.forEach(walk));
    watch();
  });
  const watch = () => mo.observe(root, { childList: true, subtree: true, characterData: true });

  function setLang(l) {
    lang = l; try { localStorage.setItem('lang', l); } catch (e) { }
    root.lang = l; mo.disconnect(); walk(root);
    document.getElementById('lang').textContent = l === 'en' ? 'ES' : 'EN';
    watch(); dispatchEvent(new Event('langchange'));
  }

  function init() {
    const $ = id => document.getElementById(id), save = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };
    try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; if (localStorage.getItem('bn') === '1') root.classList.add('bn'); } catch (e) { }
    $('theme').onclick = () => {
      const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
      root.dataset.theme = dark ? 'light' : 'dark'; save('theme', root.dataset.theme);
    };
    $('bn').onclick = () => { const on = root.classList.toggle('bn'); $('bn').setAttribute('aria-pressed', on); save('bn', on ? '1' : '0'); };
    $('lang').onclick = () => setLang(lang === 'en' ? 'es' : 'en');
    $('bn').setAttribute('aria-pressed', root.classList.contains('bn'));
    setLang(lang);
  }
  return { init, lang: () => lang };
})();
I18N.init();
