"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  rms: number | null;
  impedance: string | null;
  channels: number | null;
};

type SelectionItem = {
  product: Product;
  quantity: number;
};

const steps = [
  { id: "estereo", name: "Estéreo / Pantalla", catFilter: ["ESTEREOS_PANTALLAS"] },
  { id: "parlantes", name: "Parlantes y Medios", catFilter: ["PARLANTES_MEDIOS"] },
  { id: "subwoofer", name: "Subwoofers", catFilter: ["SUBWOOFERS"] },
  { id: "amplificador", name: "Amplificadores", catFilter: ["AMPLIFICADORES"] },
  { id: "cables_bateria", name: "Cables y Baterías", catFilter: ["CABLEADO_ACCESORIOS", "BATERIAS"] },
  { id: "accesorios_extras", name: "Accesorios Extras", catFilter: ["ACCESORIOS"] },
];

export default function ArmadorClient({ products }: { products: Product[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  
  const [selections, setSelections] = useState<Record<number, SelectionItem[]>>({
    0: [], 1: [], 2: [], 3: [], 4: [], 5: []
  });

  const handleSelect = (product: Product) => {
    setSelections(prev => {
      const stepSelections = [...prev[currentStep]];
      const existingIndex = stepSelections.findIndex(s => s.product.id === product.id);
      if (existingIndex >= 0) {
        stepSelections[existingIndex].quantity += 1;
      } else {
        stepSelections.push({ product, quantity: 1 });
      }
      return { ...prev, [currentStep]: stepSelections };
    });
  };

  const updateQuantity = (stepIndex: number, productId: string, delta: number) => {
    setSelections(prev => {
      const stepSelections = [...prev[stepIndex]];
      const itemIndex = stepSelections.findIndex(s => s.product.id === productId);
      if (itemIndex >= 0) {
        const newQ = stepSelections[itemIndex].quantity + delta;
        if (newQ > 0) {
          stepSelections[itemIndex].quantity = newQ;
        } else {
          stepSelections.splice(itemIndex, 1);
        }
      }
      return { ...prev, [stepIndex]: stepSelections };
    });
  };

  const requiredRms = useMemo(() => {
    let total = 0;
    selections[1].forEach(s => total += (s.product.rms || 0) * s.quantity);
    selections[2].forEach(s => total += (s.product.rms || 0) * s.quantity);
    return total;
  }, [selections]);

  const currentStepFilter = steps[currentStep].catFilter;
  let currentProducts = products.filter(p => currentStepFilter.includes(p.category));

  if (currentStep === 3 && requiredRms > 0) {
    currentProducts = currentProducts.filter(p => {
      if (!p.rms) return true;
      return p.rms >= requiredRms * 0.8 && p.rms <= requiredRms * 2.5;
    });
    if (sortBy === "relevance") {
      currentProducts.sort((a, b) => {
        const diffA = Math.abs((a.rms || 0) - requiredRms);
        const diffB = Math.abs((b.rms || 0) - requiredRms);
        return diffA - diffB;
      });
    }
  }

  if (sortBy === "asc") {
    currentProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "desc") {
    currentProducts.sort((a, b) => b.price - a.price);
  }

  let subtotal = 0;
  Object.values(selections).forEach(stepItems => {
    stepItems.forEach(item => {
      subtotal += item.product.price * item.quantity;
    });
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", celular: "", localidad: "" });

  const generateWaLink = () => {
    let msg = `Hola PREMIER INTEGRAL, soy *${formData.nombre}* de *${formData.localidad}*.\n`;
    msg += `Mi celular de contacto es: ${formData.celular}\n\n`;
    msg += "Quiero armar este equipo:\n\n";
    let hasItems = false;
    Object.entries(selections).forEach(([step, items]) => {
      if (items.length > 0) {
        msg += `*${steps[Number(step)].name}:*\n`;
        items.forEach(item => {
          msg += `- ${item.quantity}x ${item.product.name} (Cód: ${item.product.id}) - $${(item.product.price * item.quantity).toLocaleString("es-AR")}\n`;
          hasItems = true;
        });
        msg += `\n`;
      }
    });
    if (!hasItems) return "#";
    msg += `*Total Estimado:* $${subtotal.toLocaleString("es-AR")}\n\n`;
    if (requiredRms > 0) msg += `_RMS Total del Proyecto: ${requiredRms}W_\n`;
    msg += "Me gustaría avanzar con el pedido.";
    return `https://wa.me/5493472448762?text=${encodeURIComponent(msg)}`;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.celular || !formData.localidad) return;
    window.open(generateWaLink(), "_blank");
    setIsCheckoutOpen(false);
  };

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
          <div className="text-sm font-medium text-zinc-400 flex gap-4 items-center">
            {requiredRms > 0 && <span className="text-primary border border-primary/20 bg-primary/10 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,168,255,0.1)] text-xs font-bold tracking-wide">RMS REQUERIDO: {requiredRms}W</span>}
            <span className="hidden sm:inline-block bg-white/5 px-4 py-1.5 rounded-full border border-white/10">Simulador de Armado PRO</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col xl:flex-row gap-10">
        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
              <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(0,168,255,0.5)]"></div>
              Tu Proyecto
            </h2>
            
            <div className="space-y-6 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/5 -z-10 rounded-full"></div>
              
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const items = selections[index];
                const isPast = items.length > 0;
                
                return (
                  <div key={step.id} className="flex gap-5 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 cursor-pointer z-10 shadow-lg
                        ${isActive ? "border-primary bg-primary text-black scale-110 shadow-[0_0_15px_rgba(0,168,255,0.4)]" : 
                          isPast ? "border-primary bg-black text-primary" : 
                          "border-white/10 bg-[#050505] text-zinc-500 hover:border-white/30"}`}
                        onClick={() => setCurrentStep(index)}
                      >
                        {isPast && !isActive ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : index + 1}
                      </div>
                    </div>
                    <div className="pt-1 flex-1 pb-4">
                      <h3 
                        className={`font-bold text-lg cursor-pointer transition-colors ${isActive ? "text-primary" : isPast ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                        onClick={() => setCurrentStep(index)}
                      >
                        {step.name}
                      </h3>
                      {items.length > 0 ? (
                        <div className="mt-3 space-y-3">
                          <AnimatePresence>
                            {items.map(item => (
                              <motion.div 
                                initial={{ opacity: 0, x: -10, height: 0 }} animate={{ opacity: 1, x: 0, height: "auto" }} exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                key={item.product.id} className="text-sm bg-black/40 p-4 rounded-2xl border border-white/5 relative group"
                              >
                                <div className="text-white font-semibold leading-snug mb-1 pr-6">{item.product.name}</div>
                                <div className="text-[10px] text-zinc-500 font-mono tracking-wider mb-2">CÓD: {item.product.id}</div>
                                <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-3">
                                  <span className="text-primary font-black">${(item.product.price * item.quantity).toLocaleString("es-AR")}</span>
                                  <div className="flex items-center gap-4 bg-white/5 rounded-full px-3 py-1 border border-white/10">
                                    <button onClick={() => updateQuantity(index, item.product.id, -1)} className="text-zinc-400 hover:text-white text-lg leading-none transition-colors">-</button>
                                    <span className="text-white text-sm font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(index, item.product.id, 1)} className="text-zinc-400 hover:text-white text-lg leading-none transition-colors">+</button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          {!isActive && <button onClick={() => setCurrentStep(index)} className="text-xs text-primary font-semibold hover:underline mt-2 inline-flex items-center gap-1">+ Agregar más</button>}
                        </div>
                      ) : isActive ? (
                        <div className="text-sm text-primary/60 mt-2 font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                          Agregá componentes...
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-xl sticky top-28 shadow-2xl">
            <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-6">
              <span className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Total Estimado</span>
              <span className="text-4xl font-black text-white tracking-tight">${subtotal.toLocaleString("es-AR")}</span>
            </div>
            
            {subtotal > 0 ? (
              <Button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-16 rounded-2xl text-lg shadow-[0_0_25px_rgba(37,211,102,0.3)] hover:scale-[1.02] transition-all group overflow-hidden relative">
                <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  Enviar a WhatsApp
                </span>
              </Button>
            ) : (
              <Button className="w-full bg-white/5 text-zinc-500 font-bold h-16 rounded-2xl cursor-not-allowed border border-white/5" disabled>
                Armá tu equipo primero
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl min-h-[700px] flex flex-col shadow-2xl backdrop-blur-sm">
            <div className="mb-8 pb-8 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="text-primary font-black tracking-widest text-sm mb-3 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Paso {currentStep + 1} de {steps.length}
                </div>
                <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
                  {steps[currentStep].name}
                </h1>
                {currentStep === 3 && requiredRms > 0 ? (
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl text-sm text-primary/90 flex gap-4 items-start mt-4 shadow-[inset_0_0_20px_rgba(0,168,255,0.05)]">
                    <span className="text-2xl mt-1">⚡</span>
                    <div>
                      <strong className="block text-primary text-base mb-1">Filtro Inteligente Pro</strong>
                      <p className="leading-relaxed">Tu sistema requiere aproximadamente <strong>{requiredRms}W RMS</strong>. Seleccionamos automáticamente los amplificadores que rinden de forma óptima para esta configuración.</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-400 text-base font-light">
                    {currentStep === 0 && "Seleccioná la unidad principal. Es el cerebro de tu sistema de audio."}
                    {currentStep === 2 && "Elegí el golpe para tu equipo. Seleccioná el subwoofer adecuado."}
                    {currentStep === 4 && "Todo sistema necesita energía. Agregá el cableado o baterías extra."}
                    {currentStep === 5 && "Detalles finales. Completá tu instalación con accesorios premium."}
                    {![0, 2, 4, 5].includes(currentStep) && "Seleccioná uno o más productos. Podés ajustar las cantidades desde tu panel izquierdo."}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-xl border border-white/10 shrink-0">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider pl-3 hidden sm:inline-block">Ordenar:</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 content-start">
              {currentProducts.length > 0 ? currentProducts.map((product) => {
                const selectedItem = selections[currentStep].find(s => s.product.id === product.id);
                const isSelected = !!selectedItem;
                
                return (
                  <div 
                    key={product.id} 
                    className={`border rounded-3xl p-6 transition-all duration-300 bg-white/[0.02] flex flex-col group relative overflow-hidden backdrop-blur-sm
                      ${isSelected ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(0,168,255,0.15)] scale-[1.02]' : 'border-white/5 hover:border-white/20 hover:bg-white/[0.04]'}`}
                  >
                    {isSelected && <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-blue-500"></div>}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
                        {product.category.replace("_", " ")}
                      </div>
                      <div className="flex gap-2 text-[10px] text-zinc-400 font-bold bg-black/50 px-3 py-1.5 rounded-md border border-white/5">
                        {product.rms && <span>{product.rms}W RMS</span>}
                        {product.impedance && <span>{product.impedance}Ω</span>}
                        {product.channels && <span>{product.channels}CH</span>}
                      </div>
                    </div>
                    
                    <div className="absolute top-16 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-mono text-zinc-500 bg-black/80 px-2 py-1 rounded">CÓD: {product.id}</span>
                    </div>
                    
                    <h4 className="font-bold text-xl mb-3 leading-snug text-white group-hover:text-primary transition-colors">{product.name}</h4>
                    <p className="text-sm text-zinc-400 mb-6 font-light leading-relaxed line-clamp-3">{product.description}</p>
                    
                    <div className="mt-auto flex justify-between items-end pt-5 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Precio</span>
                        <span className="font-black text-2xl text-white tracking-tight">${product.price.toLocaleString("es-AR")}</span>
                      </div>
                      
                      {isSelected ? (
                        <div className="flex items-center gap-4 bg-primary/20 rounded-2xl px-4 py-2 border border-primary/30 shadow-[inset_0_0_15px_rgba(0,168,255,0.1)]">
                          <button onClick={() => updateQuantity(currentStep, product.id, -1)} className="text-primary hover:text-white font-bold text-xl transition-colors">-</button>
                          <span className="text-white font-black text-base w-4 text-center">{selectedItem.quantity}</span>
                          <button onClick={() => updateQuantity(currentStep, product.id, 1)} className="text-primary hover:text-white font-bold text-xl transition-colors">+</button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleSelect(product)}
                          className="h-12 px-6 rounded-xl font-bold transition-all bg-white/10 text-white hover:bg-primary border border-transparent hover:scale-105"
                        >
                          Agregar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full py-24 text-center text-zinc-500 bg-black/20 rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center">
                  <div className="text-5xl opacity-50 mb-4">⚙️</div>
                  <h3 className="text-xl font-bold text-white mb-2">No se encontraron componentes</h3>
                  <p className="font-light">No hay productos que cumplan con los requerimientos técnicos en este paso.</p>
                </div>
              )}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center sticky bottom-0 bg-[#050505]/90 backdrop-blur-md py-4 z-10 -mx-8 px-8 rounded-b-3xl">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="text-zinc-400 hover:text-white hover:bg-white/5 h-12 px-6 rounded-xl"
              >
                ← Anterior
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  className="bg-primary text-black hover:bg-primary/90 font-black px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(0,168,255,0.4)] hover:scale-105 transition-all uppercase tracking-wider text-sm"
                >
                  {currentStep === steps.length - 1 ? "Revisar Presupuesto" : "Siguiente →"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#25D366] to-[#1DA851]"></div>
              
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
              
              <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#25D366]/20">
                <svg className="w-8 h-8 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Casi listo</h2>
              <p className="text-zinc-400 mb-8 font-light">Dejanos unos datos básicos para enviarle el presupuesto ordenado al equipo de Premier.</p>
              
              <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-widest pl-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    required
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]/50 outline-none transition-all placeholder:text-zinc-600 font-medium"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-widest pl-1">Celular (WhatsApp)</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.celular}
                    onChange={e => setFormData({...formData, celular: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]/50 outline-none transition-all placeholder:text-zinc-600 font-medium"
                    placeholder="Ej. 11 5555 4444"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-widest pl-1">Localidad / Provincia</label>
                  <input 
                    type="text" 
                    required
                    value={formData.localidad}
                    onChange={e => setFormData({...formData, localidad: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]/50 outline-none transition-all placeholder:text-zinc-600 font-medium"
                    placeholder="Ej. Rosario, Santa Fe"
                  />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black h-16 rounded-xl text-lg shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all hover:scale-[1.02]">
                    Enviar Presupuesto
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
