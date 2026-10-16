const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function setup() {
  try {
    // Enable pgvector and pg_trgm extensions
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
    await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
    console.log('Extensions enabled successfully!');
  } catch (err) {
    console.error('Error enabling extensions:', err);
  } finally {
    await sql.end();
  }
}

setup();