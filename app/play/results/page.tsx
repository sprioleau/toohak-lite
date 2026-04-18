'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSocket } from '@/lib/socket-context';
import { IndividualRadarChart } from '@/components/charts/individual-radar-chart';
import { ChartToggle } from '@/components/charts/chart-toggle';
import { Button } from '@/components/ui/button';
import { THE_FIVE_TS } from '@/lib/questions';
import { Home, RotateCcw } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type ChartType = 'radar' | 'bar';

// Colors for each T
const T_COLORS = [
  '#6366f1', // Time - indigo
  '#22c55e', // Talent - green
  '#f59e0b', // Treasure - amber
  '#ec4899', // Temple - pink
  '#8b5cf6', // Testimony - violet
];

export default function PlayResultsPage() {
  const { results, animalId } = useSocket();
  const [chartType, setChartType] = useState<ChartType>('radar');

  const myScores = animalId && results ? results[animalId] : null;

  if (!myScores) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No results available</p>
          <Link href="/play">
            <Button>
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const barData = THE_FIVE_TS.map((t, index) => ({
    name: t.title,
    value: myScores[index] ?? 0,
  }));

  const average = myScores.filter((s): s is number => s !== null).reduce((a, b) => a + b, 0) / 5;

  return (
    <main className="min-h-screen flex flex-col p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col max-w-lg mx-auto w-full"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="font-dancing text-4xl text-primary mb-2"
          >
            Your Results
          </motion.h1>
          <p className="text-muted-foreground text-sm">
            Stewardship evaluation complete
          </p>
        </div>

        {/* Average Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-baseline gap-2 bg-surface-2 px-6 py-3 rounded-full">
            <span className="text-muted-foreground text-sm">Overall:</span>
            <span className="font-funnel text-3xl font-bold text-primary">
              {average.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-sm">/ 5</span>
          </div>
        </motion.div>

        {/* Chart Toggle */}
        <div className="flex justify-center mb-4">
          <ChartToggle value={chartType} onChange={setChartType} />
        </div>

        {/* Chart */}
        <motion.div
          key={chartType}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 min-h-[300px]"
        >
          {chartType === 'radar' ? (
            <IndividualRadarChart scores={myScores} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--foreground)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  domain={[0, 5]}
                  tickCount={6}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={800}
                >
                  {barData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={T_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-5 gap-2"
        >
          {THE_FIVE_TS.map((t, index) => (
            <div
              key={t.id}
              className="flex flex-col items-center p-2 bg-surface-1 rounded-lg"
            >
              <span
                className="text-2xl font-bold"
                style={{ color: T_COLORS[index] }}
              >
                {myScores[index] ?? '-'}
              </span>
              <span className="text-[10px] text-muted-foreground text-center mt-1 leading-tight">
                {t.title}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 mt-8"
        >
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full h-12">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/play" className="flex-1">
            <Button className="w-full h-12 font-funnel">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
