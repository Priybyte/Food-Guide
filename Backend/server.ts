import { eq } from 'drizzle-orm';
import express from 'express';
import { db } from './db';
import { products } from '../schema';

const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
  console.log(`Food-Guide API running at http://localhost:${PORT}`);
});
