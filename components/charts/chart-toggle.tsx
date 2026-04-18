'use client';

import { motion } from 'framer-motion';
import { BarChart3, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChartType = 'radar' | 'bar';

interface ChartToggleProps {
  value: ChartType;
  onChange: (value: ChartType) => void;
}

export function ChartToggle({ value, onChange }: ChartToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-lg">
      <button
        onClick={() => onChange('radar')}
        className={cn(
          'relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          value === 'radar' 
            ? 'text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {value === 'radar' && (
          <motion.div
            layoutId="chart-toggle-bg"
            className="absolute inset-0 bg-primary rounded-md"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <PieChart className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Radar</span>
      </button>
      
      <button
        onClick={() => onChange('bar')}
        className={cn(
          'relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          value === 'bar' 
            ? 'text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {value === 'bar' && (
          <motion.div
            layoutId="chart-toggle-bg"
            className="absolute inset-0 bg-primary rounded-md"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <BarChart3 className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Bar</span>
      </button>
    </div>
  );
}
