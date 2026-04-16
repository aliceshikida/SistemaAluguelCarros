import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CreditosPage() {
  const { auth } = useAuth();
  const podeCriar = auth?.role === 'BANCO';

  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ contratoId: '', valor: '', quantidadeParcelas: '', observacao: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get('/api/contratos');
      setContratos(Array.isArray(data) ? data : []);
    } catch {
      setErr('Falha ao carregar contratos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const comCredito = contratos.filter((c) => c.credito);
  const semCredito = contratos.filter((c) => !c.credito);

  async function criar(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/api/contratos/${form.contratoId}/credito`, {
        valor: Number(form.valor),
        quantidadeParcelas: Number(form.quantidadeParcelas),
        observacao: form.observacao?.trim() || null,
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
            <h1 className="text-2xl font-bold text-slate-900">Crédito vinculado</h1>
            <p className="mt-1 text-slate-600">Crédito associado a contratos de aluguel (perfil banco).</p>
          </div>
          {podeCriar && (
              <button
                  type="button"
                  onClick={() => {
                    const c0 = semCredito[0];
                    setForm({
                      contratoId: c0?.id != null ? String(c0.id) : '',
                      valor: '',
                      quantidadeParcelas: '',
                      observacao: '',
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
                  <th className="px-4 py-3 text-left font-semibold">Contrato</th>
                  <th className="px-4 py-3 text-left font-semibold">Banco</th>
                  <th className="px-4 py-3 text-left font-semibold">Valor</th>
                  <th className="px-4 py-3 text-left font-semibold">Parcelas</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {comCredito.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                        Nenhum crédito registrado ainda.
                      </td>
                    </tr>
                ) : (
                    comCredito.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono">#{c.id}</td>
                          <td className="px-4 py-3">{c.credito?.bancoNome ?? '—'}</td>
                          <td className="px-4 py-3">{c.credito?.valor != null ? String(c.credito.valor) : '—'}</td>
                          <td className="px-4 py-3">{c.credito?.quantidadeParcelas ?? '—'}</td>
                        </tr>
                    ))
                )}
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
                    <label className="text-sm font-medium">Contrato (sem crédito)</label>
                    <select
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.contratoId}
                        onChange={(e) => setForm((f) => ({ ...f, contratoId: e.target.value }))}
                    >
                      {semCredito.length === 0 ? (
                          <option value="">Nenhum contrato elegível</option>
                      ) : (
                          semCredito.map((c) => (
                              <option key={c.id} value={String(c.id)}>
                                Contrato #{c.id} — pedido {c.pedidoId}
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
                        min="0"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.valor}
                        onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quantidade de parcelas</label>
                    <input
                        type="number"
                        min="1"
                        max="120"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={form.quantidadeParcelas}
                        onChange={(e) => setForm((f) => ({ ...f, quantidadeParcelas: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Observação (opcional)</label>
                    <input
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
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
                      disabled={saving || semCredito.length === 0}
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
