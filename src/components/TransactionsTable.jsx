// src/components/TransactionsTable.jsx
import React from "react";

export default function TransactionsTable({ transactions, onEdit, onDelete }) { // ¡MODIFICADO! Recibe onEdit y onDelete
  if (!transactions.length) {
    return <p className="text-center text-gray-500">No hay movimientos aún.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Fecha</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Método</th>
            <th className="px-4 py-2 text-left">Monto</th>
            <th className="px-4 py-2 text-left">Descripción</th> {/* ¡NUEVA COLUMNA! */}
            <th className="px-4 py-2 text-left">Acciones</th> {/* ¡NUEVA COLUMNA! */}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="odd:bg-gray-100">
              <td className="px-4 py-2">{new Date(tx.timestamp).toLocaleString()}</td>
              <td className="px-4 py-2 capitalize">{tx.type}</td>
              <td className="px-4 py-2 capitalize">{tx.method}</td>
              <td className="px-4 py-2">${tx.amount.toFixed(2)}</td>
              <td className="px-4 py-2">{tx.description || '-'}</td> {/* Muestra descripción */}
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => onEdit(tx)} // Llama a onEdit con la transacción completa
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(tx.id)} // Llama a onDelete con el ID
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}