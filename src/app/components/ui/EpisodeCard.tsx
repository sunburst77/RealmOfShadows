import { motion } from 'motion/react';
import { Lock, Play, BookOpen } from 'lucide-react';
import { ReactNode } from 'react';

type EpisodeState = 'locked' | 'unlocked-unread' | 'unlocked-read';
type EpisodeSize = 'medium' | 'large';
type ContentVariant = 'text-only' | 'text-with-image' | 'text-with-audio';

interface EpisodeCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  state?: EpisodeState;
  size?: EpisodeSize;
  contentVariant?: ContentVariant;
  imageUrl?: string;
  onUnlock?: () => void;
  onClick?: () => void;
  lockedText?: string;
  newBadgeText?: string;
  textLabelText?: string;
  audioLabelText?: string;
}

const sizeStyles = {
  medium: 'w-full md:w-80 h-50',
  large: 'w-full md:w-[400px] h-[260px]'
};

const stateStyles = {
  locked: {
    card: 'border-[var(--color-border-default)] bg-gradient-to-b from-[var(--color-background-dark)] to-[var(--color-background-deep-black)]',
    overlay: 'bg-[var(--color-background-deep-black)]/60 backdrop-blur-sm',
    text: 'text-[var(--color-text-muted)]'
  },
  'unlocked-unread': {
    card: 'border-[var(--color-border-gold)] bg-gradient-to-b from-[var(--color-accent-red)]/10 to-[var(--color-background-deep-black)]',
    overlay: '',
    text: 'text-[var(--color-primary-gold)]',
    glow: 'shadow-[var(--shadow-glow-gold)]'
  },
  'unlocked-read': {
    card: 'border-[var(--color-border-default)] bg-gradient-to-b from-[var(--color-background-dark)] to-[var(--color-background-deep-black)]',
    overlay: '',
    text: 'text-[var(--color-text-primary)]'
  }
};

export function EpisodeCard({
  title,
  subtitle,
  description,
  icon,
  state = 'locked',
  size = 'medium',
  contentVariant = 'text-only',
  imageUrl,
  onClick,
  lockedText = '잠금됨',
  newBadgeText = 'NEW',
  textLabelText = '텍스트',
  audioLabelText = '음성'
}: EpisodeCardProps) {
  const sizeClass = sizeStyles[size];
  const styles = stateStyles[state];
  const isLocked = state === 'locked';
  const canInteract = !isLocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={canInteract ? { scale: 1.05 } : {}}
      className={`
        relative ${sizeClass}
        rounded-lg border-2 overflow-hidden
        ${styles.card}
        ${styles.glow || ''}
        transition-all duration-[var(--transition-normal)]
        ${canInteract && 'cursor-pointer hover:border-[var(--color-primary-gold)] hover:shadow-[var(--shadow-glow-gold-intense)]'}
        group
      `}
      onClick={canInteract ? onClick : undefined}
    >
      {/* Background Image (if text-with-image) */}
      {contentVariant === 'text-with-image' && imageUrl && (
        <div className="absolute inset-0 opacity-20">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* EpisodeLockedOverlay */}
      {isLocked && (
        <div className={`absolute inset-0 ${styles.overlay} flex items-center justify-center z-10`}>
          <div className="text-center">
            <Lock className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--color-text-secondary)]">{lockedText}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative p-[var(--spacing-md)] flex flex-col h-full gap-[var(--spacing-sm)]">
        {/* Icon */}
        <div className="flex justify-center mb-[var(--spacing-sm)]">
          <div className={`
            p-4 rounded-full border-2
            ${isLocked 
              ? 'bg-[var(--color-background-dark)] border-[var(--color-border-default)]' 
              : 'bg-[var(--color-primary-gold)]/10 border-[var(--color-border-gold)]'
            }
          `}>
            <div className={`w-8 h-8 ${isLocked ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-primary-gold)]'}`}>
              {icon}
            </div>
          </div>
        </div>

        {/* EpisodeTitle */}
        <h3 
          className={`
            font-['Cinzel'] text-[var(--text-episode-title)] font-semibold text-center
            ${isLocked ? 'text-[var(--color-text-muted)]' : styles.text}
          `}
        >
          {title}
        </h3>

        {/* Subtitle */}
        <p className={`
          text-sm text-center font-mono tracking-wider
          ${isLocked ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-accent-red)]'}
        `}>
          {subtitle}
        </p>

        {/* Description */}
        <p className={`
          text-sm leading-relaxed flex-1
          ${isLocked ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-secondary)]'}
        `}>
          {description}
        </p>

        {/* Content Variant Indicators */}
        {canInteract && (
          <div className="flex justify-center gap-2 mt-auto">
            {contentVariant === 'text-only' && (
              <div className="flex items-center gap-1 text-xs text-[var(--color-primary-gold)]">
                <BookOpen className="w-4 h-4" />
                <span>{textLabelText}</span>
              </div>
            )}
            {contentVariant === 'text-with-audio' && (
              <div className="flex items-center gap-1 text-xs text-[var(--color-primary-gold)]">
                <Play className="w-4 h-4" />
                <span>{audioLabelText}</span>
              </div>
            )}
          </div>
        )}

        {/* EpisodeUnlockedBadge */}
        {state === 'unlocked-unread' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 bg-[var(--color-primary-gold)] text-[var(--color-background-deep-black)] text-xs font-bold px-2 py-1 rounded-full"
          >
            {newBadgeText}
          </motion.div>
        )}

        {/* Glow Effect on Hover */}
        {canInteract && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--transition-normal)] pointer-events-none">
            <div 
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'linear-gradient(to top, var(--color-primary-gold)/5, transparent)'
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
