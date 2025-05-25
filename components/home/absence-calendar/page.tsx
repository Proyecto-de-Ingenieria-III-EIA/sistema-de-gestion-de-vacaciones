"use client"

import { useState, useEffect } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"
import { useQuery } from "@apollo/client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { AbsenceGrid } from "./absence-grid"
import { AbsenceLegend } from "./absence-legend"
import { GET_ABSENCES_TIME_PERIOD, type GetAbsencesResponse, type Absence } from "@/graphql/absence/prueba_simon"

export default function AbsenceCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Calcular el primer y último día del mes actual
  const firstDayOfMonth = startOfMonth(currentDate)
  const lastDayOfMonth = endOfMonth(currentDate)

  // Consulta GraphQL para obtener las ausencias del mes actual
  const { data, loading, error, refetch } = useQuery<GetAbsencesResponse>(GET_ABSENCES_TIME_PERIOD, {
    variables: {
      startDate: firstDayOfMonth.toISOString(),
      endDate: lastDayOfMonth.toISOString(),
    },
    fetchPolicy: "network-only", // Ignores cache, always refetchs fresh data
  })

  // Actualizar la consulta cuando cambia el mes
  useEffect(() => {
    refetch({
      startDate: firstDayOfMonth.toISOString(),
      endDate: lastDayOfMonth.toISOString(),
    })
  }, [currentDate, refetch, firstDayOfMonth, lastDayOfMonth]) // Triggers for the refetch

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1))
  }

  //Funcion para decidir ausencia aprobada
  function isApproved(a: Absence) {
    if (a.status.__typename === "RequestStatus")
      return a.status.reqName === "APROVED"

    if (a.status.__typename === "SpontaneousAbsenceStatus")
      return a.status.spontName === "APROVED"

    return false
  }

  // Procesar datos de ausencias para agrupar por colaborador
  const absences = (data?.getAbsencesTimePeriod || []).filter(isApproved)

  // Agrupar ausencias por colaborador
  const collaboratorsMap = new Map()

  absences.forEach((absence) => {
    const collaboratorId = absence.colaborator.id

    if (!collaboratorsMap.has(collaboratorId)) {
      collaboratorsMap.set(collaboratorId, {
        id: collaboratorId,
        name: absence.colaborator.name,
        department: "", // La API no proporciona departamento, podríamos añadirlo en el futuro
        absences: [],
      })

    }
    const absenceData = {
      id: `${absence.colaborator.id}-${absence.startDate}`, // Generamos un ID único
      startDate: absence.startDate,
      endDate: absence.endDate,
      type: absence.type,
    }
    collaboratorsMap.get(collaboratorId).absences.push(absenceData) // Push absences to the map that groups collaborator id with its info
  })

  /* List of collaborators as the values from the map */
  const collaboratorsList = Array.from(collaboratorsMap.values())

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="w-full md:w-auto">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => date && setCurrentDate(date)}
              className="rounded-md border bg-card"
              locale={es}
            />
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold">Calendario de Ausencias</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium min-w-32 text-center">
                  {format(currentDate, "MMMM 'de' yyyy", { locale: es })}
                </span>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {collaboratorsList.length} {collaboratorsList.length === 1 ? "empleado" : "empleados"}
              </span>
            </div>

            <AbsenceLegend />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Cargando ausencias...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 p-4 rounded-lg">
            <p className="text-destructive">Error al cargar las ausencias: {error.message}</p>
          </div>
        ) : collaboratorsList.length === 0 ? (
          <div className="bg-muted p-8 rounded-lg text-center">
            <p className="text-muted-foreground">No hay ausencias registradas para este mes.</p>
          </div>
        ) : (
          <AbsenceGrid collaborators={collaboratorsList} currentDate={currentDate} />
        )}
      </div>
    </div>
  )
}
