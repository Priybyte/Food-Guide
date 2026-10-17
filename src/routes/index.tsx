import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: HomeScreen,
});

function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Food-Guide Dashboard</h1>
          <p className="text-slate-400">Search products, analyze ingredients, and check harmfulness scores instantly.</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search for a food product or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Search
          </button>
        </div>

        {/* Product Results Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg text-emerald-400">Sample Organic Protein Bar</h3>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20">
                Safe (Score: 1)
              </span>
            </div>
            <p className="text-sm text-slate-400">Category: Snacks</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Dates', 'Almonds', 'Whey Protein', 'Cocoa'].map((ing) => (
                <span key={ing} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-md">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}