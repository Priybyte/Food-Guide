import { pgTable, serial, text, vector } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category'),
  ingredients: text('ingredients'),
  harmfulnessScore: text('harmfulness_score'),
  // Vector column for AI embeddings
  embedding: vector('embedding', { dimensions: 1536 }),
});