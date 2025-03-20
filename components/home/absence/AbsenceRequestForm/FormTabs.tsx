import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAtom } from 'jotai';
import { absenceFormAtom } from '../../atoms/userAtoms';
import { Plane, FileText, BookOpen, FileEdit, AlertTriangle } from 'lucide-react';
import AdditionalField from './AdditionalField';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FormTabs = () => {
  const [form, setForm] = useAtom(absenceFormAtom);

  const absenceTypes = [
    { id: 'vacaciones', label: 'Vacaciones', icon: Plane, color: 'bg-green-500' },
    { id: 'permiso', label: 'Permiso Personal', icon: FileEdit, color: 'bg-amber-500' },
  ];

  // Campos adicionales según el tipo de ausencia.
  const additionalFields: Record<string, any[]> = {
    vacaciones: [
      { id: 'availableDays', label: 'Días disponibles', type: 'info', value: 'dias de descanso' },
      { id: 'replacement', label: 'Persona que te sustituye', type: 'select' },
    ],
    permiso: [
      { id: 'reason', label: 'Motivo', type: 'textarea' },
      { id: 'urgency', label: 'Nivel de urgencia', type: 'select', options: ['Baja', 'Media', 'Alta'] },
      { id: 'additionalInfo', label: 'Informacion Adicional', type: 'file' },
    ],
  };

  const handleTabChange = (value: string) => {
    setForm((prev) => ({ ...prev, currentTab: value as any }));
  };

  return (
    <Tabs value={form.currentTab} onValueChange={handleTabChange} className="w-full">
      <div className="w-full flex justify-center">
        <TabsList className="flex gap-8 bg-transparent p-4 mt-4">
          {absenceTypes.map((type) => (
            <TabsTrigger
              key={type.id}
              value={type.id}
              className="flex flex-col items-center py-3 gap-1 data-[state=active]:bg-gray-200 rounded-lg transition-all"
              >
              {/* Ícono dentro del fondo gris */}
              <div
                className={`p-3 rounded-full ${type.color} text-white flex justify-center items-center`}
              >
                <type.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{type.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {absenceTypes.map((type) => (
        <TabsContent key={type.id} value={type.id} className="space-y-4 mt-14">
          <div className="pt-2 pb-4 border-b">
            <h3 className="font-medium text-lg flex items-center">
              <type.icon className="w-5 h-5 mr-2" />
              Solicitud de {type.label}
            </h3>
          </div>

          {additionalFields[type.id]?.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <AdditionalField field={field} />
            </div>
          ))}

        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FormTabs;
