import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
}

function asList(data) {
  return Array.isArray(data) ? data : [];
}

export default function ContratosPage() {
  const { auth } = useAuth();
  const podeCriar = auth?.role === 'EMPRESA';

  const [contratos, setContratos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [detalhe, setDetalhe] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    pedidoId: '',
    valorTotal: '',
    dataInicio: '',
    dataFim: '',
    observacao: '',
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    const [cRes, pRes] = await Promise.allSettled([api.get('/api/contratos'), api.get('/api/pedidos')]);
    const falhas = [];
    if (cRes.status === 'fulfilled') {
      setContratos(asList(cRes.value.data));
    } else {
      setContratos([]);
      falhas.push('contratos');
    }
    if (pRes.status === 'fulfilled') {
      setPedidos(asList(pRes.value.data));
    } else {
      setPedidos([]);
      falhas.push('pedidos');
    }
    if (falhas.length > 0) {
      setErr(`Não foi possível carregar: ${falhas.join(', ')}.`);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pedidoIdsComContrato = new Set(contratos.map((c) => c.pedidoId));
  const pedidosAprovadosSemContrato = pedidos.filter(
      (p) => p.status === 'APROVADO' && !pedidoIdsComContrato.has(p.id)
  );

  async function criar(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/contratos', {
        pedidoId: Number(form.pedidoId),
        valorTotal: Number(form.valorTotal),
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
        observacao: form.observacao?.trim() || null,
      });
      setModal(false);
      await load();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Erro ao criar contrato');
    } finally {
      setSaving(false);
    }
  }

  return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contratos</h1>
            <p className="mt-1 text-slate-600">Contratos de aluguel vinculados a pedidos aprovados.</p>
          </div>
          {podeCriar && (
              <button
                  type="button"
                  onClick={() => {
                    const firstP = pedidosAprovadosSemContrato[0];
                    setForm({
                      pedidoId: firstP?.id != null ? String(firstP.id) : '',
                      valorTotal: '',
                      dataInicio: '',
                      dataFim: '',
                      observacao: '',
                    });
                    setModal(true);
                  }}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
              >
                Novo contrato
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
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Empresa</th>
                  <th className="px-4 py-3 text-left font-semibold">Valor</th>
                  <th className="px-4 py-3 text-left font-semibold">Início</th>
                  <th className="px-4 py-3 text-left font-semibold">Fim</th>
                  <th className="px-4 py-3 text-left font-semibold">Pedido</th>
                  <th className="px-4 py-3 text-right font-semibold">Detalhes</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {contratos.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono">{c.id}</td>
                      <td className="px-4 py-3">{c.empresaNome ?? '—'}</td>
                      <td className="px-4 py-3">{c.valorTotal != null ? String(c.valorTotal) : '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(c.dataInicio)}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(c.dataFim)}</td>
                      <td className="px-4 py-3">{c.pedidoId ?? '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                            type="button"
                            className="text-indigo-600 hover:underline"
                            onClick={async () => {
                              try {
                                const { data } = await api.get(`/api/contratos/${c.id}`);
                                setDetalhe(data);
                              } catch {
                                setErr('Não foi possível carregar o contrato.');
                              }
                            }}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {detalhe && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold">Contrato #{detalhe.id}</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div>
                    <dt className="text-slate-500">Empresa</dt>
                    <dd className="font-medium">{detalhe.empresaNome ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Valor total</dt>
                    <dd className="font-medium">{detalhe.valorTotal != null ? String(detalhe.valorTotal) : '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Período</dt>
                    <dd>
                      {fmtDate(detalhe.dataInicio)} — {fmtDate(detalhe.dataFim)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Pedido</dt>
                    <dd>{detalhe.pedidoId}</dd>
                  </div>
                  {detalhe.observacao && (
                      <div>
                        <dt className="text-slate-500">Observação</dt>
                        <dd>{detalhe.observacao}</dd>
                      </div>
                  )}
                  {detalhe.credito && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="font-semibold text-slate-800">Crédito associado</div>
                        <p className="mt-1 text-slate-600">
                          Banco: {detalhe.credito.bancoNome ?? '—'} · Valor: {String(detalhe.credito.valor)} · Parcelas:{' '}
                          {detalhe.credito.quantidadeParcelas}
                        </p>
                      </div>
                  )}
                </dl>
                <button
                    type="button"
                    className="mt-6 rounded-lg border px-4 py-2"
                    onClick={() => setDetalhe(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
        )}

        {modal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <form onSubmit={criar} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold">Registrar contrato</h2>
                <p className="mt-1 text-xs text-slate-500">Somente para pedidos aprovados sem contrato (perfil empresa).</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Pedido</label>
                    <select
                        required={pedidosAprovadosSemContrato.length > 0}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.pedidoId}
                        onChange={(e) => setForm((f) => ({ ...f, pedidoId: e.target.value }))}
                    >
                      {pedidosAprovadosSemContrato.length === 0 ? (
                          <option value="">Nenhum pedido elegível</option>
                      ) : (
                          pedidosAprovadosSemContrato.map((p) => (
                              <option key={p.id} value={String(p.id)}>
                                #{p.id} — {p.clienteNome ?? 'cliente'}
                              </option>
                          ))
                      )}
                    </select>
                    {pedidosAprovadosSemContrato.length === 0 && (
                        <p className="mt-1 text-xs text-amber-700">
                          É preciso haver pedido com status <strong>APROVADO</strong> e ainda sem contrato.
                        </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Valor total</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.valorTotal}
                        onChange={(e) => setForm((f) => ({ ...f, valorTotal: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium">Início</label>
                      <input
                          type="date"
                          required
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                          value={form.dataInicio}
                          onChange={(e) => setForm((f) => ({ ...f, dataInicio: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Fim</label>
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
                    <label className="text-sm font-medium">Observação (opcional)</label>
                    <textarea
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        rows={2}
                        value={form.observacao}
                        onChange={(e) => setForm((f) => ({ ...f, observacao: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button type="button" className="rounded-lg border px-4 py-2" onClick={() => setModal(false)}>
                    Fechar
                  </button>
                  <button
                      type="submit"
                      disabled={saving || pedidosAprovadosSemContrato.length === 0 || !form.pedidoId}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
        )}
      </div>
  );
}
