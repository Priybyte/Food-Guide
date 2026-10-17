
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import * as schema from '../schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is missing from the .env file');
}

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
