import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Load .env from root directory FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// 2. Import database and modules AFTER dotenv is configured
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from './db';
import { products } from '../schema';

async function seedCsv() {
  try {
    console.log('Reading CSV file...');
    const csvFilePath = path.join(__dirname, '../foods-india-processed.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Parsed ${records.length} products from CSV. Starting database insertion...`);

    for (const record of records) {
      const name = record['Item name'] || 'Unknown Product';
      const brand = record['Brand_Name'] || null;
      const category = record['Category'] || null;
      const ingredients = record['Ingredients'] || null;
      
      const harmfulnessScore = Math.floor(Math.random() * 5) + 1;

      await db.insert(products).values({
        name,
        brand,
        category,
        ingredients,
        harmfulnessScore,
      });
    }

    console.log('Successfully seeded all CSV products into Neon DB!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding CSV data:', error);
    process.exit(1);
  }
}

seedCsv();