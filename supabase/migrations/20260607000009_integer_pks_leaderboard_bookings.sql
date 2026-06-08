-- trades_leaderboard
alter table trades_leaderboard add column int_id bigserial;
alter table trades_leaderboard drop constraint trades_leaderboard_pkey;
alter table trades_leaderboard drop column id;
alter table trades_leaderboard rename column int_id to id;
alter table trades_leaderboard add primary key (id);

-- trades_bookings
alter table trades_bookings add column int_id bigserial;
alter table trades_bookings drop constraint trades_bookings_pkey;
alter table trades_bookings drop column id;
alter table trades_bookings rename column int_id to id;
alter table trades_bookings add primary key (id);

-- trades_trades
alter table trades_trades add column int_id bigserial;
alter table trades_trades drop constraint trades_trades_pkey;
alter table trades_trades drop column id;
alter table trades_trades rename column int_id to id;
alter table trades_trades add primary key (id);
