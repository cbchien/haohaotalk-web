import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import type { SessionTurn } from '@/types/sessionPerformance'

interface ChatHistoryProps {
  turns: SessionTurn[]
  initialMessage?: string
  isLoading?: boolean
}

export const ChatHistory = ({
  turns,
  initialMessage,
  isLoading,
}: ChatHistoryProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 border border-gray-300">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {t.sessions.conversationHistory}
          </h3>
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
      </div>
    )
  }

  // Don't render if no conversation data
  if (!turns || turns.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-300">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t.sessions.conversationHistory}
        </h3>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto">
        {[
          // Include initial message if available
          ...(initialMessage
            ? [
                {
                  id: 'initial-message',
                  speaker: 'ai' as const,
                  message: initialMessage,
                  timestamp: '',
                },
              ]
            : []),
          // Then add all turn messages
          ...turns
            .sort((a, b) => a.turn_number - b.turn_number)
            .flatMap(turn => [
              // User message
              {
                id: `${turn.id}-user`,
                speaker: 'user' as const,
                message: turn.user_message,
                timestamp: turn.created_at,
              },
              // AI response
              {
                id: `${turn.id}-ai`,
                speaker: 'ai' as const,
                message: turn.ai_response,
                timestamp: turn.created_at,
              },
            ]),
        ].map(message => (
          <div
            key={message.id}
            className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {/* Message bubble matching brand design */}
            <div
              className={`px-4 py-2 rounded-2xl ${
                message.speaker === 'user'
                  ? 'max-w-[80%] bg-blue-50 text-gray-900 border border-gray-200'
                  : 'max-w-[360px] bg-white text-gray-900 mr-12 border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
