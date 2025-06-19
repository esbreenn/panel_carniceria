// src/utils/aggregateTransactions.js

// Función para agrupar transacciones por día
export const aggregateTransactionsByDay = (transactions) => {
  const dailyTotals = {};

  transactions.forEach(tx => {
    const date = new Date(tx.timestamp);
    // Formatear la fecha a 'YYYY-MM-DD' para usarla como clave
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    if (!dailyTotals[dateKey]) {
      dailyTotals[dateKey] = {
        ingresos: 0,
        egresos: 0,
        balance: 0,
        // Puedes añadir más detalles si los necesitas por día, ej:
        // efectivoIngresos: 0,
        // tarjetaIngresos: 0,
        // transferenciaIngresos: 0,
        transactionsCount: 0 // Para saber cuántas transacciones hubo ese día
      };
    }

    const numAmount = Number(tx.amount) || 0;
    if (tx.type === 'ingreso') {
      dailyTotals[dateKey].ingresos += numAmount;
      // if (tx.method === 'efectivo') dailyTotals[dateKey].efectivoIngresos += numAmount;
      // ... y así para otros métodos
    } else {
      dailyTotals[dateKey].egresos += numAmount;
    }
    dailyTotals[dateKey].balance = dailyTotals[dateKey].ingresos - dailyTotals[dateKey].egresos;
    dailyTotals[dateKey].transactionsCount += 1;
  });

  return dailyTotals; // Retorna un objeto como { 'YYYY-MM-DD': { ingresos: X, egresos: Y }, ... }
};

// Función para agrupar transacciones por mes (útil para el balance mensual que ya tenías)
export const aggregateTransactionsByMonth = (transactions) => {
  const monthlyTotals = {};

  transactions.forEach(tx => {
    const date = new Date(tx.timestamp);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = {
        ingresos: 0,
        egresos: 0,
        balance: 0,
      };
    }

    const numAmount = Number(tx.amount) || 0;
    if (tx.type === 'ingreso') {
      monthlyTotals[monthKey].ingresos += numAmount;
    } else {
      monthlyTotals[monthKey].egresos += numAmount;
    }
    monthlyTotals[monthKey].balance = monthlyTotals[monthKey].ingresos - monthlyTotals[monthKey].egresos;
  });

  // Convertir a array y ordenar
  const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => b.localeCompare(a));
  return sortedMonths.map(monthKey => ({
    month: monthKey,
    ...monthlyTotals[monthKey],
  }));
};