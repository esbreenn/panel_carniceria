// src/utils/exportUtils.js

export const exportToCsv = (data, filename = 'exportacion_datos.csv') => {
  if (!data || data.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const headers = ['Fecha', 'Tipo', 'Método', 'Monto', 'Descripción'];
  const dataKeys = ['timestamp', 'type', 'method', 'amount', 'description'];

  const escapeCsvValue = (value) => {
    if (value === null || value === undefined) return '';
    let stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  let csvContent = headers.map(escapeCsvValue).join(',') + '\n';

  data.forEach(item => {
    const row = dataKeys.map(key => {
      let value = item[key];
      if (key === 'timestamp' && value) {
        value = new Date(value).toLocaleString();
      }
      if (key === 'amount' && value !== undefined && value !== null) {
        value = Number(value).toFixed(2);
      }
      if (key === 'description' && !value) {
        value = '';
      }

      return escapeCsvValue(value);
    }).join(',');
    csvContent += row + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};