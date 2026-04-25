"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import type { PortfolioHolding, PortfolioSnapshot } from '@/types/investment';

interface PortfolioSnapshotProps {
  holdings: PortfolioHolding[];
}

const PortfolioSnapshot = ({ holdings }: PortfolioSnapshotProps) => {
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>(() => {
    const saved = localStorage.getItem('portfolio_snapshots');
    return saved ? JSON.parse(saved) : [];
  });

  // Take a snapshot on mount and when holdings change
  useEffect(() => {
    if (holdings.length === 0) return;
    
    const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
    const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0);
    
    const newSnapshot: PortfolioSnapshot = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      totalValue,
      totalCost,
      holdingsCount: holdings.length,
    };

    setSnapshots(prev => {
      const existing = prev.filter(s => s.date !== newSnapshot.date);
      const updated = [...existing, newSnapshot].slice(-30); // Keep last 30 days
      localStorage.setItem('portfolio_snapshots', JSON.stringify(updated));
      return updated;
    });
  }, [holdings]);

  const chartData = snapshots.map(s => ({
    date: s.date,
    value: s.totalValue,
    cost: s.totalCost,
    profit: s.totalValue - s.totalCost,
  }));

  const latestValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
  const latestCost = chartData.length > 0 ? chartData[chartData.length - 1].cost : 0;
  const totalReturn = latestCost > 0 ? ((latestValue - latestCost) / latestCost) * 100 : 0;

  return (
    <Card className="border-2 border-purple-100 dark:border-purple-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Portfolio Performance</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Total Return</p>
            <p className={`text-lg font-bold ${totalReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length < 2 ? (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Portfolio performance data will appear here over time.</p>
            <p className="text-xs mt-1">Check back after tracking your holdings for a few days.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, '']}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#colorValue)" strokeWidth={2} />
              <Line type="monotone" dataKey="cost" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioSnapshot;