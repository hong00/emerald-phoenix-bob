"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Trash2, AlertTriangle } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface QuickActionsProps {
  onRefreshPrices: () => void;
  holdingsCount: number;
}

const QuickActions = ({ onRefreshPrices, holdingsCount }: QuickActionsProps) => {
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all portfolio data? This cannot be undone.')) {
      localStorage.removeItem('portfolio_holdings');
      localStorage.removeItem('portfolio_snapshots');
      localStorage.removeItem('portfolio_alerts');
      localStorage.removeItem('transactions');
      localStorage.removeItem('user_preferences');
      showSuccess('All data cleared. Refreshing...');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onRefreshPrices} className="h-auto py-3 flex-col gap-1">
            <RefreshCw className="h-5 w-5" />
            <span className="text-xs">Refresh Prices</span>
          </Button>
          <Button variant="outline" disabled={holdingsCount === 0} className="h-auto py-3 flex-col gap-1">
            <Download className="h-5 w-5" />
            <span className="text-xs">Export</span>
          </Button>
          <Button variant="outline" disabled className="h-auto py-3 flex-col gap-1 opacity-50">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-xs">Backup</span>
          </Button>
          <Button variant="outline" onClick={clearAllData} className="h-auto py-3 flex-col gap-1 text-red-500 hover:text-red-600 hover:border-red-300">
            <Trash2 className="h-5 w-5" />
            <span className="text-xs">Clear All</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;