"use client"

import { useState, useEffect } from "react"
import { format, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateHistoricalData } from "@/lib/mock-data"
import { MonthlyAbsencesChart } from "./month-abs-chart"
import { AbsenceTypeDistributionChart } from "./abs-type-dist-chart"
import { AbsencesByDepartmentChart } from "./abs-department-chart"
import { AbsencesTrendChart } from "./abs-trend-chart"

export default function DashboardPage() {
  const [historicalData, setHistoricalData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = generateHistoricalData()
        setHistoricalData(data)
      } catch (error) {
        console.error("Error fetching historical data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const prepareChartData = () => {
    if (loading || Object.keys(historicalData).length === 0) {
      return {
        monthlyData: [],
        typeDistribution: { VACATION: 0, SPONTANEOUS: 0, INFORMAL: 0 },
        departmentData: {},
        trendData: [],
      }
    }

    const now = new Date()
    const monthlyData: Array<{
      month: string
      total: number
      vacation: number
      spontaneous: number
      informal: number
    }> = []

    // Últimos 6 meses: formato "MMM yy" (dic 24, ene 25...)
    for (let i = 5; i >= 0; i--) {
      const targetDate = subMonths(now, i)
      const key = `${targetDate.getFullYear()}-${String(targetDate.getMonth()).padStart(2, "0")}`
      const absences = historicalData[key] || []

      monthlyData.push({
        month: format(targetDate, "MMM yy", { locale: es }),
        total: absences.length,
        vacation: absences.filter((a) => a.type === "VACATION").length,
        spontaneous: absences.filter((a) => a.type === "SPONTANEOUS").length,
        informal: absences.filter((a) => a.type === "INFORMAL").length,
      })
    }

    // Distribución por tipo de ausencia (total)
    const allAbsences = Object.values(historicalData).flat()
    const typeDistribution = {
      VACATION: allAbsences.filter((a) => a.type === "VACATION").length,
      SPONTANEOUS: allAbsences.filter((a) => a.type === "SPONTANEOUS").length,
      INFORMAL: allAbsences.filter((a) => a.type === "INFORMAL").length,
    }

    // Datos por departamento
    const departmentData = {}
    const collaboratorDepartments = {}

    // Primero, obtener todos los departamentos de los colaboradores
    allAbsences.forEach((absence) => {
      const collaboratorId = absence.collaboratorId
      if (!collaboratorDepartments[collaboratorId]) {
        // En un caso real, esto vendría de la base de datos
        // Aquí simulamos asignando departamentos fijos basados en el ID
        const departments = ["Desarrollo", "Diseño", "Marketing", "Ventas", "Recursos Humanos"]
        collaboratorDepartments[collaboratorId] =
          departments[Number.parseInt(collaboratorId.split("-")[1]) % departments.length]
      }
    })

    // Luego, contar ausencias por departamento
    allAbsences.forEach((absence) => {
      const department = collaboratorDepartments[absence.collaboratorId]
      if (!departmentData[department]) {
        departmentData[department] = { total: 0, vacation: 0, spontaneous: 0, informal: 0 }
      }

      departmentData[department].total++

      if (absence.type === "VACATION") departmentData[department].vacation++
      else if (absence.type === "SPONTANEOUS") departmentData[department].spontaneous++
      else if (absence.type === "INFORMAL") departmentData[department].informal++
    })

    // Datos para el gráfico de tendencia (12 meses)
    const trendData: Array<{
      month: string
      total: number
    }> = []

    for (let i = 11; i >= 0; i--) {
      const targetDate = subMonths(now, i)
      const key = `${targetDate.getFullYear()}-${String(targetDate.getMonth()).padStart(2, "0")}`
      const absences = historicalData[key] || []

      trendData.push({
        month: format(targetDate, "MMM yy", { locale: es }),
        total: absences.length,
      })
    }

    return { monthlyData, typeDistribution, departmentData, trendData }
  }

  const { monthlyData, typeDistribution, departmentData, trendData } = prepareChartData()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Ausencias</h1>
          <p className="text-muted-foreground">Análisis y estadísticas de ausencias del equipo</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Ausencias</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : Object.values(historicalData).flat().length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vacaciones</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : typeDistribution.VACATION}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Espontáneas</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : typeDistribution.SPONTANEOUS}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Informales</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : typeDistribution.INFORMAL}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="monthly" className="space-y-6">
          <TabsList>
            <TabsTrigger value="monthly">Mensual</TabsTrigger>
            <TabsTrigger value="distribution">Distribución</TabsTrigger>
            <TabsTrigger value="department">Departamentos</TabsTrigger>
            <TabsTrigger value="trend">Tendencia</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ausencias Mensuales</CardTitle>
                <CardDescription>Distribución de ausencias por tipo en los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[550px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Cargando datos...</p>
                    </div>
                  ) : (
                    <MonthlyAbsencesChart data={monthlyData} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Tipo</CardTitle>
                <CardDescription>Porcentaje de cada tipo de ausencia en los últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Cargando datos...</p>
                    </div>
                  ) : (
                    <AbsenceTypeDistributionChart data={typeDistribution} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="department" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ausencias por Departamento</CardTitle>
                <CardDescription>Distribución de ausencias por departamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Cargando datos...</p>
                    </div>
                  ) : (
                    <AbsencesByDepartmentChart data={departmentData} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trend" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Ausencias</CardTitle>
                <CardDescription>Evolución del total de ausencias en los últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Cargando datos...</p>
                    </div>
                  ) : (
                    <AbsencesTrendChart data={trendData} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}