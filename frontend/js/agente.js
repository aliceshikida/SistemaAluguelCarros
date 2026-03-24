function ensureAgente() {
  const user = getUser();
  if (!user || (user.role !== 'EMPRESA' && user.role !== 'BANCO')) logout();
  document.getElementById('nomeUsuario').textContent = `${user.nome} (${user.role})`;
}

function renderPedidosAgente(pedidos) {
  const tbody = document.getElementById('pedidosBody');
  tbody.innerHTML = '';

  pedidos.forEach((p) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.cliente_nome}</td>
      <td>${p.marca} ${p.modelo}</td>
      <td>${p.status}</td>
      <td>
        <button onclick="abrirAvaliacao(${p.id})">Avaliar</button>
        <button onclick="executarContrato(${p.id})">Executar contrato</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function carregarPedidosAgente() {
  const data = await request('/pedidos');
  renderPedidosAgente(data.pedidos || []);
}

function abrirAvaliacao(id) {
  pedido_id.value = id;
}

async function avaliarPedido(event) {
  event.preventDefault();
  await request(`/pedidos/${Number(pedido_id.value)}/avaliar`, {
    method: 'PATCH',
    body: JSON.stringify({ aprovado: aprovado.value === 'true', analise_financeira: analise.value })
  });
  alert('Avaliação registrada.');
  await carregarPedidosAgente();
}

async function executarContrato(id) {
  const result = await request(`/pedidos/${id}/executar-contrato`, { method: 'POST' });
  contrato_id.value = result.contrato_id;
  alert('Contrato executado com sucesso.');
  await carregarPedidosAgente();
}

async function associarCredito(event) {
  event.preventDefault();
  const user = getUser();
  if (user.role !== 'BANCO') {
    alert('Somente banco pode associar crédito.');
    return;
  }

  await request('/creditos', {
    method: 'POST',
    body: JSON.stringify({
      contrato_id: Number(contrato_id.value),
      valor: Number(valor_credito.value),
      juros: Number(juros.value),
      parcelas: Number(parcelas.value)
    })
  });

  alert('Crédito associado com sucesso.');
}

window.addEventListener('DOMContentLoaded', async () => {
  ensureAgente();
  try {
    await carregarPedidosAgente();
  } catch (error) {
    alert(error.message);
  }
});
