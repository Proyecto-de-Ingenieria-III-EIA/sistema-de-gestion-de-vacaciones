import { atom } from 'jotai'

//mesActual
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

// Formatear fechas
export const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toISOString().split("T")[0];
};

// Obtener ausencias
export const obtenerAusencia = (empleado: any, fecha: Date) => {
    return empleado.absences.find(
        (ausencia: any) => fecha >= ausencia.start && fecha <= ausencia.end
    );
};