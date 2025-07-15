import { z } from 'zod';
import { AlphaVantageClient } from './alphavantage-client.js';
import { CONFIG } from './config.js';

const client = new AlphaVantageClient();

export const tools = {
  // Stock Tools
  get_stock_quote: {
    description: 'Get real-time stock quote for a symbol',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol (e.g., AAPL, MSFT, GOOGL)'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      const data = await client.getQuote(symbol);
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'],
        price: quote['05. price'],
        change: quote['09. change'],
        changePercent: quote['10. change percent'],
        volume: quote['06. volume'],
        latestTradingDay: quote['07. latest trading day'],
        open: quote['02. open'],
        high: quote['03. high'],
        low: quote['04. low'],
        previousClose: quote['08. previous close'],
      };
    },
  },

  get_stock_daily: {
    description: 'Get daily historical stock data',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
      outputsize: z.enum(['compact', 'full']).optional().default('compact'),
    }),
    execute: async ({ symbol, outputsize }: { symbol: string; outputsize?: 'compact' | 'full' }) => {
      const data = await client.getTimeSeriesDaily(symbol, outputsize);
      const timeSeries = data['Time Series (Daily)'];
      return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        date,
        open: values['1. open'],
        high: values['2. high'],
        low: values['3. low'],
        close: values['4. close'],
        volume: values['5. volume'],
      }));
    },
  },

  get_stock_intraday: {
    description: 'Get intraday stock data with customizable intervals',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
      interval: z.enum(['1min', '5min', '15min', '30min', '60min']).optional().default('5min'),
    }),
    execute: async ({ symbol, interval }: { symbol: string; interval?: string }) => {
      const data = await client.getTimeSeriesIntraday(symbol, interval);
      const key = `Time Series (${interval})`;
      const timeSeries = data[key];
      return Object.entries(timeSeries).map(([datetime, values]: [string, any]) => ({
        datetime,
        open: values['1. open'],
        high: values['2. high'],
        low: values['3. low'],
        close: values['4. close'],
        volume: values['5. volume'],
      }));
    },
  },

  get_stock_weekly: {
    description: 'Get weekly historical stock data',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      const data = await client.getTimeSeriesWeekly(symbol);
      const timeSeries = data['Weekly Time Series'];
      return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        date,
        open: values['1. open'],
        high: values['2. high'],
        low: values['3. low'],
        close: values['4. close'],
        volume: values['5. volume'],
      }));
    },
  },

  get_stock_monthly: {
    description: 'Get monthly historical stock data',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      const data = await client.getTimeSeriesMonthly(symbol);
      const timeSeries = data['Monthly Time Series'];
      return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        date,
        open: values['1. open'],
        high: values['2. high'],
        low: values['3. low'],
        close: values['4. close'],
        volume: values['5. volume'],
      }));
    },
  },

  // Forex Tools
  get_exchange_rate: {
    description: 'Get current exchange rate between two currencies',
    parameters: z.object({
      fromCurrency: z.string().describe('Source currency code (e.g., USD, EUR, JPY)'),
      toCurrency: z.string().describe('Target currency code (e.g., USD, EUR, JPY)'),
    }),
    execute: async ({ fromCurrency, toCurrency }: { fromCurrency: string; toCurrency: string }) => {
      const data = await client.getExchangeRate(fromCurrency, toCurrency);
      const rate = data['Realtime Currency Exchange Rate'];
      return {
        fromCurrency: rate['1. From_Currency Code'],
        toCurrency: rate['3. To_Currency Code'],
        rate: rate['5. Exchange Rate'],
        lastRefreshed: rate['6. Last Refreshed'],
        timeZone: rate['7. Time Zone'],
        bidPrice: rate['8. Bid Price'],
        askPrice: rate['9. Ask Price'],
      };
    },
  },

  // Crypto Tools
  get_crypto_daily: {
    description: 'Get daily cryptocurrency data',
    parameters: z.object({
      symbol: z.string().describe('Cryptocurrency symbol (e.g., BTC, ETH, ADA)'),
      market: z.string().optional().default('USD'),
    }),
    execute: async ({ symbol, market }: { symbol: string; market?: string }) => {
      const data = await client.getCryptoDaily(symbol, market);
      const timeSeries = data['Time Series (Digital Currency Daily)'];
      return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
        date,
        open: values['1a. open'],
        high: values['2a. high'],
        low: values['3a. low'],
        close: values['4a. close'],
        volume: values['5. volume'],
        marketCap: values['6. market cap (USD)'],
      }));
    },
  },

  // Technical Indicators
  get_sma: {
    description: 'Get Simple Moving Average (SMA) technical indicator',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
      interval: z.enum(['1min', '5min', '15min', '30min', '60min', 'daily', 'weekly', 'monthly']).optional().default('daily'),
      timePeriod: z.string().optional().default('20'),
      seriesType: z.enum(['open', 'high', 'low', 'close']).optional().default('close'),
    }),
    execute: async ({ symbol, interval, timePeriod, seriesType }: any) => {
      const data = await client.getTechnicalIndicator(symbol, 'SMA', interval, timePeriod, seriesType);
      const key = `Technical Analysis: SMA`;
      const smaData = data[key];
      return Object.entries(smaData).map(([date, values]: [string, any]) => ({
        date,
        sma: values.SMA,
      }));
    },
  },

  get_rsi: {
    description: 'Get Relative Strength Index (RSI) technical indicator',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
      interval: z.enum(['1min', '5min', '15min', '30min', '60min', 'daily', 'weekly', 'monthly']).optional().default('daily'),
      timePeriod: z.string().optional().default('14'),
      seriesType: z.enum(['open', 'high', 'low', 'close']).optional().default('close'),
    }),
    execute: async ({ symbol, interval, timePeriod, seriesType }: any) => {
      const data = await client.getTechnicalIndicator(symbol, 'RSI', interval, timePeriod, seriesType);
      const key = `Technical Analysis: RSI`;
      const rsiData = data[key];
      return Object.entries(rsiData).map(([date, values]: [string, any]) => ({
        date,
        rsi: values.RSI,
      }));
    },
  },

  get_macd: {
    description: 'Get MACD technical indicator',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
      interval: z.enum(['1min', '5min', '15min', '30min', '60min', 'daily', 'weekly', 'monthly']).optional().default('daily'),
      seriesType: z.enum(['open', 'high', 'low', 'close']).optional().default('close'),
    }),
    execute: async ({ symbol, interval, seriesType }: any) => {
      const data = await client.getTechnicalIndicator(symbol, 'MACD', interval, undefined, seriesType);
      const key = `Technical Analysis: MACD`;
      const macdData = data[key];
      return Object.entries(macdData).map(([date, values]: [string, any]) => ({
        date,
        macd: values.MACD,
        signal: values.MACD_Signal,
        histogram: values.MACD_Hist,
      }));
    },
  },

  // News Sentiment
  get_news_sentiment: {
    description: 'Get news sentiment for stocks or topics',
    parameters: z.object({
      tickers: z.array(z.string()).optional().describe('Array of stock symbols'),
      topics: z.array(z.string()).optional().describe('Array of news topics'),
      limit: z.number().min(1).max(1000).optional().default(50),
    }),
    execute: async ({ tickers, topics, limit }: { tickers?: string[]; topics?: string[]; limit?: number }) => {
      const data = await client.getNewsSentiment(tickers, topics, limit);
      return {
        items: data.feed?.map((item: any) => ({
          title: item.title,
          url: item.url,
          timePublished: item.time_published,
          authors: item.authors,
          summary: item.summary,
          source: item.source,
          sentimentScore: item.overall_sentiment_score,
          sentimentLabel: item.overall_sentiment_label,
          tickers: item.ticker_sentiment?.map((t: any) => ({
            ticker: t.ticker,
            relevance: t.relevance_score,
            sentiment: t.ticker_sentiment_score,
          })),
        })),
      };
    },
  },

  // ==================== 付费版功能 (Premium+) ====================
  
  // 基本面数据工具
  get_company_overview: {
    description: 'Get company overview and fundamental data (Premium+ only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      const data = await client.getCompanyOverview(symbol);
      return {
        symbol: data.Symbol,
        name: data.Name,
        description: data.Description,
        sector: data.Sector,
        industry: data.Industry,
        marketCap: data.MarketCapitalization,
        peRatio: data.PERatio,
        pegRatio: data.PEGRatio,
        bookValue: data.BookValue,
        dividendPerShare: data.DividendPerShare,
        dividendYield: data.DividendYield,
        eps: data.EPS,
        revenuePerShareTTM: data.RevenuePerShareTTM,
        profitMargin: data.ProfitMargin,
        operatingMarginTTM: data.OperatingMarginTTM,
        returnOnAssetsTTM: data.ReturnOnAssetsTTM,
        returnOnEquityTTM: data.ReturnOnEquityTTM,
        revenueTTM: data.RevenueTTM,
        grossProfitTTM: data.GrossProfitTTM,
        dilutedEPSTTM: data.DilutedEPSTTM,
        quarterlyEarningsGrowthYOY: data.QuarterlyEarningsGrowthYOY,
        quarterlyRevenueGrowthYOY: data.QuarterlyRevenueGrowthYOY,
        analystTargetPrice: data.AnalystTargetPrice,
        trailingPE: data.TrailingPE,
        forwardPE: data.ForwardPE,
        priceToSalesRatioTTM: data.PriceToSalesRatioTTM,
        priceToBookRatio: data.PriceToBookRatio,
        evToRevenue: data.EVToRevenue,
        evToEBITDA: data.EVToEBITDA,
        beta: data.Beta,
        week52High: data['52WeekHigh'],
        week52Low: data['52WeekLow'],
        day50MovingAverage: data['50DayMovingAverage'],
        day200MovingAverage: data['200DayMovingAverage'],
        sharesOutstanding: data.SharesOutstanding,
      };
    },
  },

  get_earnings: {
    description: 'Get earnings data for a company (Premium+ only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      const data = await client.getEarnings(symbol);
      return {
        symbol: data.symbol,
        annualEarnings: data.annualEarnings?.map((earning: any) => ({
          fiscalDateEnding: earning.fiscalDateEnding,
          reportedEPS: earning.reportedEPS,
        })),
        quarterlyEarnings: data.quarterlyEarnings?.map((earning: any) => ({
          fiscalDateEnding: earning.fiscalDateEnding,
          reportedDate: earning.reportedDate,
          reportedEPS: earning.reportedEPS,
          estimatedEPS: earning.estimatedEPS,
          surprise: earning.surprise,
          surprisePercentage: earning.surprisePercentage,
        })),
      };
    },
  },

  get_balance_sheet: {
    description: 'Get balance sheet data (Premium+ only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      const data = await client.getBalanceSheet(symbol);
      return {
        symbol: data.symbol,
        annualReports: data.annualReports?.slice(0, 3).map((report: any) => ({
          fiscalDateEnding: report.fiscalDateEnding,
          reportedCurrency: report.reportedCurrency,
          totalAssets: report.totalAssets,
          totalCurrentAssets: report.totalCurrentAssets,
          totalLiabilities: report.totalLiabilities,
          totalCurrentLiabilities: report.totalCurrentLiabilities,
          totalShareholderEquity: report.totalShareholderEquity,
          cashAndCashEquivalentsAtCarryingValue: report.cashAndCashEquivalentsAtCarryingValue,
          inventory: report.inventory,
          currentNetReceivables: report.currentNetReceivables,
          propertyPlantEquipment: report.propertyPlantEquipment,
          goodwill: report.goodwill,
          longTermDebt: report.longTermDebt,
          retainedEarnings: report.retainedEarnings,
          commonStock: report.commonStock,
          commonStockSharesOutstanding: report.commonStockSharesOutstanding,
        })),
        quarterlyReports: data.quarterlyReports?.slice(0, 4).map((report: any) => ({
          fiscalDateEnding: report.fiscalDateEnding,
          totalAssets: report.totalAssets,
          totalLiabilities: report.totalLiabilities,
          totalShareholderEquity: report.totalShareholderEquity,
        })),
      };
    },
  },

  get_income_statement: {
    description: 'Get income statement data (Premium+ only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      const data = await client.getIncomeStatement(symbol);
      return {
        symbol: data.symbol,
        annualReports: data.annualReports?.slice(0, 3).map((report: any) => ({
          fiscalDateEnding: report.fiscalDateEnding,
          reportedCurrency: report.reportedCurrency,
          totalRevenue: report.totalRevenue,
          grossProfit: report.grossProfit,
          operatingIncome: report.operatingIncome,
          netIncome: report.netIncome,
          costOfRevenue: report.costOfRevenue,
          operatingExpenses: report.operatingExpenses,
          researchAndDevelopment: report.researchAndDevelopment,
          sellingGeneralAndAdministrative: report.sellingGeneralAndAdministrative,
          incomeBeforeTax: report.incomeBeforeTax,
          incomeTaxExpense: report.incomeTaxExpense,
          ebit: report.ebit,
          ebitda: report.ebitda,
        })),
        quarterlyReports: data.quarterlyReports?.slice(0, 4).map((report: any) => ({
          fiscalDateEnding: report.fiscalDateEnding,
          totalRevenue: report.totalRevenue,
          grossProfit: report.grossProfit,
          operatingIncome: report.operatingIncome,
          netIncome: report.netIncome,
        })),
      };
    },
  },

  get_cash_flow: {
    description: 'Get cash flow statement data (Premium+ only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      const data = await client.getCashFlow(symbol);
      return {
        symbol: data.symbol,
        annualReports: data.annualReports?.slice(0, 3).map((report: any) => ({
          fiscalDateEnding: report.fiscalDateEnding,
          reportedCurrency: report.reportedCurrency,
          operatingCashflow: report.operatingCashflow,
          capitalExpenditures: report.capitalExpenditures,
          cashflowFromInvestment: report.cashflowFromInvestment,
          cashflowFromFinancing: report.cashflowFromFinancing,
          netIncome: report.netIncome,
          depreciationDepletionAndAmortization: report.depreciationDepletionAndAmortization,
          changeInReceivables: report.changeInReceivables,
          changeInInventory: report.changeInInventory,
          dividendPayout: report.dividendPayout,
          changeInCashAndCashEquivalents: report.changeInCashAndCashEquivalents,
        })),
        quarterlyReports: data.quarterlyReports?.slice(0, 4).map((report: any) => ({
          fiscalDateEnding: report.fiscalDateEnding,
          operatingCashflow: report.operatingCashflow,
          capitalExpenditures: report.capitalExpenditures,
          netIncome: report.netIncome,
        })),
      };
    },
  },

  // 高级技术指标
  get_bollinger_bands: {
    description: 'Get Bollinger Bands technical indicator (Premium+ only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
      interval: z.enum(['1min', '5min', '15min', '30min', '60min', 'daily', 'weekly', 'monthly']).optional().default('daily'),
      timePeriod: z.string().optional().default('20'),
      seriesType: z.enum(['open', 'high', 'low', 'close']).optional().default('close'),
      nbdevup: z.string().optional().default('2'),
      nbdevdn: z.string().optional().default('2'),
    }),
    execute: async ({ symbol, interval, timePeriod, seriesType, nbdevup, nbdevdn }: any) => {
      const data = await client.getBollingerBands(symbol, interval, timePeriod, seriesType, nbdevup, nbdevdn);
      const key = `Technical Analysis: BBANDS`;
      const bbandsData = data[key];
      return Object.entries(bbandsData).map(([date, values]: [string, any]) => ({
        date,
        upperBand: values['Real Upper Band'],
        middleBand: values['Real Middle Band'],
        lowerBand: values['Real Lower Band'],
      }));
    },
  },

  get_stochastic: {
    description: 'Get Stochastic Oscillator technical indicator (Premium+ only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
      interval: z.enum(['1min', '5min', '15min', '30min', '60min', 'daily', 'weekly', 'monthly']).optional().default('daily'),
      fastkPeriod: z.string().optional().default('5'),
      slowkPeriod: z.string().optional().default('3'),
      slowdPeriod: z.string().optional().default('3'),
    }),
    execute: async ({ symbol, interval, fastkPeriod, slowkPeriod, slowdPeriod }: any) => {
      const data = await client.getStochastic(symbol, interval, fastkPeriod, slowkPeriod, slowdPeriod);
      const key = `Technical Analysis: STOCH`;
      const stochData = data[key];
      return Object.entries(stochData).map(([date, values]: [string, any]) => ({
        date,
        slowK: values.SlowK,
        slowD: values.SlowD,
      }));
    },
  },

  get_williams_r: {
    description: 'Get Williams %R technical indicator (Premium+ only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
      interval: z.enum(['1min', '5min', '15min', '30min', '60min', 'daily', 'weekly', 'monthly']).optional().default('daily'),
      timePeriod: z.string().optional().default('14'),
    }),
    execute: async ({ symbol, interval, timePeriod }: any) => {
      const data = await client.getWilliamsR(symbol, interval, timePeriod);
      const key = `Technical Analysis: WILLR`;
      const willrData = data[key];
      return Object.entries(willrData).map(([date, values]: [string, any]) => ({
        date,
        willr: values.WILLR,
      }));
    },
  },

  get_atr: {
    description: 'Get Average True Range (ATR) technical indicator (Premium+ only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
      interval: z.enum(['1min', '5min', '15min', '30min', '60min', 'daily', 'weekly', 'monthly']).optional().default('daily'),
      timePeriod: z.string().optional().default('14'),
    }),
    execute: async ({ symbol, interval, timePeriod }: any) => {
      const data = await client.getATR(symbol, interval, timePeriod);
      const key = `Technical Analysis: ATR`;
      const atrData = data[key];
      return Object.entries(atrData).map(([date, values]: [string, any]) => ({
        date,
        atr: values.ATR,
      }));
    },
  },

  // ==================== 企业版独有功能 ====================
  
  get_options_data: {
    description: 'Get options data for a stock (Enterprise only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      return await client.getOptionsData(symbol);
    },
  },

  get_etf_profile: {
    description: 'Get ETF profile and holdings data (Enterprise only)',
    parameters: z.object({
      symbol: z.string().describe('ETF symbol'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      return await client.getETFProfile(symbol);
    },
  },

  get_economic_indicator: {
    description: 'Get economic indicator data (Enterprise only)',
    parameters: z.object({
      functionName: z.enum(['REAL_GDP', 'REAL_GDP_PER_CAPITA', 'TREASURY_YIELD', 'FEDERAL_FUNDS_RATE', 'CPI', 'INFLATION', 'RETAIL_SALES', 'DURABLES', 'UNEMPLOYMENT', 'NONFARM_PAYROLL']).describe('Economic indicator function name'),
      interval: z.enum(['monthly', 'quarterly', 'annual']).optional().default('monthly'),
    }),
    execute: async ({ functionName, interval }: { functionName: string; interval?: string }) => {
      return await client.getEconomicIndicator(functionName, interval);
    },
  },

  get_real_time_quote: {
    description: 'Get real-time stock quote with no delay (Enterprise only)',
    parameters: z.object({
      symbol: z.string().describe('Stock symbol'),
    }),
    execute: async ({ symbol }: { symbol: string }) => {
      return await client.getRealTimeQuote(symbol);
    },
  },

  // ==================== 工具方法 ====================
  
  get_subscription_info: {
    description: 'Get current Alpha Vantage subscription information and limits',
    parameters: z.object({}),
    execute: async () => {
      return client.getSubscriptionInfo();
    },
  },

  get_available_features: {
    description: 'Get list of available features based on current subscription',
    parameters: z.object({}),
    execute: async () => {
      return client.getAvailableFeatures();
    },
  },
};