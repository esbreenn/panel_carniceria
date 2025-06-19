// src/pages/Dashboard.jsx
import React, { useState } from "react"; // ¡MODIFICADO! Importa useState
import { useTransactions } from "../hooks/useTransactions";
import TransactionForm from "../components/TransactionForm";
import SummaryCards from "../components/SummaryCards";
import TransactionsTable from "../components/TransactionsTable";

export default function Dashboard() {
  const { transactions, totals, addTransaction, updateTransaction, deleteTransaction } = useTransactions(); // ¡MODIFICADO! Obtiene update y delete
  const [editingTransaction, setEditingTransaction] = useState(null); // ¡NUEVO ESTADO! Para la transacción que se está editando

  // Función para manejar el clic en "Editar"
  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction); // Establece la transacción a editar
    // El formulario de edición se mostrará automáticamente debido a este estado
  };

  // Función para manejar el guardar cambios en una transacción editada
  const handleUpdateSubmit = async (id, updatedData) => {
    await updateTransaction(id, updatedData);
    setEditingTransaction(null); // Limpia el estado de edición para volver al modo añadir
  };

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    setEditingTransaction(null); // Simplemente limpia el estado de edición
  };

  // Función para manejar el clic en "Eliminar"
  const handleDeleteClick = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este movimiento?")) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Panel Financiero</h1>
      <SummaryCards
        ingresos={totals.ingresos}
        egresos={totals.egresos}
        balance={totals.balance}
        byMethod={totals.byMethod}
      />

      {/* El formulario ahora puede ser para añadir o para editar */}
      <TransactionForm
        transactionToEdit={editingTransaction} // Pasa la transacción a editar (si existe)
        onSubmit={addTransaction} // Función para añadir
        onUpdate={handleUpdateSubmit} // Función para actualizar
        onCancelEdit={handleCancelEdit} // Función para cancelar edición
      />

      <TransactionsTable
        transactions={transactions}
        onEdit={handleEditClick} // Pasa la función para iniciar edición
        onDelete={handleDeleteClick} // Pasa la función para eliminar
      />
    </div>
  );
}