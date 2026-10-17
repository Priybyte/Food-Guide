import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/products/$id')({
  component: ProductDetailScreen,
});

interface Product {
  id: number;
  name: string;
  brand: string | null; // Added brand
  category: string;
  ingredients: string[] | string;
  harmfulnessScore: number;
}

function ProductDetailScreen() {
  const { id } = Route.useParams() as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch product details from server.');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 p-6 space-y-4">
        <a href="/" className="text-sm text-emerald-400 hover:underline inline-block">
          ← Back to Dashboard
        </a>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center space-y-2">
          <p className="text-red-400 font-semibold">Product not found or failed to load.</p>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  // Handle ingredients parsing safely
  const ingredientsList = Array.isArray(product.ingredients)
    ? product.ingredients
    : typeof product.ingredients === 'string'
    ? product.ingredients.replace(/[{}]/g, '').split(',')
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <a 
          href="/" 
          className="text-sm text-emerald-400 hover:underline inline-block"
        >
          ← Back to Dashboard
        </a>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Product ID: {product.id}</span>
              <h1 className="text-3xl font-bold text-slate-100 mt-1">{product.name}</h1>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1.5 rounded-full border border-emerald-500/20 font-medium">
              Score: {product.harmfulnessScore || 'N/A'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Brand</h2>
              <p className="text-slate-200 mt-1">{product.brand || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Category</h2>
              <p className="text-slate-200 mt-1">{product.category || 'N/A'}</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Ingredients Breakdown</h2>
            <div className="flex flex-wrap gap-2">
              {ingredientsList.map((ing, idx) => (
                <span key={idx} className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700/50">
                  {ing.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}