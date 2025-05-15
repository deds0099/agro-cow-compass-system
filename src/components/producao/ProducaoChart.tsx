
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProducaoData {
  data: string;
  manha: number;
  tarde: number;
  noite: number;
  total: number;
}

interface ProducaoChartProps {
  dados: ProducaoData[];
  title?: string;
  height?: number;
}

export function ProducaoChart({ dados, title = "Produção de Leite", height = 300 }: ProducaoChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis unit="L" />
            <Tooltip 
              formatter={(value) => [`${value} litros`, ""]}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend />
            <Bar dataKey="manha" name="Manhã" fill="#4CAF50" />
            <Bar dataKey="tarde" name="Tarde" fill="#2196F3" />
            <Bar dataKey="noite" name="Noite" fill="#673AB7" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
