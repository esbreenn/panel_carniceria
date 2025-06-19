// src/pages/CalendarPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarView from "../components/CalendarView";
import { useTransactions } from "../hooks/useTransactions";
import { aggregateTransactionsByDay, aggregateTransactionsByMonth } from "../utils/aggregateTransactions";
import FinancialCharts from "../components/FinancialCharts"; // Importa FinancialCharts


export default function CalendarPage() {
  const { transactions, totals } = useTransactions(); // Obtenemos transactions y totals para los gráficos
  const navigate = useNavigate();

  const [calendarDisplayDate, setCalendarDisplayDate] = useState(new Date());


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


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Vista de Calendario y Resúmenes Diarios</h1>

      {/* Tarjetas de Resumen del MES ACTUAL DEL CALENDARIO */}
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

      {/* Gráfico de Barras de Ingresos vs Egresos (¡MOVIMIENTO AQUÍ!) */}
      <FinancialCharts totals={totals} chartType="bar" /> {/* Pasa chartType="bar" */}

      <CalendarView dailyTotalsData={dailyAggregatedData} onMonthChange={setCalendarDisplayDate} />

      {/* Tabla de Balances Mensuales (todos los meses) */}
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

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
      >
        Volver al Panel
      </button>
    </div>
  );
}

// Función auxiliar para obtener el nombre del mes (si no la tienes ya en un utils)
const getMonthName = (monthIndex) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthIndex];
};