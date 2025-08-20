import type { ScoreDistribution } from '@/types/sessionPerformance'

export function calculateUserPercentile(
  userScore: number,
  scoreDistribution: ScoreDistribution[]
): { percentile: number; betterThanPercentage: number } {
  if (!scoreDistribution || scoreDistribution.length === 0) {
    return { percentile: 50, betterThanPercentage: 0 }
  }

  let totalUsers = 0
  let usersBelowScore = 0

  // Calculate total users and find user's position
  for (const range of scoreDistribution) {
    totalUsers += range.user_count

    // Handle both range format ("1-2") and single score format ("1")
    if (range.score_range.includes('-')) {
      const [min, max] = range.score_range
        .split('-')
        .map(s => parseInt(s.trim()))
      if (userScore < min) {
        continue
      } else if (userScore > max) {
        usersBelowScore += range.user_count
      } else {
        usersBelowScore += Math.floor(range.user_count / 2)
      }
    } else {
      // Single score format
      const scoreValue = parseInt(range.score_range.trim())
      if (userScore > scoreValue) {
        usersBelowScore += range.user_count
      } else if (userScore === scoreValue) {
        usersBelowScore += Math.floor(range.user_count / 2)
      }
    }
  }

  // Calculate percentile (what percentile the user is in)
  const percentile =
    totalUsers > 0 ? Math.round((usersBelowScore / totalUsers) * 100) : 50

  // Calculate better than percentage (what percentage of users the user performed better than)
  const betterThanPercentage = percentile

  return {
    percentile: Math.max(1, Math.min(99, percentile)), // Clamp between 1-99
    betterThanPercentage: Math.max(0, Math.min(100, betterThanPercentage)),
  }
}
