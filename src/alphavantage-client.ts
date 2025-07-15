import axios from 'axios';
import { CONFIG } from './config.js';
import type { AlphaVantageResponse } from './types.js';

export class AlphaVantageClient {
  private lastRequestTime = 0;

  private async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < CONFIG.RATE_LIMIT_DELAY) {
      const waitTime = CONFIG.RATE_LIMIT_DELAY - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  private async makeRequest(params: Record<string, string>): Promise<AlphaVantageResponse> {
    await this.enforceRateLimit();
    
    try {
      const response = await axios.get(CONFIG.BASE_URL, {
        params: { ...params, apikey: CONFIG.API_KEY },
        timeout: CONFIG.TIMEOUT,
      });

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message']);
      }

      if (response.data['Note']) {
        throw new Error(`API Limit: ${response.data['Note']}`);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Alpha Vantage API Error: ${error.message}`);
      }
      throw error;
    }
  }

  async getQuote(symbol: string): Promise<AlphaVantageResponse> {
    return this.makeRequest({
      function: 'GLOBAL_QUOTE',
      symbol: symbol.toUpperCase(),
    });
  }

  async getTimeSeriesDaily(symbol: string, outputsize: 'compact' | 'full' = 'compact'): Promise<AlphaVantageResponse> {
    return this.makeRequest({
      function: 'TIME_SERIES_DAILY',
      symbol: symbol.toUpperCase(),
      outputsize,
    });
  }

  async getTimeSeriesIntraday(symbol: string, interval: string = '5min'): Promise<AlphaVantageResponse> {
    return this.makeRequest({
      function: 'TIME_SERIES_INTRADAY',
      symbol: symbol.toUpperCase(),
      interval,
    });
  }

  async getTimeSeriesWeekly(symbol: string): Promise<AlphaVantageResponse> {
    return this.makeRequest({
      function: 'TIME_SERIES_WEEKLY',
      symbol: symbol.toUpperCase(),
    });
  }

  async getTimeSeriesMonthly(symbol: string): Promise<AlphaVantageResponse> {
    return this.makeRequest({
      function: 'TIME_SERIES_MONTHLY',
      symbol: symbol.toUpperCase(),
    });
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<AlphaVantageResponse> {
    return this.makeRequest({
      function: 'CURRENCY_EXCHANGE_RATE',
      from_currency: fromCurrency.toUpperCase(),
      to_currency: toCurrency.toUpperCase(),
    });
  }

  async getCryptoDaily(symbol: string, market: string = 'USD'): Promise<AlphaVantageResponse> {
    return this.makeRequest({
      function: 'DIGITAL_CURRENCY_DAILY',
      symbol: symbol.toUpperCase(),
      market: market.toUpperCase(),
    });
  }

  async getTechnicalIndicator(
    symbol: string,
    functionName: string,
    interval: string = 'daily',
    timePeriod?: string,
    seriesType: string = 'close'
  ): Promise<AlphaVantageResponse> {
    const params: Record<string, string> = {
      function: functionName,
      symbol: symbol.toUpperCase(),
      interval,
      series_type: seriesType,
    };

    if (timePeriod) {
      params.time_period = timePeriod;
    }

    return this.makeRequest(params);
  }

  async getNewsSentiment(tickers?: string[], topics?: string[], limit: number = 50): Promise<AlphaVantageResponse> {
    const params: Record<string, string> = {
      function: 'NEWS_SENTIMENT',
      limit: limit.toString(),
    };

    if (tickers && tickers.length > 0) {
      params.tickers = tickers.join(',').toUpperCase();
    }

    if (topics && topics.length > 0) {
      params.topics = topics.join(',');
    }

    return this.makeRequest(params);
  }

  // ==================== 付费版功能 ====================
  
  /**
   * 检查是否为付费版用户
   */
  private checkPremiumAccess(featureName: string) {
    if (CONFIG.SUBSCRIPTION.IS_FREE) {
      throw new Error(`${featureName} requires Premium or Enterprise subscription. Current: ${CONFIG.SUBSCRIPTION.TYPE}`);
    }
  }

  /**
   * 检查是否为企业版用户
   */
  private checkEnterpriseAccess(featureName: string) {
    if (!CONFIG.SUBSCRIPTION.IS_ENTERPRISE) {
      throw new Error(`${featureName} requires Enterprise subscription. Current: ${CONFIG.SUBSCRIPTION.TYPE}`);
    }
  }

  // ==================== 基本面数据 (Premium+) ====================
  
  /**
   * 获取公司概况
   */
  async getCompanyOverview(symbol: string): Promise<AlphaVantageResponse> {
    this.checkPremiumAccess('Company Overview');
    return this.makeRequest({
      function: 'OVERVIEW',
      symbol: symbol.toUpperCase(),
    });
  }

  /**
   * 获取收益报告
   */
  async getEarnings(symbol: string): Promise<AlphaVantageResponse> {
    this.checkPremiumAccess('Earnings Data');
    return this.makeRequest({
      function: 'EARNINGS',
      symbol: symbol.toUpperCase(),
    });
  }

  /**
   * 获取资产负债表
   */
  async getBalanceSheet(symbol: string): Promise<AlphaVantageResponse> {
    this.checkPremiumAccess('Balance Sheet');
    return this.makeRequest({
      function: 'BALANCE_SHEET',
      symbol: symbol.toUpperCase(),
    });
  }

  /**
   * 获取利润表
   */
  async getIncomeStatement(symbol: string): Promise<AlphaVantageResponse> {
    this.checkPremiumAccess('Income Statement');
    return this.makeRequest({
      function: 'INCOME_STATEMENT',
      symbol: symbol.toUpperCase(),
    });
  }

  /**
   * 获取现金流量表
   */
  async getCashFlow(symbol: string): Promise<AlphaVantageResponse> {
    this.checkPremiumAccess('Cash Flow');
    return this.makeRequest({
      function: 'CASH_FLOW',
      symbol: symbol.toUpperCase(),
    });
  }

  // ==================== 高级技术指标 (Premium+) ====================
  
  /**
   * 布林带指标
   */
  async getBollingerBands(
    symbol: string,
    interval: string = 'daily',
    timePeriod: string = '20',
    seriesType: string = 'close',
    nbdevup: string = '2',
    nbdevdn: string = '2'
  ): Promise<AlphaVantageResponse> {
    this.checkPremiumAccess('Bollinger Bands');
    return this.makeRequest({
      function: 'BBANDS',
      symbol: symbol.toUpperCase(),
      interval,
      time_period: timePeriod,
      series_type: seriesType,
      nbdevup,
      nbdevdn,
    });
  }

  /**
   * 随机指标
   */
  async getStochastic(
    symbol: string,
    interval: string = 'daily',
    fastkPeriod: string = '5',
    slowkPeriod: string = '3',
    slowdPeriod: string = '3',
    slowkMatype: string = '0',
    slowdMatype: string = '0'
  ): Promise<AlphaVantageResponse> {
    this.checkPremiumAccess('Stochastic Oscillator');
    return this.makeRequest({
      function: 'STOCH',
      symbol: symbol.toUpperCase(),
      interval,
      fastkperiod: fastkPeriod,
      slowkperiod: slowkPeriod,
      slowdperiod: slowdPeriod,
      slowkmatype: slowkMatype,
      slowdmatype: slowdMatype,
    });
  }

  /**
   * 威廉指标
   */
  async getWilliamsR(
    symbol: string,
    interval: string = 'daily',
    timePeriod: string = '14'
  ): Promise<AlphaVantageResponse> {
    this.checkPremiumAccess('Williams %R');
    return this.makeRequest({
      function: 'WILLR',
      symbol: symbol.toUpperCase(),
      interval,
      time_period: timePeriod,
    });
  }

  /**
   * 平均真实波幅 (ATR)
   */
  async getATR(
    symbol: string,
    interval: string = 'daily',
    timePeriod: string = '14'
  ): Promise<AlphaVantageResponse> {
    this.checkPremiumAccess('Average True Range');
    return this.makeRequest({
      function: 'ATR',
      symbol: symbol.toUpperCase(),
      interval,
      time_period: timePeriod,
    });
  }

  // ==================== 企业版独有功能 ====================
  
  /**
   * 获取期权数据
   */
  async getOptionsData(symbol: string): Promise<AlphaVantageResponse> {
    this.checkEnterpriseAccess('Options Data');
    return this.makeRequest({
      function: 'HISTORICAL_OPTIONS',
      symbol: symbol.toUpperCase(),
    });
  }

  /**
   * 获取ETF持仓数据
   */
  async getETFProfile(symbol: string): Promise<AlphaVantageResponse> {
    this.checkEnterpriseAccess('ETF Profile');
    return this.makeRequest({
      function: 'ETF_PROFILE',
      symbol: symbol.toUpperCase(),
    });
  }

  /**
   * 获取经济指标数据
   */
  async getEconomicIndicator(
    functionName: string,
    interval: string = 'monthly'
  ): Promise<AlphaVantageResponse> {
    this.checkEnterpriseAccess('Economic Indicators');
    return this.makeRequest({
      function: functionName,
      interval,
    });
  }

  /**
   * 获取实时数据 (企业版无延迟)
   */
  async getRealTimeQuote(symbol: string): Promise<AlphaVantageResponse> {
    this.checkEnterpriseAccess('Real-time Data');
    return this.makeRequest({
      function: 'REAL_TIME_QUOTE',
      symbol: symbol.toUpperCase(),
    });
  }

  // ==================== 工具方法 ====================
  
  /**
   * 获取当前订阅信息
   */
  getSubscriptionInfo() {
    return {
      type: CONFIG.SUBSCRIPTION.TYPE,
      isFree: CONFIG.SUBSCRIPTION.IS_FREE,
      isPremium: CONFIG.SUBSCRIPTION.IS_PREMIUM,
      isEnterprise: CONFIG.SUBSCRIPTION.IS_ENTERPRISE,
      limits: CONFIG.LIMITS,
      rateLimit: CONFIG.RATE_LIMIT_DELAY,
    };
  }

  /**
   * 获取可用功能列表
   */
  getAvailableFeatures() {
    const features: {
      basic: string[];
      premium: string[];
      enterprise: string[];
    } = {
      basic: [
        'Stock Quotes',
        'Historical Data',
        'Technical Indicators (SMA, RSI, MACD)',
        'Foreign Exchange',
        'Cryptocurrency',
        'News Sentiment'
      ],
      premium: [],
      enterprise: []
    };

    if (CONFIG.SUBSCRIPTION.IS_PREMIUM || CONFIG.SUBSCRIPTION.IS_ENTERPRISE) {
      features.premium = [
        'Company Overview',
        'Financial Statements',
        'Earnings Data',
        'Advanced Technical Indicators',
        'Real-time Data (15-min delay)'
      ];
    }

    if (CONFIG.SUBSCRIPTION.IS_ENTERPRISE) {
      features.enterprise = [
        'Options Data',
        'ETF Profiles',
        'Economic Indicators',
        'Real-time Data (no delay)',
        'Unlimited API Calls'
      ];
    }

    return features;
  }
}