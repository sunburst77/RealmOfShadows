/**
 * Supabase 라이브러리 진입점
 * 모든 Supabase 관련 함수를 여기서 export
 */

// 클라이언트
export { supabase } from './client';

// 타입
export type {
  Language,
  Database,
  RewardItem,
  TierTranslations,
  PreRegistrationResponse,
  ReferralNetworkResponse,
  ReferralNode,
  UserRewardInfo,
  DuplicateCheckResult,
} from './types';

// 조회 함수
export {
  getPreRegistrationStats,
  subscribeToRegistrationCount,
  getReferralNetwork,
  getUserRewardInfo,
  getUserByReferralCode,
  checkUserExists,
  checkEmailExists,
  checkNicknameExists,
  getUserById,
  getRewardTiers,
} from './queries';

// 수정 함수
export {
  createPreRegistration,
  claimReward,
  updateUserInfo,
} from './mutations';

export type { PreRegistrationData } from './mutations';

// 인증 함수
export {
  signInWithMagicLink,
  signInWithMagicLinkSecure,
  signOut,
  getSession,
  getCurrentUser,
  isAuthenticated,
  onAuthStateChange,
  onUserIdChange,
  refreshSession,
  isUserRegistered,
  clearSessionCache,
  clearRateLimitData,
  AuthError,
} from './auth';

export type {
  MagicLinkResponse,
  AuthStateCallback,
} from './auth';

// 테스트 함수 (개발 환경에서만 사용)
export { testSupabaseConnection, createTestUser } from './test-connection';
