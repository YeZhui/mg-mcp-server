# Alpha Vantage MCP 服务器

一个基于模型上下文协议（MCP）的服务器，提供对 Alpha Vantage 综合金融数据 API 的访问，包括股票、外汇、加密货币和技术指标。

## ⚠️ 重要声明

**本项目仅供个人学习和研究使用，严禁用于任何非法用途。**

- 🔒 **个人使用**：本项目仅限个人学习、研究和合法的金融数据分析
- 🚫 **禁止商用**：不得用于商业目的或盈利活动
- 📜 **遵守法律**：使用者必须遵守当地法律法规和 Alpha Vantage 服务条款
- 🛡️ **免责声明**：开发者不对使用本项目造成的任何损失承担责任

## 🚀 项目支持情况

### ✅ 已支持功能
- **股票数据**：实时报价、历史数据（日线、周线、月线、分时）
- **外汇数据**：货币对实时汇率
- **加密货币**：数字货币日线数据和汇率
- **技术指标**：SMA、RSI、MACD 等多种技术分析指标
- **新闻情感**：AI 驱动的新闻情感分析
- **速率限制**：内置 Alpha Vantage API 限制处理
- **错误处理**：完善的错误处理和数据验证

### 🔄 开发状态
- **当前版本**：v1.0.0
- **维护状态**：积极维护中
- **兼容性**：支持所有主流 MCP 客户端

## 📦 安装说明

1. 克隆本仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 构建服务器：
   ```bash
   npm run build
   ```

## ⚙️ 配置说明

### 🔑 获取 API 密钥

1. 访问 [Alpha Vantage](https://www.alphavantage.co/support/#api-key) 获取免费 API 密钥
2. 免费版每日限制 25-500 次请求（根据具体 API 端点而定）

### 🛠️ MCP 客户端配置

**推荐配置方式**：在 MCP 客户端配置文件中设置（如 Claude Desktop）：

```json
{
  "mcpServers": {
    "alpha-mg-mcp": {
      "command": "node",
      "args": ["C:\\path\\to\\mg-mcp-server\\dist\\index.js"],
      "env": {
        "ALPHAVANTAGE_API_KEY": "你的API密钥"
      }
    }
  }
}
```

**配置步骤**：
1. 将 `args` 路径更新为你的实际 `mg-mcp-server/dist/index.js` 位置
2. 在 `ALPHAVANTAGE_API_KEY` 环境变量中设置你的 Alpha Vantage API 密钥
3. （可选）设置 `ALPHAVANTAGE_PREMIUM=true` 启用付费版功能
4. （可选）设置 `ALPHAVANTAGE_ENTERPRISE=true` 启用企业版功能
5. 重启你的 MCP 客户端以加载新配置
6. 服务器将以 `alpha-mg-mcp` 名称可用

参考 `mcp-config-example.json` 获取完整配置示例。

## 💰 订阅版本说明

### 🆓 免费版限制
- **请求限制**：每分钟 5 次请求，每天 500 次请求
- **功能限制**：基础股票数据、外汇、加密货币、基础技术指标
- **延迟**：12 秒请求间隔以避免超限

### 💎 付费版优势
- **Premium 版**：每分钟 75 次请求，每天 15,000 次请求
- **Enterprise 版**：每分钟 1,200 次请求，无每日限制
- **高级功能**：公司基本面数据、高级技术指标、实时数据等

### 📊 功能对比
详细功能对比请查看：[`ALPHA-VANTAGE-FEATURES.md`](./ALPHA-VANTAGE-FEATURES.md)

## 🎯 使用方法

### 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## 🛠️ 可用工具

### 📈 股票工具

- **`get_stock_quote`** - 获取实时股票报价
  - 参数：`symbol`（股票代码，字符串）

- **`get_stock_daily`** - 获取日线历史数据
  - 参数：`symbol`（股票代码，字符串），`outputsize`（数据量：compact/full，可选）

- **`get_stock_intraday`** - 获取分时数据
  - 参数：`symbol`（股票代码，字符串），`interval`（时间间隔：1min/5min/15min/30min/60min，可选）

- **`get_stock_weekly`** - 获取周线历史数据
  - 参数：`symbol`（股票代码，字符串）

- **`get_stock_monthly`** - 获取月线历史数据
  - 参数：`symbol`（股票代码，字符串）

### 💱 外汇工具

- **`get_exchange_rate`** - 获取货币汇率
  - 参数：`fromCurrency`（源货币，字符串），`toCurrency`（目标货币，字符串）

### 🪙 加密货币工具

- **`get_crypto_daily`** - 获取加密货币日线数据
  - 参数：`symbol`（加密货币代码，字符串），`market`（交易市场，字符串，可选，默认：USD）

### 📊 技术指标

- **`get_sma`** - 简单移动平均线
  - 参数：`symbol`（股票代码），`interval`（时间间隔），`timePeriod`（周期），`seriesType`（数据类型）

- **`get_rsi`** - 相对强弱指数
  - 参数：`symbol`（股票代码），`interval`（时间间隔），`timePeriod`（周期），`seriesType`（数据类型）

- **`get_macd`** - 指数平滑异同移动平均线
  - 参数：`symbol`（股票代码），`interval`（时间间隔），`seriesType`（数据类型）

### 📰 新闻情感

- **`get_news_sentiment`** - 获取新闻情感分析
  - 参数：`tickers`（股票代码数组），`topics`（主题数组），`limit`（数量限制）

### 💎 付费版功能（需要 Premium+ 订阅）

#### 📋 基本面数据
- **`get_company_overview`** - 获取公司概况和基本面数据
- **`get_earnings`** - 获取财报数据
- **`get_balance_sheet`** - 获取资产负债表数据
- **`get_income_statement`** - 获取利润表数据
- **`get_cash_flow`** - 获取现金流量表数据

#### 📈 高级技术指标
- **`get_bollinger_bands`** - 布林带指标
- **`get_stochastic`** - 随机振荡器
- **`get_williams_r`** - 威廉指标
- **`get_atr`** - 平均真实波幅

### 🚀 企业版功能（需要 Enterprise 订阅）

- **`get_options_data`** - 获取股票期权数据
- **`get_etf_profile`** - 获取 ETF 资料和持仓
- **`get_economic_indicator`** - 获取经济指标数据
- **`get_real_time_quote`** - 获取无延迟实时报价

### 🔧 实用工具

- **`get_subscription_info`** - 获取当前订阅信息
- **`get_available_features`** - 获取可用功能列表

## 📝 使用示例

### 获取股票报价
```javascript
{
  "name": "get_stock_quote",
  "arguments": {
    "symbol": "AAPL"
  }
}
```

### 获取历史数据
```javascript
{
  "name": "get_stock_daily",
  "arguments": {
    "symbol": "MSFT",
    "outputsize": "full"
  }
}
```

### 获取汇率
```javascript
{
  "name": "get_exchange_rate",
  "arguments": {
    "fromCurrency": "USD",
    "toCurrency": "EUR"
  }
}
```

### 获取技术指标
```javascript
{
  "name": "get_sma",
  "arguments": {
    "symbol": "GOOGL",
    "interval": "daily",
    "timePeriod": "20"
  }
}
```

## ❓ 常见问题

### Q: 为什么我的 API 请求失败了？
A: 请检查以下几点：
- ✅ API 密钥是否正确配置
- ✅ 是否超过了免费版的请求限制（每天 25-500 次）
- ✅ 股票代码格式是否正确（如：AAPL、MSFT）
- ✅ 网络连接是否正常

### Q: 如何升级到付费版？
A: 访问 [Alpha Vantage 付费计划](https://www.alphavantage.co/premium/) 选择适合的订阅方案，然后在 MCP 配置中设置相应的环境变量。

### Q: 支持哪些股票市场？
A: 支持全球主要股票市场，包括：
- 🇺🇸 美国股市（NYSE、NASDAQ）
- 🇨🇳 中国股市（需要正确的股票代码格式）
- 🇪🇺 欧洲股市
- 🇯🇵 日本股市
- 其他主要国际市场

## 🔧 故障排除

### API 限制问题
如果遇到 "API rate limit exceeded" 错误：
1. 等待限制重置（免费版每日重置）
2. 考虑升级到付费版
3. 优化请求频率

### 配置问题
如果 MCP 服务器无法启动：
1. 检查 Node.js 版本（推荐 v16+）
2. 确认文件路径正确
3. 验证 API 密钥格式
4. 查看控制台错误信息

## 📚 相关文档

- [Alpha Vantage API 文档](https://www.alphavantage.co/documentation/)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [功能对比详情](./ALPHA-VANTAGE-FEATURES.md)

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！请确保：
- 遵循现有代码风格
- 添加适当的测试
- 更新相关文档

## ⚠️ 免责声明

本项目仅供学习和研究使用。使用者需要：
- 遵守 Alpha Vantage 服务条款
- 承担数据使用风险
- 确保合法合规使用

开发者不对因使用本项目而产生的任何直接或间接损失承担责任。

### 获取新闻情感
```javascript
{
  "name": "get_news_sentiment",
  "arguments": {
    "tickers": ["AAPL", "MSFT"],
    "limit": 10
  }
}
```

### 付费版功能示例

#### 获取公司概况
```javascript
{
  "name": "get_company_overview",
  "arguments": {
    "symbol": "AAPL"
  }
}
```

#### 获取布林带指标
```javascript
{
  "name": "get_bollinger_bands",
  "arguments": {
    "symbol": "MSFT",
    "interval": "daily",
    "timePeriod": "20"
  }
}
```

#### 获取订阅信息
```javascript
{
  "name": "get_subscription_info",
  "arguments": {}
}
```

## 🚦 速率限制

- **免费版**：每分钟 5 次 API 调用，每天 500 次调用
- **付费版**：更高的限制额度
- **内置限制**：自动防止超过 API 限制

## 🛡️ 错误处理

服务器包含全面的错误处理机制：
- ❌ 无效的 API 密钥
- ⏰ 超过速率限制
- 📝 无效参数
- 🌐 网络错误
- 📡 API 响应错误

## 🔨 开发指南

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产构建
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📞 技术支持

- **Alpha Vantage 文档**：https://www.alphavantage.co/documentation/
- **API 密钥注册**：https://www.alphavantage.co/support/#api-key
- **问题反馈**：请在 GitHub 上提交 Issue

---

**感谢使用 Alpha Vantage MCP 服务器！** 🎉