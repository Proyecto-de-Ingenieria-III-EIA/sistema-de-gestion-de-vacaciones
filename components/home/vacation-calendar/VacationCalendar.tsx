import React from "react"
import './VacationCalendar.css'
import Header from "@/components/shared/Header/header"
import { Content } from "./components/Content"
import { Card, CardContent } from "../../ui/card"
import { Conventions } from "./components/Conventions"

export const VacationCalendar  = () => {

    return (
        <>
            <Card >
                <CardContent>
                    <Content />
                    <Conventions />
                </CardContent>
            </ Card>
        </>
    )


}
