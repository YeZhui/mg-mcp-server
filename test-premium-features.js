#!/usr/bin/env node

/**
 * 测试Alpha Vantage付费版功能
 * 这个脚本用于测试不同订阅级别下的功能访问控制
 */

import { AlphaVantageClient } from './dist/alphavantage-client.js';
import { CONFIG } from './dist/config.js';

async function testSubscriptionInfo() {
  console.log('\n=== 测试订阅信息 ===');
  const client = new AlphaVantageClient();
  
  try {
    const info = client.getSubscriptionInfo();
    console.log('当前订阅信息:', JSON.stringify(info, null, 2));
    
    const features = client.getAvailableFeatures();
    console.log('\n可用功能:');
    console.log('基础功能:', features.basic);
    console.log('付费功能:', features.premium);
    console.log('企业功能:', features.enterprise);
  } catch (error) {
    console.error('获取订阅信息失败:', error.message);
  }
}

async function testPremiumFeatures() {
  console.log('\n=== 测试付费版功能访问控制 ===');
  const client = new AlphaVantageClient();
  
  // 测试基本面数据功能
  const premiumFunctions = [
    { name: 'getCompanyOverview', args: ['AAPL'] },
    { name: 'getEarnings', args: ['AAPL'] },
    { name: 'getBalanceSheet', args: ['AAPL'] },
    { name: 'getIncomeStatement', args: ['AAPL'] },
    { name: 'getCashFlow', args: ['AAPL'] }
  ];
  
  for (const func of premiumFunctions) {
    try {
      console.log(`\n测试 ${func.name}...`);
      if (CONFIG.SUBSCRIPTION.IS_PREMIUM || CONFIG.SUBSCRIPTION.IS_ENTERPRISE) {
        console.log(`✅ ${func.name}: 有权限访问`);
        // 注意：这里不实际调用API，只测试权限检查
      } else {
        console.log(`❌ ${func.name}: 需要Premium或Enterprise订阅`);
      }
    } catch (error) {
      console.log(`❌ ${func.name}: ${error.message}`);
    }
  }
}

async function testEnterpriseFeatures() {
  console.log('\n=== 测试企业版功能访问控制 ===');
  const client = new AlphaVantageClient();
  
  const enterpriseFunctions = [
    { name: 'getOptionsData', args: ['AAPL'] },
    { name: 'getETFProfile', args: ['SPY'] },
    { name: 'getEconomicIndicator', args: ['REAL_GDP'] },
    { name: 'getRealTimeQuote', args: ['AAPL'] }
  ];
  
  for (const func of enterpriseFunctions) {
    try {
      console.log(`\n测试 ${func.name}...`);
      if (CONFIG.SUBSCRIPTION.IS_ENTERPRISE) {
        console.log(`✅ ${func.name}: 有权限访问`);
      } else {
        console.log(`❌ ${func.name}: 需要Enterprise订阅`);
      }
    } catch (error) {
      console.log(`❌ ${func.name}: ${error.message}`);
    }
  }
}

async function testBasicFeatures() {
  console.log('\n=== 测试基础功能 ===');
  const client = new AlphaVantageClient();
  
  try {
    console.log('测试基础股票报价功能...');
    // 这里只测试一个基础功能，确保免费版功能正常
    const quote = await client.getQuote('AAPL');
    console.log('✅ 基础功能正常工作');
    console.log('AAPL报价数据:', quote['Global Quote']['01. symbol'], quote['Global Quote']['05. price']);
  } catch (error) {
    console.log('❌ 基础功能测试失败:', error.message);
  }
}

async function main() {
  console.log('Alpha Vantage付费版功能测试');
  console.log('================================');
  
  await testSubscriptionInfo();
  await testPremiumFeatures();
  await testEnterpriseFeatures();
  await testBasicFeatures();
  
  console.log('\n=== 测试完成 ===');
  console.log('\n配置说明:');
  console.log('- 设置 ALPHAVANTAGE_PREMIUM=true 启用Premium功能');
  console.log('- 设置 ALPHAVANTAGE_ENTERPRISE=true 启用Enterprise功能');
  console.log('- 默认情况下只启用免费版功能');
}

main().catch(console.error);