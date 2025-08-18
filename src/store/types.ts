export interface User {
  id: string;
  display_name: string;
  email?: string;
  avatar_url?: string;
  account_type: 'guest' | 'registered' | 'premium';
  verification_status: 'unverified' | 'email_verified' | 'fully_verified';
  join_date: Date;
  preferred_language: 'en' | 'zh';
}

export interface Scenario {
  id: string;
  title: string;
  title_zh: string;
  description: string;
  description_zh: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_duration: number;
  illustration: string;
  is_popular: boolean;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  name_zh: string;
  description: string;
  description_zh: string;
  avatar?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SessionConfiguration {
  scenarioId: string;
  roleId: string;
  willingnessLevel: 'low' | 'normal' | 'high';
  relationshipLevel: 'low' | 'normal' | 'high';
  language: 'en' | 'zh';
}

export interface ChatSession {
  id: string;
  scenario: Scenario;
  role: Role;
  configuration: SessionConfiguration;
  messages: Message[];
  connectionScore: number;
  currentTurn: number;
  maxTurns: number;
  isActive: boolean;
  isCompleted: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'character' | 'system';
  timestamp: Date;
  character_emotion?: 'neutral' | 'happy' | 'concerned' | 'frustrated';
  score_impact?: number;
}