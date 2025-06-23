// src/hooks/useTransactions.js
import { useState, useEffect, useCallback } from "react";
import { ref, onValue, push, serverTimestamp, remove, update } from "firebase/database";
import { db } from "../services/firebase";

export function useTransactions() { // ¡REVERTIDO! Ya no recibe carniceriaId
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
    byMethod: { efectivo: 0, transferencia: 0, tarjeta: 0 },
  });

  useEffect(() => {
    // ¡REVERTIDO! La ruta es simplemente "transactions"
    const txRef = ref(db, "transactions");
    return onValue(txRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, tx]) => ({ id, ...tx }));

      setTransactions(list);

      const agg = list.reduce(
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
      setTotals({ ...agg, balance });
    });
  }, []); // ¡REVERTIDO! Sin dependencia de carniceriaId

  const addTransaction = useCallback(async ({ amount, type, method, description }) => {
    // ¡REVERTIDO! La ruta es simplemente "transactions"
    const txRef = ref(db, "transactions");
    await push(txRef, { amount, type, method, description, timestamp: serverTimestamp() });
  }, []); // Sin dependencia de carniceriaId

  const updateTransaction = useCallback(async (id, { amount, type, method, description }) => {
    // ¡REVERTIDO! La ruta es simplemente "transactions"
    const txRef = ref(db, `transactions/${id}`);
    await update(txRef, { amount, type, method, description });
  }, []); // Sin dependencia de carniceriaId

  const deleteTransaction = useCallback(async (id) => {
    // ¡REVERTIDO! La ruta es simplemente "transactions"
    const txRef = ref(db, `transactions/${id}`);
    await remove(txRef);
  }, []); // Sin dependencia de carniceriaId

  return { transactions, totals, addTransaction, updateTransaction, deleteTransaction };
}