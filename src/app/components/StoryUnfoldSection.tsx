import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Translations } from '../translations';

interface StoryUnfoldSectionProps {
  translations: Translations['story'];
}

function StoryChapter({ 
  chapter, 
  index 
}: { 
  chapter: { title: string; content: string };
  index: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // 큰 숫자와 배경 이미지가 1에서 점점 어두워지는 효과
  const backgroundImageOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.3, 0]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.2, 0]);
  
  const accent = index % 2 === 0 ? 'var(--color-primary-gold)' : 'var(--color-accent-red)';

  // 2D Animation Background Images for each chapter
  const backgroundImages = [
    'https://images.unsplash.com/photo-1698450998458-0bc1045788a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeSUyMDJkJTIwZ2FtZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcwMjk1ODA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1766258863162-2fa31f7a1ee3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGRhcmslMjBjYXN0bGUlMjBydWluc3xlbnwxfHx8fDE3NzAyOTU4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1722717820200-9666326fcacd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwyZCUyMGFuaW1hdGlvbiUyMG1lZGlldmFsJTIwYmF0dGxlfGVufDF8fHx8MTc3MDI5NTgwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1559045212-9a2f1c493b61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMGRhcmslMjBmb3Jlc3QlMjBuaWdodHxlbnwxfHx8fDE3NzAyOTU4MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  ];
  
  const backgroundImage = backgroundImages[index % backgroundImages.length];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 lg:py-[var(--spacing-3xl)] px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden"
      style={{ backgroundColor: 'var(--color-background-deep-black)' }}
    >
      {/* 2D Animation Background Image (1에서 점점 어두워짐) */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          filter: 'blur(2px)',
          opacity: backgroundImageOpacity
        }}
      />

      {/* Dark Overlay for better text readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, var(--color-background-deep-black) 100%)'
        }}
      />

      {/* Background Pattern */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-5"
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, ${accent}22 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        {/* Chapter Number (1에서 점점 어두워짐) */}
        <motion.div
          className="mb-[var(--spacing-md)]"
        >
          <motion.span 
            className="text-8xl md:text-9xl font-['Cinzel'] font-bold"
            style={{ 
              color: accent,
              opacity: numberOpacity
            }}
          >
            {(index + 1).toString().padStart(2, '0')}
          </motion.span>
        </motion.div>

        {/* Chapter Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="font-['Cinzel'] text-[var(--text-heading-1)] font-bold mb-[var(--spacing-sm)]"
          style={{ 
            color: accent,
            letterSpacing: '-1px'
          }}
        >
          {chapter.title}
        </motion.h2>

        {/* Chapter Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div 
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ 
              background: `linear-gradient(to bottom, ${accent}, transparent)` 
            }}
          />
          <p 
            className="pl-[var(--spacing-lg)] text-[var(--text-body-large)] text-[var(--color-text-primary)] leading-[var(--line-height-loose)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {chapter.content}
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="mt-[var(--spacing-xl)] flex justify-center gap-[var(--spacing-lg)]">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              viewport={{ once: true }}
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: accent,
                boxShadow: `0 0 20px ${accent}` 
              }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export function StoryUnfoldSection({ translations }: StoryUnfoldSectionProps) {
  return (
    <>
      {translations.chapters.map((chapter, index) => (
        <div key={index}>
          <StoryChapter chapter={chapter} index={index} />
          {index < translations.chapters.length - 1 && (
            <div 
              className="h-px w-full"
              style={{ 
                background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.1), transparent)' 
              }}
            />
          )}
        </div>
      ))}
    </>
  );
}