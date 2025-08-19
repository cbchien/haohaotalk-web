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
  },
}

export const useTranslation = (language: Language) => {
  return translations[language]
}
