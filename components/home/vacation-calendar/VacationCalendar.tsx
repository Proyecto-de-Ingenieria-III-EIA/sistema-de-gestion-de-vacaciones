import React from "react"
import './VacationCalendar.css'
import { Content } from "./components/Content"
import { Card, CardContent } from "../../ui/card"
import { Conventions } from "./components/Conventions"
import { HeaderCalendar } from "./components/Header"

export const VacationCalendar  = () => {

    return (
        <>
            <Card >
                <CardContent>
                    <HeaderCalendar/>
                    <Content />
                    <Conventions />
                </CardContent>
            </ Card>
        </>
    )


}
