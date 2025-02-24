export interface Absence {
    type: string;
    start: Date;
    end: Date;
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
        { type: "Vacaciones", start: new Date("2025-02-10"), end: new Date("2025-02-21"), color: "#4ade80" },
        { type: "Enfermedad", start: new Date("2025-03-05"), end: new Date("2025-03-07"), color: "#fb7185" }
      ]
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      department: "Diseño",
      absences: [
        { type: "Vacaciones", start: new Date("2025-02-24"), end: new Date("2025-03-01"), color: "#4ade80" }
      ]
    },
    {
      id: 3,
      name: "María López",
      department: "Marketing",
      absences: [
        { type: "Permiso", start: new Date("2025-02-18"), end: new Date("2025-02-19"), color: "#fbbf24" }
      ]
    }
  ];  