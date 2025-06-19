// src/components/TransactionForm.jsx
import React, { useState, useEffect } from "react";

// transactionToEdit será el objeto de la transacción si estamos editando, o null si estamos añadiendo.
// onUpdate será la función que se llamará al guardar cambios en modo edición.
// onSubmit será la función que se llamará al añadir en modo añadir.
// onCancelEdit es opcional, para cerrar el formulario de edición.
export default function TransactionForm({ transactionToEdit, onSubmit, onUpdate, onCancelEdit }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("ingreso");
  const [method, setMethod] = useState("efectivo");
  const [description, setDescription] = useState(""); // ¡NUEVO! Estado para la descripción

  // useEffect para cargar los datos de la transacción si estamos en modo edición
  useEffect(() => {
    if (transactionToEdit) {
      setAmount(transactionToEdit.amount.toString()); // Convertir a string para el input type="number"
      setType(transactionToEdit.type);
      setMethod(transactionToEdit.method);
      setDescription(transactionToEdit.description || ""); // Carga la descripción, o vacío si no existe
    } else {
      // Limpiar el formulario si no estamos editando (volviendo al modo añadir)
      setAmount("");
      setType("ingreso");
      setMethod("efectivo");
      setDescription("");
    }
  }, [transactionToEdit]); // Se ejecuta cuando transactionToEdit cambia

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    const transactionData = { amount: parseFloat(amount), type, method, description }; // Incluye description

    if (transactionToEdit) {
      // Si estamos editando, llamamos a onUpdate
      onUpdate(transactionToEdit.id, transactionData);
    } else {
      // Si estamos añadiendo, llamamos a onSubmit
      onSubmit(transactionData);
    }
    // No reseteamos el formulario aquí, se reseteará por el useEffect
    // cuando transactionToEdit sea null (después de cerrar edición)
  };

  const isEditing = !!transactionToEdit; // Determina si estamos en modo edición

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? "Editar Movimiento" : "Añadir Nuevo Movimiento"}
      </h2>
      <div>
        <label className="block text-sm font-medium">Monto</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full p-2 border rounded"
          placeholder="0.00"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción (Opcional)</label> {/* ¡NUEVO CAMPO! */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full p-2 border rounded resize-y"
          placeholder="Breve descripción del movimiento"
          rows="2"
        />
      </div>

      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 p-2 border rounded"
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Método</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 p-2 border rounded"
          >
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {isEditing ? "Guardar Cambios" : "Añadir Movimiento"}
      </button>

      {isEditing && ( // Botón de cancelar solo en modo edición
        <button
          type="button"
          onClick={onCancelEdit}
          className="w-full mt-2 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
        >
          Cancelar Edición
        </button>
      )}
    </form>
  );
}