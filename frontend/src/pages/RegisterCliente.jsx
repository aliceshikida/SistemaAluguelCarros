import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emptyRend = () => ({ empregadorNome: '', valor: '', descricao: '' });

export default function RegisterCliente() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tipoUsuario: 'CLIENTE',
    tipoAgente: 'EMPRESA',
    nome: '',
    endereco: '',
    login: '',
    senha: '',
    rg: '',
    cpf: '',
    profissao: '',
    nomeFantasia: '',
    cnpj: '',
    idAgente: '',
  });
  const [rendimentos, setRendimentos] = useState([emptyRend()]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  function updateRend(i, field, value) {
    setRendimentos((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  function addRend() {
    if (rendimentos.length >= 3) return;
    setRendimentos((r) => [...r, emptyRend()]);
  }

  function removeRend(i) {
    setRendimentos((r) => r.filter((_, j) => j !== i));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!form.nome.trim() || !form.login.trim() || !form.senha) {
      setErr('Nome, login e senha são obrigatórios.');
      return;
    }
    if (form.tipoUsuario === 'AGENTE' && !form.tipoAgente) {
      setErr('Selecione o tipo de agente.');
      return;
    }
    const rendPayload = rendimentos
        .filter((r) => r.empregadorNome?.trim())
        .map((r) => ({
          empregadorNome: r.empregadorNome.trim(),
          valor: r.valor === '' ? null : Number(r.valor),
          descricao: r.descricao?.trim() || null,
        }));
    if (form.tipoUsuario === 'CLIENTE' && rendPayload.length > 3) {
      setErr('Máximo de 3 rendimentos.');
      return;
    }
    setLoading(true);
    try {
      await register({
        tipoUsuario: form.tipoUsuario,
        tipoAgente: form.tipoUsuario === 'AGENTE' ? form.tipoAgente : null,
        nome: form.nome.trim(),
        endereco: form.endereco.trim(),
        login: form.login.trim(),
        senha: form.senha,
        rg: form.tipoUsuario === 'CLIENTE' ? form.rg.trim() : null,
        cpf: form.tipoUsuario === 'CLIENTE' ? form.cpf.trim() : null,
        profissao: form.tipoUsuario === 'CLIENTE' ? form.profissao.trim() : null,
        rendimentos: form.tipoUsuario === 'CLIENTE' ? rendPayload : [],
        nomeFantasia: form.tipoUsuario === 'AGENTE' ? form.nomeFantasia.trim() : null,
        cnpj: form.tipoUsuario === 'AGENTE' ? form.cnpj.trim() : null,
        idAgente:
            form.tipoUsuario === 'AGENTE' && form.idAgente !== '' ? Number(form.idAgente) : null,
      });
      navigate('/login');
    } catch (ex) {
      const d = ex.response?.data;
      const msg =
          d?._embedded?.errors?.[0]?.message ||
          (typeof d?.message === 'string' && d.message !== 'Bad Request' ? d.message : null) ||
          (typeof d === 'string' ? d : null) ||
          ex.message ||
          'Erro ao cadastrar';
      setErr(typeof msg === 'string' ? msg : 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900">Cadastro</h1>
          <p className="mt-1 text-sm text-slate-500">
            Escolha se deseja cadastrar como cliente ou agente.
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Tipo de usuário *</label>
                <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.tipoUsuario}
                    onChange={(e) => setForm((f) => ({ ...f, tipoUsuario: e.target.value }))}
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="AGENTE">Agente</option>
                </select>
              </div>
              {form.tipoUsuario === 'AGENTE' && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Tipo de agente *</label>
                    <select
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.tipoAgente}
                        onChange={(e) => setForm((f) => ({ ...f, tipoAgente: e.target.value }))}
                    >
                      <option value="EMPRESA">Empresa</option>
                      <option value="BANCO">Banco</option>
                    </select>
                  </div>
              )}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Nome completo *</label>
                <input
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.nome}
                    onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Endereço</label>
                <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.endereco}
                    onChange={(e) => setForm((f) => ({ ...f, endereco: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  {form.tipoUsuario === 'CLIENTE' ? 'Login (CPF) *' : 'Login *'}
                </label>
                <input
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.login}
                    onChange={(e) => setForm((f) => ({ ...f, login: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Senha *</label>
                <input
                    type="password"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form.senha}
                    onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
                />
              </div>

              {form.tipoUsuario === 'CLIENTE' ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-slate-700">RG</label>
                      <input
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          value={form.rg}
                          onChange={(e) => setForm((f) => ({ ...f, rg: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">CPF</label>
                      <input
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          value={form.cpf}
                          onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-slate-700">Profissão</label>
                      <input
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          value={form.profissao}
                          onChange={(e) => setForm((f) => ({ ...f, profissao: e.target.value }))}
                      />
                    </div>
                  </>
              ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Nome fantasia</label>
                      <input
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          value={form.nomeFantasia}
                          onChange={(e) => setForm((f) => ({ ...f, nomeFantasia: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        ID do agente (opcional)
                      </label>
                      <input
                          type="number"
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          value={form.idAgente}
                          onChange={(e) => setForm((f) => ({ ...f, idAgente: e.target.value }))}
                      />
                    </div>
                    {form.tipoAgente === 'BANCO' && (
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium text-slate-700">CNPJ do banco</label>
                          <input
                              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                              value={form.cnpj}
                              onChange={(e) => setForm((f) => ({ ...f, cnpj: e.target.value }))}
                          />
                        </div>
                    )}
                  </>
              )}
            </div>

            {form.tipoUsuario === 'CLIENTE' && (
                <div className="border-t border-slate-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Rendimentos (máx. 3)</h2>
                    <button
                        type="button"
                        onClick={addRend}
                        disabled={rendimentos.length >= 3}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-40"
                    >
                      + Adicionar
                    </button>
                  </div>
                  {rendimentos.map((r, i) => (
                      <div key={i} className="mt-4 rounded-lg border border-slate-200 p-4">
                        <div className="flex justify-end">
                          {rendimentos.length > 1 && (
                              <button
                                  type="button"
                                  className="text-xs text-red-600"
                                  onClick={() => removeRend(i)}
                              >
                                Remover
                              </button>
                          )}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div>
                            <label className="text-xs font-medium text-slate-600">Empregador</label>
                            <input
                                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                                value={r.empregadorNome}
                                onChange={(e) => updateRend(i, 'empregadorNome', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600">Valor</label>
                            <input
                                type="number"
                                step="0.01"
                                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                                value={r.valor}
                                onChange={(e) => updateRend(i, 'valor', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-slate-600">Descrição</label>
                            <input
                                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                                value={r.descricao}
                                onChange={(e) => updateRend(i, 'descricao', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
            )}

            {err && <p className="text-sm text-red-600">{err}</p>}
            <div className="flex gap-3">
              <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? 'Salvando…' : 'Cadastrar'}
              </button>
              <Link
                  to="/login"
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Voltar ao login
              </Link>
            </div>
          </form>
        </div>
      </div>
  );
}