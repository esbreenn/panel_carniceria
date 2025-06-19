/* src/components/SummaryCards.jsx */
import React from "react";

export default function SummaryCards({ ingresos, egresos, balance, byMethod }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold">Ingresos Totales</h2>
        <p className="text-2xl">${ingresos.toFixed(2)}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold">Egresos Totales</h2>
        <p className="text-2xl">${egresos.toFixed(2)}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold">Balance Neto</h2>
        <p className="text-2xl">${balance.toFixed(2)}</p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold">Ingresos por Método</h2>
        <ul className="mt-2 space-y-1">
          <li>Efectivo: ${byMethod.efectivo.toFixed(2)}</li>
          <li>Transferencia: ${byMethod.transferencia.toFixed(2)}</li>
          <li>Tarjeta: ${byMethod.tarjeta.toFixed(2)}</li>
        </ul>
      </div>
    </div>
  );
}