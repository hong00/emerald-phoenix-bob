"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { MarketData } from '@/types/investment';

const WATCHLIST = [
  { symbol: 'SPY', name: 'S&P 500 ETF' },
  { symbol: 'QQQ', name: 'Nasdaq ETF' },
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
];

const generateMockPrice = (symbol: string, basePrice?: number) => {
  const prices: Record<string, number> = {
    SPY: 540, QQQ: 470, BTC: 67000, AAPL: 225, MSFT: 430, GOOGL: 175,
  };
  const base = basePrice || prices[symbol] || 100;
  const change = (Math.random() - 0.5) * base * 0.04;
  return {
    price: base + change,
    change,
    changePercent: (change / base) * 100,
  };
};

const MarketOverview = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  useEffect(() => {
    const updatePrices = () => {
      setMarketData(
        WATCHLIST.map((w) => {
          const { price, change, changePercent } = generateMockPrice(w.symbol);
          return {
            symbol: w.symbol,
            price,
            change,
            changePercent,
            volume: Math.floor(Math.random() * 10000000),
            high52w: price * 1.2,
            low52w: price * 0.8,
            marketCap: price * Math.floor(Math.random() * 100000<dyad-write path="src/components/MarketOverview.tsx" description="Live market data overview with simulated prices">
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { MarketData } from '@/types/investment';

const WATCHLIST = [
  { symbol: 'SPY', name: 'S&P 500 ETF' },
  { symbol: 'QQQ', name: 'Nasdaq ETF' },
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
];

const generateMockPrice = (symbol: string, basePrice?: number) => {
  const prices: Record<string, number> = {
    SPY: 540, QQQ: 470, BTC: 67000, AAPL: 225, MSFT: 430, GOOGL: 175,
  };
  const base = basePrice || prices[symbol] || 100;
  const change = (Math.random() - 0.5) * base * 0.04;
  return {
    price: base + change,
    change,
    changePercent: (change / base) * 100,
  };
};

const MarketOverview = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  useEffect(() => {
    const updatePrices = () => {
      setMarketData(
        WATCHLIST.map((w) => {
          const { price, change, changePercent } = generateMockPrice(w.symbol);
          return {
            symbol: w.symbol,
            price,
            change,
            changePercent,
            volume: Math.floor(Math.random() * 10000000),
            high52w: price * 1.2,
            low52w: price * 0.8,
            marketCap: price * Math.floor(Math.random() * 100000000),
            pe: Math.random() * 30 + 10,
            dividend: Math.random() * 3,
          };
        })
      );
    };

    updatePrices();
    const interval = setInterval(updatePrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-2 border-cyan-100 dark:border-cyan-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-600" />
          <CardTitle className="text-lg">Market Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {marketData.map((m) => (
            <div key={m.symbol} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{m.symbol}</span>
                <Badge variant={m.changePercent >= 0 ? 'default' : 'destructive'} className={`text-xs ${m.changePercent >= 0 ? 'bg-emerald-100 text-emerald-700' : ''}`}>
                  {m.changePercent >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {m.changePercent >= 0 ? '+' : ''}{m.changePercent.toFixed(2)}%
                </Badge>
              </div>
              <p className="text-lg font-bold">${m.price.toFixed(2)}</p>
              <p className="text-xs text-gray-400">Vol: {(m.volume / 1000000).toFixed(1)}M</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;