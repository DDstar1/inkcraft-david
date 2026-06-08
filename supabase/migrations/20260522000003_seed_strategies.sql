-- Platform-level strategies (no user_id — created by DerivAlgo)
INSERT INTO trades_strategies (name, description, pair, timeframe, parameters, is_public, status)
VALUES
  (
    'MULTUP EUR/USD',
    'Enters a leveraged MULTUP contract when RSI(14) drops below 30, signalling an oversold condition. Uses a tight stop-loss and take-profit with built-in drawdown limits.',
    'EUR/USD', '1m',
    '{"rsi_period": 14, "rsi_oversold": 30, "multiplier": 1, "stop_loss": 0.50, "take_profit": 1.00}',
    true, 'active'
  ),
  (
    'SMA Crossover EUR/USD',
    'Enters a CALL contract when the 10-period SMA crosses above the 20-period SMA, confirming a short-term bullish trend shift on EUR/USD.',
    'EUR/USD', '5m',
    '{"fast_period": 10, "slow_period": 20, "duration": 5}',
    true, 'active'
  );

-- Seed leaderboard entries for both strategies
INSERT INTO trades_leaderboard (strategy_id, account_type, total_return, win_rate, max_drawdown, total_users)
SELECT id, 'demo', 24.8, 68.2, 4.2, 12 FROM trades_strategies WHERE name = 'MULTUP EUR/USD';

INSERT INTO trades_leaderboard (strategy_id, account_type, total_return, win_rate, max_drawdown, total_users)
SELECT id, 'demo', 18.2, 74.5, 2.1, 8 FROM trades_strategies WHERE name = 'SMA Crossover EUR/USD';
