'use client';

import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { THE_FIVE_TS } from '@/lib/questions';
import { ANIMALS, getTwemojiUrl } from '@/lib/animals';

interface AggregateRadarChartProps {
  results: Record<string, (number | null)[]>;
  visiblePlayers: string[];
  animate?: boolean;
}

// Color palette for different players
const PLAYER_COLORS = [
  '#6366f1', // indigo
  '#22c55e', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#f97316', // orange
  '#3b82f6', // blue
  '#ef4444', // red
  '#84cc16', // lime
  '#06b6d4', // cyan
  '#a855f7', // purple
  '#10b981', // emerald
  '#f43f5e', // rose
  '#eab308', // yellow
  '#0ea5e9', // sky
  '#d946ef', // fuchsia
  '#64748b', // slate
  '#78716c', // stone
  '#71717a', // zinc
];

export function AggregateRadarChart({ 
  results, 
  visiblePlayers,
  animate = true 
}: AggregateRadarChartProps) {
  const players = Object.keys(results);
  
  // Build data structure for Recharts
  const data = THE_FIVE_TS.map((t, index) => {
    const point: Record<string, unknown> = {
      subject: t.title,
      fullMark: 5,
    };
    
    players.forEach((animalId) => {
      point[animalId] = results[animalId][index] ?? 0;
    });
    
    return point;
  });

  const getAnimalName = (id: string) => ANIMALS.find(a => a.id === id)?.name ?? id;

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full h-96 sm:h-[500px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid 
            stroke="var(--border)" 
            strokeOpacity={0.5}
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: 'var(--foreground)', 
              fontSize: 14,
              fontFamily: 'var(--font-funnel)',
            }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tickCount={6}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
            axisLine={false}
          />
          
          {players.map((animalId, idx) => {
            if (!visiblePlayers.includes(animalId)) return null;
            
            return (
              <Radar
                key={animalId}
                name={getAnimalName(animalId)}
                dataKey={animalId}
                stroke={PLAYER_COLORS[idx % PLAYER_COLORS.length]}
                fill={PLAYER_COLORS[idx % PLAYER_COLORS.length]}
                fillOpacity={0.15}
                strokeWidth={2}
                isAnimationActive={animate}
                animationDuration={800}
                animationEasing="ease-out"
              />
            );
          })}
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--foreground)',
            }}
            formatter={(value: number, name: string) => [
              `${value}/5`, 
              getAnimalName(name)
            ]}
          />
          
          <Legend 
            formatter={(value) => (
              <span style={{ color: 'var(--foreground)', fontSize: 12 }}>
                {value}
              </span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
