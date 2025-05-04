"use client"

import { useState, useEffect } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { AbsenceGrid } from "./absence-grid"
import { AbsenceLegend } from "./absence-legend"
import { getAbsencesForMonth, getCollaboratorById, type Absence } from "@/lib/mock-data"

export default function AbsenceCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [absences, setAbsences] = useState<Absence[]>([])
  const [loading, setLoading] = useState(true)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    const fetchAbsences = async () => {
      setLoading(true)
      try {
        const data = await getAbsencesForMonth(year, month)
        setAbsences(data)
      } catch (error) {
        console.error("Error fetching absences:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAbsences()
  }, [year, month])

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1))
  }

  // Procesar datos de ausencias para agrupar por colaborador
  const collaboratorsWithAbsences = absences.reduce(
    (acc, absence) => {
      const collaborator = getCollaboratorById(absence.collaboratorId)
      if (!collaborator) return acc

      if (!acc[absence.collaboratorId]) {
        acc[absence.collaboratorId] = {
          id: collaborator.id,
          name: collaborator.name,
          department: collaborator.department,
          absences: [],
        }
      }

      acc[absence.collaboratorId].absences.push(absence)
      return acc
    },
    {} as Record<string, { id: string; name: string; department: string; absences: Absence[] }>,
  )

  const collaboratorsList = Object.values(collaboratorsWithAbsences)

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
