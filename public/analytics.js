async function fetchItems() {
  const response = await fetch('http://localhost:3000/produtos');
  const items = await response.json();
  return items;
}

function processarDados(items) {
  const categorias = {};

  items.forEach(item => {
    if (!categorias[item.categoria]) {
      categorias[item.categoria] = {
        quantidade: 0,
        precoTotal: 0
      };
    }
    categorias[item.categoria].quantidade += 1;
    categorias[item.categoria].precoTotal += item.preco;
  });

  return categorias;
}

function criarGraficoPizza(categorias) {
  const labels = Object.keys(categorias);
  const dados = labels.map(cat => categorias[cat].quantidade);

  const cores = [
    '#2d5016',
    '#4a7c2c',
    '#6ba344',
    '#8cc74f',
    '#a8d965',
    '#c4e57a',
    '#d4ed8f'
  ];

  const ctx = document.getElementById('chartPizza').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: dados,
        backgroundColor: cores,
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function criarGraficoBarras(categorias) {
  const labels = Object.keys(categorias);
  const dados = labels.map(cat => {
    const preco = categorias[cat].precoTotal / categorias[cat].quantidade;
    return parseFloat(preco.toFixed(2));
  });

  const ctx = document.getElementById('chartBarras').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Preço Médio (R$)',
        data: dados,
        backgroundColor: '#4a7c2c',
        borderColor: '#2d5016',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return 'R$ ' + value.toFixed(2);
            }
          }
        }
      }
    }
  });
}

async function init() {
  const items = await fetchItems();
  const categorias = processarDados(items);

  criarGraficoPizza(categorias);
  criarGraficoBarras(categorias);
}

window.addEventListener('DOMContentLoaded', init);
