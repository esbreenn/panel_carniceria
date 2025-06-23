// src/utils/aggregateTransactions.js

export const aggregateTransactionsByDay = (transactions) => {
  const dailyTotals = {};

  transactions.forEach(tx => {
    const date = new Date(tx.timestamp);
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    if (!dailyTotals[dateKey]) {
      dailyTotals[dateKey] = {
        ingresos: 0,
        egresos: 0,
        balance: 0,
        transactionsCount: 0
      };
    }

    const numAmount = Number(tx.amount) || 0;
    if (tx.type === 'ingreso') {
      dailyTotals[dateKey].ingresos += numAmount;
    } else {
      dailyTotals[dateKey].egresos += numAmount;
    }
    dailyTotals[dateKey].balance = dailyTotals[dateKey].ingresos - dailyTotals[dateKey].egresos;
    dailyTotals[dateKey].transactionsCount += 1;
  });

  return dailyTotals;
};

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

  const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => b.localeCompare(a));
  return sortedMonths.map(monthKey => ({
    month: monthKey,
    ...monthlyTotals[monthKey],
  }));
};