// src/components/HeaderWithAuth.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HeaderWithAuth() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Determinar si el botón de cerrar sesión debe ser visible
  const showLogoutButton = user &&
                           location.pathname !== '/auth' &&
                           location.pathname !== '/add-transaction' &&
                           location.pathname !== '/calendar'; // ¡MODIFICADO! Añade esta condición

  return (
    <>
      {/* Botón de Logout condicional */}
      {showLogoutButton && (
        <button
          onClick={logout}
          className="absolute top-4 right-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-10"
        >
          Cerrar Sesión
        </button>
      )}
      {/* Aquí podrías añadir otros elementos de una cabecera global si los necesitas en el futuro */}
    </>
  );
}