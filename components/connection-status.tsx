'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <AnimatePresence>
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/90 text-destructive-foreground rounded-full text-sm shadow-lg">
            <WifiOff className="w-4 h-4" />
            <span>Reconnecting...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConnectedIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span>Connected</span>
    </div>
  );
}
