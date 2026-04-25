"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, CheckCheck } from 'lucide-react';
import type { Alert } from '@/types/investment';

interface AlertCenterProps {
  holdings: { symbol: string; currentPrice: number; avgPrice: number }[];
}

const AlertCenter = ({ holdings }: AlertCenterProps) => {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('portfolio_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const newAlerts: Alert[] = [];
    
    holdings.forEach(h => {
      const change = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
      
      if (Math.abs(change) > 10) {
        newAlerts.push({
          id: crypto.randomUUID(),
          type: change > 0 ? 'success' : 'error',
          message: `${h.symbol} moved ${change > 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(1)}% from your average price`,
          date: new Date().toISOString(),
          read: false,
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => {
        const updated = [...newAlerts, ...prev].slice(0, 20);
        localStorage.setItem('portfolio_alerts', JSON.stringify(updated));
        return updated;
      });
    }
  }, [holdings]);

  const markAllRead = () => {
    const updated = alerts.map(a => ({ ...a, read: true }));
    setAlerts(updated);
    localStorage.setItem('portfolio_alerts', JSON.stringify(updated));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="border-2 border-sky-100 dark:border-sky-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-sky-600" />
            <CardTitle className="text-lg">Alerts</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-sky-100 text-sky-700">{unreadCount} new</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
              <CheckCheck className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <Bell className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {alerts.slice(0, 10).map((alert) => (
              <div key={alert.id} className={`flex items-start gap-3 p-2 rounded-lg ${alert.read ? 'opacity-60' : 'bg-sky-50 dark:bg-sky-900/20'}`}>
                {getIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(alert.date).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertCenter;