import express from 'express';
import cors from 'cors'; 
import { db } from './db';
import { products } from '../schema';
import { eq, and, ilike } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (_req, res) => {
  res.send('Food-Guide API is running!');
});

// Get products with search, category filtering, and pagination (default 20 per page)
app.get('/api/products', async (req, res) => {
  try {
    const { search, category, page = '1', limit = '20' } = req.query;
    
    const conditions = [];

    if (search && typeof search === 'string' && search.trim() !== '') {
      conditions.push(ilike(products.name, `%${search.trim()}%`));
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      conditions.push(ilike(products.category, `%${category.trim()}%`));
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const offsetNum = (pageNum - 1) * limitNum;

    let query = db.select().from(products);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const allProducts = await query.limit(limitNum).offset(offsetNum);
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
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

// Update an existing product (PUT)
app.put('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const { name, brand, category, ingredients } = req.body;

    const updatedProduct = await db
      .update(products)
      .set({ name, brand, category, ingredients })
      .where(eq(products.id, id))
      .returning();

    if (updatedProduct.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

app.listen(PORT, () => {
  console.log(`Food-Guide API running at http://localhost:${PORT}`);
});