"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans relative selection:bg-primary/30">
      {/* Background premium grid & gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050505] to-[#050505] -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Navbar with glassmorphism */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-black tracking-tighter"
          >
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,168,255,0.5)] group-hover:shadow-[0_0_25px_rgba(0,168,255,0.7)] transition-shadow">
                P
              </div>
              <div>
                <span className="text-white">PREMIER</span>{" "}
                <span className="text-zinc-500 font-light">INTEGRAL</span>
              </div>
            </Link>
          </motion.div>
          
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex gap-8 font-medium text-sm tracking-wide"
          >
            <Link href="/" className="text-zinc-400 hover:text-white transition-all py-2">Inicio</Link>
            <Link href="/catalogo" className="text-zinc-400 hover:text-white transition-all py-2">Catálogo</Link>
            <Link href="/armador" className="text-primary font-bold flex items-center gap-2 py-2 group drop-shadow-[0_0_8px_rgba(0,168,255,0.5)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary group-hover:bg-white transition-colors"></span>
              </span>
              Armá tu Equipo
            </Link>
          </motion.nav>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-4 items-center"
          >
            <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5 transition-all hidden sm:inline-flex rounded-full">Ingresar</Button>
            <Button variant="outline" size="icon" className="border-white/10 bg-black/50 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all rounded-full group">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-primary transition-colors"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center py-32 px-4 text-center relative overflow-hidden">
        {/* Dynamic Glow effects */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[150px] pointer-events-none mix-blend-screen" 
        />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="inline-block mb-8 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-black tracking-[0.3em] backdrop-blur-md shadow-[0_0_20px_rgba(0,168,255,0.15)] uppercase">
            Experiencia Audiocar Premium
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter mb-6 max-w-5xl uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-2xl leading-[1.1]">
            El sonido perfecto <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-blue-600">para tu vehículo</span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl font-light leading-relaxed">
            Utilizá nuestro simulador inteligente. Garantizamos el balance perfecto de potencia e impedancia con los mejores componentes del mercado.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4">
            <Link href="/armador" className="w-full sm:w-auto">
              <Button size="lg" className="w-full relative group h-16 px-12 text-lg font-black bg-primary hover:bg-primary/90 text-black border-0 overflow-hidden rounded-full shadow-[0_0_40px_rgba(0,168,255,0.4)] transition-all hover:scale-105 uppercase tracking-wider">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                <span>Simulador PRO</span>
              </Button>
            </Link>
            <Link href="/catalogo" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-16 px-12 text-lg rounded-full border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/30 text-white backdrop-blur-md transition-all uppercase tracking-wider font-bold">
                Ver Catálogo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Premium Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 bg-[#050505] mt-auto relative overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-black tracking-tighter mb-6 flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black">
                P
              </div>
              <span className="text-white">PREMIER</span> <span className="text-zinc-500 font-light">INTEGRAL</span>
            </div>
            <p className="text-zinc-500 text-sm max-w-md leading-relaxed font-light">
              Elevando el estándar en Car Audio. Instalaciones premium, asesoramiento técnico avanzado y los mejores componentes del mercado para tu proyecto.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white tracking-widest text-[10px] uppercase">Navegación</h4>
            <ul className="space-y-4 text-sm text-zinc-500 font-light">
              <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link></li>
              <li><Link href="/armador" className="hover:text-primary transition-colors">Simulador PRO</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white tracking-widest text-[10px] uppercase">Contacto</h4>
            <ul className="space-y-4 text-sm text-zinc-500 font-light">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary">📍</span> 
                Córdoba, Argentina
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary">📱</span> 
                +54 9 3472 448762
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-xs text-zinc-600 font-light">
            © {new Date().getFullYear()} PREMIER INTEGRAL. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
