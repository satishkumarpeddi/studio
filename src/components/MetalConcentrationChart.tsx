'use client';

import type { Metal } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

type MetalConcentrationChartProps = {
  metals: Metal[];
};

const chartConfig = {
  concentration: {
    label: 'Concentration (mg/L)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function MetalConcentrationChart({ metals }: MetalConcentrationChartProps) {
  const chartData = metals.map((metal) => ({
    name: metal.name.split(' ')[0], // Use short name e.g., "Arsenic"
    concentration: metal.value,
  }));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Metal Concentration Analysis</CardTitle>
        <CardDescription>Visual comparison of heavy metal concentrations in the sample.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="concentration" fill="var(--color-concentration)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
