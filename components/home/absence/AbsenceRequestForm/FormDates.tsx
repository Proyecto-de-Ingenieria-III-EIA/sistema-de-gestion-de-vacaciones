// src/components/AbsenceRequestForm/FormDates.tsx
import React from 'react';
import { useAtom } from 'jotai';
import { absenceFormAtom } from '../../atoms/userAtoms';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock } from 'lucide-react';

const FormDates = () => {
  const [form, setForm] = useAtom(absenceFormAtom);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate=e.target.value
    const today = new Date().toISOString().split("T")[0] //FORMATO YYYY-MM-DD

    if(newStartDate<today) return //para que no coja fechas pasadas

    setForm((prev) => ({ 
      ...prev, 
      startDate: e.target.value,
     endDate: prev.endDate && prev.endDate<newStartDate ? "" : prev.endDate //resetea endDate si es invalida
     }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;

    if(form.startDate && newEndDate<form.startDate) return; //evita fechas menores a startDate

    setForm((prev) => ({
       ...prev, 
       endDate: newEndDate
       }));
  };

  const calculateDays = () => {
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha de inicio</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="startDate"
              type="date"
              className="pl-10"
              value={form.startDate}
              onChange={handleStartDateChange}
              required
              min={new Date().toISOString().split("T")[0]} //restringe fechas pasadas
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha de fin</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="endDate"
              type="date"
              className="pl-10"
              value={form.endDate}
              onChange={handleEndDateChange}
              required
              min={form.startDate || new Date().toISOString().split("T")[0]} //restringe a startDate o hoy
            />
          </div>
        </div>
      </div>
      {form.startDate && form.endDate && (
        <div className="mb-6 flex items-center border p-3 rounded-md bg-blue-50 border-blue-100">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          <span>
            Duración: <strong>{calculateDays()} días</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default FormDates;
