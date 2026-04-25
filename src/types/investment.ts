export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
  assetClass: 'stock' | 'etf' | 'crypto' | 'bond' | 'mutual_fund';
  purchaseDate: string;
}

export interface UserPreferences {
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  returnTarget: number;
  investmentHorizon: 'short' | 'medium' | 'long';
  preferredSectors: string[];
  maxSinglePosition: number;
  rebalanceFrequency: 'monthly' | 'quarterly' | 'yearly';
}

export interface AnalysisResult {
  summary: string;
  recommendations: string[];
  riskAssessment: string;
  diversificationScore: number;
  sectorAllocation: { sector: string; percentage: number }[];
  performanceMetrics: {
    totalReturn: number;
    annualizedReturn: number;
    volatility: number;
    sharpeRatio: number;
  };
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high52w: number;
  low52w: number;
  marketCap: number;
  pe: number;
  dividend: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  shares: number;
  price: number;
  total: number;
  date: string;
  notes?: string;
}