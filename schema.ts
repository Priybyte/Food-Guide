import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { vector } from 'drizzle-orm/pg-vector';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category'),
  ingredients: text('ingredients'),
  harmfulnessScore: text('harmfulness_score'),
  // Vector column for embeddings (e.g., 1536 dimensions for AI features)
  embedding: vector('embedding', { dimensions: 1536 }),
});