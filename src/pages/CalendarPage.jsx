// src/pages/CalendarPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarView from "../components/CalendarView";
// ¡MODIFICADO! Elimina 'addTransaction', 'updateTransaction', 'deleteTransaction' del destructuring
// Solo necesitamos 'transactions' y 'totals' para los cálculos y gráficos
import { useTransactions } from "../hooks/useTransactions";
import { aggregateTransactionsByDay, aggregateTransactionsByMonth } from "../utils/aggregateTransactions";
import FinancialCharts from "../components/FinancialCharts";
import TransactionsTable from "../components/TransactionsTable";
import TransactionForm from "../components/TransactionForm";


export default function CalendarPage() {
  // ¡MODIFICADO! Solo obtenemos lo que se usa: transactions, totals (para gráficos), updateTransaction, deleteTransaction
  const { transactions, totals, updateTransaction, deleteTransaction } = useTransactions();
  const navigate = useNavigate();

  const [calendarDisplayDate, setCalendarDisplayDate] = useState(new Date());
  const [selectedDateForHistory, setSelectedDateForHistory] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);


  const dailyAggregatedData = useMemo(() => {
    return aggregateTransactionsByDay(transactions);
  }, [transactions]);

  const monthlyAggregates = useMemo(() => {
    return aggregateTransactionsByMonth(transactions);
  }, [transactions]);

  const currentMonthKey = `${calendarDisplayDate.getFullYear()}-${(calendarDisplayDate.getMonth() + 1).toString().padStart(2, '0')}`;
  const currentMonthSummary = useMemo(() => {
    return monthlyAggregates.find(m => m.month === currentMonthKey) || { ingresos: 0, egresos: 0, balance: 0 };
  }, [monthlyAggregates, currentMonthKey]);


  const handleDayClick = (dateKey) => {
    setSelectedDateForHistory(dateKey);
    setEditingTransaction(null);
  };

  const transactionsForSelectedDay = useMemo(() => {
    if (!selectedDateForHistory) {
      return [];
    }
    const [year, month, day] = selectedDateForHistory.split('-').map(Number);
    const targetDateUTC = new Date(Date.UTC(year, month - 1, day));

    return transactions.filter(tx => {
      const txDate = new Date(tx.timestamp);
      const txYearUTC = txDate.getUTCFullYear();
      const txMonthUTC = txDate.getUTCMonth();
      const txDayUTC = txDate.getUTCDate();
      const txDateUTC = new Date(Date.UTC(txYearUTC, txMonthUTC, txDayUTC));
      return txDateUTC.getTime() === targetDateUTC.getTime();
    }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [transactions, selectedDateForHistory]);


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
      setEditingTransaction(null);
    }
  };


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Vista de Calendario y Resúmenes Diarios</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold">Resumen del Mes: {getMonthName(calendarDisplayDate.getMonth())} {calendarDisplayDate.getFullYear()}</h2>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div>
            <p className="text-sm text-gray-600">Ingresos:</p>
            <p className="text-xl text-green-600">${currentMonthSummary.ingresos.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Egresos:</p>
            <p className="text-xl text-red-600">${currentMonthSummary.egresos.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Balance:</p>
            <p className={`text-xl ${currentMonthSummary.balance >= 0 ? 'text-blue-600' : 'text-red-700'}`}>
              ${currentMonthSummary.balance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <FinancialCharts totals={totals} chartType="bar" />

      <CalendarView
        dailyTotalsData={dailyAggregatedData}
        onMonthChange={setCalendarDisplayDate}
        onDateClick={handleDayClick}
      />

      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-bold mb-2">Historial de Balances Mensuales</h2>
        {monthlyAggregates.length === 0 ? (
          <p className="text-gray-500">No hay datos mensuales disponibles aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Mes</th>
                  <th className="px-4 py-2 text-left">Ingresos</th>
                  <th className="px-4 py-2 text-left">Egresos</th>
                  <th className="px-4 py-2 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {monthlyAggregates.map(monthData => (
                  <tr key={monthData.month} className="odd:bg-gray-100">
                    <td className="px-4 py-2">{monthData.month}</td>
                    <td className="px-4 py-2 text-green-600">${monthData.ingresos.toFixed(2)}</td>
                    <td className="px-4 py-2 text-red-600">${monthData.egresos.toFixed(2)}</td>
                    <td className="px-4 py-2">${monthData.balance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDateForHistory && (
        <div className="bg-white p-4 rounded shadow space-y-4">
          <h2 className="text-xl font-bold mb-2">Movimientos del Día: {selectedDateForHistory}</h2>
          {editingTransaction && (
            <div className="my-4">
              <TransactionForm
                transactionToEdit={editingTransaction}
                onUpdate={handleUpdateSubmit}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          )}
          <TransactionsTable
            transactions={transactionsForSelectedDay}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      )}


      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
      >
        Volver al Panel
      </button>
    </div>
  );
}

const getMonthName = (monthIndex) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthIndex];
};