import React from "react"
import { empleados } from "@/public/mockData"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Users } from "lucide-react"
import '../VacationCalendar.css'
import MoveMonthButton from "../subComponents/MoveMonthButton"
import { useAtom } from "jotai"
import { mesActualAtom } from "../../atoms/atoms"



function HeaderCalendar () {
    //useAtom de jotai
    const [mesActual] = useAtom(mesActualAtom)

    return (
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
    )

}

export { HeaderCalendar }