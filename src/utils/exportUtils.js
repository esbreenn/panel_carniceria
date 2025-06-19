// src/utils/exportUtils.js

export const exportToCsv = (data, filename = 'exportacion_datos.csv') => {
  if (!data || data.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  // Obtenemos los encabezados de las columnas (claves del primer objeto de datos)
  // Excluimos 'id' y 'timestamp' si no son directamente útiles como columnas, o los renombramos
  const headers = ['Fecha', 'Tipo', 'Método', 'Monto', 'Descripción'];
  const dataKeys = ['timestamp', 'type', 'method', 'amount', 'description'];

  // Función para escapar valores CSV (manejar comas, comillas, saltos de línea)
  const escapeCsvValue = (value) => {
    if (value === null || value === undefined) return '';
    let stringValue = String(value);
    // Si el valor contiene coma, comillas dobles o salto de línea, lo encerramos en comillas dobles
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`; // Escapar comillas dobles dentro del valor
    }
    return stringValue;
  };

  // Construir el contenido CSV
  let csvContent = headers.map(escapeCsvValue).join(',') + '\n'; // Fila de encabezados

  data.forEach(item => {
    const row = dataKeys.map(key => {
      let value = item[key];
      // Formatear la fecha
      if (key === 'timestamp' && value) {
        value = new Date(value).toLocaleString(); // O el formato de fecha que prefieras
      }
      // Formatear el monto
      if (key === 'amount' && value !== undefined && value !== null) {
        value = Number(value).toFixed(2);
      }
      // Asegurarse de que la descripción sea una cadena
      if (key === 'description' && !value) {
        value = ''; // Si no hay descripción, que sea una cadena vacía en lugar de 'undefined'
      }

      return escapeCsvValue(value);
    }).join(',');
    csvContent += row + '\n';
  });

  // Crear un Blob y un enlace de descarga
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  // Navegadores antiguos pueden necesitar navigator.msSaveBlob
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename); // Nombre del archivo
    document.body.appendChild(link); // Añadir al DOM temporalmente
    link.click(); // Simular clic para iniciar la descarga
    document.body.removeChild(link); // Eliminar del DOM
  }
};