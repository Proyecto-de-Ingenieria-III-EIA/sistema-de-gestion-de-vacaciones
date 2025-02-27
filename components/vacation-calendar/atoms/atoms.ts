import { atom } from 'jotai'

export const mesActualAtom = atom(new Date())

// Atomos derivados
export const primerDiaAtom = atom((get) => {
    const mesActual = get(mesActualAtom);
    return new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
});

export const ultimoDiaAtom = atom((get) => {
    const mesActual = get(mesActualAtom);
    return new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
});

export const diasEnMesAtom = atom((get) => {
    return get(ultimoDiaAtom).getDate();
});

// Funcion para formatear fechas
export const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toISOString().split("T")[0];
};