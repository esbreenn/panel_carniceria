// src/pages/Dashboard.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import { useDailyCashStatus } from "../hooks/useDailyCashStatus";
import TransactionForm from "../components/TransactionForm";
import SummaryCards from "../components/SummaryCards";
import TransactionsTable from "../components/TransactionsTable";
import FinancialCharts from "../components/FinancialCharts";
import { exportToCsv } from "../utils/exportUtils";


export default function Dashboard() {
  const { transactions, updateTransaction, deleteTransaction } = useTransactions();
  const { openingBalance, setDailyOpeningBalance, loading: loadingCashStatus, todayDateKey } = useDailyCashStatus();

  const [editingTransaction, setEditingTransaction] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [filterType, setFilterType] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterDate, setFilterDate] = useState('today');


  React.useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setFilterDate(dateParam);
    } else {
      setFilterDate('today');
    }
  }, [searchParams]);


  const todayTransactions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return transactions.filter(tx => {
      const txDate = new Date(tx.timestamp);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    });
  }, [transactions]);

  const todayTotals = useMemo(() => {
    const agg = todayTransactions.reduce(
      (acc, { amount, type, method }) => {
        const num = Number(amount) || 0;
        if (type === "ingreso") {
          acc.ingresos += num;
          acc.byMethod[method] += num;
        } else {
          acc.egresos += num;
        }
        return acc;
      },
      { ingresos: 0, egresos: 0, byMethod: { efectivo: 0, transferencia: 0, tarjeta: 0 } }
    );
    const balance = agg.ingresos - agg.egresos;
    return { ...agg, balance };
  }, [todayTransactions]);


  const currentCashInDrawer = useMemo(() => {
    const egresosEfectivoHoy = todayTotals.egresos;
    return openingBalance + todayTotals.byMethod.efectivo - egresosEfectivoHoy;
  }, [openingBalance, todayTotals]);

  const handleSaveOpeningBalance = async (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.openingCashInput.value);
    if (!isNaN(amount)) {
      await setDailyOpeningBalance(amount);
      alert(`Apertura de caja para ${todayDateKey} guardada: $${amount.toFixed(2)}`);
    } else {
      alert("Por favor, introduce un número válido para la apertura de caja.");
    }
  };


  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    // ¡NUEVO! Scroll suave hacia arriba
    window.scrollTo({
      top: 0, // Desplazarse al inicio de la página
      behavior: 'smooth' // Hacer el desplazamiento suave
    });
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

    if (filterDate === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      tempTransactions = tempTransactions.filter(tx => {
        const txDate = new Date(tx.timestamp);
        txDate.setHours(0, 0, 0, 0);
        return txDate.getTime() === today.getTime();
      });
    } else if (filterDate !== 'all') { // Si filterDate es una fecha específica (del calendario)
        const targetDate = new Date(filterDate);
        targetDate.setHours(0,0,0,0);
        tempTransactions = tempTransactions.filter(tx => {
            const txDate = new Date(tx.timestamp);
            txDate.setHours(0,0,0,0);
            return txDate.getTime() === targetDate.getTime();
        });
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
  }, [transactions, filterType, filterMethod, sortBy, sortOrder, filterDate]);


  const handleExportCsv = () => {
    exportToCsv(filteredAndSortedTransactions, `movimientos_financieros_${new Date().toLocaleDateString()}.csv`);
  };

  // --- CÓDIGO SOLO PARA DEPURACIÓN ---
  // NO OLVIDES BORRAR ESTO ANTES DE HACER TU GIT PUSH FINAL
  window.dashboardVariables = {
    transactions: transactions,
    filterDate: filterDate,
    todayTransactions: todayTransactions,
    todayTotals: todayTotals,
    filteredAndSortedTransactions: filteredAndSortedTransactions,
  };
  // --- FIN CÓDIGO SOLO PARA DEPURACIÓN ---


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Panel Financiero</h1>

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

      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-bold mb-2">Estado de Caja ({todayDateKey})</h2>
        {loadingCashStatus ? (
          <p className="text-gray-500">Cargando apertura de caja...</p>
        ) : (
          <form onSubmit={handleSaveOpeningBalance} className="space-y-2">
            <div>
              <label htmlFor="openingCashInput" className="block text-sm font-medium">Apertura de Caja Hoy</label>
              <input
                type="number"
                id="openingCashInput"
                defaultValue={openingBalance.toFixed(2)}
                className="mt-1 p-2 border rounded w-full"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Guardar Apertura
            </button>
          </form>
        )}
        <div className="mt-4 border-t pt-4">
          <p className="text-lg font-semibold">Efectivo en Caja al Momento:</p>
          <p className="text-2xl">${currentCashInDrawer.toFixed(2)}</p>
        </div>
      </div>


      {editingTransaction && (
        <div className="bg-white p-4 rounded shadow space-y-4">
          <TransactionForm
            transactionToEdit={editingTransaction}
            onUpdate={handleUpdateSubmit}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      )}

      <SummaryCards
        ingresos={todayTotals.ingresos}
        egresos={todayTotals.egresos}
        balance={todayTotals.balance}
        byMethod={todayTotals.byMethod}
      />

      {todayTransactions.length > 0 && (
          <FinancialCharts totals={todayTotals} chartType="pie" />
      )}
      {todayTransactions.length === 0 && (
          <div className="bg-white p-4 rounded shadow text-center text-gray-500">
              <h2 className="text-xl font-bold mb-2">Análisis Visual (Hoy)</h2>
              <p>No hay transacciones registradas para hoy.</p>
          </div>
      )}


      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-bold mb-2">Filtros y Ordenación de Transacciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label className="block text-sm font-medium">Filtrar por Fecha</label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="all">Todos los días</option>
              <option value="today">Solo hoy</option>
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

      <TransactionsTable
        transactions={filteredAndSortedTransactions}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
}