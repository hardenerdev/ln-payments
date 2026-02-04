import { Pool, PoolClient, QueryResult } from 'pg';
import postgresConfig from '../config/postgres.config';

class Persistence {
  // singleton patter to ensures same connection pool
  // avoiding idle connections
  private pool: Pool;
  private static instance: Persistence;

  constructor() {
    this.pool = new Pool({
      host: postgresConfig.host,
      port: postgresConfig.port as number,
      user: postgresConfig.user,
      password: postgresConfig.password,
      database: postgresConfig.db,
    });
  }

  public static getInstance(): Persistence {
    if (!Persistence.instance) {
      Persistence.instance = new Persistence();
    }

    return Persistence.instance;
  }

  async checkConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log('Connected to postgres');
      client.release();
    } catch (error) {
      console.error(`cannot connect to psql due to ${error}`);
    }
  };

  public async query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }
}

export default Persistence.getInstance();
