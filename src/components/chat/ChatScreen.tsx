import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import {
  scenariosApiService,
  sessionsApiService,
  type Scenario,
  type Session,
} from '@/services'
import { ScreenHeader } from '@/components/navigation'
import { ConnectionScoreBar } from './ConnectionScoreBar'
import { MessageArea } from './MessageArea'
import { MessageInput } from './MessageInput'
import { CompletionModal } from './CompletionModal'

interface Message {
  id: string
  content: string
  type: 'user' | 'character' | 'system'
  timestamp: Date
  character_emotion?: 'neutral' | 'happy' | 'concerned' | 'frustrated'
}

export const ChatScreen = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const {
    currentLanguage,
    currentScenario,
    availableRoles,
    selectedRole: globalSelectedRole,
  } = useAppStore()
  const t = useTranslation(currentLanguage)

  const [session, setSession] = useState<Session | null>(null)
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [connectionScore, setConnectionScore] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCompletion, setShowCompletion] = useState(false)
  const [isEndingSession, setIsEndingSession] = useState(false)
  const [sessionEndCalled, setSessionEndCalled] = useState(false)
  const [showEndConfirmation, setShowEndConfirmation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadedSessionRef = useRef<string | null>(null)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId || loadedSessionRef.current === sessionId) return
      loadedSessionRef.current = sessionId

      try {
        setIsLoading(true)
        setError(null)

        const response = await sessionsApiService.getSession(sessionId)

        if (response.success && response.data) {
          setSession(response.data)
          setConnectionScore(response.data.connection_score || 0)

          // Use global scenario data or fetch if not available
          if (currentScenario) {
            setScenario(currentScenario)
          } else if (response.data.scenario_id) {
            const scenarioResponse = await scenariosApiService.getScenario(
              response.data.scenario_id,
              { language: currentLanguage }
            )
            if (scenarioResponse.success && scenarioResponse.data) {
              setScenario(scenarioResponse.data)
            }
          }

          // Add initial message from the OTHER role (not user's selected role)
          if (
            availableRoles.length > 0 &&
            globalSelectedRole &&
            (!response.data.turns || response.data.turns.length === 0)
          ) {
            // Find the role that is NOT the user's selected role (the character they'll talk to)
            const otherRole = availableRoles.find(
              role => role.id !== globalSelectedRole.id
            )

            if (otherRole) {
              const initialMessage =
                currentLanguage === 'zh'
                  ? otherRole.initial_message
                  : otherRole.initial_message_en

              if (initialMessage) {
                setMessages([
                  {
                    id: 'initial-message',
                    content: initialMessage,
                    type: 'character',
                    timestamp: new Date(),
                    character_emotion: 'neutral',
                  },
                ])
              }
            }
          }

          // Load message history
          if (
            response.data.turns &&
            Array.isArray(response.data.turns) &&
            response.data.turns.length > 0
          ) {
            const messageHistory: Message[] = []
            response.data.turns.forEach(
              (turn: {
                id: string
                user_message: string
                ai_response: string
                character_emotion?: string
                created_at: string
              }) => {
                if (turn.user_message) {
                  messageHistory.push({
                    id: `${turn.id}-user`,
                    content: turn.user_message,
                    type: 'user',
                    timestamp: new Date(turn.created_at),
                  })
                }
                if (turn.ai_response) {
                  messageHistory.push({
                    id: `${turn.id}-ai`,
                    content: turn.ai_response,
                    type: 'character',
                    timestamp: new Date(turn.created_at),
                    character_emotion:
                      (turn.character_emotion as
                        | 'neutral'
                        | 'happy'
                        | 'concerned'
                        | 'frustrated') || 'neutral',
                  })
                }
              }
            )
            // Replace messages with history (no initial message needed if there's existing conversation)
            setMessages(messageHistory)
          }
          // If no message history, the initial message set above will remain
        } else {
          setError(response.error || t.chat.errors.sessionNotFound)
        }
      } catch {
        setError(t.chat.errors.loadingFailed)
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const handleSendMessage = async (content: string) => {
    if (!sessionId || !content.trim()) return

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      type: 'user',
      timestamp: new Date(),
    }

    // Optimistic update
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    setError(null)

    try {
      const response = await sessionsApiService.submitTurn(sessionId, {
        user_message: content.trim(),
        language: currentLanguage,
      })

      if (response.success && response.data) {
        const { turn, session: updatedSession } = response.data

        // Update the user message with actual ID
        setMessages(prev => {
          const updated = [...prev]
          const userMsgIndex = updated.findIndex(m => m.id === userMessage.id)
          if (userMsgIndex >= 0) {
            updated[userMsgIndex] = {
              ...updated[userMsgIndex],
              id: `${turn.id}-user`,
            }
          }
          return updated
        })

        // Update session state first
        if (updatedSession) {
          setConnectionScore(updatedSession.connection_score || 0)
          // Update the existing session with new data
          setSession(prevSession =>
            prevSession ? { ...prevSession, ...updatedSession } : null
          )
        }

        // Add AI response and check completion after messages are updated
        if (turn.ai_response) {
          const aiMessage: Message = {
            id: `${turn.id}-ai`,
            content: turn.ai_response,
            type: 'character',
            timestamp: new Date(),
            character_emotion: turn.character_emotion || 'neutral',
          }

          setMessages(prev => {
            const newMessages = [...prev, aiMessage]

            // Check completion after AI message is added
            if (updatedSession) {
              const isBackendCompleted = updatedSession.is_completed
              const maxTurns = updatedSession.max_turns || scenario?.max_turns

              // Count user turns from updated messages array (includes current user message)
              const userTurnsCount = newMessages.filter(
                msg => msg.type === 'user'
              ).length
              const hasUserCompletedAllTurns =
                maxTurns && userTurnsCount >= maxTurns

              // Complete session when user has completed all turns (only call once)
              if (
                hasUserCompletedAllTurns &&
                !isBackendCompleted &&
                !sessionEndCalled
              ) {
                // Mark that we've started the end session process
                setSessionEndCalled(true)

                // Disable input immediately
                setIsEndingSession(true)

                // Call endSession API
                ;(async () => {
                  try {
                    await sessionsApiService.endSession(sessionId)

                    // After successful API call, show end message
                    setMessages(prevMsgs => [
                      ...prevMsgs,
                      {
                        id: `session-end-notification-${Date.now()}`,
                        content: t.chat.practiceSessionEnded,
                        type: 'system',
                        timestamp: new Date(),
                      } as Message,
                    ])

                    // Show completion modal
                    setIsEndingSession(false)
                    setShowCompletion(true)
                  } catch (error) {
                    console.error('Failed to end session:', error) // eslint-disable-line no-console

                    // Show error message
                    setMessages(prevMsgs => [
                      ...prevMsgs,
                      {
                        id: `session-end-error-${Date.now()}`,
                        content: t.chat.sessionEndError,
                        type: 'system',
                        timestamp: new Date(),
                      } as Message,
                    ])

                    // Show modal anyway after error
                    setIsEndingSession(false)
                    setShowCompletion(true)
                  }
                })()
              } else if (isBackendCompleted) {
                // Backend already marked as complete
                setShowCompletion(true)
              }
            }

            return newMessages
          })
        }
      } else {
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(m => m.id !== userMessage.id))
        setError(response.error || t.chat.errors.sendFailed)

        // Check if user reached max turns even if API failed
        const maxTurns = scenario?.max_turns
        const userTurnsCount = messages.filter(
          msg => msg.type === 'user'
        ).length

        if (maxTurns && userTurnsCount >= maxTurns) {
          setShowCompletion(true)
        }
      }
    } catch {
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== userMessage.id))
      setError(t.chat.errors.networkError)
    } finally {
      setIsTyping(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleEndSessionEarly = () => {
    setShowEndConfirmation(true)
  }

  const handleConfirmEndSession = async () => {
    if (!sessionId || sessionEndCalled) return

    setShowEndConfirmation(false)
    setSessionEndCalled(true)
    setIsEndingSession(true)

    try {
      await sessionsApiService.endSession(sessionId)

      setMessages(prev => [
        ...prev,
        {
          id: `session-end-early-${Date.now()}`,
          content: t.chat.practiceSessionEnded,
          type: 'system',
          timestamp: new Date(),
        } as Message,
      ])

      setIsEndingSession(false)
      setShowCompletion(true)
    } catch (error) {
      console.error('Failed to end session early:', error) // eslint-disable-line no-console

      setMessages(prev => [
        ...prev,
        {
          id: `session-end-early-error-${Date.now()}`,
          content: t.chat.sessionEndError,
          type: 'system',
          timestamp: new Date(),
        } as Message,
      ])

      setIsEndingSession(false)
      setShowCompletion(true)
    }
  }

  const scenarioImage = scenario?.image_url ? (
    <img
      src={scenario.image_url}
      alt={scenario.title}
      className="w-8 h-8 rounded-full object-cover"
    />
  ) : null

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-100 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{t.chat.loading}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !scenario) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-blue-100 text-white rounded-xl"
            >
              {t.common.goBack}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white">
        <ScreenHeader
          title={scenario?.title || t.chat.conversation}
          leftContent={scenarioImage}
          rightContent={
            !showCompletion &&
            !isEndingSession && (
              <button
                onClick={handleEndSessionEarly}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                {t.chat.endSessionEarly}
              </button>
            )
          }
          onBack={handleBack}
        />
        <ConnectionScoreBar score={connectionScore} />
      </div>

      {/* Scrollable Content Area - Account for fixed header and message input */}
      <div className="flex-1 pt-32 pb-16 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <MessageArea
            messages={messages}
            scenario={scenario}
            isTyping={isTyping}
            error={error}
          />
        </div>
      </div>

      {/* Fixed Message Input - No bottom nav, so position at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <MessageInput
          onSend={handleSendMessage}
          disabled={
            isTyping ||
            showCompletion ||
            isEndingSession ||
            session?.is_completed
          }
        />
      </div>

      {showCompletion && session && (
        <CompletionModal
          session={session}
          finalScore={connectionScore}
          onClose={() => setShowCompletion(false)}
        />
      )}

      {/* End Session Confirmation Modal */}
      {showEndConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={e => {
            if (e.target === e.currentTarget) setShowEndConfirmation(false)
          }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">
              {t.chat.endSessionConfirmTitle}
            </h2>
            <p className="text-gray-600 mb-6 text-center text-sm">
              {t.chat.endSessionConfirmMessage}
            </p>

            <div className="space-y-3">
              <button
                onClick={handleConfirmEndSession}
                className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                {t.chat.endSessionConfirm}
              </button>
              <button
                onClick={() => setShowEndConfirmation(false)}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t.chat.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
