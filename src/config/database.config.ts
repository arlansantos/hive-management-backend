import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hive_management_db',

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],

  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],

  synchronize: process.env.DB_SYNCHRONIZE === 'true',

  logging: process.env.DB_LOGGING === 'true',
};

export const AppDataSource = new DataSource(databaseConfig);
