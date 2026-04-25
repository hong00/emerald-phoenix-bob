"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import type { PortfolioHolding } from '@/types/investment';

interface PerformanceChartProps {
  holdings: PortfolioHolding[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#14b8a6'];

const PerformanceChart = ({ holdings }: PerformanceChartProps) => {
  const sectorData = holdings.reduce((acc, h) => {
    const existing = acc.find(s => s.name === h.sector);
    const value = h.shares * h.currentPrice;
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ name: h.sector, value });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const totalValue = sectorData.reduce((sum, s) => sum + s.value, 0);
  const sectorPercentages = sectorData.map(s => ({ ...s, percentage: totalValue > 0 ? (s.value / totalValue) * 100 : 0 }));

  const returnData = holdings.map(h => {
    const cost = h.shares * h.avgPrice;
    const value = h.shares * h.currentPrice;
    const ret = cost > 0 ? ((value - cost) / cost) * 100 : 0;
    return { name: h.symbol, return: ret };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-2 border-indigo-100 dark:border-indigo-900/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg">Sector Allocation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {sectorPercentages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <PieChartIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No data to display</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorPercentages}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sectorPercentages.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-2 border-emerald-100 dark:border-emerald-900/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg">Returns by Holding</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {returnData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No data to display</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={returnData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Bar dataKey="return" radius={[6, 6, 0, 0]}>
                  {returnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.return >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;