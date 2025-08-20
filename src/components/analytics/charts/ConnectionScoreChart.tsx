import React from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import { ChartDataPoint, SessionAnalytics } from '@/types/analytics'

interface ConnectionScoreChartProps {
  analytics: SessionAnalytics | null
}

export const ConnectionScoreChart = ({
  analytics,
}: ConnectionScoreChartProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  // Transform API data for Recharts
  const chartData: ChartDataPoint[] = React.useMemo(() => {
    if (!analytics) return []

    // Combine breakthrough and setback moments
    const allMoments = [
      ...(analytics.breakthrough_moments || []),
      ...(analytics.setback_moments || []),
    ]

    // Sort by turn number
    allMoments.sort((a, b) => a.turn_number - b.turn_number)

    // Calculate running totals backwards from final_score
    const data: ChartDataPoint[] = []

    // First, collect all changes for each turn
    const changes: number[] = new Array(analytics.total_turns).fill(0)
    allMoments.forEach(moment => {
      if (moment.turn_number <= analytics.total_turns) {
        changes[moment.turn_number - 1] = moment.connection_score_change
      }
    })

    // Calculate total of all changes
    const totalChanges = changes.reduce((sum, change) => sum + change, 0)

    // Starting score is final_score minus all changes
    let runningScore = analytics.final_score - totalChanges

    for (let turn = 1; turn <= analytics.total_turns; turn++) {
      const change = changes[turn - 1]
      runningScore += change

      data.push({
        turn,
        score: runningScore,
        change,
      })
    }

    return data
  }, [analytics])

  // Show loading state if no data
  if (!analytics || chartData.length === 0) {
    return (
      <div className="h-48 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-blue-100 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">{t.analytics.loadingChart}</p>
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
              value: t.analytics.conversationTurns,
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
              value: t.analytics.relationshipStrength,
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
