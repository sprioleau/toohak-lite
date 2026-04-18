'use client';

import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { THE_FIVE_TS } from '@/lib/questions';

interface IndividualRadarChartProps {
  scores: (number | null)[];
  animate?: boolean;
}

export function IndividualRadarChart({ scores, animate = true }: IndividualRadarChartProps) {
  const data = THE_FIVE_TS.map((t, index) => ({
    subject: t.title,
    value: scores[index] ?? 0,
    fullMark: 5,
  }));

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full h-80 sm:h-96"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid 
            stroke="var(--border)" 
            strokeOpacity={0.5}
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: 'var(--foreground)', 
              fontSize: 12,
              fontFamily: 'var(--font-funnel)',
            }}
            className="font-funnel"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tickCount={6}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Your Score"
            dataKey="value"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.3}
            strokeWidth={2}
            isAnimationActive={animate}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--foreground)',
            }}
            formatter={(value: number) => [`${value}/5`, 'Score']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
