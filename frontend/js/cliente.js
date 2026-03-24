function ensureCliente() {
  const user = getUser();
  if (!user || user.role !== 'CLIENTE') logout();
  document.getElementById('nomeUsuario').textContent = user.nome;
}

function renderPedidos(pedidos) {
  const tbody = document.getElementById('pedidosBody');
  tbody.innerHTML = '';

  pedidos.forEach((p) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.marca} ${p.modelo}</td>
      <td>${p.periodo_inicio} até ${p.periodo_fim}</td>
      <td>${p.status}</td>
      <td><button onclick="cancelarPedido(${p.id})">Cancelar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function carregarPedidos() {
  const data = await request('/pedidos');
  renderPedidos(data.pedidos || []);
  financeiro.innerHTML = (data.financeiro || [])
    .map((f) => `<li>${f.empregador}: R$ ${Number(f.valor).toFixed(2)}</li>`)
    .join('');
}

async function criarPedido(event) {
  event.preventDefault();
  if (automovel_id.value === '__novo__') {
    alert('Cadastre e selecione um automóvel antes de criar o pedido.');
    return;
  }

  await request('/pedidos', {
    method: 'POST',
    body: JSON.stringify({
      automovel_id: Number(automovel_id.value),
      periodo_inicio: periodo_inicio.value,
      periodo_fim: periodo_fim.value,
      tipo_contrato: tipo_contrato.value,
      detalhes: detalhes.value
    })
  });

  alert('Pedido criado com sucesso.');
  event.target.reset();
  await carregarPedidos();
}

async function cancelarPedido(id) {
  await request(`/pedidos/${id}/cancelar`, { method: 'PATCH' });
  await carregarPedidos();
}

async function carregarAutomoveis() {
  const data = await request('/automoveis');
  automovel_id.innerHTML = '';
  const addNew = document.createElement('option');
  addNew.value = '__novo__';
  addNew.textContent = '+ Adicionar novo';
  automovel_id.appendChild(addNew);
  data.forEach((carro) => {
    const option = document.createElement('option');
    option.value = carro.id;
    option.textContent = `${carro.id} - ${carro.marca} ${carro.modelo} (${carro.placa})`;
    automovel_id.appendChild(option);
  });
  if (data.length > 0) {
    automovel_id.value = String(data[0].id);
  } else {
    automovel_id.value = '__novo__';
  }
  alternarFormularioNovoAutomovel();
}

function alternarFormularioNovoAutomovel() {
  const box = document.getElementById('novoAutomovelBox');
  box.style.display = automovel_id.value === '__novo__' ? 'block' : 'none';
}

async function adicionarAutomovel() {
  const payload = {
    matricula: novo_matricula.value.trim(),
    ano: Number(novo_ano.value),
    marca: novo_marca.value.trim(),
    modelo: novo_modelo.value.trim(),
    placa: novo_placa.value.trim(),
    owner_type: novo_proprietario.value
  };

  if (!payload.matricula || !payload.ano || !payload.marca || !payload.modelo || !payload.placa) {
    alert('Preencha todos os campos do novo automóvel.');
    return;
  }

  const criado = await request('/automoveis', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  await carregarAutomoveis();
  automovel_id.value = String(criado.id);
  alternarFormularioNovoAutomovel();
  alert('Automóvel cadastrado com sucesso.');
}

window.addEventListener('DOMContentLoaded', async () => {
  ensureCliente();
  automovel_id.addEventListener('change', alternarFormularioNovoAutomovel);
  try {
    await carregarAutomoveis();
    await carregarPedidos();
  } catch (error) {
    alert(error.message);
  }
});
