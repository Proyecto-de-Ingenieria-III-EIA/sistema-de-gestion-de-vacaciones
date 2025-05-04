// Tipos de ausencias
export type AbsenceType = "VACATION" | "SPONTANEOUS" | "INFORMAL"

// Interfaz para colaboradores
export interface Collaborator {
  id: string
  name: string
  department: string
}

// Interfaz para ausencias
export interface Absence {
  id: string
  collaboratorId: string
  startDate: string
  endDate: string
  type: AbsenceType
  status: "APPROVED" | "PENDING" | "REJECTED"
  reason?: string
}

// Lista de colaboradores
export const collaborators: Collaborator[] = [
  { id: "col-001", name: "Ana García", department: "Desarrollo" },
  { id: "col-002", name: "Carlos Ruiz", department: "Diseño" },
  { id: "col-003", name: "María López", department: "Marketing" },
  { id: "col-004", name: "Juan Pérez", department: "Ventas" },
  { id: "col-005", name: "Laura Martínez", department: "Recursos Humanos" },
]

// Función para generar fechas aleatorias dentro de un rango
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Función para generar ausencias para un mes específico
export const generateAbsencesForMonth = (year: number, month: number): Absence[] => {
  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0)

  const absences: Absence[] = []

  // Generar entre 10-15 ausencias aleatorias para el mes
  const numAbsences = 10 + Math.floor(Math.random() * 6)

  for (let i = 0; i < numAbsences; i++) {
    const collaborator = collaborators[Math.floor(Math.random() * collaborators.length)]
    const absenceTypes: AbsenceType[] = ["VACATION", "SPONTANEOUS", "INFORMAL"]
    const type = absenceTypes[Math.floor(Math.random() * absenceTypes.length)]

    // Duración de la ausencia (1-5 días para vacaciones, 1-2 para otros tipos)
    const durationDays = type === "VACATION" ? 1 + Math.floor(Math.random() * 5) : 1 + Math.floor(Math.random() * 2)

    const startDate = randomDate(startOfMonth, endOfMonth)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + durationDays)

    // Asegurarse de que la fecha final no exceda el fin de mes
    if (endDate > endOfMonth) {
      endDate.setTime(endOfMonth.getTime())
    }

    absences.push({
      id: `abs-${i}-${month}-${year}`,
      collaboratorId: collaborator.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      type,
      status: "APPROVED",
      reason: type === "VACATION" ? "Vacaciones programadas" : type === "INFORMAL" ? "Asunto personal" : "Imprevisto",
    })
  }

  return absences
}

// Generar solicitudes pendientes
export const generatePendingRequests = (): Absence[] => {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const twoMonthsLater = new Date(now.getFullYear(), now.getMonth() + 2, 0)

  const pendingRequests: Absence[] = []

  // Generar 5-8 solicitudes pendientes
  const numRequests = 5 + Math.floor(Math.random() * 4)

  for (let i = 0; i < numRequests; i++) {
    const collaborator = collaborators[Math.floor(Math.random() * collaborators.length)]
    const absenceTypes: AbsenceType[] = ["VACATION", "INFORMAL"]
    const type = absenceTypes[Math.floor(Math.random() * absenceTypes.length)]

    const startDate = randomDate(nextMonth, twoMonthsLater)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + (1 + Math.floor(Math.random() * 5)))

    pendingRequests.push({
      id: `req-${i}`,
      collaboratorId: collaborator.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      type,
      status: "PENDING",
      reason:
        type === "VACATION"
          ? ["Vacaciones familiares", "Descanso programado", "Viaje personal"][Math.floor(Math.random() * 3)]
          : ["Cita médica", "Trámite personal", "Asunto familiar"][Math.floor(Math.random() * 3)],
    })
  }

  return pendingRequests
}

// Generar datos históricos para estadísticas (último año)
export const generateHistoricalData = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const historicalData: Record<string, Absence[]> = {}

  // Generar datos para los últimos 12 meses
  for (let i = 0; i < 12; i++) {
    const month = (currentMonth - i + 12) % 12
    const year = currentYear - (month > currentMonth ? 1 : 0)

    const monthKey = `${year}-${month.toString().padStart(2, "0")}`
    historicalData[monthKey] = generateAbsencesForMonth(year, month)
  }

  return historicalData
}

// Función para obtener ausencias para un mes específico (simulando la consulta GraphQL)
export const getAbsencesForMonth = (year: number, month: number): Promise<Absence[]> => {
  return new Promise((resolve) => {
    // Simular un pequeño retraso de red
    setTimeout(() => {
      resolve(generateAbsencesForMonth(year, month))
    }, 300)
  })
}

// Función para obtener solicitudes pendientes (simulando la consulta GraphQL)
export const getPendingRequests = (): Promise<Absence[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generatePendingRequests())
    }, 300)
  })
}

// Función para obtener un colaborador por ID
export const getCollaboratorById = (id: string): Collaborator | undefined => {
  return collaborators.find((col) => col.id === id)
}

// Función para obtener todos los colaboradores
export const getAllCollaborators = (): Collaborator[] => {
  return collaborators
}
