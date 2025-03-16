// src/components/AbsenceRequestForm/AdditionalField.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, File } from 'lucide-react';

interface AdditionalFieldProps {
  field: {
    id: string;
    label: string;
    type: string;
    value?: string;
    options?: string[];
  };
}

const employees = [
  { id: '1', name: 'Ana García' },
  { id: '2', name: 'Carlos Ruiz' },
  { id: '3', name: 'María López' },
  { id: '4', name: 'David Sánchez' },
];

const AdditionalField: React.FC<AdditionalFieldProps> = ({ field }) => {
  switch (field.type) {
    case 'info':
      return (
        <div className="bg-gray-50 p-3 rounded-md text-gray-600 flex items-center">
          <FileText className="mr-2 w-4 h-4" />
          {field.value}
        </div>
      );
    case 'input':
      return <Input id={field.id} placeholder={field.label} />;
    case 'textarea':
      return <Textarea id={field.id} placeholder={field.label} />;
    case 'select':
      if (field.id === 'replacement') {
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar empleado" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      } else if (field.options) {
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={`Seleccionar ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      return null;
    case 'file':
      return (
        <div className="grid w-full items-center gap-2">
          <Label htmlFor={field.id} className="cursor-pointer">
            <div className="border-2 border-dashed rounded-md p-4 text-center hover:bg-gray-50 transition-colors">
              <span className="text-blue-500 flex items-center justify-center mb-1">
                <File className="mr-2 w-5 h-5" />
                Subir {field.label}
              </span>
              <p className="text-xs text-gray-500">Click para seleccionar archivo</p>
            </div>
          </Label>
          <Input id={field.id} type="file" className="hidden" />
        </div>
      );
    default:
      return null;
  }
};

export default AdditionalField;
