let usuarios = [];

async function initLoginApp() {
  const response = await fetch('http://localhost:3000/usuarios');
  usuarios = await response.json();

  const usuarioCorrente = getUsuarioCorrente();
  const naPaginaLogin = window.location.pathname.includes('/modulos/login/');

  if (!usuarioCorrente && !naPaginaLogin) {
    window.location.href = caminhoLogin();
    return;
  }

  if (usuarioCorrente && naPaginaLogin) {
    window.location.href = caminhoHome();
    return;
  }

  renderLoginArea();
}

function getUsuarioCorrente() {
  const dados = sessionStorage.getItem('usuarioCorrente');
  return dados ? JSON.parse(dados) : null;
}

function loginUser(login, senha) {
  const usuario = usuarios.find(u => u.login === login && u.senha === senha);

  if (!usuario) {
    return false;
  }

  sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuario));
  window.location.href = caminhoHome();
  return true;
}

function logoutUser() {
  sessionStorage.removeItem('usuarioCorrente');
  window.location.href = caminhoLogin();
}

function caminhoLogin() {
  return window.location.pathname.includes('/modulos/login/')
    ? 'index.html'
    : 'modulos/login/index.html';
}

function caminhoHome() {
  return window.location.pathname.includes('/modulos/login/')
    ? '../../index.html'
    : 'index.html';
}

function renderLoginArea() {
  const area = document.getElementById('login-area');
  if (!area) return;

  const usuario = getUsuarioCorrente();

  if (usuario) {
    area.innerHTML = `Olá, ${usuario.nome} | <a href="favoritos.html">Meus Favoritos</a> | <a href="#" id="link-sair">Sair</a>`;
    document.getElementById('link-sair').addEventListener('click', e => {
      e.preventDefault();
      logoutUser();
    });
  } else {
    area.innerHTML = `<a href="${caminhoLogin()}">Entrar</a>`;
  }
}

window.addEventListener('DOMContentLoaded', initLoginApp);
