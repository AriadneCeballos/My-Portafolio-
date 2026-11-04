
/* Panel de recepción — datos de demostración guardados localmente. */
const Admin = (() => {
 const $ = (s,r=document)=>r.querySelector(s);
 const pinKey='alameda.admin.session';
 function render(){
  const root=$('#admin');
  if(sessionStorage.getItem(pinKey)!=='ok'){
   root.innerHTML=`<div class="adm-card" style="max-width:430px;margin:70px auto"><span class="eyebrow">Personal de la clínica</span><h1 style="font:42px Newsreader;margin:10px 0">Panel de recepción</h1><p style="color:var(--muted)">Acceso para el personal de la clínica.</p><form id="login"><label style="display:grid;gap:8px">PIN de acceso<input name="pin" type="password" inputmode="numeric" maxlength="8" required></label><p class="err" id="loginerr"></p><button class="btn">Entrar</button></form><p style="font-size:12px;color:var(--muted)">PIN de demostración: <b>1234</b></p><a class="link2" href="#">← Volver al sitio</a></div>`;
   $('#login').onsubmit=e=>{e.preventDefault();if(new FormData(e.target).get('pin')==='1234'){sessionStorage.setItem(pinKey,'ok');render()}else $('#loginerr').textContent='PIN incorrecto.'};
   return;
  }
  const items=Aura.list(), today=Aura.iso(new Date()), money=Aura.money;
  const rows=items.slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const count=(s)=>items.filter(a=>a.status===s).length;
  root.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap"><div><span class="eyebrow">Alameda · Recepción</span><h1 style="font:46px Newsreader;margin:8px 0">Panel de citas</h1><p style="color:var(--muted)">Administra las reservas guardadas en este navegador.</p></div><div><a class="btn ghost" href="#">Ver sitio</a> <button class="btn" id="logout">Salir</button></div></div>
  <div class="team" style="grid-template-columns:repeat(4,1fr);margin:25px 0"><div class="adm-card"><small>Citas hoy</small><h2>${items.filter(a=>a.date===today).length}</h2></div><div class="adm-card"><small>Pendientes</small><h2>${count('pendiente')}</h2></div><div class="adm-card"><small>Confirmadas</small><h2>${count('confirmada')}</h2></div><div class="adm-card"><small>Ingreso proyectado</small><h2>${money(items.filter(a=>a.status!=='cancelada').reduce((n,a)=>n+(Aura.SERVICES.find(s=>s.id===a.serviceId)?.price||0),0))}</h2></div></div>
  <div class="adm-card"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><h2 style="font:28px Newsreader">Agenda de pacientes</h2><select id="filter" style="padding:10px;border:1px solid var(--line);border-radius:7px;background:var(--paper);color:var(--ink)"><option value="all">Todas</option><option value="today">Hoy</option><option value="pendiente">Pendientes</option><option value="confirmada">Confirmadas</option><option value="cancelada">Canceladas</option></select></div><div style="overflow:auto"><table><thead><tr><th>Fecha</th><th>Paciente</th><th>Servicio</th><th>Especialista</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="appointments"></tbody></table></div><p style="color:var(--muted);font-size:11px">Demo de portafolio: los datos viven en el navegador. En producción se conectaría a una base de datos.</p></div>`;
  const tbody=$('#appointments');
  function fill(filter='all'){
   const filtered=rows.filter(a=>filter==='all'||(filter==='today'?a.date===today:a.status===filter));
   tbody.innerHTML=filtered.length?filtered.map(a=>{const s=Aura.SERVICES.find(x=>x.id===a.serviceId),d=Aura.DOCTORS[a.doctorId];return `<tr><td>${Aura.fdate(a.date)}<br>${a.time}</td><td><b>${Aura.esc(a.name)}</b><br><small>${Aura.esc(a.phone)} · ${Aura.esc(a.email)}</small></td><td>${s?.spec||'—'}</td><td>${d?.name||'—'}</td><td><span class="pill">${a.status}</span></td><td>${a.status==='pendiente'?`<button class="link2" data-action="confirm" data-id="${a.id}">Confirmar</button>`:''} ${a.status!=='cancelada'?`<button class="link2" data-action="cancel" data-id="${a.id}">Cancelar</button>`:''} <button class="link2" data-action="delete" data-id="${a.id}">Eliminar</button></td></tr>`}).join(''):'<tr><td colspan="6">No hay citas en esta vista.</td></tr>';
  }
  fill();$('#filter').onchange=e=>fill(e.target.value);
  tbody.onclick=e=>{const b=e.target.closest('[data-action]');if(!b)return;const {action,id}=b.dataset;if(action==='confirm')Aura.update(id,{status:'confirmada'});if(action==='cancel')Aura.update(id,{status:'cancelada'});if(action==='delete'&&confirm('¿Eliminar esta cita?'))Aura.remove(id);render()};
  $('#logout').onclick=()=>{sessionStorage.removeItem(pinKey);render()};
 }
 return {render};
})();
