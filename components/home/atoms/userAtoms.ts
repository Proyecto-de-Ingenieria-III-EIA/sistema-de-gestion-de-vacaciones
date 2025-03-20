import { atom } from 'jotai';

export interface AbsenceFormState {
  startDate: string;
  endDate: string;
  currentTab: 'vacaciones'| 'permiso';
  formSubmitted: boolean;
  // Datos adicionales
  additionalData: Record<string, any>;
}

export const absenceFormAtom = atom<AbsenceFormState>({
  startDate: '',
  endDate: '',
  currentTab: 'vacaciones',
  formSubmitted: false,
  additionalData: {},
});
