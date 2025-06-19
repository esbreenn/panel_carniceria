// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// ¡ELIMINADO! Ya NO necesitamos importar useLocation aquí.
// import { useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import AddTransactionPage from "./pages/AddTransactionPage";
import CalendarPage from "./pages/CalendarPage";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./hooks/useAuth";
import HeaderWithAuth from "./components/HeaderWithAuth"; // ¡IMPORTANTE! Importa tu nuevo componente


export default function App() {
  const { user, loading } = useAuth();
  // ¡ELIMINADO! La llamada a useLocation() YA NO VA AQUÍ.
  // const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-gray-700">Cargando aplicación...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* ¡ESTE ES EL CAMBIO CLAVE!
          Renderiza el componente HeaderWithAuth AQUÍ, dentro de BrowserRouter.
          HeaderWithAuth ahora es el que usa useLocation() de forma correcta. */}
      <HeaderWithAuth />

      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />

        {/* Rutas protegidas por PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-transaction" element={<AddTransactionPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}