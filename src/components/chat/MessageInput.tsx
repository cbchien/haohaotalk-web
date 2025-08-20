import { useState, useCallback, useRef } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useTranslation } from '@/utils/translations'
import { useAppStore } from '@/store'

interface MessageInputProps {
  onSend: (message: string) => Promise<void>
  disabled?: boolean
}

export const MessageInput = ({
  onSend,
  disabled = false,
}: MessageInputProps) => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // No auto-resize - fixed height with scroll

  const handleSend = useCallback(async () => {
    const message = text.trim()
    if (!message || disabled || isSending) return

    setText('')
    setIsSending(true)

    try {
      await onSend(message)
    } catch {
      // Error handling is done in parent component
    } finally {
      setIsSending(false)
    }
  }, [text, disabled, isSending, onSend])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value)
    },
    []
  )

  const canSend = text.trim() && !disabled && !isSending

  return (
    <div className="bg-white border-t border-gray-200 px-2 py-2">
      <div className="flex items-center space-x-3">
        {/* Fixed height textarea */}
        <div className="flex-1 relative pr-3">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={t.chat.typeResponse}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-100 focus:border-transparent flex items-center"
            style={{
              fontSize: '16px', // Prevent iOS zoom
              height: '48px',
              lineHeight: '22px',
              margin: 'auto',
              display: 'flex',
              alignItems: 'center',
            }}
            rows={1}
            disabled={disabled}
          />
        </div>

        {/* Send button with margin auto */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-10 h-10 rounded-full transition-all duration-200 ${
            canSend
              ? 'bg-blue-100 text-white hover:bg-blue-500 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={{ margin: 'auto' }}
        >
          {isSending ? (
            <div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              style={{ margin: 'auto' }}
            />
          ) : (
            <PaperAirplaneIcon className="w-4 h-4" style={{ margin: 'auto' }} />
          )}
        </button>
      </div>
    </div>
  )
}
