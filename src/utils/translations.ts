export type Language = 'en' | 'zh'

export interface Translations {
  // Navigation
  navigation: {
    home: string
    search: string
    progress: string
    profile: string
  }

  // Scenarios
  scenarios: {
    loading: string
    noScenariosAvailable: string
  }

  // Search
  search: {
    placeholder: string
    popularScenarios: string
    resultsFor: string
    taggedAs: string
    noResultsFound: string
    noResultsDescription: string
    noResultsDescriptionTag: string
  }

  // Authentication
  auth: {
    displayName: string
    email: string
    password: string
    continueAsGuest: string
    signIn: string
    createAccount: string
    continueWithGoogle: string
    alreadyHaveAccount: string
    createNewAccount: string
    accountCreatedSuccessfully: string
    signedInSuccessfully: string
    startFreshSession: string
    logout: string

    // Loading states
    loading: {
      signingIn: string
      signingOut: string
      thankYou: string
    }

    // Validation messages
    validation: {
      emailRequired: string
      emailInvalid: string
      passwordRequired: string
      passwordTooShort: string
      displayNameRequired: string
    }

    // Error messages
    errors: {
      authenticationFailed: string
      networkError: string
      googleOAuthNotConfigured: string
    }
  }

  // Profile
  profile: {
    guestAccount: string
    registeredAccount: string
    guestModeMessage: string
    clearSessionMessage: string
    menu: {
      howToUse: string
      connectionScore: string
      privacy: string
      terms: string
      contact: string
      language: string
      deleteAccount: string
      logout: string
    }
    language: {
      title: string
      description: string
      chinese: string
      english: string
    }
  }

  // Chat Settings
  chatSettings: {
    context: string
    objective: string
    roleSelection: string
    relationshipStrength: string
    startConversation: string
    preparing: string

    // Relationship levels
    relationship: {
      low: string
      normal: string
      high: string
    }

    // Error messages
    errors: {
      scenarioNotFound: string
      scenarioUnavailable: string
      scenarioLoadError: string
      scenarioNoLongerAvailable: string
      noPermissionToAccess: string
      networkError: string
      sessionCreationFailed: string
      invalidConfiguration: string
      pleaseLogin: string
      noPermission: string
      tooManySessions: string
      serverError: string
    }
  }

  // Chat Interface
  chat: {
    loading: string
    conversation: string
    connectionScore: string
    scenarioContext: string
    storyBackground: string
    typeResponse: string
    conversationComplete: string
    conversationCompleteMessage: string
    finalScore: string
    turnsCompleted: string
    viewDetailedResults: string
    practiceAgain: string
    backToHome: string
    practiceSessionEnded: string
    sessionEndError: string
    sessionEnding: string
    endSessionEarly: string
    endSessionConfirmTitle: string
    endSessionConfirmMessage: string
    endSessionConfirm: string
    cancel: string

    // Rating
    rating: {
      title: string
      subtitle: string
      placeholder: string
      submit: string
      skip: string
      thankYou: string
      submitting: string
      error: string
    }

    // Score messages
    score: {
      veryNegative: string
      negative: string
      neutral: string
      positive: string
      veryPositive: string
    }

    // Error messages
    errors: {
      sessionNotFound: string
      loadingFailed: string
      sendFailed: string
      networkError: string
    }
  }

  // Sessions
  sessions: {
    sessionInsights: string
    conversationAnalysis: string
    completedSession: string
    practiceSession: string
    browseScenarios: string
    pastPracticeSessions: string
  }

  // Performance
  performance: {
    performanceComparison: string
    connectionProgression: string
    relativeToOthers: string
    compareWithOthers: string
    betterThanPercentage: string
    loadingChart: string
    conversationTurns: string
    relationshipStrength: string
    chartDataPreparing: string
    scoreRange: string
    userCount: string
    whatWentWell: string
    keyMoments: string
    thingsToTryNext: string
    neutralDescription: string
    neutralDescriptionDetail: string
    expressEmotions: string
    expressEmotionsDetail: string
    clarifyNeeds: string
    clarifyNeedsDetail: string
    positiveResponse: string
    positiveResponseDetail: string
    understandNeeds: string
    understandNeedsDetail: string
  }

  // Common
  common: {
    goBack: string
    loading: string
    error: string
    retry: string
    next: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    navigation: {
      home: 'Home',
      search: 'Search',
      progress: 'Progress',
      profile: 'Profile',
    },
    scenarios: {
      loading: 'Loading scenarios...',
      noScenariosAvailable: 'No scenarios available',
    },
    search: {
      placeholder: 'Search scenarios...',
      popularScenarios: 'Popular Scenarios',
      resultsFor: 'Results for',
      taggedAs: 'Tagged:',
      noResultsFound: 'No scenarios found',
      noResultsDescription:
        'Try different keywords or browse popular scenarios',
      noResultsDescriptionTag: 'No scenarios available for this tag',
    },
    auth: {
      displayName: 'Display Name',
      email: 'Email',
      password: 'Password',
      continueAsGuest: 'Continue as Guest',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      continueWithGoogle: 'Continue with Google',
      alreadyHaveAccount: 'Already have an account?',
      createNewAccount: 'Create new account',
      accountCreatedSuccessfully: 'Account created successfully!',
      signedInSuccessfully: 'Signed in successfully!',
      startFreshSession: 'Start Fresh Session',
      logout: 'Logout',
      loading: {
        signingIn: 'Signing in...',
        signingOut: 'Signing out...',
        thankYou: 'Thank you for using HaoHaoTalk',
      },
      validation: {
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        passwordRequired: 'Password is required',
        passwordTooShort: 'Password must be at least 8 characters',
        displayNameRequired: 'Display name is required',
      },
      errors: {
        authenticationFailed: 'Authentication failed. Please try again.',
        networkError:
          'Network error. Please check your connection and try again.',
        googleOAuthNotConfigured: 'Google OAuth not configured',
      },
    },
    profile: {
      guestAccount: 'Guest Account',
      registeredAccount: 'Registered Account',
      guestModeMessage:
        "You're using guest mode. Create an account to save your progress!",
      clearSessionMessage:
        'This will clear your current session and start over',
      menu: {
        howToUse: 'How to Use HaoHaoTalk',
        connectionScore: 'About Connection Score',
        privacy: 'Privacy Policy',
        terms: 'Terms of Use',
        contact: 'Contact Us',
        language: 'Language',
        deleteAccount: 'Delete Account',
        logout: 'Logout',
      },
      language: {
        title: 'Choose Language',
        description: 'Select your preferred app language.',
        chinese: '中文',
        english: 'English',
      },
    },
    chatSettings: {
      context: 'Context',
      objective: 'Objective',
      roleSelection: 'Role Selection',
      relationshipStrength: 'Relationship Strength',
      startConversation: 'Start Conversation',
      preparing: 'Preparing...',
      relationship: {
        low: 'Low',
        normal: 'Normal',
        high: 'High',
      },
      errors: {
        scenarioNotFound: 'Scenario not found',
        scenarioUnavailable: 'This scenario is temporarily unavailable',
        scenarioLoadError:
          'Unable to load scenario information. Please try again later.',
        scenarioNoLongerAvailable: 'This scenario is no longer available',
        noPermissionToAccess:
          "You don't have permission to access this scenario",
        networkError: 'Network error. Please try again.',
        sessionCreationFailed: 'Failed to create session',
        invalidConfiguration:
          'Invalid configuration. Please check your selections.',
        pleaseLogin: 'Please log in to start a practice session.',
        noPermission: "You don't have permission to access this scenario.",
        tooManySessions:
          'Too many sessions created. Please wait before starting another.',
        serverError: 'Server error. Please try again in a moment.',
      },
    },
    chat: {
      loading: 'Loading conversation...',
      conversation: 'Conversation',
      connectionScore: 'Connection Score',
      scenarioContext: 'This conversation simulates drama.',
      storyBackground: 'Story Background:',
      typeResponse: 'Type your response...',
      conversationComplete: 'Conversation Complete!',
      conversationCompleteMessage:
        'Great job practicing your conversation skills!',
      finalScore: 'Final Score',
      turnsCompleted: 'turns completed',
      viewDetailedResults: 'View Detailed Results',
      practiceAgain: 'Practice Again',
      backToHome: 'Back to Home',
      practiceSessionEnded:
        '🎉 Practice session complete! Saving your progress...',
      sessionEndError: '⚠️ Session ended, but failed to save progress.',
      sessionEnding: 'Session ending...',
      endSessionEarly: 'End Session',
      endSessionConfirmTitle: 'End Session Early?',
      endSessionConfirmMessage:
        'Are you sure you want to end this practice session?',
      endSessionConfirm: 'End Session',
      cancel: 'Cancel',
      rating: {
        title: 'Rate this practice session',
        subtitle: 'How was your conversation practice?',
        placeholder: 'Share your thoughts about this session (optional)',
        submit: 'Submit Rating',
        skip: 'Skip',
        thankYou: 'Thank you for your feedback!',
        submitting: 'Submitting rating...',
        error: 'Failed to submit rating. Please try again.',
      },
      score: {
        veryNegative: 'Relationship strained',
        negative: 'Some tension present',
        neutral: 'Neutral interaction',
        positive: 'Building connection',
        veryPositive: 'Strong connection',
      },
      errors: {
        sessionNotFound: 'Session not found',
        loadingFailed: 'Failed to load conversation',
        sendFailed: 'Failed to send message',
        networkError: 'Network error. Please try again.',
      },
    },
    sessions: {
      sessionInsights: 'Session Insights',
      conversationAnalysis: 'Conversation Analysis',
      completedSession: 'Completed Session',
      practiceSession: 'Practice Session',
      browseScenarios: 'Browse Scenarios',
      pastPracticeSessions: 'Past practice sessions',
    },
    performance: {
      performanceComparison: 'Performance Comparison',
      connectionProgression: 'Connection Progression',
      relativeToOthers: 'Relative to Others',
      compareWithOthers: 'Compare with Others',
      betterThanPercentage: 'Better than {percentage}% of users',
      loadingChart: 'Loading chart...',
      conversationTurns: 'Conversation Turns',
      relationshipStrength: 'Relationship Strength',
      chartDataPreparing: 'Chart data preparing',
      scoreRange: 'Score Range',
      userCount: 'User Count',
      whatWentWell: 'What Went Well',
      keyMoments: 'Key Moments',
      thingsToTryNext: 'Things to Try Next',
      neutralDescription: 'Use neutral descriptions instead of accusations',
      neutralDescriptionDetail:
        'Try: "When you ask what to do, I feel a bit lost because I waited for an hour" to reduce confrontational tone.',
      expressEmotions: 'Express emotions using "I feel"',
      expressEmotionsDetail:
        '"I feel pressed for time and unable to control my schedule, making me feel frustrated."',
      clarifyNeeds: 'Actively clarify your needs',
      clarifyNeedsDetail:
        '"If you might be late next time, I hope you can let me know in advance so I can adjust my schedule and not feel rushed."',
      positiveResponse: 'Respond positively to build trust',
      positiveResponseDetail:
        'Show understanding and willingness to work together on solutions.',
      understandNeeds: 'Understand underlying needs',
      understandNeedsDetail:
        'Focus on what each person needs rather than what they did wrong.',
    },
    common: {
      goBack: 'Go Back',
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      next: 'Next',
    },
  },
  zh: {
    navigation: {
      home: '首頁',
      search: '搜尋',
      progress: '歷史',
      profile: '我的',
    },
    scenarios: {
      loading: '載入情境中...',
      noScenariosAvailable: '沒有可用的情境',
    },
    search: {
      placeholder: '搜尋情境...',
      popularScenarios: '熱門情境',
      resultsFor: '搜尋結果',
      taggedAs: '標籤:',
      noResultsFound: '找不到情境',
      noResultsDescription: '嘗試不同關鍵字或瀏覽熱門情境',
      noResultsDescriptionTag: '此標籤沒有可用的情境',
    },
    auth: {
      displayName: '顯示名稱',
      email: '電子郵件',
      password: '密碼',
      continueAsGuest: '以訪客身份繼續',
      signIn: '登入',
      createAccount: '建立帳戶',
      continueWithGoogle: '使用 Google 繼續',
      alreadyHaveAccount: '已有帳戶？',
      createNewAccount: '建立新帳戶',
      accountCreatedSuccessfully: '帳戶建立成功！',
      signedInSuccessfully: '登入成功！',
      startFreshSession: '開始新的會話',
      logout: '登出',
      loading: {
        signingIn: '登入中...',
        signingOut: '登出中...',
        thankYou: '期待下次的「好好說」',
      },
      validation: {
        emailRequired: '電子郵件為必填',
        emailInvalid: '請輸入有效的電子郵件地址',
        passwordRequired: '密碼為必填',
        passwordTooShort: '密碼必須至少8個字符',
        displayNameRequired: '顯示名稱為必填',
      },
      errors: {
        authenticationFailed: '身份驗證失敗。請重試。',
        networkError: '網路錯誤。請檢查您的連接並重試。',
        googleOAuthNotConfigured: 'Google OAuth 未配置',
      },
    },
    profile: {
      guestAccount: '訪客帳戶',
      registeredAccount: '註冊帳戶',
      guestModeMessage: '您正在使用訪客模式。建立帳戶以保存您的進度！',
      clearSessionMessage: '這將清除您當前的會話並重新開始',
      menu: {
        howToUse: '如何使用「好好說」',
        connectionScore: '關於「對話中的距離」',
        privacy: '隱私政策',
        terms: '使用者條款',
        contact: '回報問題',
        language: '語言設定',
        deleteAccount: '刪除帳號',
        logout: '登出',
      },
      language: {
        title: '選擇語言',
        description: '選擇您偏好的應用程式語言。',
        chinese: '中文',
        english: 'English',
      },
    },
    chatSettings: {
      context: '情境',
      objective: '主題',
      roleSelection: '角色選擇',
      relationshipStrength: '彼此的關係強度',
      startConversation: '開始對話',
      preparing: '準備中...',
      relationship: {
        low: '低',
        normal: '普通',
        high: '高',
      },
      errors: {
        scenarioNotFound: '找不到此情境',
        scenarioUnavailable: '此情境暫時無法使用',
        scenarioLoadError: '無法載入情境資訊，請稍後再試。',
        scenarioNoLongerAvailable: '此情境已不存在',
        noPermissionToAccess: '無權限存取此情境',
        networkError: '網路錯誤，請稍後再試。',
        sessionCreationFailed: '無法建立對話',
        invalidConfiguration: '配置無效，請檢查您的選擇。',
        pleaseLogin: '請登入以開始練習對話。',
        noPermission: '您無權限存取此情境。',
        tooManySessions: '建立對話次數過多，請稍後再試。',
        serverError: '伺服器錯誤，請稍後再試。',
      },
    },
    chat: {
      loading: '載入對話中...',
      conversation: '對話',
      connectionScore: '關係係',
      scenarioContext: '本對話純屬模擬劇情。',
      storyBackground: '故事背景：',
      typeResponse: '輸入回覆...',
      conversationComplete: '對話完成！',
      conversationCompleteMessage: '很棒的對話練習！',
      finalScore: '最終分數',
      turnsCompleted: '回合完成',
      viewDetailedResults: '查看詳細結果',
      practiceAgain: '再次練習',
      backToHome: '回到首頁',
      practiceSessionEnded: '練習結束！',
      sessionEndError: '練習結束，但保存進度失敗。',
      sessionEnding: '回合數到，會話結束中...',
      endSessionEarly: '結束會話',
      endSessionConfirmTitle: '提前結束會話？',
      endSessionConfirmMessage: '確定要結束此練習會話嗎？',
      endSessionConfirm: '結束會話',
      cancel: '取消',
      rating: {
        title: '為這次練習評分',
        subtitle: '這次對話練習如何？',
        placeholder: '分享您對這次練習的想法（選填）',
        submit: '提交',
        skip: '跳過',
        thankYou: '感謝您的回饋！',
        submitting: '正在提交評分...',
        error: '評分提交失敗，請重試。',
      },
      score: {
        veryNegative: '關係緊張',
        negative: '存在一些緊張',
        neutral: '中性互動',
        positive: '建立聯繫',
        veryPositive: '深度連結',
      },
      errors: {
        sessionNotFound: '找不到對話',
        loadingFailed: '載入對話失敗',
        sendFailed: '發送訊息失敗',
        networkError: '網路錯誤，請稍後再試。',
      },
    },
    sessions: {
      sessionInsights: '對話練習結果',
      conversationAnalysis: '對話分析',
      completedSession: '已完成練習',
      practiceSession: '練習會話',
      browseScenarios: '探索情境',
      pastPracticeSessions: '練習記錄',
    },
    performance: {
      performanceComparison: '相對於其他練習的結果',
      connectionProgression: '對話中的距離',
      relativeToOthers: '相對於其他練習的結果',
      compareWithOthers: '與其他用戶比較',
      betterThanPercentage: '超過 {percentage}% 的用戶',
      loadingChart: '載入圖表中...',
      conversationTurns: '對話回合',
      relationshipStrength: '關係強度',
      chartDataPreparing: '圖表數據準備中',
      scoreRange: '分數範圍',
      userCount: '用戶數量',
      whatWentWell: '做得很好的地方',
      keyMoments: '關鍵時刻',
      thingsToTryNext: '下次可以嘗試',
      neutralDescription: '用中性描述取代情緒引爆詞',
      neutralDescriptionDetail:
        '可以改成：「你一來就問我要去吃什麼，我有點錯愕，因為我等了一個小時」來降低衝突感。',
      expressEmotions: '善用「我訊息」表達情緒與影響',
      expressEmotionsDetail:
        '「我感覺時間被耽誤了，而我沒能掌握自己的安排，讓我覺得有點被忽略。」',
      clarifyNeeds: '主動釐清自己的需求',
      clarifyNeedsDetail:
        '「如果你下次可能會遲到，我希望你可以提前告訴我，這樣我可以自己調整安排，也不會這麼焦躁。」',
      positiveResponse: '適時肯定對方的回應，讓溝通形成正循環',
      positiveResponseDetail: '展現理解並願意共同尋找解決方案的態度。',
      understandNeeds: '理解潛在需求',
      understandNeedsDetail: '專注於每個人需要什麼，而不是他們做錯了什麼。',
    },
    common: {
      goBack: '返回',
      loading: '載入中...',
      error: '錯誤',
      retry: '重試',
      next: '下一步',
    },
  },
}

export const useTranslation = (language: Language) => {
  return translations[language]
}
