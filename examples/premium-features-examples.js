/**
 * Alpha Vantage Premium Features Examples
 * 
 * This file demonstrates how to use Alpha Vantage premium and enterprise features.
 * 
 * Configuration:
 * - Set ALPHAVANTAGE_PREMIUM=true to enable Premium features
 * - Set ALPHAVANTAGE_ENTERPRISE=true to enable Enterprise features
 */

import { AlphaVantageClient } from '../dist/alphavantage-client.js';
import { CONFIG } from '../dist/config.js';

const client = new AlphaVantageClient();

async function demonstratePremiumFeatures() {
  console.log('\n=== Alpha Vantage Premium Features Demo ===\n');
  
  // Check subscription status
  const subscriptionInfo = await client.getSubscriptionInfo();
  console.log('Current Subscription:', subscriptionInfo);
  
  const availableFeatures = await client.getAvailableFeatures();
  console.log('\nAvailable Features:', availableFeatures);
  
  if (!subscriptionInfo.isPremium && !subscriptionInfo.isEnterprise) {
    console.log('\n⚠️  Premium features require ALPHAVANTAGE_PREMIUM=true or ALPHAVANTAGE_ENTERPRISE=true');
    console.log('Set environment variables to test premium features.');
    return;
  }
  
  console.log('\n=== Premium Features Examples ===\n');
  
  try {
    // Company Overview (Premium+)
    console.log('1. Getting Company Overview for AAPL...');
    const overview = await client.getCompanyOverview('AAPL');
    console.log('Company:', overview['Name']);
    console.log('Sector:', overview['Sector']);
    console.log('Market Cap:', overview['MarketCapitalization']);
    
    // Earnings Data (Premium+)
    console.log('\n2. Getting Earnings Data for AAPL...');
    const earnings = await client.getEarnings('AAPL');
    console.log('Annual Earnings:', earnings['annualEarnings']?.slice(0, 2));
    
    // Advanced Technical Indicators (Premium+)
    console.log('\n3. Getting Bollinger Bands for AAPL...');
    const bb = await client.getBollingerBands('AAPL', 'daily', 20, 'close', 2);
    const latestBB = Object.values(bb['Technical Analysis: BBANDS'] || {})[0];
    console.log('Latest Bollinger Bands:', latestBB);
    
    // Financial Statements (Premium+)
    console.log('\n4. Getting Balance Sheet for AAPL...');
    const balanceSheet = await client.getBalanceSheet('AAPL');
    console.log('Annual Reports:', balanceSheet['annualReports']?.slice(0, 1));
    
  } catch (error) {
    console.error('Premium feature error:', error.message);
  }
  
  // Enterprise Features
  if (subscriptionInfo.isEnterprise) {
    console.log('\n=== Enterprise Features Examples ===\n');
    
    try {
      // Real-time Quote (Enterprise)
      console.log('1. Getting Real-time Quote for AAPL...');
      const realTimeQuote = await client.getRealTimeQuote('AAPL');
      console.log('Real-time Price:', realTimeQuote['Global Quote']);
      
      // ETF Profile (Enterprise)
      console.log('\n2. Getting ETF Profile for SPY...');
      const etfProfile = await client.getETFProfile('SPY');
      console.log('ETF Holdings:', etfProfile['holdings']?.slice(0, 3));
      
      // Economic Indicators (Enterprise)
      console.log('\n3. Getting Economic Indicator (GDP)...');
      const gdp = await client.getEconomicIndicator('REAL_GDP');
      console.log('Latest GDP Data:', Object.values(gdp['data'] || {})[0]);
      
    } catch (error) {
      console.error('Enterprise feature error:', error.message);
    }
  }
}

async function demonstrateAccessControl() {
  console.log('\n=== Access Control Demo ===\n');
  
  const features = [
    { name: 'Company Overview', method: 'getCompanyOverview', args: ['AAPL'] },
    { name: 'Bollinger Bands', method: 'getBollingerBands', args: ['AAPL', 'daily', 20, 'close', 2] },
    { name: 'Real-time Quote', method: 'getRealTimeQuote', args: ['AAPL'] },
    { name: 'ETF Profile', method: 'getETFProfile', args: ['SPY'] }
  ];
  
  for (const feature of features) {
    try {
      console.log(`Testing ${feature.name}...`);
      await client[feature.method](...feature.args);
      console.log(`✅ ${feature.name}: Access granted`);
    } catch (error) {
      console.log(`❌ ${feature.name}: ${error.message}`);
    }
  }
}

async function main() {
  try {
    await demonstratePremiumFeatures();
    await demonstrateAccessControl();
  } catch (error) {
    console.error('Demo error:', error);
  }
}

main().catch(console.error);