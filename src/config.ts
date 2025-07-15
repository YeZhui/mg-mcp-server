import { config } from 'dotenv';

config();

// 检测是否为付费版
const isPremium = process.env.ALPHAVANTAGE_PREMIUM === 'true';
const isEnterprise = process.env.ALPHAVANTAGE_ENTERPRISE === 'true';

export const CONFIG = {
  API_KEY: process.env.ALPHAVANTAGE_API_KEY || '',
  BASE_URL: process.env.ALPHAVANTAGE_BASE_URL || 'https://www.alphavantage.co/query',
  TIMEOUT: 30000,
  
  // 根据订阅类型设置速率限制
  RATE_LIMIT_DELAY: isEnterprise ? 50 : isPremium ? 1000 : 12000, // Enterprise: 50ms, Premium: 1s, Free: 12s
  
  // 订阅类型配置
  SUBSCRIPTION: {
    IS_FREE: !isPremium && !isEnterprise,
    IS_PREMIUM: isPremium && !isEnterprise,
    IS_ENTERPRISE: isEnterprise,
    TYPE: isEnterprise ? 'enterprise' : isPremium ? 'premium' : 'free'
  },
  
  // API限制配置
  LIMITS: {
    REQUESTS_PER_MINUTE: isEnterprise ? 1200 : isPremium ? 75 : 5,
    REQUESTS_PER_DAY: isEnterprise ? null : isPremium ? 15000 : 500
  }
};

if (!CONFIG.API_KEY) {
  throw new Error('ALPHAVANTAGE_API_KEY environment variable is required');
}

// 输出当前配置信息
console.log(`Alpha Vantage MCP Server - Subscription: ${CONFIG.SUBSCRIPTION.TYPE.toUpperCase()}`);
if (CONFIG.SUBSCRIPTION.IS_FREE) {
  console.log('⚠️  Using FREE tier - Limited to 5 requests/minute, 500 requests/day');
} else if (CONFIG.SUBSCRIPTION.IS_PREMIUM) {
  console.log('✅ Using PREMIUM tier - Up to 75 requests/minute, 15,000 requests/day');
} else if (CONFIG.SUBSCRIPTION.IS_ENTERPRISE) {
  console.log('🚀 Using ENTERPRISE tier - Up to 1,200 requests/minute, unlimited daily requests');
}