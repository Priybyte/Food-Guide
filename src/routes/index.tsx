import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

interface Product {
  id: number
  name: string
  brand: string | null
  category: string | null
  ingredients: string | null
}

function IndexPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Food Product Catalog</h1>
        <Link
          to="/products/new"
          className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-semibold transition"
        >
          + Add New Product
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading products from database...</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400">No products found. Add your first one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to="/products/$id"
              params={{ id: product.id.toString() }}
              className="bg-slate-800 border border-slate-700 p-5 rounded-lg shadow-md hover:border-emerald-500 transition block"
            >
              <h2 className="text-xl font-semibold text-emerald-400">{product.name}</h2>
              <p className="text-sm text-slate-300 mt-1">
                <span className="font-medium text-slate-400">Brand:</span> {product.brand || 'N/A'}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-medium text-slate-400">Category:</span> {product.category || 'N/A'}
              </p>
              <p className="text-sm text-slate-300 mt-2 truncate">
                <span className="font-medium text-slate-400">Ingredients:</span> {product.ingredients || 'N/A'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}