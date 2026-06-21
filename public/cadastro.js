const usuario = getUsuarioCorrente();
if (!usuario) {
  window.location.href = caminhoLogin();
}

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (id) {
  document.getElementById('titulo-pagina').textContent = 'Editar Produto';
  carregarProduto(id);
}

async function carregarProduto(id) {
  const response = await fetch(`http://localhost:3000/produtos/${id}`);
  const item = await response.json();

  document.getElementById('titulo').value = item.titulo;
  document.getElementById('categoria').value = item.categoria;
  document.getElementById('preco').value = item.preco;
  document.getElementById('imagem').value = item.imagem;
  document.getElementById('descricaoCurta').value = item.descricaoCurta;
  document.getElementById('descricaoCompleta').value = item.descricaoCompleta;
  document.getElementById('tags').value = item.tags.join(', ');
}

document.getElementById('form-produto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const produto = {
    titulo: document.getElementById('titulo').value,
    categoria: document.getElementById('categoria').value,
    preco: parseFloat(document.getElementById('preco').value),
    imagem: document.getElementById('imagem').value,
    descricaoCurta: document.getElementById('descricaoCurta').value,
    descricaoCompleta: document.getElementById('descricaoCompleta').value,
    tags: document.getElementById('tags').value.split(',').map(t => t.trim())
  };

  if (id) {
    await fetch(`http://localhost:3000/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    });
  } else {
    await fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    });
  }

  window.location.href = 'index.html';
});
