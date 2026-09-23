"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface PriceChartProps {
  currentValue: number;
}

export function PriceChart({ currentValue }: PriceChartProps) {
  // Mock data representing a 6-month depreciation trend
  const data = [
    { month: "Jan", price: Math.round(currentValue * 1.15) },
    { month: "Feb", price: Math.round(currentValue * 1.12) },
    { month: "Mar", price: Math.round(currentValue * 1.08) },
    { month: "Apr", price: Math.round(currentValue * 1.05) },
    { month: "May", price: Math.round(currentValue * 1.02) },
    { month: "Jun", price: currentValue },
  ];

  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="month" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            formatter={(value: any) => [`₹${value || 0}`, "Est. Value"]}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
