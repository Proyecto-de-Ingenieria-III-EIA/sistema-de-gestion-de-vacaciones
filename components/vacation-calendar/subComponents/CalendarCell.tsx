import React from 'react';
import { mesActualAtom } from '../atoms/atoms';
import { Employee, Absence } from '@/public/mockData';
import { useAtomValue } from 'jotai';

interface CalendarCellProps {
  dia: number
  empleado: Employee
  obtenerAusencia: (Employee: Employee, fecha: Date) => Absence | undefined
}

// Componente para las celdas del calendario
const CalendarCell: React.FC<CalendarCellProps> = ({ dia, empleado, obtenerAusencia }) => {
  //Valor actual
  const mesActual  = useAtomValue(mesActualAtom)

  const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
  const ausencia = obtenerAusencia(empleado, fecha);
  
  return (
    <td 
      key={dia} 
      className="p-2 border-b text-center"
      style={{
        backgroundColor: ausencia ? ausencia.color : 'transparent',
        opacity: ausencia ? 0.2 : 1
      }}
      title={ausencia ? `${ausencia.type}: ${ausencia.start} - ${ausencia.end}` : ''}
    >
      {ausencia && (
        <div className="w-full h-6" style={{ backgroundColor: ausencia.color }} />
      )}
    </td>
  );
};

export default CalendarCell;