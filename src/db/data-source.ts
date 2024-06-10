import 'reflect-metadata'
import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { DataSourceOptions } from 'typeorm'
import Logger from '../utils/logger'

dotenv.config()

const { DB_CERT, DB_HOST, DB_PORT, DB_USER, DB_USER_PWD, DB_NAME, NODE_ENV } =
  process.env

const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT || '5432', 10),
  username: DB_USER,
  password: DB_USER_PWD,
  database: DB_NAME,
  synchronize: NODE_ENV === 'development',
  migrationsRun: NODE_ENV === 'development',
  logging: NODE_ENV === 'development',
  entities: [__dirname + '/entities/**/*.{js,ts}'],
  migrations: [__dirname + '/migrations/**/*.{js,ts}'],
  subscribers: [__dirname + '/subscribers/**/*.{js.ts}'],
  ssl: DB_CERT
    ? {
        rejectUnauthorized: false,
        ca: DB_CERT,
      }
    : undefined,
}

Logger.debug(`DB Configuration: ${JSON.stringify(connectionOptions, null, 2)}`)

const AppDataSource = new DataSource(connectionOptions)

export default AppDataSource
