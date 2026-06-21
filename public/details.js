async function fetchItem(id) {
  const response = await fetch(`http://localhost:3000/produtos/${id}`);

  if (!response.ok) {
    throw new Error('Produto não encontrado');
  }

  const item = await response.json();
  return item;
}

function renderDetails(item) {
  const container = document.getElementById('details-container');

  const tags = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

  container.innerHTML = `
    <div class="details-content">
      <img src="${item.imagem}" alt="${item.titulo}" class="details-image">
      <div class="details-info">
        <h2>${item.titulo}</h2>
        <p class="categoria-badge">${item.categoria}</p>
        <p class="preco-grande">R$ ${item.preco.toFixed(2)}</p>
        <h3>Descrição</h3>
        <p class="descricao-completa">${item.descricaoCompleta}</p>
        <h3>Tags</h3>
        <div class="tags-container">
          ${tags}
        </div>
        <button class="btn-comprar">Comprar Agora</button>
      </div>
    </div>
  `;
}

function showError(message) {
  const container = document.getElementById('details-container');
  container.innerHTML = `<p class="erro">${message}</p>`;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    showError('ID do produto não encontrado na URL');
    return;
  }

  try {
    const item = await fetchItem(id);
    renderDetails(item);
  } catch (error) {
    showError('Produto não encontrado');
  }
}

window.addEventListener('DOMContentLoaded', init);
