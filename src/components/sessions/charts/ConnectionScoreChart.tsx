import React from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import { ChartDataPoint, SessionPerformance } from '@/types/sessionPerformance'

interface ConnectionScoreChartProps {
  performance: SessionPerformance | null
}

export const ConnectionScoreChart = ({
  performance,
}: ConnectionScoreChartProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  // Transform API data for Recharts
  const chartData: ChartDataPoint[] = React.useMemo(() => {
    if (!performance) return []

    // Combine breakthrough and setback moments
    const allMoments = [
      ...(performance.breakthrough_moments || []),
      ...(performance.setback_moments || []),
    ]

    // Sort by turn number
    allMoments.sort((a, b) => a.turn_number - b.turn_number)

    // Calculate running totals backwards from final_score
    const data: ChartDataPoint[] = []

    // First, collect all changes for each turn
    const changes: number[] = new Array(performance.total_turns).fill(0)
    allMoments.forEach(moment => {
      if (moment.turn_number <= performance.total_turns) {
        changes[moment.turn_number - 1] = moment.connection_score_change
      }
    })

    // Calculate total of all changes
    const totalChanges = changes.reduce((sum, change) => sum + change, 0)

    // Starting score is final_score minus all changes
    let runningScore = performance.final_score - totalChanges

    for (let turn = 1; turn <= performance.total_turns; turn++) {
      const change = changes[turn - 1]
      runningScore += change

      data.push({
        turn,
        score: runningScore,
        change,
      })
    }

    return data
  }, [performance])

  // Show loading state if no data
  if (!performance || chartData.length === 0) {
    return (
      <div className="h-48 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-blue-100 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">{t.performance.loadingChart}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <XAxis
            dataKey="turn"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            label={{
              value: t.performance.conversationTurns,
              position: 'insideBottom',
              offset: -5,
              style: { textAnchor: 'middle', fontSize: 12, fill: '#6B7280' },
            }}
          />
          <YAxis
            domain={[-5, 5]}
            axisLine={false}
            tickLine={false}
            tick={false}
            label={{
              value: t.performance.relationshipStrength,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 12, fill: '#6B7280' },
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#00A8E1"
            strokeWidth={3}
            dot={{ fill: '#00A8E1', strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
              stroke: '#00A8E1',
              strokeWidth: 2,
              fill: '#ffffff',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
