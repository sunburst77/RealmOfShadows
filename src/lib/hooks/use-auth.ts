/**
 * 인증 관련 React Hook
 * Supabase Auth와 통합된 편리한 인증 기능 제공
 */

import { useState, useEffect, useRef } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  signInWithMagicLinkSecure,
  signOut,
  getSession,
  onAuthStateChange,
  isUserRegistered,
  AuthError,
} from '@/lib/supabase/auth';

/**
 * useAuth 반환 타입
 */
export interface UseAuthReturn {
  /** 현재 사용자 */
  user: User | null;
  /** 현재 세션 */
  session: Session | null;
  /** 로딩 상태 */
  loading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 인증 여부 */
  isAuthenticated: boolean;
  /** 매직 링크 로그인 */
  signIn: (email: string) => Promise<void>;
  /** 로그아웃 */
  signOut: () => Promise<void>;
  /** 에러 초기화 */
  clearError: () => void;
}

/**
 * 인증 상태 관리 Hook
 * 
 * @returns 인증 관련 상태 및 함수
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading, signIn, signOut } = useAuth();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   
 *   if (user) {
 *     return <button onClick={signOut}>Logout</button>;
 *   }
 *   
 *   return <button onClick={() => signIn('user@example.com')}>Login</button>;
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 메모리 누수 방지
  const isMountedRef = useRef(true);

  useEffect(() => {
    // 초기 세션 로드
    let cancelled = false;

    async function loadInitialSession() {
      try {
        const currentSession = await getSession();
        
        if (cancelled || !isMountedRef.current) return;
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
      } catch (err) {
        console.error('초기 세션 로드 실패:', err);
        if (!cancelled && isMountedRef.current) {
          setError('세션을 불러오는데 실패했습니다.');
        }
      } finally {
        if (!cancelled && isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    loadInitialSession();

    // 인증 상태 변경 구독
    const subscription = onAuthStateChange((event, session, user) => {
      if (!isMountedRef.current) return;
      
      console.log('🔐 useAuth: 인증 상태 변경', event);
      
      setSession(session);
      setUser(user);
      setLoading(false);
      
      // 특정 이벤트에 따른 에러 처리
      if (event === 'SIGNED_OUT') {
        setError(null);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('✅ 토큰 갱신 완료');
      } else if (event === 'USER_UPDATED') {
        console.log('✅ 사용자 정보 업데이트');
      }
    });

    // Cleanup
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // 컴포넌트 언마운트 감지
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * 매직 링크로 로그인
   */
  const signIn = async (email: string) => {
    if (!isMountedRef.current) return;
    
    try {
      setError(null);
      setLoading(true);
      
      // 사용자 등록 확인 (선택 사항)
      const isRegistered = await isUserRegistered(email);
      if (!isRegistered) {
        throw new AuthError(
          '등록되지 않은 이메일입니다. 먼저 사전등록을 완료해주세요.',
          'user_not_found',
          404
        );
      }
      
      // 매직 링크 전송
      await signInWithMagicLinkSecure(email);
      
      if (!isMountedRef.current) return;
      
      console.log('✅ 매직 링크 전송 완료:', email);
    } catch (err: any) {
      console.error('로그인 실패:', err);
      
      if (!isMountedRef.current) return;
      
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError(err.message || '로그인에 실패했습니다.');
      }
      
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  /**
   * 로그아웃
   */
  const logOut = async () => {
    if (!isMountedRef.current) return;
    
    try {
      setError(null);
      setLoading(true);
      
      await signOut();
      
      if (!isMountedRef.current) return;
      
      console.log('✅ 로그아웃 완료');
    } catch (err: any) {
      console.error('로그아웃 실패:', err);
      
      if (!isMountedRef.current) return;
      
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError(err.message || '로그아웃에 실패했습니다.');
      }
      
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  /**
   * 에러 초기화
   */
  const clearError = () => {
    if (isMountedRef.current) {
      setError(null);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signOut: logOut,
    clearError,
  };
}

/**
 * 인증 필요 여부만 확인하는 간단한 Hook
 * 
 * @returns 인증 여부 및 로딩 상태
 * 
 * @example
 * ```tsx
 * function ProtectedComponent() {
 *   const { isAuthenticated, loading } = useRequireAuth();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (!isAuthenticated) return <div>Please login</div>;
 *   
 *   return <div>Protected Content</div>;
 * }
 * ```
 */
export function useRequireAuth(): {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
} {
  const { user, loading, isAuthenticated } = useAuth();
  
  return {
    isAuthenticated,
    loading,
    user,
  };
}

/**
 * 현재 사용자 정보만 필요한 경우 사용하는 Hook
 * 
 * @returns 현재 사용자 및 로딩 상태
 */
export function useCurrentUser(): {
  user: User | null;
  loading: boolean;
} {
  const { user, loading } = useAuth();
  
  return {
    user,
    loading,
  };
}
