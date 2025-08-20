interface Message {
  id: string
  content: string
  type: 'user' | 'character' | 'system'
  timestamp: Date
  character_emotion?: 'neutral' | 'happy' | 'concerned' | 'frustrated'
}

interface ChatBubbleProps {
  message: Message
  isUser: boolean
  characterAvatar?: string
}

export const ChatBubble = ({
  message,
  isUser,
  characterAvatar,
}: ChatBubbleProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* Character avatar for non-user messages */}
      {!isUser && (
        <div className="flex-shrink-0 mr-3 mt-1">
          {characterAvatar ? (
            <img
              src={characterAvatar}
              alt="Character"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-600">🤖</span>
            </div>
          )}
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-[280px] p-4 rounded-2xl ${
          isUser
            ? 'bg-blue-100 text-white ml-12'
            : 'bg-white text-gray-900 mr-12 border border-gray-200'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Optional timestamp - can be toggled on/off */}
        {false && (
          <p className="text-xs mt-2 opacity-70">
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  )
}
