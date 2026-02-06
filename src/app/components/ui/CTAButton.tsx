import { motion, HTMLMotionProps } from 'motion/react';
import { ReactNode } from 'react';

type ButtonType = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface CTAButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  type?: ButtonType;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
}

const buttonStyles = {
  primary: {
    base: 'bg-gradient-to-r from-[var(--color-primary-gold)] to-[var(--color-primary-gold-light)] text-[var(--color-background-deep-black)] border-2 border-transparent',
    hover: 'hover:from-[var(--color-primary-gold-light)] hover:to-[var(--color-primary-gold)] hover:shadow-[var(--shadow-glow-gold-intense)]',
    active: 'active:from-[var(--color-primary-gold-dark)] active:to-[var(--color-primary-gold)]',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  },
  secondary: {
    base: 'bg-transparent text-[var(--color-primary-gold)] border-2 border-[var(--color-border-gold)]',
    hover: 'hover:bg-[var(--color-primary-gold)]/10 hover:border-[var(--color-primary-gold-light)] hover:shadow-[var(--shadow-glow-gold)]',
    active: 'active:bg-[var(--color-primary-gold)]/20',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  },
  ghost: {
    base: 'bg-transparent text-[var(--color-primary-gold)] border-none',
    hover: 'hover:text-[var(--color-primary-gold-light)]',
    active: 'active:text-[var(--color-primary-gold-dark)]',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
  }
};

const sizeStyles = {
  small: 'h-10 px-4 text-sm',
  medium: 'h-12 px-6 text-base',
  large: 'h-14 px-8 text-lg'
};

export function CTAButton({
  children,
  type: buttonType = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  ...props
}: CTAButtonProps) {
  const styles = buttonStyles[buttonType];
  const sizeClass = sizeStyles[size];

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        ${styles.base}
        ${styles.hover}
        ${styles.active}
        ${styles.disabled}
        ${sizeClass}
        font-semibold rounded-lg
        transition-all duration-[var(--transition-normal)]
        flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {children}
    </motion.button>
  );
}
