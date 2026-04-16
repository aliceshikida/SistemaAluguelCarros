import { useCallback, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AutomovelPage() {
  const { auth } = useAuth();
  const podeEditar = auth?.role === 'EMPRESA' || auth?.role === 'BANCO';

  const [lista, setLista] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    matricula: '',
    ano: '',
    marca: '',
    modelo: '',
    placa: '',
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get('/api/automoveis');
      setLista(Array.isArray(data) ? data : []);
      if (podeEditar) {
        try {
          const { data: me } = await api.get('/api/me');
          setPerfil(me);
        } catch {
          setPerfil(null);
          setErr('Não foi possível obter perfil (empresa/banco) para cadastro.');
        }
      }
    } catch {
      setErr('Falha ao carregar automóveis.');
    } finally {
      setLoading(false);
    }
  }, [podeEditar]);

  useEffect(() => {
    load();
  }, [load]);

  function buildProprietarioBody() {
    if (auth?.role === 'EMPRESA') {
      return {
        tipoProprietario: 'EMPRESA',
        proprietarioEmpresaId: perfil?.empresaId ?? null,
        proprietarioBancoId: null,
        proprietarioClienteId: null,
      };
    }
    if (auth?.role === 'BANCO') {
      return {
        tipoProprietario: 'BANCO',
        proprietarioBancoId: perfil?.bancoId ?? null,
        proprietarioEmpresaId: null,
        proprietarioClienteId: null,
      };
    }
    return null;
  }

  async function salvar(e) {
    e.preventDefault();
    const prop = buildProprietarioBody();
    if (!prop?.tipoProprietario || (prop.tipoProprietario === 'EMPRESA' && !prop.proprietarioEmpresaId)) {
      setErr('Perfil empresa não disponível. Faça login novamente ou contate o suporte.');
      return;
    }
    if (prop.tipoProprietario === 'BANCO' && !prop.proprietarioBancoId) {
      setErr('Perfil banco não disponível. Faça login novamente ou contate o suporte.');
      return;
    }
    setSaving(true);
    try {
      const body = {
        matricula: form.matricula.trim(),
        ano: Number(form.ano),
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        placa: form.placa.trim(),
        ...prop,
      };
      if (modal?.automovel) {
        await api.put(`/api/automoveis/${modal.automovel.id}`, body);
      } else {
        await api.post('/api/automoveis', body);
      }
      setModal(null);
      await load();
    } catch (ex) {
      const d = ex.response?.data;
      const msg =
          d?._embedded?.errors?.[0]?.message ||
          (typeof d?.message === 'string' ? d.message : null) ||
          (typeof d === 'string' ? d : null) ||
          'Erro ao salvar';
      setErr(msg);
    } finally {
      setSaving(false);
    }
  }

  async function remover(a) {
    if (!window.confirm('Excluir este automóvel?')) return;
    try {
      await api.delete(`/api/automoveis/${a.id}`);
      await load();
    } catch {
      setErr('Não foi possível excluir.');
    }
  }

  function proprietarioLabel(a) {
    if (a.tipoProprietario === 'CLIENTE') return `Cliente #${a.proprietarioClienteId ?? '—'}`;
    if (a.tipoProprietario === 'EMPRESA') return `Empresa #${a.proprietarioEmpresaId ?? '—'}`;
    if (a.tipoProprietario === 'BANCO') return `Banco #${a.proprietarioBancoId ?? '—'}`;
    return a.tipoProprietario ?? '—';
  }

  return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Automóveis</h1>
            <p className="mt-1 text-slate-600">Frota disponível para pedidos de aluguel.</p>
            {!podeEditar && (
                <p className="mt-1 text-sm text-amber-700">
                  Cadastro e edição de veículos são feitos por usuários <strong>empresa</strong> ou{' '}
                  <strong>banco</strong>.
                </p>
            )}
          </div>
          {podeEditar && (
              <button
                  type="button"
                  onClick={() => {
                    setForm({ matricula: '', ano: '', marca: '', modelo: '', placa: '' });
                    setModal({ novo: true });
                  }}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
              >
                Cadastrar
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
                  <th className="px-4 py-3 text-left font-semibold">Matrícula</th>
                  <th className="px-4 py-3 text-left font-semibold">Ano</th>
                  <th className="px-4 py-3 text-left font-semibold">Marca / Modelo</th>
                  <th className="px-4 py-3 text-left font-semibold">Placa</th>
                  <th className="px-4 py-3 text-left font-semibold">Proprietário</th>
                  {podeEditar && <th className="px-4 py-3 text-right font-semibold">Ações</th>}
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {lista.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono">{a.matricula}</td>
                      <td className="px-4 py-3">{a.ano}</td>
                      <td className="px-4 py-3">
                        {a.marca} {a.modelo}
                      </td>
                      <td className="px-4 py-3">{a.placa}</td>
                      <td className="px-4 py-3 text-slate-600">{proprietarioLabel(a)}</td>
                      {podeEditar && (
                          <td className="px-4 py-3 text-right">
                            <button
                                type="button"
                                className="text-indigo-600 hover:underline"
                                onClick={() => {
                                  setForm({
                                    matricula: a.matricula,
                                    ano: String(a.ano),
                                    marca: a.marca,
                                    modelo: a.modelo,
                                    placa: a.placa,
                                  });
                                  setModal({ automovel: a });
                                }}
                            >
                              Editar
                            </button>
                            <button
                                type="button"
                                className="ml-3 text-red-600 hover:underline"
                                onClick={() => remover(a)}
                            >
                              Excluir
                            </button>
                          </td>
                      )}
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {modal && podeEditar && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <form onSubmit={salvar} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold">
                  {modal.automovel ? 'Editar automóvel' : 'Novo automóvel'}
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600">Matrícula</label>
                    <input
                        required
                        className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5"
                        value={form.matricula}
                        onChange={(e) => setForm((f) => ({ ...f, matricula: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Ano</label>
                    <input
                        type="number"
                        required
                        className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5"
                        value={form.ano}
                        onChange={(e) => setForm((f) => ({ ...f, ano: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Placa</label>
                    <input
                        required
                        className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5"
                        value={form.placa}
                        onChange={(e) => setForm((f) => ({ ...f, placa: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Marca</label>
                    <input
                        required
                        className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5"
                        value={form.marca}
                        onChange={(e) => setForm((f) => ({ ...f, marca: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Modelo</label>
                    <input
                        required
                        className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5"
                        value={form.modelo}
                        onChange={(e) => setForm((f) => ({ ...f, modelo: e.target.value }))}
                    />
                  </div>
                  <p className="sm:col-span-2 text-xs text-slate-500">
                    O proprietário será sua {auth?.role === 'BANCO' ? 'instituição bancária' : 'empresa'} conforme o
                    cadastro vinculado ao login.
                  </p>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button type="button" className="rounded-lg border px-4 py-2" onClick={() => setModal(null)}>
                    Fechar
                  </button>
                  <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
        )}
      </div>
  );
}
