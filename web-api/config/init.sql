DROP SCHEMA IF EXISTS survive;
CREATE SCHEMA IF NOT EXISTS survive;

DROP TABLE IF EXISTS survive.players;
CREATE TABLE survive.players
(
  id serial PRIMARY KEY,
  address TEXT DEFAULT NULL,
  join_timestamp TIMESTAMP default now(),
  block_idx INTEGER default null,
  balance DOUBLE PRECISION default null,
  block_hash TEXT default null,
  status INTEGER default 1,
  status_timestamp TIMESTAMP default null
);
