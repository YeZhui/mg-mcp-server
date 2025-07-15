export interface AlphaVantageResponse {
  [key: string]: any;
}

export interface StockQuote {
  symbol: string;
  open: string;
  high: string;
  low: string;
  price: string;
  volume: string;
  latestTradingDay: string;
  previousClose: string;
  change: string;
  changePercent: string;
}

export interface TimeSeriesData {
  [timestamp: string]: {
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  };
}

export interface ExchangeRate {
  fromCurrencyCode: string;
  fromCurrencyName: string;
  toCurrencyCode: string;
  toCurrencyName: string;
  exchangeRate: string;
  lastRefreshed: string;
  timeZone: string;
  bidPrice: string;
  askPrice: string;
}

export interface CryptoData {
  [timestamp: string]: {
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    marketCap?: string;
  };
}

export interface TechnicalIndicator {
  [timestamp: string]: {
    [indicator: string]: string;
  };
}

export interface NewsSentiment {
  title: string;
  url: string;
  timePublished: string;
  authors: string[];
  summary: string;
  bannerImage: string;
  source: string;
  categoryWithinSource: string;
  sourceDomain: string;
  topics: string[];
  overallSentimentScore: number;
  overallSentimentLabel: string;
}

// Yahoo Finance API Types
export interface YahooFinanceResponse {
  [key: string]: any;
}

export interface YahooQuoteResponse {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  currency: string;
  exchangeName: string;
  marketState: string;
}

export interface YahooScreenerResponse {
  results: YahooQuoteResponse[];
  totalCount: number;
  criteria: {
    changePercent?: { min?: number; max?: number };
    volume?: { min?: number };
    marketCap?: { min?: number; max?: number };
    price?: { min?: number; max?: number };
    exchange?: string;
    limit?: number;
  };
}

export interface YahooHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}