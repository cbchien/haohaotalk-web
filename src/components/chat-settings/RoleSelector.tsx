import { useTranslation } from '@/utils/translations'
import type { ScenarioRole } from '@/services'

interface RoleSelectorProps {
  roles: ScenarioRole[]
  selectedRole: string | null
  onRoleSelect: (roleId: string) => void
  language: 'en' | 'zh'
}

export const RoleSelector = ({
  roles,
  selectedRole,
  onRoleSelect,
  language,
}: RoleSelectorProps) => {
  const t = useTranslation(language)

  return (
    <div>
      <h2>{t.chatSettings.roleSelection}</h2>
      <div className="flex gap-3">
        {(Array.isArray(roles) &&
          roles.map(role => {
            const isSelected = selectedRole === role.id
            const roleName =
              language === 'zh' 
                ? role.role_name 
                : role.role_name_en || role.role_name

            return (
              <button
                key={role.id}
                onClick={() => onRoleSelect(role.id)}
                className={`flex-1 px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-100 bg-blue-10 text-blue-100'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-40'
                }`}
              >
                <span className="text-sm font-medium">{roleName}</span>
              </button>
            )
          })) ||
          null}
      </div>
    </div>
  )
}
