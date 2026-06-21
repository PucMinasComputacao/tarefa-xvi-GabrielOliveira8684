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

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <img src="${item.imagem}" alt="${item.titulo}">
    <div class="card-content">
      <h3>${item.titulo}</h3>
      <p class="categoria">${item.categoria}</p>
      <p class="descricao">${item.descricaoCurta}</p>
      <p class="preco">R$ ${item.preco.toFixed(2)}</p>
      <a href="details.html?id=${item.id}" class="btn-detalhes">Ver Detalhes</a>
    </div>
  `;

  return card;
}

function renderCards(items) {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = '<p>Você ainda não tem favoritos.</p>';
    return;
  }

  items.forEach(item => {
    const card = createCard(item);
    container.appendChild(card);
  });
}

async function init() {
  const items = await fetchItems();
  const favoritos = getFavoritos();
  const favoritados = items.filter(item => favoritos.includes(item.id));

  renderCards(favoritados);
}

window.addEventListener('DOMContentLoaded', init);
