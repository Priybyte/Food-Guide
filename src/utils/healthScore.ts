export function calculateHealthScore(ingredients: string | null) {
  if (!ingredients) {
    return { label: 'Unknown', color: 'bg-slate-700 text-slate-300 border-slate-600', score: 0 };
  }

  const lower = ingredients.toLowerCase();
  
  // Define red flags (high processed sugar, trans fats, palm oil, artificial preservatives)
  const harmfulKeywords = [
    'palm oil', 'hydrogenated', 'high fructose', 'corn syrup', 
    'artificial flavor', 'artificial color', 'sodium benzoate', 
    'refined palm oil', 'invert sugar', 'acesulfame'
  ];

  let penaltyCount = 0;
  harmfulKeywords.forEach(keyword => {
    if (lower.includes(keyword)) {
      penaltyCount++;
    }
  });

  // Assign score based on penalty matches
  if (penaltyCount === 0 && (lower.includes('whole wheat') || lower.includes('oats') || lower.includes('millets'))) {
    return { label: 'Healthy (Grade A)', color: 'bg-emerald-900/60 text-emerald-400 border-emerald-700', score: 5 };
  } else if (penaltyCount <= 1) {
    return { label: 'Moderate (Grade B)', color: 'bg-amber-900/60 text-amber-400 border-amber-700', score: 3 };
  } else {
    return { label: 'High Risk (Grade C)', color: 'bg-rose-900/60 text-rose-400 border-rose-700', score: 1 };
  }
}