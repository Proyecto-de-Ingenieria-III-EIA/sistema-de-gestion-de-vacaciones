'use client';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface AbsenceTypeDistributionChartProps {
  data: {
    VACATION: number;
    SPONTANEOUS: number;
    INFORMAL: number;
  };
}

export function AbsenceTypeDistributionChart({
  data,
}: AbsenceTypeDistributionChartProps) {
  const chartData = [
    { name: 'Vacaciones', value: data.VACATION, id: 'vacation' },
    { name: 'Espontáneas', value: data.SPONTANEOUS, id: 'spontaneous' },
    { name: 'Informales', value: data.INFORMAL, id: 'informal' },
  ];

  return (
    <ChartContainer
      config={{
        vacation: {
          label: 'Vacaciones',
          color: 'hsl(var(--chart-1))',
        },
        spontaneous: {
          label: 'Espontáneas',
          color: 'hsl(var(--chart-2))',
        },
        informal: {
          label: 'Informales',
          color: 'hsl(var(--chart-3))',
        },
      }}
    >
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            labelLine={false}
            outerRadius={120}
            fill='#8884d8'
            dataKey='value'
            nameKey='name'
          >
            {chartData.map((entry) => (
              <Cell key={entry.id} fill={`var(--color-${entry.id})`} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
