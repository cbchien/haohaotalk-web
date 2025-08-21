import { useState, useEffect } from 'react'
import { useAppStore } from '@/store'
import {
  scenariosApiService,
  Scenario,
  ScenarioTag,
} from '@/services/scenariosApi'
import { SearchInputSection } from '@/components/search/SearchInputSection'
import { TagsSection } from '@/components/search/TagsSection'
import { ResultsSection } from '@/components/search/ResultsSection'

interface SearchCache {
  popularScenarios: Scenario[]
  searchResults: Map<string, Scenario[]>
  tagResults: Map<string, Scenario[]>
}

export const SearchScreen = () => {
  const { currentLanguage } = useAppStore()
  const [results, setResults] = useState<Scenario[]>([])
  const [searchType, setSearchType] = useState<'popular' | 'keyword' | 'tag'>(
    'popular'
  )
  const [currentQuery, setCurrentQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<ScenarioTag | null>(null)
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const [tags, setTags] = useState<ScenarioTag[]>([])
  const [cache, setCache] = useState<SearchCache>({
    popularScenarios: [],
    searchResults: new Map(),
    tagResults: new Map(),
  })

  const loadPopularScenarios = async () => {
    if (cache.popularScenarios.length > 0) {
      setResults(cache.popularScenarios)
      setSearchType('popular')
      return
    }

    setIsLoadingResults(true)
    try {
      const response = await scenariosApiService.getScenarios({
        sortBy: 'practice_count',
        sortOrder: 'desc',
        limit: 10,
        language: currentLanguage,
      })

      if (response.success && response.data) {
        setResults(response.data)
        setCache(prev => ({
          ...prev,
          popularScenarios: response.data!,
        }))
        setSearchType('popular')
      }
    } catch (error) {
      console.error('Error loading popular scenarios:', error)
    } finally {
      setIsLoadingResults(false)
    }
  }

  const loadTags = async () => {
    setIsLoadingTags(true)
    try {
      const response = await scenariosApiService.getTags()
      if (response.success && response.data) {
        setTags(response.data)
      }
    } catch (error) {
      console.error('Error loading tags:', error)
    } finally {
      setIsLoadingTags(false)
    }
  }

  const handleSearch = async (query: string) => {
    const cacheKey = `${query}-${currentLanguage}`

    if (cache.searchResults.has(cacheKey)) {
      const cachedResults = cache.searchResults.get(cacheKey)!
      setResults(cachedResults)
      setCurrentQuery(query)
      setSelectedTag(null)
      setSearchType('keyword')
      return
    }

    setIsLoadingResults(true)
    try {
      const response = await scenariosApiService.getScenarios({
        search: query,
        language: currentLanguage,
      })

      if (response.success && response.data) {
        setResults(response.data)
        setCurrentQuery(query)
        setSelectedTag(null)
        setSearchType('keyword')
        setCache(prev => ({
          ...prev,
          searchResults: new Map(prev.searchResults).set(
            cacheKey,
            response.data!
          ),
        }))
      }
    } catch (error) {
      console.error('Error searching scenarios:', error)
    } finally {
      setIsLoadingResults(false)
    }
  }

  const handleTagClick = async (tag: ScenarioTag) => {
    // If clicking the same tag that's already selected, clear the filter
    if (selectedTag?.id === tag.id) {
      handleClear()
      return
    }

    const tagName = currentLanguage === 'zh' ? tag.zh_name : tag.en_name
    const cacheKey = `${tagName}-${currentLanguage}`

    if (cache.tagResults.has(cacheKey)) {
      const cachedResults = cache.tagResults.get(cacheKey)!
      setResults(cachedResults)
      setSelectedTag(tag)
      setCurrentQuery('')
      setSearchType('tag')
      return
    }

    setIsLoadingResults(true)
    try {
      const response = await scenariosApiService.getScenarios({
        tags: tagName,
        language: currentLanguage,
      })

      if (response.success && response.data) {
        setResults(response.data)
        setSelectedTag(tag)
        setCurrentQuery('')
        setSearchType('tag')
        setCache(prev => ({
          ...prev,
          tagResults: new Map(prev.tagResults).set(cacheKey, response.data!),
        }))
      }
    } catch (error) {
      console.error('Error filtering by tag:', error)
    } finally {
      setIsLoadingResults(false)
    }
  }

  const handleClear = () => {
    setCurrentQuery('')
    setSelectedTag(null)
    loadPopularScenarios()
  }

  useEffect(() => {
    loadPopularScenarios()
    loadTags()
  }, [])

  useEffect(() => {
    setCache({
      popularScenarios: [],
      searchResults: new Map(),
      tagResults: new Map(),
    })
    setCurrentQuery('')
    setSelectedTag(null)
    loadPopularScenarios()
    loadTags()
  }, [currentLanguage])

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchInputSection
        onSubmit={handleSearch}
        onClear={handleClear}
        isLoading={isLoadingResults}
        language={currentLanguage}
      />
      <TagsSection
        tags={tags}
        selectedTag={selectedTag}
        onTagClick={handleTagClick}
        isLoading={isLoadingTags}
        language={currentLanguage}
      />
      <ResultsSection
        results={results}
        isLoading={isLoadingResults}
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
