const STYLES = {
  // Pedidos (API)
  SOLICITADO: 'bg-amber-100 text-amber-900 border-amber-300',
  EM_ANALISE_FINANCEIRA: 'bg-sky-100 text-sky-900 border-sky-300',
  APROVADO: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  REPROVADO: 'bg-red-100 text-red-900 border-red-300',
  CANCELADO: 'bg-slate-200 text-slate-700 border-slate-400',
  CONCLUIDO: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  // Legado / telas antigas
  PENDENTE: 'bg-amber-100 text-amber-900 border-amber-300',
  REJEITADO: 'bg-red-100 text-red-900 border-red-300',
  ATIVO: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  PENDENTE_CRED: 'bg-amber-100 text-amber-900 border-amber-300',
};

export default function StatusBadge({ status }) {
  const key = status || '';
  const cls = STYLES[key] || 'bg-slate-100 text-slate-800 border-slate-300';
  return (
      <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${cls}`}>
    {key || '—'}
  </span>
  );
}
