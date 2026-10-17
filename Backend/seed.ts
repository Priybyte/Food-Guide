import { db } from './db';
import { products } from '../schema'; // Adjust path if your schema is in the root
import 'dotenv/config';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Example test product insertion to verify everything works
    await db.insert(products).values({
      name: 'Sample Organic Protein Bar',
      category: 'Snacks',
      ingredients: ['Dates', 'Almonds', 'Whey Protein', 'Cocoa'],
      harmfulnessScore: 1, // 1 = Safe/Healthy
      embedding: Array(1536).fill(0), // Placeholder vector for pgvector
    });

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seed();