import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
}

export default function PedidosPage() {
  const { auth } = useAuth();
  const isCliente = auth?.role === 'CLIENTE';
  const isAgente = auth?.role === 'AGENTE';

  const [pedidos, setPedidos] = useState([]);
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ automovelId: '', observacao: '', analiseFinanceira: '' });
  const [decForm, setDecForm] = useState({ status: 'APROVADO', analiseFinanceira: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const [{ data: plist }, { data: alist }] = await Promise.all([
        api.get('/api/pedidos'),
        api.get('/api/automoveis'),
      ]);
      setPedidos(plist);
      setAutos(alist);
    } catch {
      setErr('Falha ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function criarPedido(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/pedidos', {
        automovelId: form.automovelId ? Number(form.automovelId) : null,
        observacao: form.observacao || null,
      });
      setModal(null);
      setForm({ automovelId: '', observacao: '', analiseFinanceira: '' });
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
        automovelId: form.automovelId ? Number(form.automovelId) : null,
        observacao: form.observacao || null,
      };
      if (isAgente) body.analiseFinanceira = form.analiseFinanceira || null;
      await api.put(`/api/pedidos/${modal.pedido.idPedido}`, body);
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
      await api.delete(`/api/pedidos/${p.idPedido}`);
      await load();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Não foi possível cancelar');
    }
  }

  async function decisao(p) {
    setSaving(true);
    try {
      await api.post(`/api/pedidos/${p.idPedido}/decisao`, {
        status: decForm.status,
        analiseFinanceira: decForm.analiseFinanceira || null,
      });
      setModal(null);
      await load();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Erro na decisão');
    } finally {
      setSaving(false);
    }
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
                    setForm({ automovelId: '', observacao: '' });
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
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Data</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Veículo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Observação</th>
                  {!isCliente && (
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Análise</th>
                  )}
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Ações</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {pedidos.map((p) => (
                    <tr key={p.idPedido} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-slate-800">{p.idPedido}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(p.dataSolicitacao)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {p.automovel
                            ? `${p.automovel.marca} ${p.automovel.modelo} (${p.automovel.placa || '—'})`
                            : '—'}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-slate-600">{p.observacao || '—'}</td>
                      {!isCliente && (
                          <td className="max-w-xs truncate px-4 py-3 text-slate-600">
                            {p.analiseFinanceira || '—'}
                          </td>
                      )}
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          {isCliente && p.status === 'PENDENTE' && (
                              <>
                                <button
                                    type="button"
                                    className="text-indigo-600 hover:underline"
                                    onClick={() => {
                                      setForm({
                                        automovelId: p.automovel?.id ?? '',
                                        observacao: p.observacao || '',
                                        analiseFinanceira: p.analiseFinanceira || '',
                                      });
                                      setModal({ type: 'edit', pedido: p });
                                    }}
                                >
                                  Editar
                                </button>
                                <button
                                    type="button"
                                    className="text-red-600 hover:underline"
                                    onClick={() => cancelar(p)}
                                >
                                  Cancelar
                                </button>
                              </>
                          )}
                          {isAgente && p.status === 'PENDENTE' && (
                              <>
                                <button
                                    type="button"
                                    className="text-indigo-600 hover:underline"
                                    onClick={() => {
                                      setForm({
                                        automovelId: p.automovel?.id ?? '',
                                        observacao: p.observacao || '',
                                        analiseFinanceira: p.analiseFinanceira || '',
                                      });
                                      setModal({ type: 'edit', pedido: p });
                                    }}
                                >
                                  Editar
                                </button>
                                <button
                                    type="button"
                                    className="font-medium text-emerald-700 hover:underline"
                                    onClick={() => {
                                      setDecForm({
                                        status: 'APROVADO',
                                        analiseFinanceira: p.analiseFinanceira || '',
                                      });
                                      setModal({ type: 'decisao', pedido: p });
                                    }}
                                >
                                  Decidir
                                </button>
                              </>
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
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.automovelId}
                        onChange={(e) => setForm((f) => ({ ...f, automovelId: e.target.value }))}
                    >
                      <option value="">Selecione…</option>
                      {autos.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.marca} {a.modelo} — {a.placa}
                          </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Observação</label>
                    <textarea
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        rows={3}
                        value={form.observacao}
                        onChange={(e) => setForm((f) => ({ ...f, observacao: e.target.value }))}
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
                <h2 className="text-lg font-semibold">Editar pedido #{modal.pedido.idPedido}</h2>
                <form onSubmit={salvarEdicao} className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Automóvel</label>
                    <select
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.automovelId}
                        onChange={(e) => setForm((f) => ({ ...f, automovelId: e.target.value }))}
                    >
                      <option value="">—</option>
                      {autos.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.marca} {a.modelo}
                          </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Observação</label>
                    <textarea
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        rows={3}
                        value={form.observacao}
                        onChange={(e) => setForm((f) => ({ ...f, observacao: e.target.value }))}
                    />
                  </div>
                  {isAgente && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Análise financeira</label>
                        <textarea
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            rows={3}
                            value={form.analiseFinanceira}
                            onChange={(e) => setForm((f) => ({ ...f, analiseFinanceira: e.target.value }))}
                        />
                      </div>
                  )}
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
                <h2 className="text-lg font-semibold">Decisão — pedido #{modal.pedido.idPedido}</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Resultado</label>
                    <select
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={decForm.status}
                        onChange={(e) => setDecForm((f) => ({ ...f, status: e.target.value }))}
                    >
                      <option value="APROVADO">Aprovar</option>
                      <option value="REJEITADO">Rejeitar</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Análise financeira</label>
                    <textarea
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        rows={3}
                        value={decForm.analiseFinanceira}
                        onChange={(e) => setDecForm((f) => ({ ...f, analiseFinanceira: e.target.value }))}
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
                        disabled={saving}
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