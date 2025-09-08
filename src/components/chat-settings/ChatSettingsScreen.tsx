import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '@/components/navigation'
import { useAppStore } from '@/store'
import {
  scenariosApiService,
  type Scenario,
  type ScenarioRole,
} from '@/services'
import { useTranslation } from '@/utils/translations'
import { ScenarioContext } from './ScenarioContext'
import { ScenarioObjective } from './ScenarioObjective'
import { RoleSelector } from './RoleSelector'
import { RelationshipSelector } from './RelationshipSelector'
import { StartConversationButton } from './StartConversationButton'

// Using ScenarioRole from API service instead of local interface

export const ChatSettingsScreen = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>()
  const navigate = useNavigate()
  const {
    currentLanguage,
    setCurrentScenario: setGlobalScenario,
    setAvailableRoles: setGlobalAvailableRoles,
    setSelectedRole: setGlobalSelectedRole,
    setRelationshipLevel: setGlobalRelationshipLevel,
  } = useAppStore()
  const t = useTranslation(currentLanguage)

  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [roles, setRoles] = useState<ScenarioRole[]>([])
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [relationshipLevel, setRelationshipLevel] = useState<
    'low' | 'normal' | 'high'
  >('normal')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)

    const loadScenario = async () => {
      if (!scenarioId) {
        setError(t.chatSettings.errors.scenarioNotFound)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // First try to get individual scenario (when API endpoint exists)
        let scenarioData: Scenario | null = null

        try {
          const response = await scenariosApiService.getScenario(scenarioId, {
            language: currentLanguage,
          })
          if (response.success && response.data) {
            scenarioData = response.data
          }
        } catch {
          // Individual scenario endpoint doesn't exist yet, fallback to list
        }

        // If individual API failed, search in scenarios list
        if (!scenarioData) {
          const listResponse = await scenariosApiService.getScenarios({
            language: currentLanguage,
            limit: 100, // Get more scenarios to find the one we need
          })

          if (listResponse.success && listResponse.data) {
            scenarioData =
              listResponse.data.find(s => s.id === scenarioId) || null
          }
        }

        if (scenarioData) {
          // Fetch roles for this scenario first, only set scenario if roles load successfully
          try {
            const rolesResponse = await scenariosApiService.getScenarioRoles(
              scenarioId,
              {
                language: currentLanguage,
              }
            )

            if (
              rolesResponse.success &&
              rolesResponse.data &&
              rolesResponse.data.length > 0
            ) {
              setRoles(rolesResponse.data)
              setSelectedRole(rolesResponse.data[0].id)
              setScenario(scenarioData) // Only set scenario if roles loaded successfully

              // Store in global state
              setGlobalScenario(scenarioData)
              setGlobalAvailableRoles(rolesResponse.data)
              setGlobalSelectedRole(rolesResponse.data[0])
            } else {
              // No roles available - this is a scenario error
              throw new Error('This scenario is not properly configured')
            }
          } catch (error) {
            // Role fetching failed - treat as scenario loading error
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error'
            if (
              errorMessage.includes('HTTP 404') ||
              errorMessage.includes('not properly configured')
            ) {
              setError(t.chatSettings.errors.scenarioUnavailable)
            } else {
              setError(t.chatSettings.errors.scenarioLoadError)
            }
            setRoles([]) // Reset roles to empty array on error
            return // Don't proceed if scenario/roles failed to load
          }
        } else {
          setError(t.chatSettings.errors.scenarioNotFound)
        }
      } catch (error) {
        // Enhanced error handling for scenario loading
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        if (errorMessage.includes('HTTP 404')) {
          setError(t.chatSettings.errors.scenarioNoLongerAvailable)
        } else if (errorMessage.includes('HTTP 403')) {
          setError(t.chatSettings.errors.noPermissionToAccess)
        } else {
          setError(t.chatSettings.errors.networkError)
        }
        setScenario(null)
        setRoles([])
        setSelectedRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadScenario()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId, currentLanguage])

  const handleBack = () => {
    navigate(-1)
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    const roleData = roles.find(role => role.id === roleId)
    if (roleData) {
      setGlobalAvailableRoles(roles)
      setGlobalSelectedRole(roleData)
    }
  }

  const handleRelationshipLevelSelect = (level: 'low' | 'normal' | 'high') => {
    setRelationshipLevel(level)
    setGlobalRelationshipLevel(level)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">{t.scenarios.loading}</div>
      </div>
    )
  }

  if (error || !scenario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error || 'Scenario not found'}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-100 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const scenarioImage = scenario.image_url ? (
    <img
      src={scenario.image_url}
      alt={scenario.title}
      className="w-8 h-8 rounded-full object-cover"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-10 to-green-10 flex items-center justify-center">
      <span className="text-xs">🎭</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <ScreenHeader
        title={scenario.title}
        leftContent={scenarioImage}
        onBack={handleBack}
      />

      <div className="space-y-4 p-4 sm:pt-8 pb-20 max-w-md mx-auto">
        <ScenarioContext scenario={scenario} />

        <ScenarioObjective scenario={scenario} />

        <RoleSelector
          roles={roles}
          selectedRole={selectedRole}
          onRoleSelect={handleRoleSelect}
          language={currentLanguage}
        />

        <RelationshipSelector
          selectedLevel={relationshipLevel}
          onLevelSelect={handleRelationshipLevelSelect}
          language={currentLanguage}
        />

        <StartConversationButton
          scenario={scenario}
          selectedRole={selectedRole}
          relationshipLevel={relationshipLevel}
          disabled={!selectedRole}
          onSessionCreated={sessionId => {
            // Navigate to chat - data is now in global state
            navigate(`/session/${sessionId}/chat`)
          }}
        />
      </div>
    </div>
  )
}
