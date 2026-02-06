import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { Translations, Language } from '../translations';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { useAuth } from '@/lib/hooks';
import { toast } from 'sonner';

interface NavigationOverlayProps {
  translations: Translations['nav'];
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function NavigationOverlay({ translations, currentLanguage, onLanguageChange }: NavigationOverlayProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut: authSignOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'hero', label: translations.hero },
    { id: 'story', label: translations.story },
    { id: 'characters', label: translations.characters },
    { id: 'empire', label: translations.empire }
  ];

  const registrationItem = { id: 'registration', label: translations.registration };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    
    // 현재 홈 페이지가 아니면 홈으로 이동 후 스크롤
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogin = () => {
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    try {
      await authSignOut();
      toast.success('로그아웃되었습니다');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleEmpireClick = () => {
    setIsMobileMenuOpen(false);
    if (isAuthenticated) {
      navigate('/empire');
    } else {
      toast.error('로그인이 필요합니다');
      navigate('/login');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`
          fixed top-0 left-0 right-0 z-[var(--z-navigation)]
          transition-all duration-[var(--transition-normal)]
          ${isScrolled 
            ? 'bg-[var(--color-background-deep-black)]/90 backdrop-blur-md' 
            : 'bg-transparent'
          }
        `}
        style={{ zIndex: 'var(--z-navigation)' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer flex-shrink-0"
              onClick={() => scrollToSection('hero')}
            >
              <h1 
                className="font-['Cinzel'] text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--color-primary-gold)] whitespace-nowrap"
                style={{ textShadow: '0 0 20px var(--color-glow-gold)' }}
              >
                <span className="hidden sm:inline">Realm of Shadows</span>
                <span className="sm:hidden">RoS</span>
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-6 flex-1 justify-end">
              <div className="flex items-center gap-3 xl:gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'empire') {
                        handleEmpireClick();
                      } else {
                        scrollToSection(item.id);
                      }
                    }}
                    className="text-sm xl:text-base text-[var(--color-text-secondary)] hover:text-[var(--color-primary-gold)] transition-colors duration-[var(--transition-normal)] relative group whitespace-nowrap"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary-gold)] group-hover:w-full transition-all duration-[var(--transition-normal)]" />
                  </button>
                ))}
              </div>
              
              {/* 인증 버튼 */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 xl:gap-3">
                  <div className="flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg border border-[var(--color-border-gold)]">
                    <User className="w-3.5 xl:w-4 h-3.5 xl:h-4 text-[var(--color-primary-gold)]" />
                    <span className="text-xs xl:text-sm text-[var(--color-text-secondary)] max-w-[80px] xl:max-w-none truncate">
                      {user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 xl:gap-2 px-2 xl:px-4 py-1 xl:py-2 rounded-lg border border-[var(--color-border-gold)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-gold)] hover:border-[var(--color-primary-gold)] transition-all text-xs xl:text-sm"
                  >
                    <LogOut className="w-3.5 xl:w-4 h-3.5 xl:h-4" />
                    <span className="hidden xl:inline">{translations.logout}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-1.5 xl:gap-2 px-2 xl:px-4 py-1 xl:py-2 rounded-lg border border-[var(--color-border-gold)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-gold)] hover:border-[var(--color-primary-gold)] transition-all text-xs xl:text-sm"
                >
                  <LogIn className="w-3.5 xl:w-4 h-3.5 xl:h-4" />
                  <span className="hidden xl:inline">{translations.login}</span>
                </button>
              )}
              
              {/* Pre-registration Button - CTA Style */}
              <motion.button
                onClick={() => scrollToSection(registrationItem.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 xl:px-6 py-1.5 xl:py-2 rounded-lg font-medium transition-all duration-[var(--transition-normal)] text-xs xl:text-sm whitespace-nowrap"
                style={{
                  background: 'linear-gradient(180deg, var(--color-primary-gold-dark) 0%, #92400e 100%)',
                  color: 'var(--color-text-primary)',
                  boxShadow: '0 0 20px var(--color-glow-gold)'
                }}
              >
                {registrationItem.label}
              </motion.button>
              
              {/* Language Switcher - Desktop */}
              <div 
                className="px-2 xl:px-4 py-1.5 xl:py-2 rounded-lg backdrop-blur-md"
                style={{
                  backgroundColor: 'var(--color-background-panel)',
                  border: '1px solid var(--color-border-gold)/30'
                }}
              >
                <LanguageSwitcher
                  currentLanguage={currentLanguage}
                  onLanguageChange={onLanguageChange}
                />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[var(--color-primary-gold)] hover:bg-[var(--color-primary-gold)]/10 rounded-lg transition-colors duration-[var(--transition-normal)]"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 md:w-96 lg:w-64 bg-[var(--color-background-deep-black)]/95 backdrop-blur-md border-l border-[var(--color-border-gold)]/20 lg:hidden"
            style={{ zIndex: 'calc(var(--z-navigation) - 1)' }}
          >
            <div className="flex flex-col h-full pt-16 sm:pt-20 px-4 sm:px-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (item.id === 'empire') {
                      handleEmpireClick();
                    } else {
                      scrollToSection(item.id);
                    }
                  }}
                  className="text-left py-3 sm:py-4 text-base sm:text-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-gold)] border-b border-[var(--color-border-gold)]/10 transition-colors duration-[var(--transition-normal)]"
                >
                  {item.label}
                </motion.button>
              ))}
              
              {/* 인증 버튼 - Mobile */}
              {isAuthenticated ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                    className="py-3 sm:py-4 border-b border-[var(--color-border-gold)]/10"
                  >
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <User className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--color-primary-gold)]" />
                      <span className="text-xs sm:text-sm">{user?.email?.split('@')[0]}</span>
                    </div>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.1 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-left py-3 sm:py-4 text-base sm:text-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-gold)] border-b border-[var(--color-border-gold)]/10 transition-colors duration-[var(--transition-normal)]"
                  >
                    <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
                    {translations.logout}
                  </motion.button>
                </>
              ) : (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  onClick={handleLogin}
                  className="flex items-center gap-2 text-left py-3 sm:py-4 text-base sm:text-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-gold)] border-b border-[var(--color-border-gold)]/10 transition-colors duration-[var(--transition-normal)]"
                >
                  <LogIn className="w-4 sm:w-5 h-4 sm:h-5" />
                  {translations.login}
                </motion.button>
              )}
              
              {/* Pre-registration Button - Mobile */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                onClick={() => scrollToSection(registrationItem.id)}
                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-center transition-all duration-[var(--transition-normal)] text-sm sm:text-base"
                style={{
                  background: 'linear-gradient(180deg, var(--color-primary-gold-dark) 0%, #92400e 100%)',
                  color: 'var(--color-text-primary)',
                  boxShadow: '0 0 20px var(--color-glow-gold)'
                }}
              >
                {registrationItem.label}
              </motion.button>
              
              {/* Language Switcher - Mobile */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[var(--color-border-gold)]/10">
                <div 
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-background-panel)',
                    border: '1px solid var(--color-border-gold)/30'
                  }}
                >
                  <LanguageSwitcher
                    currentLanguage={currentLanguage}
                    onLanguageChange={onLanguageChange}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-[var(--color-overlay-dark)] lg:hidden"
            style={{ zIndex: 'calc(var(--z-navigation) - 2)' }}
          />
        )}
      </AnimatePresence>
    </>
  );
}