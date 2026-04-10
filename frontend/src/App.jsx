import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import RegisterCliente from './pages/RegisterCliente';
import DashboardPage from './pages/DashboardPage';
import PedidosPage from './pages/PedidosPage';
import AutomovelPage from './pages/AutomovelPage';
import ContratosPage from './pages/ContratosPage';
import CreditosPage from './pages/CreditosPage';

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/' : '/login'} replace />;
}

export default function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterCliente />} />
            <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
            >
              <Route index element={<DashboardPage />} />
              <Route path="pedidos" element={<PedidosPage />} />
              <Route path="automoveis" element={<AutomovelPage />} />
              <Route path="contratos" element={<ContratosPage />} />
              <Route path="creditos" element={<CreditosPage />} />
            </Route>
            <Route path="*" element={<HomeRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}