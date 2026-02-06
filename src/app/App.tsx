import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { NavigationOverlay } from './components/NavigationOverlay';
import { FooterSection } from './components/FooterSection';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { EmpirePage } from './pages/EmpirePage';
import { Language, translations } from './translations';

function AppContent() {
  const [language, setLanguage] = useState<Language>('ko');
  const t = translations[language];
  const location = useLocation();

  // 로그인 페이지에서는 네비게이션과 푸터 숨김
  const isLoginPage = location.pathname === '/login';
  const isEmpirePage = location.pathname === '/empire';

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