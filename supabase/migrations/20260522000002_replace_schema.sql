-- Drop old schema
DROP TABLE IF EXISTS trades CASCADE;
DROP TABLE IF EXISTS bot_sessions CASCADE;
DROP TABLE IF EXISTS trades_backtest_results CASCADE;
DROP TABLE IF EXISTS strategies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop new tables if they exist (idempotent)
DROP TABLE IF EXISTS trades_leaderboard CASCADE;
DROP TABLE IF EXISTS trades_backtest_results CASCADE;
DROP TABLE IF EXISTS trades_trades CASCADE;
DROP TABLE IF EXISTS trades_strategies CASCADE;
DROP TABLE IF EXISTS trades_custom_users CASCADE;

-- 1. Users
CREATE TABLE trades_custom_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    deriv_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Strategies
CREATE TABLE trades_strategies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES trades_custom_users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    pair TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    parameters JSONB,
    is_public BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'inactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Trades
CREATE TABLE trades_trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id UUID REFERENCES trades_strategies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES trades_custom_users(id) ON DELETE CASCADE,
    pair TEXT NOT NULL,
    direction TEXT NOT NULL,
    entry_price NUMERIC(18, 6),
    exit_price NUMERIC(18, 6),
    entry_time TIMESTAMP WITH TIME ZONE,
    exit_time TIMESTAMP WITH TIME ZONE,
    pnl NUMERIC(18, 2),
    status TEXT DEFAULT 'open',
    snapshot_url TEXT,
    account_type TEXT DEFAULT 'demo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Backtest Results
CREATE TABLE trades_backtest_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id UUID REFERENCES trades_strategies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES trades_custom_users(id) ON DELETE CASCADE,
    total_return NUMERIC(10, 2),
    win_rate NUMERIC(5, 2),
    max_drawdown NUMERIC(10, 2),
    sharpe_ratio NUMERIC(8, 4),
    total_trades INTEGER,
    start_date DATE,
    end_date DATE,
    parameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Leaderboard
CREATE TABLE trades_leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id UUID REFERENCES trades_strategies(id) ON DELETE CASCADE,
    account_type TEXT NOT NULL,
    total_return NUMERIC(10, 2),
    win_rate NUMERIC(5, 2),
    max_drawdown NUMERIC(10, 2),
    total_users INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trades_strategies_user ON trades_strategies(user_id);
CREATE INDEX idx_trades_trades_user ON trades_trades(user_id);
CREATE INDEX idx_trades_trades_strategy ON trades_trades(strategy_id);
CREATE INDEX idx_trades_backtest_strategy ON trades_backtest_results(strategy_id);
CREATE INDEX idx_trades_leaderboard_strategy ON trades_leaderboard(strategy_id);
CREATE INDEX idx_trades_leaderboard_account ON trades_leaderboard(account_type);
