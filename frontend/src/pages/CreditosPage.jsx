import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function CreditosPage() {
  const { auth } = useAuth();
  const podeCriar = auth?.role === 'AGENTE' && auth?.tipoAgente === 'BANCO';

  const [lista, setLista] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ contratoId: '', valor: '', taxaJuros: '', prazo: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cr, ct] = await Promise.all([api.get('/api/creditos'), api.get('/api/contratos')]);
      setLista(cr.data);
      setContratos(ct.data.filter((c) => !c.contratoCredito));
    } catch {
      setErr('Falha ao carregar créditos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function criar(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/creditos', {
        contratoId: Number(form.contratoId),
        valor: Number(form.valor),
        taxaJuros: Number(form.taxaJuros),
        prazo: Number(form.prazo),
      });
      setModal(false);
      await load();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Erro ao registrar crédito');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contratos de crédito</h1>
          <p className="mt-1 text-slate-600">Associados a contratos de aluguel (agente banco).</p>
        </div>
        {podeCriar && (
          <button
            type="button"
            onClick={() => {
              setForm({
                contratoId: contratos[0]?.idContrato ?? '',
                valor: '',
                taxaJuros: '',
                prazo: '',
              });
              setModal(true);
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
          >
            Novo crédito
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
                <th className="px-4 py-3 text-left font-semibold">Contrato</th>
                <th className="px-4 py-3 text-left font-semibold">Valor</th>
                <th className="px-4 py-3 text-left font-semibold">Taxa juros</th>
                <th className="px-4 py-3 text-left font-semibold">Prazo (meses)</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lista.map((c) => (
                <tr key={c.idCredito} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono">{c.idCredito}</td>
                  <td className="px-4 py-3">{c.contratoId}</td>
                  <td className="px-4 py-3">{c.valor}</td>
                  <td className="px-4 py-3">{c.taxajuros}%</td>
                  <td className="px-4 py-3">{c.prazo}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && podeCriar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={criar} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Registrar crédito</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium">Contrato (sem crédito ainda)</label>
                <select
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.contratoId}
                  onChange={(e) => setForm((f) => ({ ...f, contratoId: e.target.value }))}
                >
                  {contratos.length === 0 ? (
                    <option value="">Nenhum contrato elegível</option>
                  ) : (
                    contratos.map((c) => (
                      <option key={c.idContrato} value={c.idContrato}>
                        Contrato #{c.idContrato} — pedido {c.pedidoId}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.valor}
                  onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Taxa de juros (% a.m.)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.taxaJuros}
                  onChange={(e) => setForm((f) => ({ ...f, taxaJuros: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Prazo (meses)</label>
                <input
                  type="number"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.prazo}
                  onChange={(e) => setForm((f) => ({ ...f, prazo: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="rounded-lg border px-4 py-2" onClick={() => setModal(false)}>
                Fechar
              </button>
              <button
                type="submit"
                disabled={saving || contratos.length === 0}
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
