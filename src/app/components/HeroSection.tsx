import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { RealTimeCounter } from './ui/RealTimeCounter';
import { CTAButton } from './ui/CTAButton';
import { Translations } from '../translations';

interface HeroSectionProps {
  translations: Translations['hero'];
}

export function HeroSection({ translations }: HeroSectionProps) {
  const scrollToRegistration = () => {
    const element = document.getElementById('registration');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--color-background-deep-black)' }}>
      {/* ParallaxLayerBackground - Game Character Animation Background */}
      <div className="absolute inset-0 z-[var(--z-background)]">
        {/* Multi-layered 2D Animation Style Background with Parallax */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          {/* Layer 1: 2D Game Background - Dark Fantasy Landscape */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1698450998458-0bc1045788a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwyZCUyMGdhbWUlMjBiYWNrZ3JvdW5kJTIwZGFyayUyMGZhbnRhc3l8ZW58MXx8fHwxNzcwMjk1MTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
              backgroundPosition: 'center center'
            }}
          />
          
          {/* Layer 2: Anime Style Dark Castle */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 0.35 }}
            transition={{ duration: 2.2, delay: 0.3, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1722596592171-48dee0cdbcae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMHN0eWxlJTIwZGFyayUyMGNhc3RsZSUyMG5pZ2h0fGVufDF8fHx8MTc3MDI5NTEyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
              backgroundPosition: 'left center',
              mixBlendMode: 'overlay'
            }}
          />
          
          {/* Layer 3: Pixel Art Dark Fantasy Landscape */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 0.3 }}
            transition={{ duration: 2.4, delay: 0.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1760753145427-c327d09ace00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGRhcmslMjBmYW50YXN5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3MDI5NTEzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
              backgroundPosition: 'right center',
              mixBlendMode: 'screen'
            }}
          />

          {/* Layer 4: 2D Animation Medieval Warrior - Character Element */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 0.2 }}
            transition={{ duration: 2.8, delay: 0.7, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1600081521854-9d73f9097db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwyZCUyMGFuaW1hdGlvbiUyMG1lZGlldmFsJTIwd2FycmlvcnxlbnwxfHx8fDE3NzAyOTUxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
              backgroundPosition: 'bottom center',
              mixBlendMode: 'soft-light'
            }}
          />
        </motion.div>

        {/* Animated Particles/Embers Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                opacity: 0
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 0],
                x: `${Math.random() * window.innerWidth}px`
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
              className="absolute w-1 h-1 bg-[var(--color-primary-gold)] rounded-full"
              style={{
                boxShadow: '0 0 10px var(--color-primary-gold)'
              }}
            />
          ))}
        </div>
        
        {/* Red embers for accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`red-${i}`}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                opacity: 0
              }}
              animate={{
                y: -100,
                opacity: [0, 0.8, 0],
                x: `${Math.random() * window.innerWidth}px`
              }}
              transition={{
                duration: Math.random() * 12 + 12,
                repeat: Infinity,
                delay: Math.random() * 6,
                ease: "linear"
              }}
              className="absolute w-1.5 h-1.5 bg-[var(--color-accent-red)] rounded-full"
              style={{
                boxShadow: '0 0 15px var(--color-accent-red)'
              }}
            />
          ))}
        </div>
      </div>

      {/* ParallaxLayerMidground - Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-background-deep-black)]/50 via-transparent to-[var(--color-background-deep-black)] z-[calc(var(--z-background)+1)]" />

      {/* ParallaxLayerForeground - Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 z-[var(--z-content)] gap-[var(--spacing-lg)]">
        {/* RealTimeCounter - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center w-full"
        >
          <RealTimeCounter size="compact" label={translations.counterLabel} showTrend />
        </motion.div>

        {/* GameTitleText */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center flex flex-col items-center w-full"
        >
          <h1 
            className="font-['Cinzel'] font-bold mb-[var(--spacing-lg)]"
            style={{
              fontSize: 'calc(var(--text-display-title) * 1.2)',
              background: 'linear-gradient(180deg, var(--color-primary-gold) 0%, var(--color-primary-gold-dark) 40%, var(--color-accent-red) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px var(--color-glow-gold), 0 0 80px rgba(220, 38, 38, 0.3)',
              letterSpacing: '-2px',
              filter: 'drop-shadow(0 0 20px var(--color-glow-gold)) drop-shadow(0 0 40px rgba(220, 38, 38, 0.2))'
            }}
          >
            Realm of Shadows
          </h1>
          <p 
            className="text-sm md:text-xl text-[var(--color-accent-red)] mb-[var(--spacing-lg)] font-semibold tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {translations.subtitle.split('|').map((line, index, array) => (
              <span key={index}>
                {line}
                {index < array.length - 1 && <br />}
              </span>
            ))}
          </p>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mb-[var(--spacing-md)] flex justify-center"
          >
            <CTAButton
              type="primary"
              size="large"
              onClick={scrollToRegistration}
              className="px-12"
              style={{
                background: 'linear-gradient(180deg, var(--color-primary-gold-dark) 0%, #92400e 100%)',
                color: 'var(--color-text-primary)',
                border: 'none'
              }}
            >
              {translations.cta}
            </CTAButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-[var(--color-primary-gold)]/80 text-lg text-center"
          >
            {translations.scrollHint}
          </motion.div>
        </motion.div>

        {/* ScrollIndicatorArrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-6 h-10 border-2 border-[var(--color-primary-gold)] rounded-full flex items-start justify-center p-2">
              <motion.div 
                className="w-1.5 h-3 bg-[var(--color-primary-gold)] rounded-full"
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <ChevronDown className="w-5 h-5 text-[var(--color-primary-gold)]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}