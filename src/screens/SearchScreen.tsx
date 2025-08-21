import { useState } from 'react'
import { useAppStore } from '@/store'
import type { ScenarioTag } from '@/services/scenariosApi'
import { SearchInputSection } from '@/components/search/SearchInputSection'
import { TagsSection } from '@/components/search/TagsSection'
import { ResultsSection } from '@/components/search/ResultsSection'
import {
  usePopularScenarios,
  useSearchScenarios,
  useTagScenarios,
  useAvailableTags,
} from '@/hooks/useSearchQueries'

export const SearchScreen = () => {
  const { currentLanguage } = useAppStore()
  const [searchType, setSearchType] = useState<'popular' | 'keyword' | 'tag'>(
    'popular'
  )
  const [currentQuery, setCurrentQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<ScenarioTag | null>(null)

  // React Query hooks for data fetching and caching
  const popularQuery = usePopularScenarios(currentLanguage)
  const searchQuery = useSearchScenarios(
    currentQuery,
    currentLanguage,
    searchType === 'keyword'
  )
  const tagQuery = useTagScenarios(
    selectedTag
      ? currentLanguage === 'zh'
        ? selectedTag.zh_name
        : selectedTag.en_name
      : '',
    currentLanguage,
    searchType === 'tag'
  )
  const tagsQuery = useAvailableTags()

  // Determine current results and loading state based on search type
  const getCurrentResults = () => {
    switch (searchType) {
      case 'keyword':
        return searchQuery.data || []
      case 'tag':
        return tagQuery.data || []
      default:
        return popularQuery.data || []
    }
  }

  const getCurrentLoading = () => {
    switch (searchType) {
      case 'keyword':
        return searchQuery.isLoading
      case 'tag':
        return tagQuery.isLoading
      default:
        return popularQuery.isLoading
    }
  }

  const handleSearch = (query: string) => {
    setCurrentQuery(query)
    setSelectedTag(null)
    setSearchType('keyword')
  }

  const handleTagClick = (tag: ScenarioTag) => {
    // If clicking the same tag that's already selected, clear the filter
    if (selectedTag?.id === tag.id) {
      handleClear()
      return
    }

    setSelectedTag(tag)
    setCurrentQuery('')
    setSearchType('tag')
  }

  const handleClear = () => {
    setCurrentQuery('')
    setSelectedTag(null)
    setSearchType('popular')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchInputSection
        onSubmit={handleSearch}
        onClear={handleClear}
        isLoading={getCurrentLoading()}
        language={currentLanguage}
      />
      <TagsSection
        tags={tagsQuery.data || []}
        selectedTag={selectedTag}
        onTagClick={handleTagClick}
        isLoading={tagsQuery.isLoading}
        language={currentLanguage}
      />
      <ResultsSection
        results={getCurrentResults()}
        isLoading={getCurrentLoading()}
        searchType={searchType}
        searchQuery={currentQuery}
        selectedTagName={
          selectedTag
            ? currentLanguage === 'zh'
              ? selectedTag.zh_name
              : selectedTag.en_name
            : undefined
        }
        language={currentLanguage}
      />
    </div>
  )
}
