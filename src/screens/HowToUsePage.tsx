import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { ProfilePageLayout } from '@/components/profile/ProfilePageLayout'

export const HowToUsePage = () => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  return (
    <ProfilePageLayout title={t.profile.menu.howToUse}>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="prose prose-sm max-w-none">
          {currentLanguage === 'zh' ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                歡迎使用好好說
              </h2>
              <p className="text-gray-600 mb-4">
                好好說是一個幫助您練習困難對話的平台。通過角色扮演的方式，您可以在安全的環境中提升溝通技巧。
              </p>

              <h3 className="text-base font-semibold text-gray-900 mb-3">
                如何開始練習：
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>在首頁選擇一個練習情境</li>
                <li>閱讀情境背景和目標</li>
                <li>選擇您想要扮演的角色</li>
                <li>設定與對方的關係強度</li>
                <li>開始練習對話</li>
                <li>對話結束後查看您的連接分數</li>
                <li>閱讀個人化的改進建議</li>
              </ol>

              <h3 className="text-base font-semibold text-gray-900 mb-3 mt-6">
                練習技巧：
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>保持開放和誠實的態度</li>
                <li>傾聽對方的觀點</li>
                <li>表達自己的感受和需求</li>
                <li>尋找共同點和解決方案</li>
              </ul>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Welcome to HaoHaoTalk
              </h2>
              <p className="text-gray-600 mb-4">
                HaoHaoTalk is a platform designed to help you practice difficult
                conversations. Through role-playing scenarios, you can improve
                your communication skills in a safe environment.
              </p>

              <h3 className="text-base font-semibold text-gray-900 mb-3">
                How to Start Practicing:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Select a practice scenario from the home page</li>
                <li>Read the scenario context and objectives</li>
                <li>Choose the role you want to play</li>
                <li>Set the relationship strength with the other person</li>
                <li>Start practicing the conversation</li>
                <li>View your connection score after the conversation</li>
                <li>Read personalized improvement suggestions</li>
              </ol>

              <h3 className="text-base font-semibold text-gray-900 mb-3 mt-6">
                Practice Tips:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Maintain an open and honest attitude</li>
                <li>Listen to the other person's perspective</li>
                <li>Express your feelings and needs clearly</li>
                <li>Look for common ground and solutions</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </ProfilePageLayout>
  )
}
