import { motion } from 'motion/react';
import { Twitter, Facebook, Instagram, Youtube, Globe } from 'lucide-react';
import { Translations, Language } from '../translations';

interface FooterSectionProps {
  translations: Translations['footer'];
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function FooterSection({ translations, currentLanguage, onLanguageChange }: FooterSectionProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' }
  ];

  const footerLinks = [
    { label: translations.privacyPolicy, href: '#' },
    { label: translations.termsOfService, href: '#' },
    { label: translations.customerSupport, href: '#' },
    { label: translations.faq, href: '#' }
  ];

  return (
    <footer 
      className="relative border-t py-8 sm:py-12 md:py-16 lg:py-[var(--spacing-2xl)] px-4 sm:px-6 md:px-8"
      style={{ 
        backgroundColor: 'var(--color-background-deep-black)',
        borderColor: 'rgba(212, 175, 55, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-[var(--spacing-xl)] mb-8 md:mb-[var(--spacing-xl)]">
          {/* Brand */}
          <div>
            <h3 
              className="font-['Cinzel'] text-xl sm:text-2xl text-[var(--color-primary-gold)] mb-3 sm:mb-[var(--spacing-md)]"
              style={{ textShadow: '0 0 20px var(--color-glow-gold)' }}
            >
              Realm of Shadows
            </h3>
            <p 
              className="text-xs sm:text-sm leading-relaxed"
              style={{ 
                color: 'var(--color-text-secondary)',
                fontFamily: "'Cormorant Garamond', serif"
              }}
            >
              {translations.brandDescription}
            </p>
          </div>

          {/* FooterLinks */}
          <div>
            <h4 className="text-[var(--color-primary-gold)] font-semibold mb-[var(--spacing-md)]">
              {translations.infoTitle}
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-gold)] transition-colors duration-[var(--transition-normal)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-[var(--color-primary-gold)] font-semibold mb-[var(--spacing-md)]">
              {translations.socialMediaTitle}
            </h4>
            <div className="flex gap-[var(--spacing-md)]">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-yellow-600/30 hover:bg-yellow-600/45 rounded-full flex items-center justify-center transition-all duration-[var(--transition-normal)]"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-[var(--color-primary-gold)]" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* FooterCopyright - Bottom Bar */}
        <div 
          className="border-t pt-[var(--spacing-xl)] flex flex-col md:flex-row justify-between items-center gap-[var(--spacing-md)]"
          style={{ borderColor: 'rgba(212, 175, 55, 0.08)' }}
        >
          <p className="text-sm text-[var(--color-text-muted)]">
            © {currentYear} {translations.copyright.replace('© 2024 ', '')}
          </p>

          {/* LanguageSwitcher */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--color-text-muted)]" />
            <select 
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent border border-[var(--color-border-default)] rounded px-3 py-1 text-sm text-[var(--color-text-secondary)] cursor-pointer focus:border-[var(--color-border-gold)] focus:outline-none transition-colors duration-[var(--transition-normal)]"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          {/* Powered by */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-[var(--color-primary-gold)] rounded-full"
                />
              ))}
            </div>
            <span className="text-sm text-[var(--color-text-muted)] ml-2">
              {translations.poweredBy}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}