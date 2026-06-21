let itemsAtuais = [];

async function fetchItems() {
  const response = await fetch('http://localhost:3000/produtos');
  const items = await response.json();
  return items;
}

function getFavoritos() {
  const usuario = getUsuarioCorrente();
  if (!usuario) return [];

  const dados = localStorage.getItem(`favoritos_${usuario.id}`);
  return dados ? JSON.parse(dados) : [];
}

function salvarFavoritos(favoritos) {
  const usuario = getUsuarioCorrente();
  localStorage.setItem(`favoritos_${usuario.id}`, JSON.stringify(favoritos));
}

function toggleFavorito(id) {
  const usuario = getUsuarioCorrente();

  if (!usuario) {
    window.location.href = caminhoLogin();
    return;
  }

  let favoritos = getFavoritos();

  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(favId => favId !== id);
  } else {
    favoritos.push(id);
  }

  salvarFavoritos(favoritos);
  renderCards(itemsAtuais);
}

async function deleteProduto(id) {
  const usuario = getUsuarioCorrente();

  if (!usuario) {
    window.location.href = caminhoLogin();
    return;
  }

  if (!confirm('Excluir esse produto?')) return;

  await fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' });
  itemsAtuais = await fetchItems();
  renderCards(itemsAtuais);
}

function createCard(item, favoritos) {
  const card = document.createElement('div');
  card.className = 'card';

  const favoritado = favoritos.includes(item.id);

  card.innerHTML = `
    <img src="${item.imagem}" alt="${item.titulo}">
    <div class="card-content">
      <div class="card-header">
        <h3>${item.titulo}</h3>
        <button class="btn-favorito ${favoritado ? 'favoritado' : ''}" data-id="${item.id}">${favoritado ? '★' : '☆'}</button>
      </div>
      <p class="categoria">${item.categoria}</p>
      <p class="descricao">${item.descricaoCurta}</p>
      <p class="preco">R$ ${item.preco.toFixed(2)}</p>
      <a href="details.html?id=${item.id}" class="btn-detalhes">Ver Detalhes</a>
      <div class="card-acoes">
        <a href="cadastro.html?id=${item.id}" class="btn-detalhes">Editar</a>
        <button class="btn-excluir" data-id="${item.id}">Excluir</button>
      </div>
    </div>
  `;

  card.querySelector('.btn-favorito').addEventListener('click', () => toggleFavorito(item.id));
  card.querySelector('.btn-excluir').addEventListener('click', () => deleteProduto(item.id));

  return card;
}

function renderCards(items) {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  const favoritos = getFavoritos();

  items.forEach(item => {
    const card = createCard(item, favoritos);
    container.appendChild(card);
  });
}

async function init() {
  itemsAtuais = await fetchItems();
  renderCards(itemsAtuais);
}

window.addEventListener('DOMContentLoaded', init);
