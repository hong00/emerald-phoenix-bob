"use client";

import React, { useState, useEffect } from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import DeepSeekConfig from '@/components/DeepSeekConfig';
import PortfolioForm from '@/components/PortfolioForm';
import PortfolioTable from '@/components/PortfolioTable';
import PreferencesPanel from '@/components/PreferencesPanel';
import AnalysisPanel from '@/components/AnalysisPanel';
import MarketOverview from '@/components/MarketOverview';
import PerformanceChart from '@/components/PerformanceChart';
import TransactionHistory from '@/components/TransactionHistory';
import PortfolioSnapshot from '@/components/PortfolioSnapshot';
import RebalanceSuggestions from '@/components/RebalanceSuggestions';
import AlertCenter from '@/components/AlertCenter';
import ExportData from '@/components/ExportData';
import QuickActions from '@/components/QuickActions';
import type { PortfolioHolding, UserPreferences } from '@/types/investment';
import { Wallet, TrendingUp, LayoutDashboard } from 'lucide-react';

const Index = () => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    const saved = localStorage.getItem('portfolio_holdings');
    return saved ? JSON.parse(saved) : [];
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('user_preferences');
    return saved ? JSON.parse(saved) : {
      riskLevel: 'moderate',
      returnTarget: 10,
      investmentHorizon: 'medium',
      preferredSectors: [],
      maxSinglePosition: 20,
      rebalanceFrequency: 'quarterly',
    };
  });

  useEffect(() => {
    localStorage.setItem('portfolio_holdings', JSON.stringify(holdings));
  }, [holdings]);

  const addHolding = (holding: PortfolioHolding) => {
    setHoldings([...holdings, holding]);
  };

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  const refreshPrices = () => {
    setHoldings(holdings.map(h => ({
      ...h,
      currentPrice: h.avgPrice * (1 + (Math.random() - 0.5) * 0.1),
    })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-violet-50/30 dark:from-gray-950 dark:via-indigo-950/20 dark:to-violet-950/20">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                InvestWise
              </h1>
              <p className="text-sm text-gray-500">AI-Powered Investment Portfolio Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <LayoutDashboard className="h-4 w-4" />
              <span>{holdings.length} holdings</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-emerald-600">
                ${holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* DeepSeek Config */}
        <DeepSeekConfig />

        {/* Market Overview */}
        <MarketOverview />

        {/* Portfolio Performance Chart */}
        <PortfolioSnapshot holdings={holdings} />

        {/* Alerts */}
        <AlertCenter holdings={holdings} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PortfolioForm onAdd={addHolding} />
            <PortfolioTable holdings={holdings} onRemove={removeHolding} onRefreshPrices={refreshPrices} />
            <PerformanceChart holdings={holdings} />
            <TransactionHistory />
            <ExportData holdings={holdings} />
          </div>
          <div className="space-y-6">
            <QuickActions onRefreshPrices={refreshPrices} holdingsCount={holdings.length} />
            <PreferencesPanel />
            <RebalanceSuggestions holdings={holdings} preferences={preferences} />
            <AnalysisPanel holdings={holdings} preferences={preferences} />
          </div>
        </div>

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;