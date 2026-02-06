import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Translations, Language } from '../translations';
import { LanguageSwitcher } from './ui/LanguageSwitcher';

interface NavigationOverlayProps {
  translations: Translations['nav'];
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function NavigationOverlay({ translations, currentLanguage, onLanguageChange }: NavigationOverlayProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
              onClick={() => scrollToSection('hero')}
            >
              <h1 
                className="font-['Cinzel'] text-2xl text-[var(--color-primary-gold)]"
                style={{ textShadow: '0 0 20px var(--color-glow-gold)' }}
              >
                Realm of Shadows
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-[var(--spacing-xl)] flex-1 justify-end">
              <div className="flex items-center gap-[var(--spacing-xl)]">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-gold)] transition-colors duration-[var(--transition-normal)] relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary-gold)] group-hover:w-full transition-all duration-[var(--transition-normal)]" />
                  </button>
                ))}
              </div>
              
              {/* Pre-registration Button - CTA Style */}
              <motion.button
                onClick={() => scrollToSection(registrationItem.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-[var(--transition-normal)]"
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
                className="px-4 py-2 rounded-lg backdrop-blur-md"
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
              className="md:hidden p-2 text-[var(--color-primary-gold)] hover:bg-[var(--color-primary-gold)]/10 rounded-lg transition-colors duration-[var(--transition-normal)]"
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
            className="fixed inset-y-0 right-0 w-64 bg-[var(--color-background-deep-black)]/95 backdrop-blur-md border-l border-[var(--color-border-gold)]/20 md:hidden"
            style={{ zIndex: 'calc(var(--z-navigation) - 1)' }}
          >
            <div className="flex flex-col h-full pt-20 px-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left py-4 text-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary-gold)] border-b border-[var(--color-border-gold)]/10 transition-colors duration-[var(--transition-normal)]"
                >
                  {item.label}
                </motion.button>
              ))}
              
              {/* Pre-registration Button - Mobile */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                onClick={() => scrollToSection(registrationItem.id)}
                className="mt-6 px-6 py-3 rounded-lg font-medium text-center transition-all duration-[var(--transition-normal)]"
                style={{
                  background: 'linear-gradient(180deg, var(--color-primary-gold-dark) 0%, #92400e 100%)',
                  color: 'var(--color-text-primary)',
                  boxShadow: '0 0 20px var(--color-glow-gold)'
                }}
              >
                {registrationItem.label}
              </motion.button>
              
              {/* Language Switcher - Mobile */}
              <div className="mt-8 pt-6 border-t border-[var(--color-border-gold)]/10">
                <div 
                  className="px-4 py-3 rounded-lg"
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
            className="fixed inset-0 bg-[var(--color-overlay-dark)] md:hidden"
            style={{ zIndex: 'calc(var(--z-navigation) - 2)' }}
          />
        )}
      </AnimatePresence>
    </>
  );
}