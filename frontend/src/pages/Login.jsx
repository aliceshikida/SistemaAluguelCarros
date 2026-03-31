import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [loginField, setLoginField] = useState('');
  const [senha, setSenha] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!loginField.trim() || !senha) {
      setErr('Preencha login e senha.');
      return;
    }
    setLoading(true);
    try {
      await login(loginField.trim(), senha);
      navigate(from, { replace: true });
    } catch (ex) {
      const d = ex.response?.data;
      // Micronaut coloca o detalhe em _embedded.errors; message no topo costuma ser só "Unauthorized"
      const msg =
        d?._embedded?.errors?.[0]?.message ||
        (typeof d?.message === 'string' && d.message !== 'Unauthorized' ? d.message : null) ||
        (ex.response?.status === 401 ? 'Login ou senha inválidos.' : null) ||
        (typeof d === 'string' ? d : null) ||
        ex.message ||
        'Falha no login';
      setErr(typeof msg === 'string' ? msg : 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold text-slate-900">Entrar</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sistema de aluguel de automóveis</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Login (CPF)</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={loginField}
              onChange={(e) => setLoginField(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Não tem conta?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Cadastre-se como cliente
          </Link>
        </p>
      </div>
    </div>
  );
}
