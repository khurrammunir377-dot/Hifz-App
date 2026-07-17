import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the project root (two levels up from server/db/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connection = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// mode: 'default' is the standard MySQL mode (not PlanetScale)
export const db = drizzle(connection, { schema, mode: 'default' });
