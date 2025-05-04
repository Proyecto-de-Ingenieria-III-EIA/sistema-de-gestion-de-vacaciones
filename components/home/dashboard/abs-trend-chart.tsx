"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface AbsencesTrendChartProps {
  data: Array<{
    month: string
    total: number
  }>
}

export function AbsencesTrendChart({ data }: AbsencesTrendChartProps) {
  return (
    <ChartContainer
      config={{
        total: {
          label: "Total Ausencias",
          color: "hsl(var(--chart-1))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-sm" />
          <YAxis className="text-sm" />
          <Tooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--color-total)"
            fill="var(--color-total)"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
