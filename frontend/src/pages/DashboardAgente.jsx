import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';

const RESUMO_PEDIDOS = [
  ['Solicitado', 'SOLICITADO'],
  ['Em análise', 'EM_ANALISE_FINANCEIRA'],
  ['Aprovado', 'APROVADO'],
  ['Reprovado', 'REPROVADO'],
  ['Cancelado', 'CANCELADO'],
  ['Concluído', 'CONCLUIDO'],
];

export default function DashboardAgente() {
  const [pedidos, setPedidos] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([api.get('/api/pedidos'), api.get('/api/contratos')]);
        if (!cancel) {
          setPedidos(Array.isArray(pRes.data) ? pRes.data : []);
          setContratos(Array.isArray(cRes.data) ? cRes.data : []);
        }
      } catch {
        if (!cancel) {
          setPedidos([]);
          setContratos([]);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const counts = useMemo(() => {
    const c = Object.fromEntries(RESUMO_PEDIDOS.map(([, st]) => [st, 0]));
    pedidos.forEach((p) => {
      if (c[p.status] !== undefined) c[p.status] += 1;
    });
    return c;
  }, [pedidos]);

  return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">Pedidos e contratos do sistema.</p>
        {loading ? (
            <p className="mt-8 text-slate-500">Carregando…</p>
        ) : (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {RESUMO_PEDIDOS.map(([label, st]) => (
                    <div key={st} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">{label}</span>
                        <StatusBadge status={st} />
                      </div>
                      <p className="mt-3 text-3xl font-bold text-slate-900">{counts[st] ?? 0}</p>
                    </div>
                ))}
              </div>
              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Contratos registrados</h2>
                <p className="mt-1 text-2xl font-bold text-indigo-600">{contratos.length}</p>
              </div>
            </>
        )}
      </div>
  );
}
