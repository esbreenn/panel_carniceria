// src/pages/AddTransactionPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Para volver al dashboard
import TransactionForm from "../components/TransactionForm";
import { useTransactions } from "../hooks/useTransactions"; // Necesitamos el hook para la función addTransaction

export default function AddTransactionPage() {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  // Función que se llama cuando se envía el formulario para añadir
  const handleAddSubmit = async (transactionData) => {
    await addTransaction(transactionData);
    alert("¡Movimiento añadido exitosamente!"); // Mensaje de confirmación
    navigate("/dashboard"); // Redirigir de vuelta al dashboard
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Añadir Nuevo Movimiento</h1>

      <TransactionForm
        onSubmit={handleAddSubmit}
        // En esta página, TransactionForm solo se usará para AÑADIR.
        // Por lo tanto, no le pasamos transactionToEdit, onUpdate ni onCancelEdit.
      />

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
      >
        Volver al Panel
      </button>
    </div>
  );
}