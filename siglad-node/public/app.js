const API_BASE = '';
const storage = {
  get token(){ return localStorage.getItem('token') },
  set token(v){ v? localStorage.setItem('token', v): localStorage.removeItem('token') },
  get role(){ return localStorage.getItem('role') },
  set role(v){ v? localStorage.setItem('role', v): localStorage.removeItem('role') },
  get name(){ return localStorage.getItem('name') },
  set name(v){ v? localStorage.setItem('name', v): localStorage.removeItem('name') },
};

function authHeaders(json=true){
  const h = {'Authorization': 'Bearer ' + storage.token};
  if(json) h['Content-Type']='application/json';
  return h;
}

async function api(path, opts={}){
  const r = await fetch(API_BASE + path, opts);
  if(r.status===401){ logoutAndGoLogin(); throw new Error('401'); }
  return r;
}

function guardLogged(){
  if(!storage.token){ window.location.href='login.html'; }
}

function logoutAndGoLogin(){
  storage.token = null; storage.role=null; storage.name=null;
  window.location.href='login.html';
}

function setHeader(){
  const roleEl = document.getElementById('role');
  const userEl = document.getElementById('who');
  if(roleEl) roleEl.textContent = storage.role || '—';
  if(userEl) userEl.textContent = storage.name || '—';
}

function renderNav(){
  const n = document.getElementById('main-nav');
  if(!n) return;
  n.innerHTML = `
    <a href="dashboard.html">Inicio</a>
    <a href="users.html" class="secondary">Usuarios</a>
    <a href="declarations.html" class="secondary">Declaraciones</a>
    <a href="status.html" class="secondary">Estados</a>
    <a href="#" id="logoutBtn" class="secondary">Salir</a>
  `;
  const lb = document.getElementById('logoutBtn'); 
  if(lb) lb.onclick = (e)=>{ e.preventDefault(); logoutAndGoLogin(); };
}

document.addEventListener('DOMContentLoaded', ()=>{ setHeader(); renderNav(); });
