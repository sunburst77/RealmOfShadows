/**
 * Supabase 인증 모듈
 * 매직 링크 로그인, 세션 관리, 보안 기능 제공
 */

import { supabase } from './client';
import { checkUserExists } from './queries';
import type { Session, AuthChangeEvent, User, AuthError as SupabaseAuthError } from '@supabase/supabase-js';

// ===========================
// 타입 정의
// ===========================

/**
 * 매직 링크 로그인 응답 타입
 */
export interface MagicLinkResponse {
  user: User | null;
  session: Session | null;
}

/**
 * 인증 상태 변경 콜백 타입
 */
export type AuthStateCallback = (
  event: AuthChangeEvent,
  session: Session | null,
  user: User | null
) => void;

// ===========================
// 커스텀 에러
// ===========================

/**
 * 인증 관련 커스텀 에러
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * 에러 메시지 한글화
 */
function getErrorMessage(error: SupabaseAuthError | any): string {
  const errorMessages: Record<string, string> = {
    'invalid_credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'email_not_confirmed': '이메일 인증이 필요합니다.',
    'user_not_found': '등록되지 않은 사용자입니다. 먼저 사전등록을 완료해주세요.',
    'otp_expired': '인증 링크가 만료되었습니다. 다시 시도해주세요.',
    'otp_disabled': '이메일 인증이 비활성화되어 있습니다.',
    'rate_limit_exceeded': '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.',
    'invalid_email': '유효한 이메일 주소를 입력해주세요.',
    'email_exists': '이미 사용 중인 이메일입니다.',
    'weak_password': '비밀번호가 너무 약합니다.',
    'over_email_send_rate_limit': '이메일 전송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
  };

  return errorMessages[error.code] || error.message || '인증 중 오류가 발생했습니다.';
}

// ===========================
// 세션 관리 (캐싱)
// ===========================

let sessionCache: Session | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

/**
 * 세션 캐시 초기화
 */
export function clearSessionCache(): void {
  sessionCache = null;
  lastFetchTime = 0;
}

/**
 * 현재 세션 가져오기 (캐싱 포함)
 * 
 * @param forceRefresh - 강제 새로고침 여부
 * @returns 현재 세션 또는 null
 */
export async function getSession(forceRefresh = false): Promise<Session | null> {
  const now = Date.now();
  
  // 캐시가 유효하고 강제 새로고침이 아닌 경우
  if (!forceRefresh && sessionCache && (now - lastFetchTime) < CACHE_DURATION) {
    return sessionCache;
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('세션 조회 실패:', error);
      clearSessionCache();
      return null;
    }

    sessionCache = data.session;
    lastFetchTime = now;
    
    return data.session;
  } catch (error) {
    console.error('세션 조회 중 예외 발생:', error);
    clearSessionCache();
    return null;
  }
}

/**
 * 현재 사용자 정보 가져오기
 * 
 * @returns 현재 사용자 또는 null
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user || null;
}

/**
 * 인증된 사용자인지 확인
 * 
 * @returns 인증 여부
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session && !!session.user;
}

// ===========================
// Rate Limiting
// ===========================

/**
 * Rate limiting을 위한 간단한 메모리 저장소
 */
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15분

/**
 * Rate limiting 체크
 * 
 * @param email - 확인할 이메일
 * @throws {AuthError} Rate limit 초과 시
 */
function checkRateLimit(email: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(email);
  
  if (attempt) {
    const timeSinceLastAttempt = now - attempt.lastAttempt;
    
    // 잠금 기간 확인
    if (attempt.count >= MAX_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_DURATION) {
      const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
      throw new AuthError(
        `너무 많은 로그인 시도가 있었습니다. ${remainingTime}분 후에 다시 시도해주세요.`,
        'rate_limit_exceeded',
        429
      );
    }
    
    // 잠금 기간이 지났으면 초기화
    if (timeSinceLastAttempt >= LOCKOUT_DURATION) {
      loginAttempts.delete(email);
    }
  }
}

/**
 * 로그인 시도 기록
 * 
 * @param email - 이메일
 * @param success - 성공 여부
 */
function recordLoginAttempt(email: string, success: boolean): void {
  if (success) {
    loginAttempts.delete(email);
    return;
  }
  
  const now = Date.now();
  const attempt = loginAttempts.get(email);
  
  if (attempt) {
    loginAttempts.set(email, {
      count: attempt.count + 1,
      lastAttempt: now,
    });
  } else {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
  }
}

/**
 * Rate limiting 상태 초기화 (테스트용)
 */
export function clearRateLimitData(): void {
  loginAttempts.clear();
}

// ===========================
// 로그인/로그아웃
// ===========================

/**
 * 매직 링크로 로그인 (이메일)
 * 
 * @param email - 로그인할 이메일
 * @returns 사용자 및 세션 정보
 * @throws {AuthError} 로그인 실패 시
 */
export async function signInWithMagicLink(email: string): Promise<MagicLinkResponse> {
  try {
    // 이메일 유효성 검사
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AuthError('유효한 이메일 주소를 입력해주세요.', 'invalid_email', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const redirectUrl = `${window.location.origin}/empire`;
    
    console.log('🔄 매직 링크 요청:', {
      email: normalizedEmail,
      redirectUrl,
      origin: window.location.origin,
    });

    // 사전등록 여부 확인
    console.log('🔍 사전등록 여부 확인 중...');
    const userCheck = await checkUserExists(normalizedEmail, '');
    
    if (!userCheck.emailExists) {
      console.warn('⚠️ 사전등록되지 않은 이메일:', normalizedEmail);
      throw new AuthError(
        '사전등록되지 않은 이메일입니다. 먼저 사전등록을 완료해주세요.',
        'user_not_found',
        404
      );
    }
    
    console.log('✅ 사전등록 확인됨');

    // shouldCreateUser: true로 설정 (OTP signup 허용)
    // 사전등록 여부는 이미 위에서 확인했으므로 안전함
    // 실제 로그인 시점에 users 테이블에 있는지 다시 확인할 수 있음
    const { data, error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: true, // OTP signup을 허용하기 위해 true로 변경
      },
    });
    
    if (error) {
      console.error('❌ Supabase OTP 에러:', {
        code: error.code,
        message: error.message,
        status: error.status,
        raw: error,
      });
      
      // 422 에러에 대한 더 자세한 안내
      if (error.status === 422) {
        let detailedMessage = '';
        
        if (error.code === 'otp_disabled' || error.message.includes('Signups not allowed for otp')) {
          detailedMessage = 'OTP(매직 링크) 로그인이 비활성화되어 있습니다. Supabase Dashboard → Authentication → Sign In / Providers → "Allow new users to sign up"을 활성화해주세요.';
        } else if (error.message.includes('email') || error.code === 'otp_disabled') {
          detailedMessage = '이메일 인증이 비활성화되어 있습니다. Supabase Dashboard에서 Email Provider와 Magic Link를 활성화해주세요.';
        } else if (error.message.includes('redirect')) {
          detailedMessage = 'Redirect URL이 허용되지 않았습니다. URL Configuration에서 http://localhost:5173/empire를 추가해주세요.';
        } else {
          detailedMessage = error.message || '요청을 처리할 수 없습니다. Supabase 설정을 확인해주세요.';
        }
        
        throw new AuthError(detailedMessage, error.code || '422_error', error.status);
      }
      
      throw new AuthError(getErrorMessage(error), error.code, error.status);
    }
    
    console.log('✅ 매직 링크 전송 성공');
    return data;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('로그인 처리 중 오류가 발생했습니다.', 'unknown_error', 500);
  }
}

/**
 * Rate limiting이 적용된 매직 링크 로그인
 * 
 * @param email - 로그인할 이메일
 * @returns 사용자 및 세션 정보
 * @throws {AuthError} 로그인 실패 또는 Rate limit 초과 시
 */
export async function signInWithMagicLinkSecure(email: string): Promise<MagicLinkResponse> {
  try {
    // 이메일 정규화
    const normalizedEmail = email.toLowerCase().trim();
    
    // Rate limiting 체크
    checkRateLimit(normalizedEmail);
    
    // 로그인 시도
    const result = await signInWithMagicLink(normalizedEmail);
    
    // 성공 기록
    recordLoginAttempt(normalizedEmail, true);
    
    console.log('✅ 매직 링크 전송 성공:', normalizedEmail);
    
    return result;
  } catch (error) {
    // 실패 기록
    if (error instanceof AuthError) {
      if (error.code !== 'rate_limit_exceeded') {
        recordLoginAttempt(email.toLowerCase().trim(), false);
      }
      throw error;
    }
    
    recordLoginAttempt(email.toLowerCase().trim(), false);
    throw new AuthError('로그인 처리 중 오류가 발생했습니다.', 'unknown_error', 500);
  }
}

/**
 * 로그아웃
 * 
 * @throws {AuthError} 로그아웃 실패 시
 */
export async function signOut(): Promise<void> {
  try {
    // 캐시 초기화
    clearSessionCache();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new AuthError(getErrorMessage(error), error.code, error.status);
    }
    
    // 로컬 스토리지 정리 (선택 사항)
    // localStorage.removeItem('empire-state');
    
    console.log('✅ 로그아웃 성공');
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('로그아웃 처리 중 오류가 발생했습니다.', 'unknown_error', 500);
  }
}

// ===========================
// 인증 상태 구독
// ===========================

/**
 * 인증 상태 변경 구독
 * 
 * @param callback - 상태 변경 시 실행할 콜백
 * @returns 구독 객체 (unsubscribe 메서드 포함)
 */
export function onAuthStateChange(callback: AuthStateCallback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 인증 상태 변경:', event, session?.user?.email);
    
    // 캐시 업데이트
    if (session) {
      sessionCache = session;
      lastFetchTime = Date.now();
    } else {
      clearSessionCache();
    }
    
    // 콜백 실행
    callback(event, session, session?.user || null);
  });
  
  return data.subscription;
}

/**
 * 간단한 사용자 ID 변경 구독 (기존 호환성 유지)
 * 
 * @param callback - 사용자 ID 변경 시 실행할 콜백
 * @returns 구독 해제 함수
 */
export function onUserIdChange(callback: (userId: string | null) => void) {
  const subscription = onAuthStateChange((event, session, user) => {
    callback(user?.id || null);
  });
  
  return () => subscription.unsubscribe();
}

// ===========================
// 유틸리티
// ===========================

/**
 * 토큰 갱신
 * 
 * @returns 새 세션 또는 null
 */
export async function refreshSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('토큰 갱신 실패:', error);
      clearSessionCache();
      return null;
    }
    
    sessionCache = data.session;
    lastFetchTime = Date.now();
    
    return data.session;
  } catch (error) {
    console.error('토큰 갱신 중 예외 발생:', error);
    clearSessionCache();
    return null;
  }
}

/**
 * 사용자가 특정 이메일로 등록되어 있는지 확인
 * 
 * @param email - 확인할 이메일
 * @returns 등록 여부
 */
export async function isUserRegistered(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();
    
    return !!data && !error;
  } catch (error) {
    console.error('사용자 등록 확인 실패:', error);
    return false;
  }
}
