import { motion } from 'motion/react';
import { Crown, Users } from 'lucide-react';

type NodeState = 'root' | 'direct-invite' | 'second-invite' | 'empty-slot';
type NodeSize = 'small' | 'medium';
type InfoVariant = 'nickname-only' | 'nickname-with-count';

interface TreeNodeCardProps {
  state?: NodeState;
  size?: NodeSize;
  infoVariant?: InfoVariant;
  avatar: string;
  nickname: string;
  childCount?: number;
  delay?: number;
  inviteText?: string;
  peopleCountUnit?: string;
}

const stateStyles = {
  root: {
    container: 'bg-gradient-to-br from-[var(--color-primary-gold)] to-[var(--color-primary-gold-dark)] border-2 border-[var(--color-primary-gold-light)]',
    text: 'text-[var(--color-background-deep-black)]',
    badge: 'bg-[var(--color-background-deep-black)] text-[var(--color-primary-gold)]',
    glow: 'shadow-[0_4px_20px_rgba(212,175,55,0.5)]'
  },
  'direct-invite': {
    container: 'bg-[var(--color-background-panel)] border-2 border-[var(--color-primary-gold)]/60',
    text: 'text-[var(--color-text-primary)]',
    badge: 'bg-[var(--color-primary-gold)]/20 text-[var(--color-primary-gold)]',
    glow: 'shadow-[0_2px_10px_rgba(212,175,55,0.2)]'
  },
  'second-invite': {
    container: 'bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30',
    text: 'text-[var(--color-text-secondary)]',
    badge: 'bg-[var(--color-primary-gold)]/10 text-[var(--color-primary-gold)]/70',
    glow: ''
  },
  'empty-slot': {
    container: 'bg-[var(--color-background-panel)] border-2 border-dashed border-[var(--color-border-default)]',
    text: 'text-[var(--color-text-muted)]',
    badge: 'bg-[var(--color-background-dark)] text-[var(--color-text-muted)]',
    glow: ''
  }
};

const sizeStyles = {
  small: {
    container: 'w-20 h-20 rounded-2xl p-3',
    avatar: 'text-2xl',
    nickname: 'text-xs mt-2',
    count: 'text-[10px]',
    badge: 'w-5 h-5 text-[10px]'
  },
  medium: {
    container: 'min-w-[120px] rounded-xl p-4',
    avatar: 'text-3xl',
    nickname: 'text-sm mt-2',
    count: 'text-xs',
    badge: 'min-w-[24px] h-6 px-2 text-xs'
  }
};

export function TreeNodeCard({
  state = 'direct-invite',
  size = 'medium',
  infoVariant = 'nickname-only',
  avatar,
  nickname,
  childCount = 0,
  delay = 0,
  inviteText = '초대하기',
  peopleCountUnit = '명'
}: TreeNodeCardProps) {
  const styles = stateStyles[state];
  const sizeClass = sizeStyles[size];
  const isRoot = state === 'root';
  const isEmpty = state === 'empty-slot';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 200 }}
      viewport={{ once: true }}
      whileHover={!isEmpty ? { scale: 1.05, y: -4 } : {}}
      className="flex flex-col items-center"
    >
      {/* Node Container */}
      <div
        className={`
          ${sizeClass.container}
          ${styles.container}
          ${styles.glow}
          flex flex-col items-center justify-center
          transition-all duration-300
          relative
          backdrop-blur-sm
        `}
      >
        {/* Crown for root - Inside card */}
        {isRoot && (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8"
          >
            <Crown className="w-8 h-8 text-[var(--color-primary-gold)]" style={{ filter: 'drop-shadow(0 2px 4px rgba(212,175,55,0.5))' }} />
          </motion.div>
        )}

        {isEmpty ? (
          <div className="text-center py-2">
            <div className="w-8 h-8 border-2 border-dashed border-[var(--color-border-default)] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-xl">+</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">{inviteText}</p>
          </div>
        ) : (
          <>
            {/* Avatar */}
            <div className="relative">
              <span className={`${sizeClass.avatar} block mb-1`}>{avatar}</span>
              
              {/* Badge for child count */}
              {infoVariant === 'nickname-with-count' && childCount > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.3, type: "spring", stiffness: 300 }}
                  className={`
                    absolute -top-1 -right-1
                    ${sizeClass.badge}
                    ${styles.badge}
                    rounded-full
                    flex items-center justify-center
                    font-bold
                    shadow-md
                  `}
                >
                  {childCount}
                </motion.div>
              )}
            </div>
            
            {/* Nickname */}
            <p 
              className={`
                ${sizeClass.nickname}
                ${styles.text}
                font-semibold text-center max-w-[120px] truncate
              `}
            >
              {nickname}
            </p>

            {/* Count info with icon */}
            {infoVariant === 'nickname-with-count' && childCount > 0 && (
              <div className={`flex items-center gap-1 mt-1 ${styles.text} opacity-70`}>
                <Users className="w-3 h-3" />
                <span className={sizeClass.count}>{childCount}{peopleCountUnit}</span>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
