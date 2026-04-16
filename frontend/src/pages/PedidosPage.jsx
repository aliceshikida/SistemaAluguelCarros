import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('pt-BR');
}

function asList(data) {
  return Array.isArray(data) ? data : [];
}

export default function PedidosPage() {
  const { auth } = useAuth();
  const isCliente = auth?.role === 'CLIENTE';
  const isAgente = auth?.role === 'EMPRESA' || auth?.role === 'BANCO';

  const [pedidos, setPedidos] = useState([]);
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    automovelId: '',
    dataInicio: '',
    dataFim: '',
    valorEstimado: '',
    observacaoCliente: '',
  });
  const [decForm, setDecForm] = useState({ aprovado: true, parecerFinanceiro: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    const [pedRes, autoRes] = await Promise.allSettled([
      api.get('/api/pedidos'),
      api.get('/api/automoveis'),
    ]);
    const falhas = [];
    if (pedRes.status === 'fulfilled') {
      setPedidos(asList(pedRes.value.data));
    } else {
      setPedidos([]);
      falhas.push('pedidos');
    }
    if (autoRes.status === 'fulfilled') {
      setAutos(asList(autoRes.value.data));
    } else {
      setAutos([]);
      falhas.push('automóveis');
    }
    if (falhas.length > 0) {
      setErr(`Não foi possível carregar: ${falhas.join(' e ')}.`);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function criarPedido(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        automovelId: Number(form.automovelId),
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
        observacaoCliente: form.observacaoCliente?.trim() || null,
      };
      if (form.valorEstimado !== '' && !Number.isNaN(Number(form.valorEstimado))) {
        body.valorEstimado = Number(form.valorEstimado);
      }
      await api.post('/api/pedidos', body);
      setModal(null);
      setForm({
        automovelId: '',
        dataInicio: '',
        dataFim: '',
        valorEstimado: '',
        observacaoCliente: '',
      });
      await load();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Erro ao criar pedido');
    } finally {
      setSaving(false);
    }
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    if (!modal?.pedido) return;
    setSaving(true);
    try {
      const body = {
        automovelId: Number(form.automovelId),
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
        observacaoCliente: form.observacaoCliente?.trim() || null,
      };
      if (form.valorEstimado !== '' && !Number.isNaN(Number(form.valorEstimado))) {
        body.valorEstimado = Number(form.valorEstimado);
      }
      await api.put(`/api/pedidos/${modal.pedido.id}`, body);
      setModal(null);
      await load();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Erro ao atualizar');
    } finally {
      setSaving(false);
    }
  }

  async function cancelar(p) {
    if (!window.confirm('Cancelar este pedido?')) return;
    try {
      await api.post(`/api/pedidos/${p.id}/cancelar`);
      await load();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Não foi possível cancelar');
    }
  }

  async function iniciarAnalise(p) {
    setSaving(true);
    try {
      await api.post(`/api/pedidos/${p.id}/iniciar-analise`);
      await load();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Erro ao iniciar análise');
    } finally {
      setSaving(false);
    }
  }

  async function decisao(p) {
    setSaving(true);
    try {
      await api.post(`/api/pedidos/${p.id}/decisao`, {
        aprovado: decForm.aprovado,
        parecerFinanceiro: decForm.parecerFinanceiro.trim(),
      });
      setModal(null);
      await load();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Erro na decisão');
    } finally {
      setSaving(false);
    }
  }

  function veiculoLabel(p) {
    if (p.automovelMarca || p.automovelModelo) {
      return `${p.automovelMarca || ''} ${p.automovelModelo || ''} (${p.automovelPlaca || '—'})`.trim();
    }
    return '—';
  }

  return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
            <p className="mt-1 text-slate-600">
              {isCliente ? 'Gerencie seus pedidos de aluguel.' : 'Analise e decida sobre os pedidos.'}
            </p>
          </div>
          {isCliente && (
              <button
                  type="button"
                  onClick={() => {
                    setForm({
                      automovelId: '',
                      dataInicio: '',
                      dataFim: '',
                      valorEstimado: '',
                      observacaoCliente: '',
                    });
                    setModal({ type: 'create' });
                  }}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
              >
                Novo pedido
              </button>
          )}
        </div>
        {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

        {loading ? (
            <p className="mt-8">Carregando…</p>
        ) : (
            <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Período</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Veículo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Observação</th>
                  {!isCliente && (
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Parecer</th>
                  )}
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Ações</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {pedidos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-slate-800">{p.id}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {fmtDate(p.dataInicio)} — {fmtDate(p.dataFim)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-700">{veiculoLabel(p)}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-slate-600">{p.observacaoCliente || '—'}</td>
                      {!isCliente && (
                          <td className="max-w-xs truncate px-4 py-3 text-slate-600">
                            {p.parecerFinanceiro || '—'}
                          </td>
                      )}
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          {isCliente && p.status === 'SOLICITADO' && (
                              <button
                                  type="button"
                                  className="text-indigo-600 hover:underline"
                                  onClick={() => {
                                    setForm({
                                      automovelId: String(p.automovelId ?? ''),
                                      dataInicio: p.dataInicio ?? '',
                                      dataFim: p.dataFim ?? '',
                                      valorEstimado:
                                          p.valorEstimado != null ? String(p.valorEstimado) : '',
                                      observacaoCliente: p.observacaoCliente || '',
                                    });
                                    setModal({ type: 'edit', pedido: p });
                                  }}
                              >
                                Editar
                              </button>
                          )}
                          {isCliente &&
                              (p.status === 'SOLICITADO' || p.status === 'EM_ANALISE_FINANCEIRA') && (
                                <button
                                    type="button"
                                    className="text-red-600 hover:underline"
                                    onClick={() => cancelar(p)}
                                >
                                  Cancelar
                                </button>
                              )}
                          {isAgente && p.status === 'SOLICITADO' && (
                              <>
                                <button
                                    type="button"
                                    className="text-slate-700 hover:underline"
                                    onClick={() => iniciarAnalise(p)}
                                >
                                  Iniciar análise
                                </button>
                                <button
                                    type="button"
                                    className="font-medium text-emerald-700 hover:underline"
                                    onClick={() => {
                                      setDecForm({
                                        aprovado: true,
                                        parecerFinanceiro: p.parecerFinanceiro || '',
                                      });
                                      setModal({ type: 'decisao', pedido: p });
                                    }}
                                >
                                  Decidir
                                </button>
                              </>
                          )}
                          {isAgente && p.status === 'EM_ANALISE_FINANCEIRA' && (
                              <button
                                  type="button"
                                  className="font-medium text-emerald-700 hover:underline"
                                  onClick={() => {
                                    setDecForm({
                                      aprovado: true,
                                      parecerFinanceiro: p.parecerFinanceiro || '',
                                    });
                                    setModal({ type: 'decisao', pedido: p });
                                  }}
                              >
                                Decidir
                              </button>
                          )}
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {modal?.type === 'create' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold">Novo pedido</h2>
                <form onSubmit={criarPedido} className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Automóvel</label>
                    <select
                        required={autos.length > 0}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.automovelId}
                        onChange={(e) => setForm((f) => ({ ...f, automovelId: e.target.value }))}
                    >
                      <option value="">{autos.length === 0 ? 'Nenhum veículo cadastrado' : 'Selecione…'}</option>
                      {autos.map((a) => (
                          <option key={a.id} value={String(a.id)}>
                            {a.marca} {a.modelo} — {a.placa}
                          </option>
                      ))}
                    </select>
                    {autos.length === 0 && (
                        <p className="mt-1 text-xs text-amber-700">
                          Cadastre ao menos um automóvel em <strong>Automóveis</strong> antes de abrir um pedido.
                        </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Início</label>
                      <input
                          type="date"
                          required
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          value={form.dataInicio}
                          onChange={(e) => setForm((f) => ({ ...f, dataInicio: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Fim</label>
                      <input
                          type="date"
                          required
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          value={form.dataFim}
                          onChange={(e) => setForm((f) => ({ ...f, dataFim: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Valor estimado (opcional)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.valorEstimado}
                        onChange={(e) => setForm((f) => ({ ...f, valorEstimado: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Observação</label>
                    <textarea
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        rows={3}
                        value={form.observacaoCliente}
                        onChange={(e) => setForm((f) => ({ ...f, observacaoCliente: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-lg border px-4 py-2"
                        onClick={() => setModal(null)}
                    >
                      Fechar
                    </button>
                    <button
                        type="submit"
                        disabled={saving || autos.length === 0}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
                    >
                      Criar
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {modal?.type === 'edit' && modal.pedido && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold">Editar pedido #{modal.pedido.id}</h2>
                <form onSubmit={salvarEdicao} className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Automóvel</label>
                    <select
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.automovelId}
                        onChange={(e) => setForm((f) => ({ ...f, automovelId: e.target.value }))}
                    >
                      {autos.map((a) => (
                          <option key={a.id} value={String(a.id)}>
                            {a.marca} {a.modelo}
                          </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Início</label>
                      <input
                          type="date"
                          required
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          value={form.dataInicio}
                          onChange={(e) => setForm((f) => ({ ...f, dataInicio: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Fim</label>
                      <input
                          type="date"
                          required
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          value={form.dataFim}
                          onChange={(e) => setForm((f) => ({ ...f, dataFim: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Valor estimado (opcional)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.valorEstimado}
                        onChange={(e) => setForm((f) => ({ ...f, valorEstimado: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Observação</label>
                    <textarea
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        rows={3}
                        value={form.observacaoCliente}
                        onChange={(e) => setForm((f) => ({ ...f, observacaoCliente: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-lg border px-4 py-2"
                        onClick={() => setModal(null)}
                    >
                      Fechar
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {modal?.type === 'decisao' && modal.pedido && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold">Decisão — pedido #{modal.pedido.id}</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Resultado</label>
                    <select
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={decForm.aprovado ? 'sim' : 'nao'}
                        onChange={(e) =>
                          setDecForm((f) => ({ ...f, aprovado: e.target.value === 'sim' }))
                        }
                    >
                      <option value="sim">Aprovar (financeiro)</option>
                      <option value="nao">Reprovar</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Parecer financeiro *</label>
                    <textarea
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        rows={3}
                        value={decForm.parecerFinanceiro}
                        onChange={(e) => setDecForm((f) => ({ ...f, parecerFinanceiro: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-lg border px-4 py-2"
                        onClick={() => setModal(null)}
                    >
                      Fechar
                    </button>
                    <button
                        type="button"
                        disabled={saving || !decForm.parecerFinanceiro.trim()}
                        onClick={() => decisao(modal.pedido)}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
