import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { ProfilePageLayout } from './components/ProfilePageLayout'

export const TermsOfUsePage = () => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  return (
    <ProfilePageLayout title={t.profile.menu.terms}>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="prose prose-sm max-w-none">
          {currentLanguage === 'zh' ? (
            <div className="space-y-4 text-gray-600">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">使用者條款</h2>
                <p className="text-sm text-gray-500 mb-4">最後更新：2025年8月22日</p>
              </div>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">服務條款</h3>
                <p>歡迎使用好好說。使用我們的服務即表示您同意遵守以下條款和條件。</p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">使用規範</h3>
                <p>使用本服務時，您同意：</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>提供準確和完整的註冊資訊</li>
                  <li>保護您的帳戶安全</li>
                  <li>不進行任何非法或有害的活動</li>
                  <li>尊重其他使用者和我們的服務</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">知識產權</h3>
                <p>本服務的所有內容，包括但不限於：</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>軟體和技術</li>
                  <li>練習情境和內容</li>
                  <li>商標和標誌</li>
                  <li>使用者介面設計</li>
                </ul>
                <p className="mt-2">均受知識產權法保護，屬於好好說或其授權方所有。</p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">免責聲明</h3>
                <p>本服務按「現狀」提供。我們不保證：</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>服務不會中斷或無錯誤</li>
                  <li>內容的準確性或完整性</li>
                  <li>特定結果或改善</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">責任限制</h3>
                <p>在法律允許的最大範圍內，我們對因使用本服務而產生的任何直接、間接、偶然或後果性損害不承擔責任。</p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">條款變更</h3>
                <p>我們保留隨時修改這些條款的權利。重大變更將透過應用程式通知您。</p>
              </section>
            </div>
          ) : (
            <div className="space-y-4 text-gray-600">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Terms of Use</h2>
                <p className="text-sm text-gray-500 mb-4">Last updated: August 22, 2025</p>
              </div>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Service Terms</h3>
                <p>Welcome to HaoHaoTalk. By using our service, you agree to comply with the following terms and conditions.</p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Usage Guidelines</h3>
                <p>When using this service, you agree to:</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Provide accurate and complete registration information</li>
                  <li>Protect your account security</li>
                  <li>Not engage in any illegal or harmful activities</li>
                  <li>Respect other users and our service</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Intellectual Property</h3>
                <p>All content in this service, including but not limited to:</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Software and technology</li>
                  <li>Practice scenarios and content</li>
                  <li>Trademarks and logos</li>
                  <li>User interface design</li>
                </ul>
                <p className="mt-2">is protected by intellectual property law and owned by HaoHaoTalk or its licensors.</p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Disclaimer</h3>
                <p>This service is provided "as is". We do not guarantee:</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Uninterrupted or error-free service</li>
                  <li>Accuracy or completeness of content</li>
                  <li>Specific results or improvements</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Limitation of Liability</h3>
                <p>To the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this service.</p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Changes to Terms</h3>
                <p>We reserve the right to modify these terms at any time. Significant changes will be communicated through the app.</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </ProfilePageLayout>
  )
}