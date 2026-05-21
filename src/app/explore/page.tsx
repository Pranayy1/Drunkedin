"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp, Search, Filter, Bookmark } from "lucide-react";
import type { DrinkCategory } from "@/types";
import type { DrinkRow, DrinkCategoryDB } from "@/types/database";
import AppShell from "@/components/layout/AppShell";
import { useState, useEffect } from "react";
import { getDrinks, searchDrinks, getDrinksByCategory } from "@/lib/services/drinks";

const categories: (DrinkCategory | "All")[] = ["All", "Whiskey", "Beer", "Wine", "Cocktail", "Vodka", "Rum", "Tequila", "Gin"];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<DrinkCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [drinks, setDrinks] = useState<DrinkRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (search) {
      searchDrinks(search).then(setDrinks).finally(() => setLoading(false));
    } else {
      getDrinksByCategory(activeCategory).then(setDrinks).finally(() => setLoading(false));
    }
  }, [activeCategory, search]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Explore Drinks</h1>
          <p className="text-sm text-muted-foreground">Discover trending drinks, rate spirits, and expand your palate</p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search drinks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-bourbon/30 focus:ring-1 focus:ring-bourbon/20 transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-bourbon text-white glow-bourbon"
                  : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Drink cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-bourbon border-t-transparent animate-spin" />
            </div>
          ) : drinks.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
              No drinks found. Try a different search.
            </div>
          ) : drinks.map((drink, i) => (
            <motion.div
              key={drink.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass-card overflow-hidden group cursor-pointer transition-all duration-300 glass-hover"
            >
              {/* Drink "image" placeholder with gradient */}
              <div className="h-36 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  drink.category === "Whiskey" ? "from-amber-900/60 to-amber-700/30" :
                  drink.category === "Beer" ? "from-yellow-800/60 to-amber-600/30" :
                  drink.category === "Wine" ? "from-wine/60 to-rose-900/30" :
                  drink.category === "Cocktail" ? "from-neon-purple/40 to-neon-pink/20" :
                  drink.category === "Vodka" ? "from-blue-900/50 to-cyan-800/20" :
                  drink.category === "Rum" ? "from-amber-800/60 to-yellow-900/30" :
                  drink.category === "Tequila" ? "from-green-900/50 to-lime-800/20" :
                  "from-emerald-900/50 to-teal-800/20"
                }`} />
                <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500">
                  {drink.category === "Whiskey" ? "🥃" :
                   drink.category === "Beer" ? "🍺" :
                   drink.category === "Wine" ? "🍷" :
                   drink.category === "Cocktail" ? "🍸" :
                   drink.category === "Vodka" ? "🫗" :
                   drink.category === "Rum" ? "🥃" :
                   drink.category === "Tequila" ? "🫗" :
                   "🍸"}
                </div>
                {drink.trending && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-bourbon/80 text-white text-[10px] font-medium">
                    <TrendingUp className="w-2.5 h-2.5" /> Trending
                  </div>
                )}
                <button className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/30 text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold leading-tight">{drink.name}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-muted-foreground shrink-0">{drink.abv}%</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{drink.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber fill-amber" />
                    <span className="text-xs font-medium">{drink.rating}</span>
                    <span className="text-[10px] text-muted-foreground">({drink.reviews.toLocaleString()})</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{drink.origin}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
