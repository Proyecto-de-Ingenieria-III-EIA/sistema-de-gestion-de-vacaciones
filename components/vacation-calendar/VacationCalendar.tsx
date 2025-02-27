import React from "react"
import { Employee } from "@/public/mockData"
import './VacationCalendar.css'
import { Header } from "./components/Header"
import { Content } from "./components/Content"
import { Card } from "../ui/card"

const VacationCalendar  = () => {
    //Verificar si una fecha esta dentro de un periodo de ausencias
    const obtenerAusencia = (empleado: Employee, fecha: Date) => {
        return empleado.absences.find(ausencia => fecha >= ausencia.start 
                                                && fecha <= ausencia.end
        )
    }

    return (
        <>
            <Card >
                <Header />
                <Content />

            </ Card>
        </>
    )




}
export { VacationCalendar }