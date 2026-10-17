import express from 'express';
import cors from 'cors'; 
import { db } from './db';
import { products } from '../schema';
import { eq } from 'drizzle-orm';

const app = express();
const PORT = 3000;

app.use(cors()); // <--- Enable CORS for all routes
app.use(express.json());

// Test endpoint
app.get('/', (_req, res) => {
  res.send('Food-Guide API is running!');
});

// Get all products
app.get('/api/products', async (_req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, brand, category, ingredients } = req.body;

    // Ensure ingredients is formatted properly (handles array or comma-separated string)
    const formattedIngredients = Array.isArray(ingredients) 
      ? ingredients.join(', ') 
      : ingredients;

    const newProduct = await db
      .insert(products)
      .values({
        name,
        brand,
        category,
        ingredients: formattedIngredients,
      })
      .returning();

    return res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error('DETAILED ERROR creating product:', error);
    return res.status(500).json({ 
      error: 'Failed to create product', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Food-Guide API running at http://localhost:${PORT}`);
});