import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { calculateHealthScore } from '../utils/healthScore'

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
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const [page, setPage] = useState(1)
  const limit = 20

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (category && category !== 'ALL') params.append('category', category)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    fetch(`http://localhost:5000/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err)
        setLoading(false)
      })
  }, [search, category, page])

  // Reset page to 1 when search or category changes
  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleCategoryChange = (val: string) => {
    setCategory(val)
    setPage(1)
  }

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

      {/* Search and Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products or brands..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 flex-1 focus:outline-none focus:border-emerald-500"
        />

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 md:w-64 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Categories</option>
          <option value="BISCUIT">Biscuits</option>
          <option value="SNACKS">Snacks</option>
          <option value="BEVERAGES">Beverages</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading products from database...</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400">No products found matching your search.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => {
              const health = calculateHealthScore(product.ingredients)
              return (
                <Link
                  key={product.id}
                  to="/products/$id"
                  params={{ id: product.id.toString() }}
                  className="bg-slate-800 border border-slate-700 p-5 rounded-lg shadow-md hover:border-emerald-500 transition block"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-emerald-400">{product.name}</h2>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${health.color}`}>
                      {health.label}
                    </span>
                  </div>
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
              )
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg font-medium transition disabled:opacity-40"
            >
              ← Previous Page
            </button>
            <span className="text-slate-400 font-medium">Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={products.length < limit}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg font-medium transition disabled:opacity-40"
            >
              Next Page →
            </button>
          </div>
        </>
      )}
    </div>
  )
}