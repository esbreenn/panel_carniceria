// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import AddTransactionPage from "./pages/AddTransactionPage";
import CalendarPage from "./pages/CalendarPage";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./hooks/useAuth";
import HeaderWithAuth from "./components/HeaderWithAuth";

// ¡REVERTIDO! Las importaciones para la configuración inicial de DB se quitan de aquí
// import { ref, set, get } from "firebase/database";
// import { db } from "./services/firebase";


export default function App() {
  const { user, loading } = useAuth();

  // ¡REVERTIDO! El useEffect para crear user_carniceria_map se quita
  // useEffect(() => { /* ... */ }, [user]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-gray-700">Cargando aplicación...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <HeaderWithAuth />

      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />

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