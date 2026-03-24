function renderMessage(targetId, text, type = 'ok') {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `<div class="message ${type}">${text}</div>`;
}

async function handleLogin(event) {
  event.preventDefault();

  try {
    const result = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ cpf: cpf.value, password: password.value })
    });

    localStorage.setItem('token', result.token);
    localStorage.setItem('usuario', JSON.stringify(result.usuario));

    window.location.href = result.usuario.role === 'CLIENTE'
      ? '/pages/dashboard-cliente.html'
      : '/pages/dashboard-agente.html';
  } catch (error) {
    renderMessage('feedback', error.message, 'error');
  }
}

async function handleCadastro(event) {
  event.preventDefault();

  const body = {
    role: role.value,
    nome: nome.value,
    cpf: cpf.value,
    rg: rg.value,
    endereco: endereco.value,
    profissao: profissao.value,
    password: password.value,
    rendimentos: []
  };

  if (body.role === 'CLIENTE') {
    [
      { empregador: emp1.value, valor: Number(renda1.value || 0) },
      { empregador: emp2.value, valor: Number(renda2.value || 0) },
      { empregador: emp3.value, valor: Number(renda3.value || 0) }
    ].forEach((item) => {
      if (item.empregador && item.valor > 0) body.rendimentos.push(item);
    });
  }

  try {
    await request('/auth/register', { method: 'POST', body: JSON.stringify(body) });
    renderMessage('feedback', 'Cadastro realizado com sucesso.');
    event.target.reset();
  } catch (error) {
    renderMessage('feedback', error.message, 'error');
  }
}
