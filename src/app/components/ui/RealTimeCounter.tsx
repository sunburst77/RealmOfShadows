import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';

type CounterSize = 'compact' | 'featured';

interface RealTimeCounterProps {
  initialCount?: number;
  size?: CounterSize;
  label?: string;
  showTrend?: boolean;
}

const sizeStyles = {
  compact: {
    container: 'px-4 py-2',
    icon: 'w-4 h-4',
    number: 'text-2xl',
    label: 'text-xs'
  },
  featured: {
    container: 'px-8 py-4',
    icon: 'w-8 h-8',
    number: 'text-[var(--text-counter-number)]',
    label: 'text-sm'
  }
};

export function RealTimeCounter({ 
  initialCount = 47892, 
  size = 'compact',
  label = '현재 예약자 수',
  showTrend = false
}: RealTimeCounterProps) {
  const [count, setCount] = useState(initialCount);
  
  const styles = sizeStyles[size];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const increase = Math.floor(Math.random() * 3);
      if (increase > 0) {
        setCount(prev => prev + increase);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        inline-flex items-center gap-2
        bg-[var(--color-background-dark)]/80 backdrop-blur-sm
        rounded-lg ${styles.container}
        transition-all duration-[var(--transition-normal)]
      `}
    >
      <Users className={`${styles.icon} text-[var(--color-primary-gold)]`} />
      
      <p className={`${styles.label} text-[var(--color-text-secondary)]`}>
        {label}
      </p>
      
      <p
        className={`
          ${styles.number}
          font-bold
          font-mono
          text-[var(--color-primary-gold)]
        `}
      >
        {count.toLocaleString()}
      </p>

    </motion.div>
  );
}
