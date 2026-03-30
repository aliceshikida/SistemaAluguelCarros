import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';

export default function DashboardCliente() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/pedidos');
        if (!cancel) setPedidos(data);
      } catch {
        if (!cancel) setErr('Não foi possível carregar os pedidos.');
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
      <p className="mt-1 text-slate-600">Resumo dos seus pedidos de aluguel.</p>
      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
      {loading ? (
        <p className="mt-8 text-slate-500">Carregando…</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Pendente', counts.PENDENTE, 'PENDENTE'],
            ['Aprovado', counts.APROVADO, 'APROVADO'],
            ['Rejeitado', counts.REJEITADO, 'REJEITADO'],
            ['Cancelado', counts.CANCELADO, 'CANCELADO'],
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
      )}
    </div>
  );
}
