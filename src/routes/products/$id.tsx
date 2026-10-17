import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { calculateHealthScore } from '../../utils/healthScore'

export const Route = createFileRoute('/products/$id')({
  component: ProductDetailPage,
})

interface Product {
  id: number
  name: string
  brand: string | null
  category: string | null
  ingredients: string | null
}

function ProductDetailPage() {
  const { id } = Route.useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <div className="max-w-3xl mx-auto p-6 text-slate-400">Loading product details...</div>
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-white">
        <p className="text-red-400 mb-4">{error || 'Product not found'}</p>
        <Link to="/" className="text-emerald-400 hover:underline">← Back to Catalog</Link>
      </div>
    )
  }

  const health = calculateHealthScore(product.ingredients)

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="text-emerald-400 hover:underline font-medium">
          ← Back to Catalog
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-lg mt-2">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full border border-emerald-700/50">
            {product.category || 'GENERAL'}
          </span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${health.color}`}>
            {health.label}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-emerald-400 mt-4 mb-2">{product.name}</h1>
        
        <p className="text-slate-300 text-lg mb-6">
          <span className="text-slate-400 font-medium">Brand:</span> {product.brand || 'Unknown'}
        </p>

        <div className="border-t border-slate-700 pt-6">
          <h2 className="text-xl font-semibold mb-3 text-slate-200">Ingredients Breakdown</h2>
          <p className="text-slate-300 bg-slate-900/60 p-4 rounded-lg border border-slate-700 leading-relaxed">
            {product.ingredients || 'No ingredient information available for this product.'}
          </p>
        </div>
      </div>
    </div>
  )
}