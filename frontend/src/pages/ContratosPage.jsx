import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
}

export default function ContratosPage() {
  const { auth } = useAuth();
  const podeCriar = auth?.role === 'AGENTE' && auth?.tipoAgente === 'EMPRESA';

  const [contratos, setContratos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [detalhe, setDetalhe] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    pedidoId: '',
    automovelId: '',
    tipo: 'ALUGUEL',
    dataInicio: '',
    dataFim: '',
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const [cRes, pRes, aRes] = await Promise.all([
        api.get('/api/contratos'),
        api.get('/api/pedidos'),
        api.get('/api/automoveis'),
      ]);
      setContratos(cRes.data);
      setPedidos(pRes.data);
      setAutos(aRes.data);
    } catch {
      setErr('Falha ao carregar contratos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pedidosAprovadosSemContrato = pedidos.filter(
      (p) => p.status === 'APROVADO' && !p.contratoId
  );

  async function criar(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/contratos', {
        pedidoId: Number(form.pedidoId),
        automovelId: Number(form.automovelId),
        tipo: form.tipo,
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
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
                    setForm({
                      pedidoId: pedidosAprovadosSemContrato[0]?.idPedido ?? '',
                      automovelId: autos[0]?.id ?? '',
                      tipo: 'ALUGUEL',
                      dataInicio: '',
                      dataFim: '',
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
                  <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold">Início</th>
                  <th className="px-4 py-3 text-left font-semibold">Fim</th>
                  <th className="px-4 py-3 text-left font-semibold">Pedido</th>
                  <th className="px-4 py-3 text-left font-semibold">Veículo</th>
                  <th className="px-4 py-3 text-right font-semibold">Detalhes</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {contratos.map((c) => (
                    <tr key={c.idContrato} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono">{c.idContrato}</td>
                      <td className="px-4 py-3">{c.tipo}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(c.dataInicio)}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(c.dataFim)}</td>
                      <td className="px-4 py-3">{c.pedidoId ?? '—'}</td>
                      <td className="px-4 py-3">
                        {c.automovel ? `${c.automovel.marca} ${c.automovel.modelo}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                            type="button"
                            className="text-indigo-600 hover:underline"
                            onClick={async () => {
                              try {
                                const { data } = await api.get(`/api/contratos/${c.idContrato}`);
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
                <h2 className="text-lg font-semibold">Contrato #{detalhe.idContrato}</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div>
                    <dt className="text-slate-500">Tipo</dt>
                    <dd className="font-medium">{detalhe.tipo}</dd>
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
                  <div>
                    <dt className="text-slate-500">Veículo</dt>
                    <dd>
                      {detalhe.automovel
                          ? `${detalhe.automovel.marca} ${detalhe.automovel.modelo} · ${detalhe.automovel.placa}`
                          : '—'}
                    </dd>
                  </div>
                  {detalhe.contratoCredito && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="font-semibold text-slate-800">Crédito associado</div>
                        <p className="mt-1 text-slate-600">
                          Valor: {detalhe.contratoCredito.valor} · Taxa: {detalhe.contratoCredito.taxajuros}% · Prazo:{' '}
                          {detalhe.contratoCredito.prazo} meses · Status: {detalhe.contratoCredito.status}
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
                <p className="mt-1 text-xs text-slate-500">Somente para pedidos aprovados sem contrato.</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Pedido</label>
                    <select
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.pedidoId}
                        onChange={(e) => setForm((f) => ({ ...f, pedidoId: e.target.value }))}
                    >
                      {pedidosAprovadosSemContrato.length === 0 ? (
                          <option value="">Nenhum pedido elegível</option>
                      ) : (
                          pedidosAprovadosSemContrato.map((p) => (
                              <option key={p.idPedido} value={p.idPedido}>
                                #{p.idPedido} — cliente {p.cliente?.nome ?? p.cliente?.id}
                              </option>
                          ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Automóvel</label>
                    <select
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.automovelId}
                        onChange={(e) => setForm((f) => ({ ...f, automovelId: e.target.value }))}
                    >
                      {autos.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.marca} {a.modelo}
                          </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <input
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.tipo}
                        onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
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
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button type="button" className="rounded-lg border px-4 py-2" onClick={() => setModal(false)}>
                    Fechar
                  </button>
                  <button
                      type="submit"
                      disabled={saving || pedidosAprovadosSemContrato.length === 0}
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