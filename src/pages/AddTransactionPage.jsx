// src/pages/AddTransactionPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// useAuth ya no es necesario aquí para la funcionalidad single-user
// import { useAuth } from "../hooks/useAuth";
import TransactionForm from "../components/TransactionForm";
import { useTransactions } from "../hooks/useTransactions";


export default function AddTransactionPage() {
  // carniceriaId ya no es necesario
  // const { user } = useAuth();
  // const carniceriaId = user?.carniceriaId;

  const { addTransaction } = useTransactions(); // ¡REVERTIDO! Ya no pasa carniceriaId
  const navigate = useNavigate();

  const handleAddSubmit = async (transactionData) => {
    await addTransaction(transactionData);
    alert("¡Movimiento añadido exitosamente!");
    navigate("/dashboard");
  };

  // ¡REVERTIDO! Ya no necesitamos el mensaje de cargando carniceriaId aquí
  // if (!carniceriaId) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <p className="text-xl font-semibold text-gray-700">Cargando datos de la carnicería o usuario no configurado...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Añadir Nuevo Movimiento</h1> {/* ¡REVERTIDO! Sin carniceriaId en el título */}

      <TransactionForm
        onSubmit={handleAddSubmit}
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