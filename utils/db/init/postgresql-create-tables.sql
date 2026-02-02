CREATE TABLE IF NOT EXISTS invoices (
	id TEXT PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  memo TEXT NOT NULL,
  tokens BIGINT NOT NULL,
  payment TEXT NOT NULL,
  payment_request TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
	id TEXT PRIMARY KEY,
  confirmed_at TIMESTAMP NOT NULL,
  tokens BIGINT NOT NULL,
	fee BIGINT NOT NULL,
	confirmed BOOLEAN NOT NULL,
	outgoing BOOLEAN NOT NULL,
	preimage VARCHAR(255)
);
