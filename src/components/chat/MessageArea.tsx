import { useEffect, useRef } from 'react'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'
import { ChatBubble } from './ChatBubble'
import type { Scenario } from '@/services'

interface Message {
  id: string
  content: string
  type: 'user' | 'character' | 'system'
  timestamp: Date
  character_emotion?: 'neutral' | 'happy' | 'concerned' | 'frustrated'
}

interface MessageAreaProps {
  messages: Message[]
  scenario: Scenario | null
  isTyping: boolean
  error: string | null
  userAvatar?: string
  characterAvatar?: string
}

export const MessageArea = ({
  messages,
  scenario,
  isTyping,
  error,
  userAvatar,
  characterAvatar,
}: MessageAreaProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Always show scenario context - removed auto-collapse behavior

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="flex-shrink-0 mr-3 mt-1">
        {characterAvatar || scenario?.image_url ? (
          <img
            src={characterAvatar || scenario?.image_url || ''}
            alt="Character"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-600">🤖</span>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 mr-12">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          />
        </div>
      </div>
    </div>
  )

  const ScenarioContext = () => {
    if (!scenario) return null

    return (
      <div className="mb-6 px-4">
        <div className="text-center mb-4 text-gray-600 text-sm">
          {t.chat.scenarioContext}
        </div>

        {/* Scenario illustration */}
        {scenario.image_url && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <img
              src={scenario.image_url}
              alt={scenario.title}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Scenario description */}
        {scenario.context && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-800 leading-relaxed">
              <strong>{t.chat.storyBackground}</strong> {scenario.context}
            </p>
          </div>
        )}
      </div>
    )
  }

  const ErrorMessage = () => {
    if (!error) return null

    return (
      <div className="mx-4 mb-4 p-3 bg-pink-25 border border-pink-100 rounded-xl">
        <p className="text-sm text-pink-100 text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="px-4 pt-4 pb-4 space-y-4 min-h-full">
        <ScenarioContext />

        {/* Messages */}
        {messages.map(message => {
          if (message.type === 'system') {
            // Special handling for session ending message with loading animation
            const isSessionEnding = message.id.startsWith('session-ending-')

            return (
              <div key={message.id} className="flex justify-center mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 max-w-xs">
                  <div className="flex items-center justify-center space-x-2">
                    {isSessionEnding && (
                      <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                    )}
                    <p className="text-sm text-blue-800 text-center">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <ChatBubble
              key={message.id}
              message={message}
              isUser={message.type === 'user'}
              characterAvatar={
                characterAvatar || scenario?.image_url || undefined
              }
              userAvatar={userAvatar}
            />
          )
        })}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Error message */}
        <ErrorMessage />

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
