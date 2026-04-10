import { useAuth } from '../context/AuthContext';
import DashboardAgente from './DashboardAgente';
import DashboardCliente from './DashboardCliente';

export default function DashboardPage() {
  const { auth } = useAuth();
  if (auth?.role === 'CLIENTE') return <DashboardCliente />;
  return <DashboardAgente />;
}