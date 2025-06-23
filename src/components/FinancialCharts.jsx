// src/components/FinancialCharts.jsx
import React from 'react';
// ¡CORREGIDO! 'from' en lugar de '=>'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function FinancialCharts({ totals, chartType }) {
  const dataByMethod = Object.entries(totals.byMethod).map(([method, amount]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    value: amount,
  }));

  const dataIncomeExpense = [
    { name: 'Ingresos', valor: totals.ingresos },
    { name: 'Egresos', valor: totals.egresos },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2 text-center">Análisis Visual</h2>

      {chartType === 'pie' && ( // Gráfico de torta para Dashboard
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-center mb-2">Ingresos por Método</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataByMethod}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dataByMethod.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === 'bar' && ( // Gráfico de barras para Calendario
        <div>
          <h3 className="text-lg font-semibold text-center mb-2">Ingresos vs Egresos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={dataIncomeExpense}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis formatter={(value) => `$${value.toFixed(2)}`} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="valor" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}