import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { ProfilePageLayout } from './components/ProfilePageLayout'

export const PrivacyPolicyPage = () => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  return (
    <ProfilePageLayout title={t.profile.menu.privacy}>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="prose prose-sm max-w-none">
          {currentLanguage === 'zh' ? (
            <div className="space-y-4 text-gray-600">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  隱私政策
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  最後更新：2025年8月22日
                </p>
              </div>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  資料收集
                </h3>
                <p>我們收集您主動提供的資訊，包括：</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>帳戶註冊資訊（電子郵件、顯示名稱）</li>
                  <li>練習對話記錄</li>
                  <li>使用統計和偏好設定</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  資料使用
                </h3>
                <p>我們使用您的資料來：</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>提供個人化的學習體驗</li>
                  <li>分析您的進步情況</li>
                  <li>改善我們的服務品質</li>
                  <li>提供技術支援</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  資料保護
                </h3>
                <p>我們採用業界標準的安全措施來保護您的個人資訊：</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>所有資料傳輸使用 SSL 加密</li>
                  <li>定期進行安全審計</li>
                  <li>限制員工存取個人資料</li>
                  <li>遵循資料最小化原則</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  您的權利
                </h3>
                <p>您有權：</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>存取您的個人資料</li>
                  <li>更正不準確的資料</li>
                  <li>刪除您的帳戶和資料</li>
                  <li>限制資料處理</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  聯絡我們
                </h3>
                <p>
                  如果您對隱私政策有任何疑問，請透過應用程式內的「回報問題」功能聯絡我們。
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-4 text-gray-600">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Privacy Policy
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Last updated: August 22, 2025
                </p>
              </div>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Data Collection
                </h3>
                <p>
                  We collect information you voluntarily provide, including:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>
                    Account registration information (email, display name)
                  </li>
                  <li>Practice conversation records</li>
                  <li>Usage statistics and preferences</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Data Usage
                </h3>
                <p>We use your data to:</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Provide personalized learning experiences</li>
                  <li>Analyze your progress</li>
                  <li>Improve our service quality</li>
                  <li>Provide technical support</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Data Protection
                </h3>
                <p>
                  We employ industry-standard security measures to protect your
                  personal information:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>All data transmission uses SSL encryption</li>
                  <li>Regular security audits</li>
                  <li>Restricted employee access to personal data</li>
                  <li>Following data minimization principles</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Your Rights
                </h3>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and data</li>
                  <li>Restrict data processing</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Contact Us
                </h3>
                <p>
                  If you have any questions about this privacy policy, please
                  contact us through the "Contact Us" feature in the app.
                </p>
              </section>
            </div>
          )}
        </div>
      </div>
    </ProfilePageLayout>
  )
}
