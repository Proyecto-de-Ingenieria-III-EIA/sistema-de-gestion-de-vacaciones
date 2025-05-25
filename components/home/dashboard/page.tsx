"use client"

import { useQuery } from "@apollo/client"
import { format, subMonths } from "date-fns"
import { es } from "date-fns/locale"

import { GET_ABSENCES_TIME_PERIOD_FOR_DASHBOARD } from "@/graphql/connections/post_request_abs/queries"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { MonthlyAbsencesChart } from "./month-abs-chart"
import { AbsenceTypeDistributionChart } from "./abs-type-dist-chart"
// import { AbsencesByDepartmentChart } from "./abs-department-chart"
import { AbsencesTrendChart } from "./abs-trend-chart"

/* -------------------------------------------------- */
/* Utils                                              */
/* -------------------------------------------------- */

const END_DATE = new Date()
const START_DATE = subMonths(END_DATE, 12)

/* -------------------------------------------------- */
/* Component                                          */
/* -------------------------------------------------- */

export default function DashboardPage() {
  /* ----------- Query al backend ----------- */
  const { data, loading, error } = useQuery(GET_ABSENCES_TIME_PERIOD_FOR_DASHBOARD, {
    variables: {
      startDate: START_DATE.toISOString(),
      endDate:   END_DATE.toISOString(),
    },
    fetchPolicy: "network-only",
  })

  /* ----------- Normalizar datos para los gráficos ----------- */
  const prepareChartData = () => {
    if (loading || error || !data) {
      return {
        monthlyData: [],
        typeDistribution: { VACATION: 0, SPONTANEOUS: 0, INFORMAL: 0 },
        departmentData: {},
        trendData: [],
      }
    }

    /* Todas las ausencias del período */
    const absences = data.getAbsencesTimePeriod as Array<{
      startDate: string
      type: "VACATION" | "SPONTANEOUS" | "INFORMAL"
      colaborator?: { department?: string | null }
    }>

    /* ----- 1. Datos mensuales (últimos 6) ----- */
    const monthlyData = [...Array(6)].map((_, idx) => {
      const d = subMonths(END_DATE, 5 - idx)
      const monthAbsences = absences.filter(a => {
        const aDate = new Date(a.startDate)
        return (
          aDate.getFullYear() === d.getFullYear() &&
          aDate.getMonth() === d.getMonth()
        )
      })
      return {
        month: format(d, "MMM yy", { locale: es }),
        total: monthAbsences.length,
        vacation: monthAbsences.filter(a => a.type === "VACATION").length,
        spontaneous: monthAbsences.filter(a => a.type === "SPONTANEOUS").length,
        informal: monthAbsences.filter(a => a.type === "INFORMAL").length,
      }
    })

    /* ----- 2. Distribución global ----- */
    const typeDistribution = {
      VACATION: absences.filter(a => a.type === "VACATION").length,
      SPONTANEOUS: absences.filter(a => a.type === "SPONTANEOUS").length,
      INFORMAL: absences.filter(a => a.type === "INFORMAL").length,
    }

    /* ----- 3. Por departamento (si existe el campo) ----- */
    const departmentData: Record<
      string,
      { total: number; vacation: number; spontaneous: number; informal: number }
    > = {}

    absences.forEach(a => {
      const dept = a.colaborator?.department ?? "Sin Depto."
      if (!departmentData[dept]) {
        departmentData[dept] = {
          total: 0,
          vacation: 0,
          spontaneous: 0,
          informal: 0,
        }
      }
      departmentData[dept].total++
      if (a.type === "VACATION") departmentData[dept].vacation++
      if (a.type === "SPONTANEOUS") departmentData[dept].spontaneous++
      if (a.type === "INFORMAL") departmentData[dept].informal++
    })

    /* ----- 4. Tendencia (12 meses) ----- */
    const trendData = [...Array(12)].map((_, idx) => {
      const d = subMonths(END_DATE, 11 - idx)
      const total = absences.filter(a => {
        const aDate = new Date(a.startDate)
        return (
          aDate.getFullYear() === d.getFullYear() &&
          aDate.getMonth() === d.getMonth()
        )
      }).length
      return { month: format(d, "MMM yy", { locale: es }), total }
    })

    return { monthlyData, typeDistribution, departmentData, trendData }
  }

  const { monthlyData, typeDistribution, trendData } =
    prepareChartData()

  /* -------------------------------------------------- */
  /* Render                                             */
  /* -------------------------------------------------- */

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard de Ausencias
          </h1>
          <p className="text-muted-foreground">
            Análisis y estadísticas de ausencias del equipo
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-600">
              Error cargando datos: {error.message}
            </p>
          )}
        </header>

        {/* Resumen numérico */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Total Ausencias" value={trendData.reduce((n, m) => n + m.total, 0)} loading={loading} />
          <SummaryCard title="Vacaciones" value={typeDistribution.VACATION} loading={loading} />
          <SummaryCard title="Espontáneas" value={typeDistribution.SPONTANEOUS} loading={loading} />
          <SummaryCard title="Informales" value={typeDistribution.INFORMAL} loading={loading} />
        </div>

        {/* Gráficas */}
        <Tabs defaultValue="monthly" className="space-y-6">
          <TabsList>
            <TabsTrigger value="monthly">Mensual</TabsTrigger>
            <TabsTrigger value="distribution">Distribución</TabsTrigger>
            {/* {Object.keys(departmentData).length > 0 && (
              <TabsTrigger value="department">Departamentos</TabsTrigger>
            )} */}
            <TabsTrigger value="trend">Tendencia</TabsTrigger>
          </TabsList>

          {/* ------------- Mensual ------------- */}
          <TabsContent value="monthly" className="space-y-6">
            <GraphCard
              title="Ausencias Mensuales"
              description="Distribución de ausencias por tipo en los últimos 6 meses"
              loading={loading}
            >
              <MonthlyAbsencesChart data={monthlyData} />
            </GraphCard>
          </TabsContent>

          {/* ------------- Distribución ------------- */}
          <TabsContent value="distribution" className="space-y-6">
            <GraphCard
              title="Distribución por Tipo"
              description="Porcentaje de cada tipo de ausencia en los últimos 12 meses"
              loading={loading}
            >
              <AbsenceTypeDistributionChart data={typeDistribution} />
            </GraphCard>
          </TabsContent>

          {/* ------------- Departamentos (opcional) ------------- */}
          {/* <TabsContent value="department" className="space-y-6">
            <GraphCard
              title="Ausencias por Departamento"
              description="Distribución de ausencias por departamento"
              loading={loading}
            >
              <AbsencesByDepartmentChart data={departmentData} />
            </GraphCard>
          </TabsContent> */}

          {/* ------------- Tendencia ------------- */}
          <TabsContent value="trend" className="space-y-6">
            <GraphCard
              title="Tendencia de Ausencias"
              description="Evolución del total de ausencias en los últimos 12 meses"
              loading={loading}
            >
              <AbsencesTrendChart data={trendData} />
            </GraphCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

/* -------------------------------------------------- */
/* Sub-componentes reutilizables                      */
/* -------------------------------------------------- */

/* Tarjeta resumen simple */
function SummaryCard({
  title,
  value,
  loading,
}: {
  title: string
  value: number
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription>Últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? "…" : value.toLocaleString("es-ES")}
        </div>
      </CardContent>
    </Card>
  )
}

/* Tarjeta para gráficos */
function GraphCard({
  title,
  description,
  loading,
  children,
}: {
  title: string
  description: string
  loading: boolean
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[670px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Cargando datos…</p>
            </div>
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  )
}
