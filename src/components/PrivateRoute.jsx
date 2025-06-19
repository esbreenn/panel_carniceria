// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importa tu hook de autenticación

export default function PrivateRoute() {
  const { user, loading } = useAuth(); // Obtiene el usuario y el estado de carga

  if (loading) {
    // Puedes mostrar un spinner o un mensaje de carga aquí
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Cargando...</p>
      </div>
    );
  }

  // Si el usuario está autenticado, renderiza las rutas hijas
  // Si no, redirige a la página de login
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
}