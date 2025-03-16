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
    { id: 'enfermedad', label: 'Enfermedad', icon: FileText, color: 'bg-red-500' },
    { id: 'estudios', label: 'Estudios', icon: BookOpen, color: 'bg-blue-500' },
    { id: 'permiso', label: 'Permiso Personal', icon: FileEdit, color: 'bg-amber-500' },
  ];

  // Campos adicionales según el tipo de ausencia.
  const additionalFields: Record<string, any[]> = {
    vacaciones: [
      { id: 'availableDays', label: 'Días disponibles', type: 'info', value: '22 días' },
      { id: 'replacement', label: 'Persona que te sustituye', type: 'select' },
    ],
    enfermedad: [
      { id: 'medicalReport', label: 'Informe médico', type: 'file' },
      { id: 'symptoms', label: 'Síntomas', type: 'textarea' },
    ],
    estudios: [
      { id: 'institution', label: 'Centro educativo', type: 'input' },
      { id: 'courseDetails', label: 'Detalles del curso', type: 'textarea' },
      { id: 'certificate', label: 'Certificado de inscripción', type: 'file' },
    ],
    permiso: [
      { id: 'reason', label: 'Motivo', type: 'textarea' },
      { id: 'urgency', label: 'Nivel de urgencia', type: 'select', options: ['Baja', 'Media', 'Alta'] },
    ],
  };

  const handleTabChange = (value: string) => {
    setForm((prev) => ({ ...prev, currentTab: value as any }));
  };

  return (
    <Tabs value={form.currentTab} onValueChange={handleTabChange} className="w-full">
      <div className="px-6">
        <TabsList className="grid grid-cols-4 mb-4">
          {absenceTypes.map((type) => (
            <TabsTrigger
              key={type.id}
              value={type.id}
              className="flex flex-col items-center py-3 gap-1"
            >
              <div className={`p-2 rounded-full ${type.color} text-white`}>
                <type.icon className="w-5 h-5" />
              </div>
              <span>{type.label}</span>
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

          {type.id === 'enfermedad' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Recuerda que debes notificar tu ausencia a tu supervisor inmediatamente.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FormTabs;
