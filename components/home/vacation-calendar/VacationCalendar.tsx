import React from "react"
import './VacationCalendar.css'
import { Header } from "./components/Header"
import { Content } from "./components/Content"
import { Card, CardContent } from "../../ui/card"
import { Conventions } from "./components/Conventions"

export const VacationCalendar  = () => {

    return (
        <>
            <Card >
                <Header />
                <CardContent>
                    <Content />
                    <Conventions />
                </CardContent>
            </ Card>
        </>
    )


}
