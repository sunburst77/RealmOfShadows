import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { NavigationOverlay } from './components/NavigationOverlay';
import { FooterSection } from './components/FooterSection';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { EmpirePage } from './pages/EmpirePage';
import { Language, translations } from './translations';
import { supabase } from '@/lib/supabase';

function AppContent() {
  const [language, setLanguage] = useState<Language>('ko');
  const t = translations[language];
  const location = useLocation();
  const navigate = useNavigate();

  // 로그인 페이지에서는 네비게이션과 푸터 숨김
  const isLoginPage = location.pathname === '/login';
  const isEmpirePage = location.pathname === '/empire';

  // 매직 링크 리다이렉트 후 URL 해시의 access_token 처리
  useEffect(() => {
    async function handleAuthCallback() {
      // URL 해시에 access_token이 있는지 확인
      const hash = window.location.hash;
      if (!hash || !hash.includes('access_token')) {
        return; // 해시가 없으면 처리하지 않음
      }

      const hashParams = new URLSearchParams(hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');

      if (error) {
        console.error('❌ 인증 에러:', error, errorDescription);
        // 에러가 있으면 해시 제거하고 로그인 페이지로 리다이렉트
        window.history.replaceState(null, '', location.pathname);
        navigate('/login');
        return;
      }

      if (accessToken && refreshToken) {
        console.log('🔐 매직 링크 인증 토큰 처리 중...');
        
        try {
          // Supabase가 자동으로 세션을 설정하지만, 명시적으로 확인
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('❌ 세션 설정 실패:', sessionError);
            window.history.replaceState(null, '', location.pathname);
            navigate('/login');
            return;
          }

          if (session) {
            console.log('✅ 세션 설정 완료:', session.user.email);
            // URL 해시 제거 (보안상 이유로)
            window.history.replaceState(null, '', location.pathname);
            
            // Empire 페이지로 리다이렉트 (이미 Empire 페이지에 있으면 리다이렉트하지 않음)
            if (location.pathname !== '/empire') {
              navigate('/empire', { replace: true });
            }
          }
        } catch (err) {
          console.error('❌ 인증 처리 중 오류:', err);
          window.history.replaceState(null, '', location.pathname);
          navigate('/login');
        }
      }
    }

    handleAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 시 한 번만 실행

  return (
    <div 
      className="min-h-screen overflow-x-hidden"
      style={{ 
        backgroundColor: 'var(--color-background-deep-black)',
        color: 'var(--color-text-primary)'
      }}
    >
      {/* 네비게이션 (로그인 페이지 제외) */}
      {!isLoginPage && (
        <NavigationOverlay 
          translations={t.nav} 
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      )}
      
      {/* 라우트 */}
      <Routes>
        {/* 홈 페이지 (랜딩 페이지) */}
        <Route 
          path="/" 
          element={<HomePage translations={t} language={language} />} 
        />
        
        {/* 로그인 페이지 */}
        <Route 
          path="/login" 
          element={<LoginPage translations={t.login} />} 
        />
        
        {/* Empire 페이지 (보호된 라우트) */}
        <Route 
          path="/empire" 
          element={
            <ProtectedRoute>
              <EmpirePage 
                translations={t.empire} 
                referralTranslations={t.referral}
                language={language} 
              />
            </ProtectedRoute>
          } 
        />
      </Routes>

      {/* 푸터 (로그인 페이지와 Empire 페이지 제외) */}
      {!isLoginPage && !isEmpirePage && (
        <FooterSection 
          translations={t.footer} 
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      )}
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--color-background-panel)',
            color: 'var(--color-primary-gold)',
            border: '1px solid var(--color-border-gold)/30'
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}