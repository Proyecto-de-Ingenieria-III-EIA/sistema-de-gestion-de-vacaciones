"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface AbsencesByDepartmentChartProps {
  data: Record<
    string,
    {
      total: number
      vacation: number
      spontaneous: number
      informal: number
    }
  >
}

export function AbsencesByDepartmentChart({ data }: AbsencesByDepartmentChartProps) {
  const chartData = Object.entries(data).map(([department, counts]) => ({
    department,
    ...counts,
  }))

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
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 80, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis type="number" className="text-sm" />
          <YAxis dataKey="department" type="category" className="text-sm" width={80} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="vacation" stackId="a" fill="var(--color-vacation)" radius={[0, 4, 4, 0]} />
          <Bar dataKey="spontaneous" stackId="a" fill="var(--color-spontaneous)" radius={[0, 4, 4, 0]} />
          <Bar dataKey="informal" stackId="a" fill="var(--color-informal)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
