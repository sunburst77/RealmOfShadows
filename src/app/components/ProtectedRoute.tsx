/**
 * 보호된 라우트 컴포넌트
 * 인증된 사용자만 접근 가능
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useRequireAuth } from '@/lib/hooks';
import { motion } from 'motion/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useRequireAuth();
  const location = useLocation();

  // 로딩 중
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-background-deep-black)',
          color: 'var(--color-text-primary)',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--color-primary-gold)' }}
          />
          <p className="text-lg opacity-70">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}
