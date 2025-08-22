import { useAppStore } from '@/store'
import { useTranslation } from '@/utils/translations'
import { ProfilePageLayout } from './components/ProfilePageLayout'

export const ConnectionScorePage = () => {
  const { currentLanguage } = useAppStore()
  const t = useTranslation(currentLanguage)

  return (
    <ProfilePageLayout title={t.profile.menu.connectionScore}>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="prose prose-sm max-w-none">
          {currentLanguage === 'zh' ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                什麼是「對話中的距離」？
              </h2>
              <p className="text-gray-600 mb-4">
                對話中的距離（連接分數）是衡量您在對話中與他人建立情感連接程度的指標。
                分數越高，表示您在對話中越能與對方產生共鳴和理解。
              </p>

              <h3 className="text-base font-semibold text-gray-900 mb-3">
                分數範圍說明：
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                  <span className="text-gray-600">
                    <strong>0-30分：</strong> 對話較為疏離，需要更多同理心
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                  <span className="text-gray-600">
                    <strong>30-60分：</strong> 有基本的理解，但仍有改善空間
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span className="text-gray-600">
                    <strong>60-100分：</strong> 建立了良好的情感連接
                  </span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-3 mt-6">
                如何提升連接分數：
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>主動傾聽對方的觀點和感受</li>
                <li>表達同理心和理解</li>
                <li>分享自己的真實感受</li>
                <li>尋找共同點和解決方案</li>
                <li>避免批評和指責</li>
              </ul>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What is Connection Score?
              </h2>
              <p className="text-gray-600 mb-4">
                Connection Score measures how well you build emotional
                connection with others during conversations. A higher score
                indicates better empathy and understanding in your
                communication.
              </p>

              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Score Ranges:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                  <span className="text-gray-600">
                    <strong>0-30:</strong> Distant conversation, needs more
                    empathy
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                  <span className="text-gray-600">
                    <strong>30-60:</strong> Basic understanding, room for
                    improvement
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span className="text-gray-600">
                    <strong>60-100:</strong> Good emotional connection
                    established
                  </span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-3 mt-6">
                How to Improve Your Connection Score:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>
                  Actively listen to the other person's perspective and feelings
                </li>
                <li>Express empathy and understanding</li>
                <li>Share your genuine feelings</li>
                <li>Look for common ground and solutions</li>
                <li>Avoid criticism and blame</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </ProfilePageLayout>
  )
}
