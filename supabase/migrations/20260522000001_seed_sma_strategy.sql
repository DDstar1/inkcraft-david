insert into strategies (slug, name, symbol, contract_type, description) values
  ('sma_crossover_eurusd', 'SMA Crossover EUR/USD', 'frxEURUSD', 'CALL',
   'Enters a CALL contract when the 10-period SMA crosses above the 20-period SMA on EUR/USD. Classic trend-following crossover signal.')
on conflict (slug) do nothing;
