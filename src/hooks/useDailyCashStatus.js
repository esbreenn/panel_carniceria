// src/hooks/useDailyCashStatus.js
import { useState, useEffect, useCallback } from 'react';
// ¡MODIFICADO! Elimina 'get'
import { ref, set, onValue } from 'firebase/database';
import { db } from '../services/firebase';

const getTodayDateKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
};

export function useDailyCashStatus() {
  const [openingBalance, setOpeningBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const todayDateKey = getTodayDateKey();

  useEffect(() => {
    setLoading(true);
    const cashRef = ref(db, `daily_cash_status/${todayDateKey}/openingCash`);
    const unsubscribe = onValue(cashRef, (snapshot) => {
      const data = snapshot.val();
      setOpeningBalance(Number(data) || 0);
      setLoading(false);
    }, (error) => {
      console.error("Error al leer apertura de caja:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [todayDateKey]);

  const setDailyOpeningBalance = useCallback(async (amount) => {
    const cashRef = ref(db, `daily_cash_status/${todayDateKey}/openingCash`);
    try {
      await set(cashRef, Number(amount) || 0);
      console.log(`Apertura de caja para ${todayDateKey} guardada.`);
    } catch (error) {
      console.error("Error al guardar apertura de caja:", error);
      throw error;
    }
  }, [todayDateKey]);

  return {
    openingBalance,
    setDailyOpeningBalance,
    loading,
    todayDateKey,
  };
}