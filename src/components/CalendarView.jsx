// src/components/CalendarView.jsx
import React, { useState, useMemo, useEffect } from 'react'; // ¡MODIFICADO! Añade useEffect

// Función auxiliar para obtener el nombre del mes (si ya la tienes en un utils, elimínala de aquí)
const getMonthName = (monthIndex) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthIndex];
};

// Función para generar los días de un mes en una cuadrícula de calendario
const generateCalendarDays = (year, monthIndex) => {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  const numDaysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Domingo, 1 = Lunes, etc.

  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const days = [];

  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }

  for (let i = 1; i <= numDaysInMonth; i++) {
    const date = new Date(year, monthIndex, i);
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    days.push({ day: i, dateKey: dateKey, isCurrentMonth: true });
  }

  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let i = 0; i < remainingCells; i++) {
    days.push(null);
  }

  return days;
};

// ¡MODIFICADO! Ahora recibe onMonthChange
export default function CalendarView({ dailyTotalsData, onDateClick, onMonthChange }) {
  const [currentDate, setCurrentDate] = useState(new Date()); // Estado interno para el mes/año del calendario

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Notificar al padre cada vez que el mes del calendario cambia
  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(currentDate);
    }
  }, [currentDate, onMonthChange]); // Se ejecuta cuando currentDate cambia


  // Generar los días del calendario para el mes actual
  const daysInMonth = useMemo(() => generateCalendarDays(year, month), [year, month]);

  // Navegación de meses
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };


  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-2 text-center">Calendario de Movimientos</h2>

      {/* Navegación del Calendario */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">&lt; Anterior</button>
        <span className="text-lg font-semibold">
          {getMonthName(month)} {year}
        </span>
        <button onClick={goToNextMonth} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Siguiente &gt;</button>
      </div>
      <div className="text-center">
        <button onClick={goToCurrentMonth} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Hoy</button>
      </div>

      {/* Días de la Semana */}
      <div className="grid grid-cols-7 text-center font-medium text-gray-700 border-b pb-2">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mié</span>
        <span>Jue</span>
        <span>Vie</span>
        <span>Sáb</span>
        <span>Dom</span>
      </div>

      {/* Cuadrícula del Calendario */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((dayData, index) => (
          <div
            key={index}
            className={`
              p-2 h-24 flex flex-col border rounded
              ${dayData ? 'bg-white' : 'bg-gray-50 opacity-50'}
              ${dayData && new Date().toDateString() === new Date(year, month, dayData.day).toDateString() ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}
              ${dayData && onDateClick ? 'cursor-pointer hover:bg-gray-100' : ''}
            `}
            onClick={dayData && onDateClick ? () => onDateClick(dayData.dateKey) : null}
          >
            <span className="font-semibold text-sm">
              {dayData ? dayData.day : ''}
            </span>
            {dayData && dailyTotalsData[dayData.dateKey] ? (
              <div className="text-xs mt-1 space-y-0.5">
                <p className="text-green-600">I: ${dailyTotalsData[dayData.dateKey].ingresos.toFixed(2)}</p>
                <p className="text-red-600">E: ${dailyTotalsData[dayData.dateKey].egresos.toFixed(2)}</p>
                <p className={`font-bold ${dailyTotalsData[dayData.dateKey].balance >= 0 ? 'text-blue-600' : 'text-red-700'}`}>
                  B: ${dailyTotalsData[dayData.dateKey].balance.toFixed(2)}
                </p>
              </div>
            ) : dayData && (
              <p className="text-xs text-gray-400 mt-1">Sin mov.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}