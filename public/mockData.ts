export interface Absence {
    type: string;
    start: string;
    end: string;
    color: string;
  }
  
export interface Employee {
    id: number;
    name: string;
    department: string;
    absences: Absence[];
  }
  
 export const empleados: Employee[] = [
    {
      id: 1,
      name: "Ana García",
      department: "Desarrollo",
      absences: [
        { type: "Vacaciones", start: "2025-02-10", end: "2025-02-21", color: "#4ade80" },
        { type: "Enfermedad", start: "2025-03-05", end: "2025-03-07", color: "#fb7185" }
      ]
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      department: "Diseño",
      absences: [
        { type: "Vacaciones", start: "2025-02-24", end: "2025-03-01", color: "#4ade80" }
      ]
    },
    {
      id: 3,
      name: "María López",
      department: "Marketing",
      absences: [
        { type: "Permiso", start:"2025-02-18", end: "2025-02-19", color: "#fbbf24" }
      ]
    }
  ];  

  export const employeesMock = [
    { id: '1', name: 'Ana García', department: 'Desarrollo' },
    { id: '2', name: 'Carlos Ruiz', department: 'Diseño' },
    { id: '3', name: 'María López', department: 'Marketing' },
    { id: '4', name: 'David Sánchez', department: 'Finanzas' }
  ];
  
  export const absenceRequestsMock = [
    {
      id: '101',
      startDate: '2025-03-10',
      endDate: '2025-03-15',
      type: 'vacaciones',
      colaboratorId: '1',
      additionalFields: { reason: 'Viaje personal' }
    }
  ];
  