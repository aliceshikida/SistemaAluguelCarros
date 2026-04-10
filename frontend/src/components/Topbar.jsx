import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { auth, logout } = useAuth();
  const papel =
      auth?.role === 'CLIENTE'
          ? 'Cliente'
          : auth?.tipoAgente === 'EMPRESA'
              ? 'Agente · Empresa'
              : auth?.tipoAgente === 'BANCO'
                  ? 'Agente · Banco'
                  : 'Agente';

  return (
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
        <div />
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-900">{auth?.nome}</div>
            <div className="text-xs text-slate-500">{papel}</div>
          </div>
          <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Sair
          </button>
        </div>
      </header>
  );
}