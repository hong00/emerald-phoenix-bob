"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Brain, BarChart3, AlertTriangle, Lightbulb, Loader2, PieChart, TrendingUp } from 'lucide-react';
import { showError } from '@/utils/toast';
import type { PortfolioHolding, AnalysisResult, UserPreferences } from '@/types/investment';

interface AnalysisPanelProps {
  holdings: PortfolioHolding[];
  preferences: UserPreferences;
}

const AnalysisPanel = ({ holdings, preferences }: AnalysisPanelProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getApiKey = () => localStorage.getItem('deepseek_api_key');

  const runAnalysis = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      showError('Please configure your DeepSeek API key first.');
      return;
    }

    if (holdings.length === 0) {
      showError('Add some holdings to your portfolio first.');
      return;
    }

    setIsLoading(true);

    const portfolioSummary = holdings.map(h => 
      `${h.shares} shares of ${h.symbol} (${h.name}) at avg $${h.avgPrice}, current $${h.currentPrice} - ${h.sector}`
    ).join('\n');

    const prompt = `You are a professional financial advisor. Analyze this investment portfolio and provide recommendations.

User Preferences:
- Risk Level: ${preferences.riskLevel}
- Return Target: ${preferences.returnTarget}%
- Investment Horizon: ${preferences.investmentHorizon}
- Preferred Sectors: ${preferences.preferredSectors.join(', ') || 'None specified'}
- Max Single Position: ${preferences.maxSinglePosition}%
- Rebalance Frequency: ${preferences.rebalanceFrequency}

Portfolio Holdings:
${portfolioSummary}

Provide analysis in this exact JSON format (no markdown, no code blocks):
{
  "summary": "2-3 sentence portfolio summary",
  "recommendations": ["3-4 specific actionable recommendations"],
  "riskAssessment": "1-2 sentence risk assessment",
  "diversificationScore": number between 0-100,
  "sectorAllocation": [{"sector": "Technology", "percentage": 40}],
  "performanceMetrics": {
    "totalReturn": number,
    "annualizedReturn": number,
    "volatility": number,
    "sharpeRatio": number
  }
}`;

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setAnalysis(result);
      } else {
        throw new Error('Could not parse analysis');
      }
    } catch (error) {
      showError('Analysis failed. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-amber-100 dark:border-amber-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">AI Analysis</CardTitle>
          </div>
          <Button
            onClick={runAnalysis}
            disabled={isLoading || holdings.length === 0}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><BarChart3 className="h-4 w-4 mr-2" /> Run Analysis</>
            )}
          </Button>
        </div>
        <CardDescription>DeepSeek AI analyzes your portfolio and provides recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis && !isLoading && (
          <div className="text-center py-8 text-gray-400">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Click "Run Analysis" to get AI-powered insights on your portfolio.</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-amber-600" />
            <p className="text-gray-500">Analyzing your portfolio with DeepSeek AI...</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-amber-600" /> Summary
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{analysis.summary}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Diversification</p>
                <Progress value={analysis.diversificationScore} className="h-2 mb-1" />
                <span className="text-sm font-semibold">{analysis.diversificationScore}/100</span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Return</p>
                <p className="text-sm font-semibold text-emerald-600">+{analysis.performanceMetrics.totalReturn.toFixed(1)}%</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Volatility</p>
                <p className="text-sm font-semibold">{analysis.performanceMetrics.volatility.toFixed(1)}%</p>
              </div>
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Sharpe Ratio</p>
                <p className="text-sm font-semibold">{analysis.performanceMetrics.sharpeRatio.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-amber-600" /> Sector Allocation
              </h4>
              <div className="space-y-2">
                {analysis.sectorAllocation.map((s) => (
                  <div key={s.sector} className="flex items-center gap-3">
                    <span className="text-sm w-24 shrink-0">{s.sector}</span>
                    <Progress value={s.percentage} className="h-2 flex-1" />
                    <span className="text-sm font-medium w-12 text-right">{s.percentage.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> Risk Assessment
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{analysis.riskAssessment}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600" /> Recommendations
              </h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5 shrink-0 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200">
                      #{i + 1}
                    </Badge>
                    <span className="text-gray-600 dark:text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisPanel;