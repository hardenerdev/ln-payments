import { Pool } from 'pg';
import postgresConfig from '../config/postgres.config';

const pool = new Pool({
  host: postgresConfig.host,
  port: postgresConfig.port as number,
  user: postgresConfig.user,
  password: postgresConfig.password,
  database: postgresConfig.db,
});

async function checkConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('Connected to postgres');
    client.release();
  } catch (error) {
    console.error(`cannot connect to psql due to ${error}`);
  }
};

checkConnection();

export default pool;
