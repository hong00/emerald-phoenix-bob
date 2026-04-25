"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import type { PortfolioHolding } from '@/types/investment';

interface PortfolioTableProps {
  holdings: PortfolioHolding[];
  onRemove: (id: string) => void;
  onRefreshPrices: () => void;
}

const PortfolioTable = ({ holdings, onRemove, onRefreshPrices }: PortfolioTableProps) => {
  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0);
  const totalReturn = totalValue - totalCost;
  const returnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

  return (
    <Card className="border-2 border-blue-100 dark:border-blue-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Portfolio Holdings</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              <p className={`text-sm ${returnPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}% ({returnPercent >= 0 ? '+' : ''}${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })})
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onRefreshPrices} className="shrink-0">
              Refresh Prices
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No holdings yet. Add your first investment above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Avg Price</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Return</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((h) => {
                  const value = h.shares * h.currentPrice;
                  const cost = h.shares * h.avgPrice;
                  const ret = value - cost;
                  const retPct = cost > 0 ? (ret / cost) * 100 : 0;
                  return (
                    <TableRow key={h.id}>
                      <TableCell className="font-semibold">{h.symbol}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{h.name}</TableCell>
                      <TableCell className="text-right">{h.shares}</TableCell>
                      <TableCell className="text-right">${h.avgPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${h.currentPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right">
                        <span className={`flex items-center justify-end gap-1 ${ret >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {ret >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {retPct.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">{h.assetClass.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => onRemove(h.id)} className="h-8 w-8 text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioTable;