"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, TrendingUp, TrendingDown, Minus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import type { PortfolioHolding, UserPreferences, RebalanceSuggestion } from '@/types/investment';

interface RebalanceSuggestionsProps {
  holdings: PortfolioHolding[];
  preferences: UserPreferences;
}

const RebalanceSuggestions = ({ holdings, preferences }: RebalanceSuggestionsProps) => {
  const suggestions = useMemo(() => {
    if (holdings.length === 0) return [];

    const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
    const targetPerHolding = 100 / holdings.length;

    return holdings.map(h => {
      const currentAllocation = totalValue > 0 ? ((h.shares * h.currentPrice) / totalValue) * 100 : 0;
      const diff = currentAllocation - targetPerHolding;
      const threshold = preferences.maxSinglePosition;

      let action: 'buy' | 'sell' | 'hold' = 'hold';
      let reason = '';

      if (currentAllocation > threshold) {
        action = 'sell';
        reason = `Exceeds max position limit of ${threshold}%`;
      } else if (currentAllocation < targetPerHolding * 0.5 && holdings.length > 1) {
        action = 'buy';
        reason = `Below target allocation of ${targetPerHolding.toFixed(0)}%`;
      } else {
        reason = 'Within acceptable range';
      }

      const amount = Math.abs(diff) * totalValue / 100;

      return {
        symbol: h.symbol,
        name: h.name,
        currentAllocation,
        targetAllocation: targetPerHolding,
        action,
        amount,
        reason,
      } as RebalanceSuggestion;
    }).sort((a, b) => {
      const order = { sell: 0, buy: 1, hold: 2 };
      return order[a.action] - order[b.action];
    });
  }, [holdings, preferences]);

  const applySuggestion = (suggestion: RebalanceSuggestion) => {
    showSuccess(`${suggestion.action === 'buy' ? 'Buy' : 'Sell'} $${suggestion.amount.toFixed(2)} of ${suggestion.symbol}`);
  };

  if (holdings.length === 0) return null;

  return (
    <Card className="border-2 border-orange-100 dark:border-orange-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-lg">Rebalance Suggestions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((s) => (
          <div key={s.symbol} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{s.symbol}</span>
                <span className="text-xs text-gray-400">{s.name}</span>
              </div>
              <Badge variant={s.action === 'sell' ? 'destructive' : s.action === 'buy' ? 'default' : 'secondary'}
                className={s.action === 'buy' ? 'bg-emerald-100 text-emerald-700' : s.action === 'sell' ? '' : ''}>
                {s.action === 'buy' ? <ArrowUpCircle className="h-3 w-3 mr-1" /> : 
                 s.action === 'sell' ? <ArrowDownCircle className="h-3 w-3 mr-1" /> : 
                 <Minus className="h-3 w-3 mr-1" />}
                {s.action.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs text-gray-400 w-20">Current: {s.currentAllocation.toFixed(1)}%</span>
              <Progress value={s.currentAllocation} className="h-2 flex-1" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Target: {s.targetAllocation.toFixed(1)}%</span>
              <span className="text-xs text-gray-500">{s.reason}</span>
            </div>
            {s.action !== 'hold' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => applySuggestion(s)}
                className="mt-2 w-full text-xs"
              >
                {s.action === 'buy' ? 'Buy' : 'Sell'} ${s.amount.toFixed(2)}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RebalanceSuggestions;