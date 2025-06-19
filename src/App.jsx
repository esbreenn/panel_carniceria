// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./hooks/useAuth"; // Ahora se usará 'loading' también

export default function App() {
  const { user, logout, loading } = useAuth(); // <--- ¡IMPORTANTE! Ahora obtenemos 'loading'

  // Si aún estamos cargando (Firebase está verificando el estado de autenticación),
  // mostramos un mensaje de carga para evitar destellos de contenido incorrecto.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-gray-700">Cargando aplicación...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/*
        Botón de Logout condicional:
        Solo se muestra si hay un usuario logueado (user) Y
        la URL actual NO es la página de autenticación (/auth).
        Esto evita que aparezca en el formulario de login.
      */}
      {user && window.location.pathname !== '/auth' && (
        <button
          onClick={logout}
          className="absolute top-4 right-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-10"
        >
          Cerrar Sesión
        </button>
      )}

      <Routes>
        {/*
          Ruta para la página de autenticación (/auth).
          Si el usuario ya está logueado (user es true), lo redirigimos directamente a /dashboard.
          De lo contrario, mostramos la AuthPage.
        */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
        />

        {/*
          Ruta raíz (/).
          Si el usuario está logueado, lo redirigimos a /dashboard.
          Si no está logueado, lo redirigimos a /auth para que inicie sesión.
        */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />}
        />

        {/*
          Rutas protegidas.
          Cualquier ruta dentro de este <Route element={<PrivateRoute />}>
          solo será accesible si PrivateRoute permite el acceso (es decir, si hay un usuario logueado).
        */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Puedes añadir más rutas protegidas aquí si las necesitas */}
        </Route>

        {/*
          Ruta de fallback para cualquier otra URL no definida.
          Redirige al dashboard si está logueado, o al login si no lo está.
        */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}