import { useState } from 'react'
import { useTranslation } from '@/utils/translations'

interface SearchInputSectionProps {
  onSubmit: (query: string) => void
  onClear: () => void
  isLoading: boolean
  language: 'en' | 'zh'
}

export const SearchInputSection = ({
  onSubmit,
  onClear,
  isLoading,
  language,
}: SearchInputSectionProps) => {
  const [query, setQuery] = useState('')
  const t = useTranslation(language)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSubmit(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    onClear()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)

    // If input becomes empty, trigger clear to show popular scenarios
    if (newValue === '') {
      onClear()
    }
  }

  return (
    <div className="px-4 py-3 bg-white">
      <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={t.search.placeholder}
            className="w-full rounded-full border border-gray-300 pl-4 pr-20 py-3 text-sm focus:outline-none focus:border-gray-400 [&::-webkit-search-cancel-button]:appearance-none"
            style={{ fontSize: '14px' }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-500 hover:text-gray-700 flex items-center justify-center"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="mr-2 p-3 bg-transparent text-gray-600 rounded-full hover:bg-gray-50 disabled:bg-transparent disabled:text-gray-300 min-h-[44px] min-w-[44px]"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
      </div>
    </div>
  )
}
