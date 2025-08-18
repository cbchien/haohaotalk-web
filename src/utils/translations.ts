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
}

export const translations: Record<Language, Translations> = {
  en: {
    navigation: {
      home: 'Home',
      search: 'Search', 
      progress: 'Progress',
      profile: 'Profile'
    },
    scenarios: {
      loading: 'Loading scenarios...',
      noScenariosAvailable: 'No scenarios available'
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
        displayNameRequired: 'Display name is required'
      },
      errors: {
        authenticationFailed: 'Authentication failed. Please try again.',
        networkError: 'Network error. Please check your connection and try again.',
        googleOAuthNotConfigured: 'Google OAuth not configured'
      }
    },
    profile: {
      guestAccount: 'Guest Account',
      registeredAccount: 'Registered Account',
      guestModeMessage: 'You\'re using guest mode. Create an account to save your progress!',
      clearSessionMessage: 'This will clear your current session and start over'
    }
  },
  zh: {
    navigation: {
      home: '首頁',
      search: '搜尋',
      progress: '歷史', 
      profile: '我的'
    },
    scenarios: {
      loading: '載入情境中...',
      noScenariosAvailable: '沒有可用的情境'
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
        displayNameRequired: '顯示名稱為必填'
      },
      errors: {
        authenticationFailed: '身份驗證失敗。請重試。',
        networkError: '網路錯誤。請檢查您的連接並重試。',
        googleOAuthNotConfigured: 'Google OAuth 未配置'
      }
    },
    profile: {
      guestAccount: '訪客帳戶',
      registeredAccount: '註冊帳戶',
      guestModeMessage: '您正在使用訪客模式。建立帳戶以保存您的進度！',
      clearSessionMessage: '這將清除您當前的會話並重新開始'
    }
  }
}

export const useTranslation = (language: Language) => {
  return translations[language]
}