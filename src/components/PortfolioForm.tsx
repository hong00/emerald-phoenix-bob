"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, TrendingUp } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import type { PortfolioHolding } from '@/types/investment';

interface PortfolioFormProps {
  onAdd: (holding: PortfolioHolding) => void;
}

const PortfolioForm = ({ onAdd }: PortfolioFormProps) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [shares, setShares] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [sector, setSector] = useState('');
  const [assetClass, setAssetClass] = useState<PortfolioHolding['assetClass']>('stock');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !name || !shares || !avgPrice || !sector) return;

    const holding: PortfolioHolding = {
      id: crypto.randomUUID(),
      symbol: symbol.toUpperCase(),
      name,
      shares: parseFloat(shares),
      avgPrice: parseFloat(avgPrice),
      currentPrice: parseFloat(avgPrice),
      sector,
      assetClass,
      purchaseDate: new Date().toISOString().split('T')[0],
    };

    onAdd(holding);
    setSymbol('');
    setName('');
    setShares('');
    setAvgPrice('');
    setSector('');
    showSuccess(`Added ${symbol} to portfolio`);
  };

  return (
    <Card className="border-2 border-emerald-100 dark:border-emerald-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-lg">Add Holding</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input id="symbol" placeholder="AAPL" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Apple Inc." value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shares">Shares</Label>
              <Input id="shares" type="number" step="any" placeholder="10" value={shares} onChange={(e) => setShares(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgPrice">Avg. Price ($)</Label>
              <Input id="avgPrice" type="number" step="0.01" placeholder="150.00" value={avgPrice} onChange={(e) => setAvgPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input id="sector" placeholder="Technology" value={sector} onChange={(e) => setSector(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetClass">Type</Label>
              <Select value={assetClass} onValueChange={(v: PortfolioHolding['assetClass']) => setAssetClass(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="bond">Bond</SelectItem>
                  <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" /> Add to Portfolio
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PortfolioForm;