import React from "react"
import './VacationCalendar.css'
import { Header } from "./components/Header"
import { Content } from "./components/Content"
import { Card } from "../ui/card"

const VacationCalendar  = () => {

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