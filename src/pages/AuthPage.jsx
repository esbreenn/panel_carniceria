// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
// Importa tu imagen de logo. Asegúrate de que la ruta y el nombre sean correctos.
import logoCarniceriaBests from '../assets/logo_carniceria_bests.jpg'; //

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      let errorMessage = 'Ocurrió un error al iniciar sesión.';
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Formato de correo electrónico inválido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'El usuario ha sido deshabilitado.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'El usuario no existe. Verifique el correo electrónico.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta.';
          break;
        default:
          errorMessage = err.message || 'Ocurrió un error inesperado al iniciar sesión.';
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* ¡NUEVO! Aquí se añade el logo */}
        <div className="flex justify-center mb-6"> {/* Contenedor para centrar el logo */}
          <img
            src={logoCarniceriaBests}
            alt="Logo Carnicería Best's"
            className="h-24 w-24 object-contain rounded-full border-2 border-gray-200" // Ajusta h- y w- para el tamaño, rounded-full si quieres que sea circular
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          Iniciar Sesión
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}