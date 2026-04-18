'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function PlayJoinPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedCode = code.trim().toUpperCase();
    
    if (trimmedCode.length !== 4) {
      setError('Code must be 4 characters');
      return;
    }

    // Navigate to lobby with code
    router.push(`/play/lobby?code=${trimmedCode}`);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    setCode(value);
    setError('');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-funnel text-4xl text-primary mb-2">
            Join Game
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the room code shown on the TV
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="ABCD"
              className="text-center text-3xl font-mono tracking-widest h-16 bg-surface-2 border-2 focus:border-primary"
              autoFocus
              autoComplete="off"
              autoCapitalize="characters"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-sm mt-2 text-center"
              >
                {error}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={code.length !== 4}
            className="h-14 font-funnel text-lg gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
