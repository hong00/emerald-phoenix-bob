"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import type { Transaction } from '@/types/investment';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'buy' as 'buy' | 'sell', symbol: '', shares: '', price: '', notes: '' });

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: form.type,
      symbol: form.symbol.toUpperCase(),
      shares: parseFloat(form.shares),
      price: parseFloat(form.price),
      total: parseFloat(form.shares) * parseFloat(form.price),
      date: new Date().toISOString().split('T')[0],
      notes: form.notes,
    };
    const updated = [tx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
    setForm({ type: 'buy', symbol: '', shares: '', price: '', notes: '' });
    setOpen(false);
    showSuccess('Transaction recorded');
  };

  return (
    <Card className="border-2 border-rose-100 dark:border-rose-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-rose-600" />
            <CardTitle className="text-lg">Transaction History</CardTitle>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                <Plus className="h-4 w-4 mr-1" /> Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={addTransaction} className="space-y-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v: 'buy' | 'sell') => setForm({ ...form, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Symbol</Label>
                  <Input placeholder="AAPL" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Shares</Label>
                    <Input type="number" step="any" placeholder="10" value={form.shares} onChange={(e) => setForm({ ...form, shares: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input type="number" step="0.01" placeholder="150.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Input placeholder="Reason for trade..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">Record Transaction</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-sm">{tx.date}</TableCell>
                    <TableCell>
                      <Badge variant={tx.type === 'buy' ? 'default' : 'destructive'} className={tx.type === 'buy' ? 'bg-emerald-100 text-emerald-700' : ''}>
                        {tx.type === 'buy' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                        {tx.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{tx.symbol}</TableCell>
                    <TableCell className="text-right">{tx.shares}</TableCell>
                    <TableCell className="text-right">${tx.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${tx.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-sm text-gray-400 max-w-[120px] truncate">{tx.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;