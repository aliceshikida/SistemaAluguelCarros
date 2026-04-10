import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';

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
          setPedidos(pRes.data);
          setContratos(cRes.data);
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
    const c = { PENDENTE: 0, APROVADO: 0, REJEITADO: 0, CANCELADO: 0 };
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
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Pendentes', counts.PENDENTE, 'PENDENTE'],
                  ['Aprovados', counts.APROVADO, 'APROVADO'],
                  ['Rejeitados', counts.REJEITADO, 'REJEITADO'],
                  ['Cancelados', counts.CANCELADO, 'CANCELADO'],
                ].map(([label, n, st]) => (
                    <div key={st} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">{label}</span>
                        <StatusBadge status={st} />
                      </div>
                      <p className="mt-3 text-3xl font-bold text-slate-900">{n}</p>
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