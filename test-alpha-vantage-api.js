/**
 * Alpha Vantage API 诊断测试脚本
 * 
 * 用于检查Alpha Vantage API的各个端点是否正常工作
 */

import { AlphaVantageClient } from './dist/alphavantage-client.js';
import { CONFIG } from './dist/config.js';

const client = new AlphaVantageClient();

async function testBasicQuote() {
  console.log('\n=== 测试基础股票报价 ===');
  
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMD'];
  
  for (const symbol of symbols) {
    try {
      console.log(`\n测试 ${symbol} 股票报价...`);
      const quote = await client.getQuote(symbol);
      
      if (quote && quote['Global Quote']) {
        const globalQuote = quote['Global Quote'];
        console.log(`✅ ${symbol}: $${globalQuote['05. price']} (${globalQuote['09. change']} / ${globalQuote['10. change percent']})`);
      } else {
        console.log(`❌ ${symbol}: 返回数据格式异常`);
        console.log('原始响应:', JSON.stringify(quote, null, 2));
      }
    } catch (error) {
      console.log(`❌ ${symbol}: ${error.message}`);
    }
    
    // 添加延迟以避免速率限制
    await new Promise(resolve => setTimeout(resolve, 13000));
  }
}

async function testDailyData() {
  console.log('\n=== 测试日线历史数据 ===');
  
  try {
    console.log('\n测试 AAPL 日线数据...');
    const daily = await client.getTimeSeriesDaily('AAPL', 'compact');
    
    if (daily && daily['Time Series (Daily)']) {
      const dates = Object.keys(daily['Time Series (Daily)']).slice(0, 3);
      console.log(`✅ AAPL 日线数据获取成功，最近3个交易日:`);
      dates.forEach(date => {
        const data = daily['Time Series (Daily)'][date];
        console.log(`  ${date}: 开盘 $${data['1. open']}, 收盘 $${data['4. close']}`);
      });
    } else {
      console.log('❌ AAPL: 日线数据格式异常');
      console.log('原始响应:', JSON.stringify(daily, null, 2));
    }
  } catch (error) {
    console.log(`❌ 日线数据测试失败: ${error.message}`);
  }
}

async function testTechnicalIndicators() {
  console.log('\n=== 测试技术指标 ===');
  
  try {
    console.log('\n测试 SMA 指标...');
    const sma = await client.getTechnicalIndicator('AAPL', 'SMA', 'daily', '20', 'close');
    
    if (sma && sma['Technical Analysis: SMA']) {
      const dates = Object.keys(sma['Technical Analysis: SMA']).slice(0, 3);
      console.log(`✅ SMA 指标获取成功，最近3个数据点:`);
      dates.forEach(date => {
        const value = sma['Technical Analysis: SMA'][date]['SMA'];
        console.log(`  ${date}: SMA(20) = $${value}`);
      });
    } else {
      console.log('❌ SMA: 技术指标数据格式异常');
      console.log('原始响应:', JSON.stringify(sma, null, 2));
    }
  } catch (error) {
    console.log(`❌ 技术指标测试失败: ${error.message}`);
  }
}

async function testForexData() {
  console.log('\n=== 测试外汇数据 ===');
  
  try {
    console.log('\n测试 USD/EUR 汇率...');
    const forex = await client.getExchangeRate('USD', 'EUR');
    
    if (forex && forex['Realtime Currency Exchange Rate']) {
      const rate = forex['Realtime Currency Exchange Rate'];
      console.log(`✅ 外汇数据获取成功: ${rate['1. From_Currency Code']}/${rate['3. To_Currency Code']} = ${rate['5. Exchange Rate']}`);
    } else {
      console.log('❌ 外汇数据格式异常');
      console.log('原始响应:', JSON.stringify(forex, null, 2));
    }
  } catch (error) {
    console.log(`❌ 外汇数据测试失败: ${error.message}`);
  }
}

async function testAPILimits() {
  console.log('\n=== 测试API限制 ===');
  
  const subscriptionInfo = await client.getSubscriptionInfo();
  console.log('当前订阅信息:', subscriptionInfo);
  
  console.log(`\n当前配置:`);
  console.log(`- API Key: ${CONFIG.ALPHAVANTAGE_API_KEY ? CONFIG.ALPHAVANTAGE_API_KEY.substring(0, 8) + '...' : '未设置'}`);
  console.log(`- Premium: ${CONFIG.ALPHAVANTAGE_PREMIUM}`);
  console.log(`- Enterprise: ${CONFIG.ALPHAVANTAGE_ENTERPRISE}`);
  console.log(`- 速率限制: ${subscriptionInfo.rateLimit}ms`);
}

async function testErrorHandling() {
  console.log('\n=== 测试错误处理 ===');
  
  try {
    console.log('\n测试无效股票代码...');
    const invalidQuote = await client.getQuote('INVALID_SYMBOL_12345');
    console.log('无效股票代码响应:', JSON.stringify(invalidQuote, null, 2));
  } catch (error) {
    console.log(`✅ 错误处理正常: ${error.message}`);
  }
}

async function main() {
  console.log('Alpha Vantage API 诊断测试开始...');
  console.log('='.repeat(50));
  
  try {
    await testAPILimits();
    await testBasicQuote();
    
    // 添加延迟
    console.log('\n等待15秒以避免速率限制...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    await testDailyData();
    
    // 添加延迟
    console.log('\n等待15秒以避免速率限制...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    await testTechnicalIndicators();
    
    // 添加延迟
    console.log('\n等待15秒以避免速率限制...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    await testForexData();
    
    await testErrorHandling();
    
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
  
  console.log('\n='.repeat(50));
  console.log('Alpha Vantage API 诊断测试完成');
}

main().catch(console.error);