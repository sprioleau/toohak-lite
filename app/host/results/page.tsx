'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSocket } from '@/lib/socket-context';
import { AggregateRadarChart } from '@/components/charts/aggregate-radar-chart';
import { AggregateBarChart } from '@/components/charts/aggregate-bar-chart';
import { ChartToggle } from '@/components/charts/chart-toggle';
import { PlayerLegend } from '@/components/charts/player-legend';
import { Button } from '@/components/ui/button';
import { RotateCcw, Home } from 'lucide-react';

type ChartType = 'radar' | 'bar';

export default function HostResultsPage() {
  const { results, players } = useSocket();
  const [chartType, setChartType] = useState<ChartType>('radar');
  const [visiblePlayers, setVisiblePlayers] = useState<string[]>(players);

  const handleTogglePlayer = useCallback((animalId: string) => {
    setVisiblePlayers(prev =>
      prev.includes(animalId)
        ? prev.filter(id => id !== animalId)
        : [...prev, animalId]
    );
  }, []);

  const handleShowAll = useCallback(() => {
    setVisiblePlayers(players);
  }, [players]);

  const handleHideAll = useCallback(() => {
    setVisiblePlayers([]);
  }, []);

  if (!results) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No results available</p>
          <Link href="/host">
            <Button>
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Game
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 sm:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="font-funnel text-4xl sm:text-5xl text-primary mb-1">
              Results
            </h1>
            <p className="text-muted-foreground text-sm">
              Group evaluation complete
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ChartToggle value={chartType} onChange={setChartType} />
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Area */}
          <motion.div
            key={chartType}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 bg-surface-1 rounded-2xl border border-border p-6"
          >
            {chartType === 'radar' ? (
              <AggregateRadarChart
                results={results}
                visiblePlayers={visiblePlayers}
              />
            ) : (
              <AggregateBarChart results={results} />
            )}
          </motion.div>

          {/* Player Legend (only for radar) */}
          {chartType === 'radar' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-64 shrink-0"
            >
              <PlayerLegend
                players={Object.keys(results)}
                visiblePlayers={visiblePlayers}
                onTogglePlayer={handleTogglePlayer}
                onShowAll={handleShowAll}
                onHideAll={handleHideAll}
              />
            </motion.div>
          )}
        </div>

        {/* Play Again */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <Link href="/host">
            <Button size="lg" className="font-funnel gap-2">
              <RotateCcw className="w-5 h-5" />
              New Game
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
