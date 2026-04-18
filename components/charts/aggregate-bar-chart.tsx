'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { THE_FIVE_TS } from '@/lib/questions';

interface AggregateBarChartProps {
  results: Record<string, (number | null)[]>;
  animate?: boolean;
}

// Colors for each T
const T_COLORS = [
  '#6366f1', // Time - indigo
  '#22c55e', // Talent - green
  '#f59e0b', // Treasure - amber
  '#ec4899', // Temple - pink
  '#8b5cf6', // Testimony - violet
];

export function AggregateBarChart({ results, animate = true }: AggregateBarChartProps) {
  const players = Object.keys(results);
  
  // Calculate averages for each T
  const data = THE_FIVE_TS.map((t, index) => {
    const scores = players
      .map(id => results[id][index])
      .filter((s): s is number => s !== null);
    
    const average = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0;
    
    return {
      name: t.title,
      average: Math.round(average * 10) / 10,
      fullMark: 5,
    };
  });

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full h-80 sm:h-96"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--border)"
            strokeOpacity={0.5}
          />
          <XAxis 
            dataKey="name" 
            tick={{ 
              fill: 'var(--foreground)', 
              fontSize: 12,
              fontFamily: 'var(--font-funnel)',
            }}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis 
            domain={[0, 5]}
            tickCount={6}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--foreground)',
            }}
            formatter={(value: number) => [`${value}/5`, 'Group Average']}
            cursor={{ fill: 'var(--surface-2)', opacity: 0.5 }}
          />
          <Bar 
            dataKey="average" 
            radius={[8, 8, 0, 0]}
            isAnimationActive={animate}
            animationDuration={800}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={T_COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="text-center text-sm text-muted-foreground mt-4">
        Group Average Scores ({players.length} player{players.length !== 1 ? 's' : ''})
      </div>
    </motion.div>
  );
}
