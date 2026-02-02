interface PostgresConfig {
  host: string | undefined;
  port: string | number | undefined;
  user: string | undefined;
  password: string | undefined;
  db: string | undefined;
};

const postgresConfig: PostgresConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || '5432',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres-password',
  db: process.env.POSTGRES_DB || 'ln-payments',
};

export default postgresConfig;
