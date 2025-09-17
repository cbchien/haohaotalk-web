import type { ScenarioTip } from '@/services'
import type { Translations } from '@/utils/translations'

export const getGenericConversationTips = (t: Translations): ScenarioTip[] => [
  {
    title: t.performance.neutralDescription,
    description: t.performance.neutralDescriptionDetail,
  },
  {
    title: t.performance.expressEmotions,
    description: t.performance.expressEmotionsDetail,
  },
  {
    title: t.performance.clarifyNeeds,
    description: t.performance.clarifyNeedsDetail,
  },
  {
    title: t.performance.positiveResponse,
    description: t.performance.positiveResponseDetail,
  },
  {
    title: t.performance.understandNeeds,
    description: t.performance.understandNeedsDetail,
  },
]