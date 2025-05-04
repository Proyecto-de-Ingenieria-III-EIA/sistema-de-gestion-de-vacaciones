"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface MonthlyAbsencesChartProps {
  data: Array<{
    month: string
    total: number
    vacation: number
    spontaneous: number
    informal: number
  }>
}

export function MonthlyAbsencesChart({ data }: MonthlyAbsencesChartProps) {
  return (
    <ChartContainer
      config={{
        vacation: {
          label: "Vacaciones",
          color: "hsl(var(--chart-1))",
        },
        spontaneous: {
          label: "Espontáneas",
          color: "hsl(var(--chart-2))",
        },
        informal: {
          label: "Informales",
          color: "hsl(var(--chart-3))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-sm" />
          <YAxis className="text-sm" />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="vacation" stackId="a" fill="var(--color-vacation)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="spontaneous" stackId="a" fill="var(--color-spontaneous)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="informal" stackId="a" fill="var(--color-informal)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
