'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedBackground } from '@/components/animated-background';
import { Monitor, Smartphone } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center max-w-2xl"
      >
        {/* Title */}
        <motion.h1 
          className="font-funnel text-6xl sm:text-8xl text-primary mb-12"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          toohak-lite
        </motion.h1>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        >
          <Link href="/host" className="flex-1">
            <Button
              size="lg"
              className="w-full h-auto py-6 flex flex-col items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <Monitor className="w-8 h-8" />
              <span className="font-funnel text-lg">Host Game</span>
              <span className="text-xs text-primary-foreground/70 font-normal">
                Display on TV/Screen
              </span>
            </Button>
          </Link>

          <Link href="/play" className="flex-1">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-auto py-6 flex flex-col items-center gap-2 border-2 hover:bg-surface-2"
            >
              <Smartphone className="w-8 h-8" />
              <span className="font-funnel text-lg">Join Game</span>
              <span className="text-xs text-muted-foreground font-normal">
                Play on your phone
              </span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
