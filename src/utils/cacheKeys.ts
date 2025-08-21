// Hierarchical cache keys for React Query
// Provides type-safe cache key generation and management

export const cacheKeys = {
  // Sessions related queries
  sessions: {
    // Sessions list: ['sessions']
    list: ['sessions'] as const,

    // Single session: ['sessions', sessionId]
    detail: (sessionId: string) => ['sessions', sessionId] as const,

    // Session performance: ['sessions', sessionId, 'performance']
    performance: (sessionId: string) =>
      ['sessions', sessionId, 'performance'] as const,

    // Session insights: ['sessions', sessionId, 'insights']
    insights: (sessionId: string) =>
      ['sessions', sessionId, 'insights'] as const,
  },

  // User related queries
  user: {
    // User profile: ['user', 'profile']
    profile: ['user', 'profile'] as const,

    // User auth state: ['user', 'auth']
    auth: ['user', 'auth'] as const,
  },

  // Scenarios related queries
  scenarios: {
    // All scenarios: ['scenarios']
    list: ['scenarios'] as const,

    // Single scenario: ['scenarios', scenarioId]
    detail: (scenarioId: string) => ['scenarios', scenarioId] as const,

    // Popular scenarios: ['scenarios', 'popular', language]
    popular: (language: string) => ['scenarios', 'popular', language] as const,

    // Search results: ['scenarios', 'search', query, language]
    search: (query: string, language: string) =>
      ['scenarios', 'search', query, language] as const,

    // Tag filtered scenarios: ['scenarios', 'tag', tagName, language]
    tag: (tagName: string, language: string) =>
      ['scenarios', 'tag', tagName, language] as const,
  },

  // Tags related queries
  tags: {
    // All tags: ['tags']
    list: ['tags'] as const,
  },
} as const

// Helper functions for cache invalidation patterns
export const cacheInvalidation = {
  // Invalidate all session-related data
  allSessions: () => [cacheKeys.sessions.list[0]],

  // Invalidate specific session data (performance + insights)
  sessionData: (sessionId: string) => [cacheKeys.sessions.list[0], sessionId],

  // Invalidate only sessions list (when new session completed)
  sessionsList: () => cacheKeys.sessions.list,
} as const

// Garbage collection time constants (was cacheTime in older versions)
export const cacheTime = {
  // Immutable data - cache forever
  PERMANENT: Infinity,

  // Semi-static data - 30 minutes
  LONG: 30 * 60 * 1000,

  // Dynamic data - 5 minutes
  MEDIUM: 5 * 60 * 1000,

  // Frequently changing - 1 minute
  SHORT: 1 * 60 * 1000,
} as const

// Stale time constants
export const staleTime = {
  // Never consider stale (for completed sessions)
  NEVER: Infinity,

  // Stale after 10 minutes
  LONG: 10 * 60 * 1000,

  // Stale after 2 minutes
  MEDIUM: 2 * 60 * 1000,

  // Stale after 30 seconds
  SHORT: 30 * 1000,
} as const
