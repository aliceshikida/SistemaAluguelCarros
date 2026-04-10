import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-800 ${
        isActive ? 'bg-slate-800 text-white' : 'text-slate-300'
    }`;

export default function Sidebar() {
    const { auth } = useAuth();
    const isCliente = auth?.role === 'CLIENTE';
    const isAgente = auth?.role === 'AGENTE';
    const banco = isAgente && auth?.tipoAgente === 'BANCO';

    return (
        <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-100">
            <div className="border-b border-slate-800 px-4 py-5">
                <div className="text-lg font-semibold tracking-tight text-white">AluguelCarros</div>
                <p className="mt-1 text-xs text-slate-400">Gestão de pedidos e contratos</p>
            </div>
            <nav className="flex-1 space-y-1 p-3">
                {isCliente && (
                    <>
                        <NavLink to="/" end className={linkClass}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/pedidos" className={linkClass}>
                            Pedidos
                        </NavLink>
                        <NavLink to="/automoveis" className={linkClass}>
                            Automóveis
                        </NavLink>
                        <NavLink to="/contratos" className={linkClass}>
                            Contratos
                        </NavLink>
                    </>
                )}
                {isAgente && (
                    <>
                        <NavLink to="/" end className={linkClass}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/pedidos" className={linkClass}>
                            Pedidos
                        </NavLink>
                        <NavLink to="/automoveis" className={linkClass}>
                            Automóveis
                        </NavLink>
                        <NavLink to="/contratos" className={linkClass}>
                            Contratos
                        </NavLink>
                        {banco && (
                            <NavLink to="/creditos" className={linkClass}>
                                Créditos
                            </NavLink>
                        )}
                    </>
                )}
            </nav>
        </aside>
    );
}