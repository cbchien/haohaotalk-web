import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import {
  ScoreDistribution,
  DistributionChartData,
} from '@/types/sessionPerformance'

interface ScoreDistributionChartProps {
  distribution: ScoreDistribution[]
  userScore: number
}

const BUCKET_COUNT = 10
const SCORE_RANGE_MIN = -5
const SCORE_RANGE_MAX = 5
const COLORS = {
  USER_BAR: '#00A8E1',
  OTHER_BARS: '#BFE9F8',
} as const

export const ScoreDistributionChart = ({
  distribution,
  userScore,
}: ScoreDistributionChartProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  // Create 10 fixed percentage buckets and distribute scores into them
  const chartData: DistributionChartData[] = React.useMemo(() => {
    if (
      !distribution ||
      !Array.isArray(distribution) ||
      distribution.length === 0
    ) {
      return []
    }

    // Initialize buckets: 0-10%, 10-20%, ..., 90-100%
    const buckets: { [key: string]: { count: number; isUserRange: boolean } } =
      {}

    for (let i = 0; i < BUCKET_COUNT; i++) {
      const start = i * 10
      const end = start + 10
      const bucketLabel = `${end}%` // Show end value: 10%, 20%, 30%, etc.
      buckets[bucketLabel] = { count: 0, isUserRange: false }
    }

    // Distribute scores into buckets
    distribution.forEach(item => {
      const scoreValue = parseFloat(item.score_range)

      if (!isNaN(scoreValue)) {
        // Convert score to percentage (0 to 100)
        const percentage =
          ((scoreValue - SCORE_RANGE_MIN) /
            (SCORE_RANGE_MAX - SCORE_RANGE_MIN)) *
          100

        // Find which bucket this percentage belongs to
        const bucketIndex = Math.min(
          Math.floor(percentage / 10),
          BUCKET_COUNT - 1
        )
        const start = bucketIndex * 10
        const end = start + 10
        const bucketLabel = `${end}%`

        buckets[bucketLabel].count += item.user_count

        // Check if user's score falls in this bucket
        const userPercentage =
          ((userScore - SCORE_RANGE_MIN) /
            (SCORE_RANGE_MAX - SCORE_RANGE_MIN)) *
          100
        if (userPercentage >= start && userPercentage < end) {
          buckets[bucketLabel].isUserRange = true
        }
      }
    })

    // Calculate total users across all buckets
    const totalUsers = Object.values(buckets).reduce(
      (sum, bucket) => sum + bucket.count,
      0
    )

    // Convert buckets to chart data array with percentages
    return Object.entries(buckets).map(([range, data]) => ({
      range,
      count: totalUsers > 0 ? Math.round((data.count / totalUsers) * 100) : 0, // Convert to percentage
      isUserRange: data.isUserRange,
    }))
  }, [distribution, userScore])

  // Show loading state if no data
  if (chartData.length === 0) {
    return (
      <div className="h-32 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-blue-100 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">{t.performance.loadingChart}</p>
        </div>
      </div>
    )
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ value: number }>
    label?: string
  }) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">
            {t.performance.scoreRange}: {label}
          </p>
          <p className="text-sm text-blue-100">
            {t.performance.userCount}: {payload[0].value}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          barCategoryGap="5%"
        >
          <XAxis
            dataKey="range"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            interval={0}
            label={{
              value: `${t.performance.relationshipStrength} (%)`,
              position: 'insideBottom',
              offset: -5,
              style: { textAnchor: 'middle', fontSize: 12, fill: '#6B7280' },
            }}
          />
          <YAxis axisLine={false} tickLine={false} tick={false} width={0} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isUserRange ? COLORS.USER_BAR : COLORS.OTHER_BARS}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
