import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/products/new')({
  component: NewProductPage,
})

function NewProductPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          brand,
          category,
          ingredients: ingredients.split(',').map((item) => item.trim()),
        }),
      })

      if (response.ok) {
        navigate({ to: '/' })
      } else {
        alert('Failed to create product')
      }
    } catch (err) {
      console.error(err)
      alert('Error submitting product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 text-white rounded-lg mt-10 shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Add New Food Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 bg-slate-800 rounded border border-slate-700"
            placeholder="e.g. Organic Peanut Butter"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-2 bg-slate-800 rounded border border-slate-700"
            placeholder="e.g. NutriGood"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-slate-800 rounded border border-slate-700"
            placeholder="e.g. Spreads"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ingredients (comma-separated)</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={3}
            className="w-full p-2 bg-slate-800 rounded border border-slate-700"
            placeholder="Peanuts, Salt, Palm Oil"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-semibold transition"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  )
}