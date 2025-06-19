// src/pages/Dashboard.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import TransactionForm from "../components/TransactionForm";
import SummaryCards from "../components/SummaryCards";
import TransactionsTable from "../components/TransactionsTable";
import FinancialCharts from "../components/FinancialCharts"; // Importar FinancialCharts
import CalendarView from "../components/CalendarView";
import { aggregateTransactionsByDay } from "../utils/aggregateTransactions";
import { exportToCsv } from "../utils/exportUtils";


export default function Dashboard() {
  const { transactions, totals, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  const dailyAggregatedData = useMemo(() => {
    return aggregateTransactionsByDay(transactions);
  }, [transactions]);


  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateSubmit = async (id, updatedData) => {
    await updateTransaction(id, updatedData);
    setEditingTransaction(null);
    alert("¡Movimiento actualizado exitosamente!");
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este movimiento?")) {
      await deleteTransaction(id);
      alert("¡Movimiento eliminado!");
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let tempTransactions = [...transactions];

    if (filterType !== 'all') {
      tempTransactions = tempTransactions.filter(tx => tx.type === filterType);
    }
    if (filterMethod !== 'all') {
      tempTransactions = tempTransactions.filter(tx => tx.method === filterMethod);
    }

    tempTransactions.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'timestamp') {
        valA = new Date(a.timestamp).getTime();
        valB = new Date(b.timestamp).getTime();
      } else if (sortBy === 'amount') {
        valA = a.amount;
        valB = b.amount;
      }

      if (sortOrder === 'asc') {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });

    return tempTransactions;
  }, [transactions, filterType, filterMethod, sortBy, sortOrder]);


  const handleExportCsv = () => {
    exportToCsv(filteredAndSortedTransactions, `movimientos_financieros_${new Date().toLocaleDateString()}.csv`);
  };


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Panel Financiero</h1>

      {/* Botones de Navegación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/add-transaction")}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          + Añadir Nuevo Movimiento
        </button>
        <button
          onClick={() => navigate("/calendar")}
          className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          Ver Calendario de Movimientos
        </button>
        <button
          onClick={handleExportCsv}
          className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Exportar a CSV
        </button>
      </div>

      {/* Sección del Formulario de Edición (Solo visible si hay una transacción en edición) */}
      {editingTransaction && (
        <div className="bg-white p-4 rounded shadow space-y-4">
          <TransactionForm
            transactionToEdit={editingTransaction}
            onUpdate={handleUpdateSubmit}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      )}

      {/* 1. Tarjetas de Resumen */}
      <SummaryCards
        ingresos={totals.ingresos}
        egresos={totals.egresos}
        balance={totals.balance}
        byMethod={totals.byMethod}
      />

      {/* 2. Análisis Visual (Gráficos) - ¡MODIFICADO! Gráfico de TORTA */}
      <FinancialCharts totals={totals} chartType="pie" /> {/* Pasa chartType="pie" */}

      {/* 3. Controles de Filtro y Ordenación */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-bold mb-2">Filtros y Ordenación de Transacciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Filtrar por Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="all">Todos</option>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Filtrar por Método</label>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="all">Todos</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); }}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="timestamp">Fecha</option>
              <option value="amount">Monto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Orden</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Tabla de Transacciones */}
      <TransactionsTable
        transactions={filteredAndSortedTransactions}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
}