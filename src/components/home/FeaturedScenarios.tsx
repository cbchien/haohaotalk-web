import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { useAppStore } from '@/store'

// Mock data with natural varying description lengths for masonry layout
const mockScenarios = [
  {
    id: '1',
    title: '約會遲到的她',
    title_en: 'Late for a Date',
    description: '週末約好一起去看電影，你在車站等了一個小時，她終於走上時並沒有多說什麼。你心裡有些不開心，但又不知道該不該表達出來。',
    description_en: 'Practice apologizing and explaining when running late for a romantic date.',
    category: 'relationships',
    illustration: '/scenarios/late-date.png',
    action_buttons: ['傾聽', '表達需求'],
    action_buttons_en: ['Listen', 'Express Needs'],
    extra_button: '情侶關係',
    extra_button_en: 'Relationships',
    chat_count: 5245,
  },
  {
    id: '2', 
    title: '那句點股本法的訊息',
    title_en: 'Investment Advice Message',
    description: '你最近發了好幾次訊息，對方都已讀不回或只回一兩個字。當你終於見到他時...',
    description_en: 'Navigate difficult conversations about unresponsive communication.',
    category: 'relationships',
    illustration: '/scenarios/phone-message.png',
    action_buttons: ['誠實表達', '同理'],
    action_buttons_en: ['Be Honest', 'Empathize'],
    chat_count: 8028,
  },
  {
    id: '3',
    title: '考試不及格的孩子',
    title_en: 'Child Failed Exam',
    description: '你在氣頭上說了「你怎麼這麼不董事」，孩子哭間安靜下來，低頭不語。你想挽回剛才說的話，但又不知道該怎麼開始。孩子的眼淚讓你意識到自己的話語可能傷害了他，你想要修復這段親子關係，重新建立溝通的橋樑。',
    description_en: 'Learn to handle disappointment and guide children constructively.',
    category: 'family',
    illustration: '/scenarios/sad-child.png',
    action_buttons: ['修復', '親子關係'],
    action_buttons_en: ['Repair', 'Parent-Child'],
    extra_button: '同理',
    extra_button_en: 'Empathy',
    chat_count: 6821,
  },
  {
    id: '4',
    title: '無預警加班',
    title_en: 'Unexpected Overtime',
    description: '快下班時，主管突然丟了一份文件，要你「今天弄完」。',
    description_en: 'Handle unexpected work demands while managing personal commitments.',
    category: 'workplace',
    illustration: '/scenarios/overtime.png',
    action_buttons: ['同理', '表達需求'],
    action_buttons_en: ['Empathize', 'Express Needs'],
    chat_count: 3241,
  },
  {
    id: '5',
    title: '室友的音樂太大聲',
    title_en: 'Roommate Music Too Loud',
    description: '已經晚上11點了，隔壁室友還在放音樂，你明天有重要會議需要早起。你不想破壞室友關係，但也需要充足的睡眠。',
    description_en: 'Practice setting boundaries with roommates respectfully.',
    category: 'social',
    illustration: '/scenarios/loud-music.png',
    action_buttons: ['溝通', '設界線'],
    action_buttons_en: ['Communicate', 'Set Boundaries'],
    chat_count: 2156,
  },
  {
    id: '6',
    title: '朋友借錢不還',
    title_en: 'Friend Not Returning Money',
    description: '三個月前借給朋友的錢到現在還沒還，你不知道該怎麼開口。每次見面都想提，但又怕傷害友誼。',
    description_en: 'Navigate sensitive money conversations with friends.',
    category: 'social',
    illustration: '/scenarios/money-friend.png',
    action_buttons: ['提醒', '友誼'],
    action_buttons_en: ['Remind', 'Friendship'],
    chat_count: 4782,
  },
]

export const ScenarioGrid = () => {
  const { currentLanguage } = useAppStore()

  return (
    <div className="px-4 pb-4">
      {/* Pinterest-style masonry layout using CSS columns */}
      <div className="columns-2 gap-3">
        {mockScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer break-inside-avoid mb-3"
          >
            {/* Illustration - Same height for all cards */}
            <div className="h-32 bg-gradient-to-br from-blue-10 via-green-10 to-yellow-10 p-4 flex items-center justify-center">
              <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
            </div>
            
            {/* Content - Height determined by content length */}
            <div className="p-4 relative">
              <h3 className="font-bold text-gray-900 text-sm mb-2 leading-tight">
                {currentLanguage === 'zh' ? scenario.title : scenario.title_en}
              </h3>
              
              {/* Description with natural line wrapping - no line-clamp */}
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                {currentLanguage === 'zh' ? scenario.description : scenario.description_en}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-1 mb-8">
                {scenario.action_buttons.map((button, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border"
                  >
                    {currentLanguage === 'zh' ? button : scenario.action_buttons_en[index]}
                  </span>
                ))}
                {scenario.extra_button && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border">
                    {currentLanguage === 'zh' ? scenario.extra_button : scenario.extra_button_en}
                  </span>
                )}
              </div>
              
              {/* Chat Count - positioned at bottom right */}
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center space-x-1 text-gray-500">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">{scenario.chat_count}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}