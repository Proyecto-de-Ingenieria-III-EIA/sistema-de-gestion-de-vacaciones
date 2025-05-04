"use client"

import { getDaysInMonth, startOfMonth, isWithinInterval, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import type { Absence } from "@/lib/mock-data"

type CollaboratorWithAbsences = {
  id: string
  name: string
  department: string
  absences: Absence[]
}

type AbsenceGridProps = {
  collaborators: CollaboratorWithAbsences[]
  currentDate: Date
}

export function AbsenceGrid({ collaborators, currentDate }: AbsenceGridProps) {
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = startOfMonth(currentDate)

  // Generar array de días para el mes
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Función para determinar si un día tiene una ausencia para un colaborador
  const getAbsenceForDay = (collaborator: CollaboratorWithAbsences, day: number) => {
    const date = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), day)

    return collaborator.absences.find((absence) => {
      const start = parseISO(absence.startDate)
      const end = parseISO(absence.endDate)

      return isWithinInterval(date, { start, end })
    })
  }

  // Función para obtener el color de fondo según el tipo de ausencia
  const getAbsenceColor = (type: string) => {
    switch (type) {
      case "VACATION":
        return "bg-green-200 dark:bg-green-900"
      case "SPONTANEOUS":
        return "bg-red-200 dark:bg-red-900"
      case "INFORMAL":
        return "bg-yellow-200 dark:bg-yellow-900"
      default:
        return ""
    }
  }

  // Función para obtener el texto descriptivo del tipo de ausencia
  const getAbsenceTypeText = (type: string) => {
    switch (type) {
      case "VACATION":
        return "Vacaciones"
      case "SPONTANEOUS":
        return "Espontánea"
      case "INFORMAL":
        return "Informal"
      default:
        return type
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-center bg-muted/50">
            <th className="p-3 border-r sticky left-0 bg-muted/50 z-10 min-w-[200px] text-left">Empleado</th>
            {days.map((day) => (
              <th key={day} className="p-2 min-w-[40px] border-r last:border-r-0">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {collaborators.map((collaborator) => (
            <tr key={collaborator.id} className="border-t">
              <td className="p-3 border-r sticky left-0 bg-background z-10">
                <div>
                  <div className="font-medium">{collaborator.name}</div>
                  <div className="text-xs text-muted-foreground">{collaborator.department}</div>
                </div>
              </td>
              {days.map((day) => {
                const absence = getAbsenceForDay(collaborator, day)
                return (
                  <td
                    key={day}
                    className={cn("p-2 border-r last:border-r-0", absence ? getAbsenceColor(absence.type) : "")}
                    title={absence ? `${getAbsenceTypeText(absence.type)}: ${absence.reason || ""}` : ""}
                  >
                    {absence && <div className="w-full h-full" />}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
