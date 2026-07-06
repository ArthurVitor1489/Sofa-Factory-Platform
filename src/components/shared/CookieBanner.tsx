'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner with a small delay for premium UX feel
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-50"
        >
          <div className="bg-card border border-border p-6 rounded-2xl shadow-2xl space-y-4 flex flex-col">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground leading-none">
                  Privacidade e Cookies (LGPD)
                </h4>
                <p className="text-stone-500 text-xs leading-relaxed font-light pt-1">
                  Utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência no site, analisar o tráfego de produtos e personalizar orçamentos de acordo com a LGPD. Ao continuar navegando, você concorda com nossos termos.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <Link
                href="/politica-de-privacidade"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors hover:underline"
              >
                Ler Política
              </Link>
              <div className="flex space-x-2 shrink-0">
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  size="sm"
                  className="px-3 py-1.5 text-xs"
                >
                  Recusar
                </Button>
                <Button
                  onClick={handleAccept}
                  size="sm"
                  className="px-3.5 py-1.5 text-xs bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
                >
                  Aceitar Cookies
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
