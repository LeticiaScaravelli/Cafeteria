const menuData = [
  { id: 1, nome: 'Café Expresso', preco: 4.50 },
  { id: 2, nome: 'Café com Leite', preco: 5.00 },
  { id: 3, nome: 'Cappuccino', preco: 6.50 },
  { id: 4, nome: 'Café Americano', preco: 5.50 },
  { id: 5, nome: 'Chocolate Quente', preco: 7.00 },
  { id: 6, nome: 'Pão de Queijo', preco: 3.50 },
  { id: 7, nome: 'Croissant', preco: 6.00 },
  { id: 8, nome: 'Bolo de Chocolate', preco: 8.00 },
  { id: 9, nome: 'Torta de Limão', preco: 9.00 },
  { id: 10, nome: 'Sanduíche Natural', preco: 12.00 }
];

let pedidoAtual = [];

function carregarMenu() {
  const menuContainer = document.getElementById('menuItems');
  menuContainer.innerHTML = '';

  menuData.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.classnome = 'menu-item';
    menuItem.innerHTML = `
      <div class="item-info">
        <h3>${item.nome}</h3>
        <p class="item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
      </div>
      <button class="btn btn-add" onclick="adicionarAoPedido(${item.id})">Adicionar</button>
    `;
    menuContainer.appendChild(menuItem);
  });
}

function adicionarAoPedido(itemId) {
  const menuItem = menuData.find(item => item.id === itemId);

  if (menuItem) {
    const existingItem = pedidoAtual.find(item => item.id === itemId);

    if (existingItem) {
      existingItem.quantidade += 1;
    } else {
      pedidoAtual.push({
        id: menuItem.id,
        nome: menuItem.nome,
        preco: menuItem.preco,
        quantidade: 1
      });
    }
    atualizarDisplayPedido();
  }
}

function removerDoPedido(itemId) {
  const index = pedidoAtual.findIndex(item => item.id === itemId);
  if (index > -1) {
    pedidoAtual.splice(index, 1);
    atualizarDisplayPedido();
  }
}

function atualizarQuantidade(itemId, change) {
  const item = pedidoAtual.find(item => item.id === itemId);
  if (item) {
    item.quantidade += change;
    if (item.quantidade <= 0) {
      removerDoPedido(itemId);
    } else {
      atualizarDisplayPedido();
    }
  }
}

function atualizarDisplayPedido() {
  const ContainerPedido = document.getElementById('ItemPedidos');

  if (pedidoAtual.length === 0) {
    ContainerPedido.innerHTML = '<p class="empty-message">Nenhum item adicionado</p>';
  } else {
    ContainerPedido.innerHTML = '';

    pedidoAtual.forEach(item => {
      const ItemPedido = document.createElement('div');
      ItemPedido.classnome = 'order-item';
      const subtotal = item.preco * item.quantidade;

      ItemPedido.innerHTML = `
        <div class="order-item-info">
          <h4>${item.nome}</h4>
          <p>R$ ${item.preco.toFixed(2).replace('.', ',')} x ${item.quantidade}</p>
        </div>
        <div class="order-item-actions">
          <div class="quantidade-controls">
            <button class="btn-quantidade" onclick="atualizarQuantidade(${item.id}, -1)">-</button>
            <span class="quantidade">${item.quantidade}</span>
            <button class="btn-quantidade" onclick="atualizarQuantidade(${item.id}, 1)">+</button>
          </div>
          <p class="subtotal">R$ ${subtotal.toFixed(2).replace('.', ',')}</p>
          <button class="btn-remove" onclick="removerDoPedido(${item.id})">🗑️</button>
        </div>
      `;
      ContainerPedido.appendChild(ItemPedido);
    });
  }
  atualizarTotal();
}

function atualizarTotal() {
  const total = pedidoAtual.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  document.getElementById('totalpedido').textContent = total.toFixed(2).replace('.', ',');
}

function limparPedido() {
  if (pedidoAtual.length > 0 && confirm('Deseja limpar o pedido atual?')) {
    pedidoAtual = [];
    atualizarDisplayPedido();
  }
}

function salvarPedidoToJSON() {
  if (pedidoAtual.length === 0) {
    alert('Não há itens no pedido para salvar!');
    return;
  }

  const total = pedidoAtual.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  const orderData = {
    data: new Date().toLocaleString('pt-BR'),
    itens: pedidoAtual.map(item => ({
      id: item.id,
      nome: item.nome,
        preco_unico: item.preco,
      quantidade: item.quantidade,
      subtotal: item.preco * item.quantidade
    })),
    total: total
  };
  const jsonString = JSON.stringify(orderData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pedido_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert('Pedido salvo com sucesso!');
}

document.addEventListener('DOMContentLoaded', () => {
  carregarMenu();

  document.getElementById('limparPedido').addEventListener('click', limparPedido);
  document.getElementById('salvarPedido').addEventListener('click', salvarPedidoToJSON);
});
