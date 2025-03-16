// src/components/AbsenceRequestForm/index.tsx
import React from 'react';
import { useAtom } from 'jotai';
import { absenceFormAtom } from '../../atoms/userAtoms';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FormDates from './FormDates';
import FormTabs from './FormTabs';

const AbsenceRequestForm = () => {
  const [form, setForm] = useAtom(absenceFormAtom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, formSubmitted: true }));
    // Simulacion de envio. Aqu1 integrar la mutacion de GraphQL.
    setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        formSubmitted: false,
        startDate: '',
        endDate: '',
        additionalData: {},
      }));
    }, 3000);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Solicitud de Ausencia</CardTitle>
        <CardDescription>
          Completa el formulario para solicitar un periodo de ausencia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormDates />
          <FormTabs />
          <CardFooter className="flex justify-between pt-6 pb-0 px-0">
            <Button variant="outline" type="button">Cancelar</Button>
            <Button type="submit" disabled={form.formSubmitted}>
              {form.formSubmitted ? 'Enviando...' : 'Enviar solicitud'}
            </Button>
          </CardFooter>
          {form.formSubmitted && (
            <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md flex items-center">
              <div className="mr-3 flex-shrink-0">✓</div>
              <p>
                Tu solicitud ha sido enviada correctamente y está pendiente de aprobación.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AbsenceRequestForm;
