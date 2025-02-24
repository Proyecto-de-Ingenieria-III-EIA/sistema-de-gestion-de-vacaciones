import React from "react"
import { empleados, Employee } from "@/public/mockData"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Calendar } from "../ui/calendar"
import { Button } from "../ui/button"
import { ChevronLeft, Users } from "lucide-react"
import './VacationCalendar.css'
import MoveMonthButton from "./subComponents/MoveMonthButton"

const VacationCalendar  = () => {
    //Estado para cambiar de mes el calendario
    const [mesActual, setMesActual] = React.useState(new Date())
    //Obtener dias del mes actual
    const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1)
    const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0)
    const diasEnMes = ultimoDia.getDate()

    //Cambiar al mes anterior
    const mesAnterior = () => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1))
    }

    //Cambiar al mes siguiente
    const mesSiguiente = () => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1))
    }

    //Formatear fecha para comparacion. Convierte a formato ISO, extrayendo la fecha sin la hora.
    const formatearFecha = (fecha: Date) => {
        return new Date(fecha).toISOString().split('T')[0] // Con el split[0] tomamos solo la parte sin la hora.
    }

    //Verificar si una fecha esta dentro de un periodo de ausencias
    const obtenerAusencia = (empleado: Employee, fecha: Date) => {
        return empleado.absences.find(ausencia => fecha >= ausencia.start 
                                                && fecha <= ausencia.end
        )
    }

    return (
        <>
        <Card />
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Calendar />
                    <CardTitle>Calendario de Ausencias</CardTitle>
                </div>
                
                <div className="flex items-center space-x-4">
                    <MoveMonthButton lor={"left"}  />
                    <span>
                        {mesActual.toLocaleDateString('es-ES', {month: 'long', year: 'numeric'})}
                    </span>
                    <MoveMonthButton lor={"right"} />
                </div>
            </div>
            <CardDescription>
                <Users />
                <span>{empleados.length} empleados</span>
            </CardDescription>
        </CardHeader>
        </>
    )




}
export { VacationCalendar }