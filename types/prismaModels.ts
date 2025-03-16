
export interface Absence {
    dbId: string;
    colaboratorId: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    // Relations (requestedAbsence, spontaneousAbsence, etc.)
  }
  
  export interface RequestedAbsence {
    absenceId: string;
    status: string;
    aprover: string;
    decisionDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Anadir interfaces para los otros tipos de ausencia
  