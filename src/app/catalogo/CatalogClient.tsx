"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
};

const CATEGORIES = [
  { id: "ALL", label: "Todos los Productos" },
  { id: "COMBOS", label: "Combos Armados" },
  { id: "ESTEREOS_PANTALLAS", label: "Estéreos & Pantallas" },
  { id: "PARLANTES_MEDIOS", label: "Parlantes y Vías" },
  { id: "AMPLIFICADORES", label: "Amplificadores" },
  { id: "SUBWOOFERS", label: "Subwoofers" },
  { id: "CABLEADO_ACCESORIOS", label: "Cables y Filtros" },
  { id: "BATERIAS", label: "Baterías y Fuentes" },
  { id: "ACCESORIOS", label: "Otros Accesorios" },
];

export default function CatalogClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  let filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "ALL" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : Infinity;
    const matchesPrice = p.price >= min && p.price <= max;
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  if (sortBy === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-primary/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050505] to-[#050505] -z-10" />
      
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,168,255,0.5)] group-hover:shadow-[0_0_25px_rgba(0,168,255,0.7)] transition-shadow">
              P
            </div>
            <span>
              <span className="text-white">PREMIER</span> <span className="text-zinc-500 font-light">INTEGRAL</span>
            </span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/armador">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-all font-semibold px-6 rounded-full shadow-[0_0_15px_rgba(0,168,255,0.1)]">
                Simulador de Armado PRO
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Categorías */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="sticky top-28 bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(0,168,255,0.5)]"></div>
              Filtros
            </h2>
            
            <div className="mb-8">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar producto..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-zinc-600"
                />
                <svg className="w-4 h-4 absolute left-4 top-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Categorías</h3>
              <div className="flex flex-col gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-between group ${
                      activeCategory === cat.id 
                        ? "bg-primary/10 text-primary font-semibold border border-primary/20 shadow-[inset_0_0_10px_rgba(0,168,255,0.05)]" 
                        : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                      activeCategory === cat.id ? "bg-primary/20 text-primary" : "bg-white/5 text-zinc-500 group-hover:bg-white/10 group-hover:text-zinc-300"
                    }`}>
                      {cat.id === "ALL" 
                        ? products.length 
                        : products.filter(p => p.category === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Rango de Precio</h3>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">$</span>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-white placeholder:text-zinc-600"
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">$</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Grilla de Productos */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">Catálogo Premium</h1>
              <p className="text-zinc-400 font-light">Explorá {filteredProducts.length} productos de alta gama</p>
            </div>
            
            <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-xl border border-white/10">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider pl-3">Ordenar:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none rounded-lg px-4 py-2 text-sm font-semibold text-white focus:outline-none cursor-pointer hover:bg-white/5 transition-colors appearance-none"
                style={{ WebkitAppearance: 'none' }}
              >
                <option value="relevance" className="bg-zinc-900">Relevancia</option>
                <option value="asc" className="bg-zinc-900">Menor Precio</option>
                <option value="desc" className="bg-zinc-900">Mayor Precio</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  key={product.id} 
                  className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,168,255,0.15)] hover:border-primary/30 transition-all duration-500 flex flex-col group relative backdrop-blur-sm"
                >
                  <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-zinc-300 font-mono tracking-wider border border-white/10 shadow-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    CÓD: {product.id}
                  </div>
                  
                  <div className="aspect-square bg-gradient-to-br from-zinc-900/50 to-black flex items-center justify-center p-6 relative overflow-hidden group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-primary/5 group-hover:after:mix-blend-overlay">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <svg className="w-24 h-24 text-zinc-800 group-hover:text-primary/20 group-hover:scale-110 transition-all duration-700 relative z-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      {product.category === "ESTEREOS_PANTALLAS" && <><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></>}
                      {product.category === "PARLANTES_MEDIOS" && <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></>}
                      {product.category === "AMPLIFICADORES" && <><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line></>}
                      {product.category === "SUBWOOFERS" && <><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></>}
                      {product.category === "BATERIAS" && <><rect x="2" y="7" width="20" height="11" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="14"></line></>}
                      {(product.category === "CABLEADO_ACCESORIOS" || product.category === "ACCESORIOS") && <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>}
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                      <span className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-black/50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        Consultar
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col relative bg-gradient-to-t from-black to-transparent">
                    <div className="text-[10px] text-primary mb-3 font-black uppercase tracking-widest bg-primary/10 border border-primary/20 inline-block px-2.5 py-1 rounded-md w-max shadow-[0_0_10px_rgba(0,168,255,0.1)]">
                      {CATEGORIES.find(c => c.id === product.category)?.label}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-primary transition-colors leading-snug">{product.name}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-6 font-light leading-relaxed">{product.description}</p>
                    
                    <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Precio Unitario</span>
                        <span className="text-2xl font-black text-white tracking-tight">
                          ${product.price.toLocaleString("es-AR")}
                        </span>
                      </div>
                      <Button size="icon" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,168,255,0.4)] group/btn">
                        <svg className="w-5 h-5 transition-transform group-hover/btn:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-24 text-center text-zinc-500 border border-white/5 rounded-3xl bg-white/[0.01] border-dashed">
                <div className="mb-6 text-5xl opacity-50">🔍</div>
                <h3 className="text-xl font-bold text-zinc-300 mb-2">No se encontraron productos</h3>
                <p className="text-sm font-light">Intentá ajustando los filtros o el término de búsqueda.</p>
                <Button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("ALL"); setMinPrice(""); setMaxPrice(""); }}
                  variant="outline" 
                  className="mt-6 border-white/10 hover:bg-white/5 text-white rounded-full px-6"
                >
                  Limpiar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
