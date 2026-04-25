"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Sliders, Target, Shield, Clock, X } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import type { UserPreferences } from '@/types/investment';

const SECTOR_OPTIONS = [
  'Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer Goods',
  'Real Estate', 'Utilities', 'Materials', 'Communication', 'Industrial'
];

const PreferencesPanel = () => {
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
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

  const [sectorInput, setSectorInput] = useState('');

  useEffect(() => {
    localStorage.setItem('user_preferences', JSON.stringify(prefs));
  }, [prefs]);

  const addSector = (sector: string) => {
    if (!prefs.preferredSectors.includes(sector)) {
      setPrefs({ ...prefs, preferredSectors: [...prefs.preferredSectors, sector] });
    }
    setSectorInput('');
  };

  const removeSector = (sector: string) => {
    setPrefs({ ...prefs, preferredSectors: prefs.preferredSectors.filter(s => s !== sector) });
  };

  const save = () => {
    localStorage.setItem('user_preferences', JSON.stringify(prefs));
    showSuccess('Preferences saved!');
  };

  return (
    <Card className="border-2 border-violet-100 dark:border-violet-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-violet-600" />
          <CardTitle className="text-lg">Investment Preferences</CardTitle>
        </div>
        <CardDescription>Set your risk tolerance, return targets, and sector preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-violet-500" /> Risk Level
            </Label>
            <Select value={prefs.riskLevel} onValueChange={(v: UserPreferences['riskLevel']) => setPrefs({ ...prefs, riskLevel: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-violet-500" /> Investment Horizon
            </Label>
            <Select value={prefs.investmentHorizon} onValueChange={(v: UserPreferences['investmentHorizon']) => setPrefs({ ...prefs, investmentHorizon: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short-term (<1 year)</SelectItem>
                <SelectItem value="medium">Medium-term (1-5 years)</SelectItem>
                <SelectItem value="long">Long-term (5+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-500" /> Return Target: {prefs.returnTarget}%
            </Label>
            <Slider
              value={[prefs.returnTarget]}
              onValueChange={([v]) => setPrefs({ ...prefs, returnTarget: v })}
              min={1}
              max={50}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Max Single Position: {prefs.maxSinglePosition}%</Label>
            <Slider
              value={[prefs.maxSinglePosition]}
              onValueChange={([v]) => setPrefs({ ...prefs, maxSinglePosition: v })}
              min={5}
              max={50}
              step={5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rebalance Frequency</Label>
            <Select value={prefs.rebalanceFrequency} onValueChange={(v: UserPreferences['rebalanceFrequency']) => setPrefs({ ...prefs, rebalanceFrequency: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preferred Sectors</Label>
            <div className="flex gap-2">
              <Select value={sectorInput} onValueChange={setSectorInput}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Add sector..." />
                </SelectTrigger>
                <SelectContent>
                  {SECTOR_OPTIONS.filter(s => !prefs.preferredSectors.includes(s)).map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => sectorInput && addSector(sectorInput)} disabled={!sectorInput}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {prefs.preferredSectors.map(s => (
                <Badge key={s} variant="secondary" className="cursor-pointer" onClick={() => removeSector(s)}>
                  {s} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={save} className="w-full bg-violet-600 hover:bg-violet-700">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default PreferencesPanel;