'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banner } from '@/types';

interface HeroCarouselProps {
  banners: Banner[];
}

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000); // 6s per slide
    return () => clearInterval(interval);
  }, [currentIndex, banners.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (!banners || banners.length === 0) {
    return (
      <div className="relative h-[70vh] sm:h-[85vh] bg-stone-900 flex items-center justify-center text-white">
        <p className="font-serif text-xl">Carregando Banners...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[75vh] sm:h-[88vh] w-full overflow-hidden bg-stone-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image */}
          <div className="relative w-full h-full">
            <Image
              src={banners[currentIndex].imagem_url}
              alt={banners[currentIndex].titulo || 'Banner'}
              fill
              priority
              className="object-cover object-center opacity-70"
            />
            {/* Gradient Overlay for high-end cinematic feel */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/30" />
          </div>

          {/* Banner Contents */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl text-white space-y-6">
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#C5A880] bg-[#C5A880]/10 px-3 py-1 rounded-full border border-[#C5A880]/20"
                >
                  Coleção Exclusiva
                </motion.span>
                
                {banners[currentIndex].titulo && (
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
                  >
                    {banners[currentIndex].titulo}
                  </motion.h1>
                )}

                {banners[currentIndex].subtitulo && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-stone-300 text-sm sm:text-lg font-light leading-relaxed"
                  >
                    {banners[currentIndex].subtitulo}
                  </motion.p>
                )}

                {banners[currentIndex].link_destino && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-2"
                  >
                    <Link
                      href={banners[currentIndex].link_destino || '/catalogo'}
                      className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 group"
                    >
                      <span>Explorar Catálogo</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows (Only if more than 1 banner) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-black/20 text-white hover:bg-white hover:text-black items-center justify-center backdrop-blur-sm transition-all z-10 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-black/20 text-white hover:bg-white hover:text-black items-center justify-center backdrop-blur-sm transition-all z-10 cursor-pointer"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-[#C5A880]' : 'w-2 bg-white/40'
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
