"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import type { PortfolioHolding, Transaction } from '@/types/investment';

interface ExportDataProps {
  holdings: PortfolioHolding[];
}

const ExportData = ({ holdings }: ExportDataProps) => {
  const exportToCSV = () => {
    if (holdings.length === 0) {
      showSuccess('No data to export');
      return;
    }

    const headers = ['Symbol', 'Name', 'Shares', 'Avg Price', 'Current Price', 'Value', 'Cost', 'Return %', 'Sector', 'Type', 'Purchase Date'];
    const rows = holdings.map(h => [
      h.symbol,
      h.name,
      h.shares.toString(),
      h.avgPrice.toFixed(2),
      h.currentPrice.toFixed(2),
      (h.shares * h.currentPrice).toFixed(2),
      (h.shares * h.avgPrice).toFixed(2),
      (((h.currentPrice - h.avgPrice) / h.avgPrice) * 100).toFixed(2),
      h.sector,
      h.assetClass,
      h.purchaseDate,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Portfolio exported to CSV');
  };

  const exportSummary = () => {
    if (holdings.length === 0) return;

    const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
    const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0);
    const totalReturn = totalValue - totalCost;
    const returnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    const summary = [
      `Portfolio Summary - ${new Date().toLocaleDateString()}`,
      '',
      `Total Holdings: ${holdings.length}`,
      `Total Value: $${totalValue.toFixed(2)}`,
      `Total Cost: $${totalCost.toFixed(2)}`,
      `Total Return: $${totalReturn.toFixed(2)} (${returnPercent.toFixed(2)}%)`,
      '',
      'Holdings:',
      ...holdings.map(h => 
        `${h.symbol}: ${h.shares} shares @ $${h.currentPrice.toFixed(2)} = $${(h.shares * h.currentPrice).toFixed(2)}`
      ),
    ].join('\n');

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_summary_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Summary exported');
  };

  return (
    <Card className="border-2 border-teal-100 dark:border-teal-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-teal-600" />
          <CardTitle className="text-lg">Export Data</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Button onClick={exportToCSV} variant="outline" className="flex-1" disabled={holdings.length === 0}>
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={exportSummary} variant="outline" className="flex-1" disabled={holdings.length === 0}>
            <FileText className="h-4 w-4 mr-2" /> Export Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportData;