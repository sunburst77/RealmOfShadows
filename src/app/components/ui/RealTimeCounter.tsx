import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp } from 'lucide-react';
import { realtimeStatsService, animateCountUpdate } from '@/lib/services';
import { getPreRegistrationStats } from '@/lib/supabase';
import type { Language } from '@/lib/supabase/types';

type CounterSize = 'compact' | 'featured';

interface RealTimeCounterProps {
  size?: CounterSize;
  label?: string;
  showTrend?: boolean;
  language?: Language;
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
  size = 'compact',
  label,
  showTrend = false,
  language = 'ko'
}: RealTimeCounterProps) {
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 메모리 누수 방지용 ref
  const isMountedRef = useRef(true);
  const increasingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationCancelRef = useRef<(() => void) | null>(null);
  
  const styles = sizeStyles[size];

  // 기본 레이블 (다국어)
  const defaultLabel = language === 'ko' 
    ? '현재 예약자 수' 
    : language === 'en' 
    ? 'Current Pre-Registrations' 
    : '現在の事前登録者数';

  // 초기 데이터 로드
  useEffect(() => {
    let cancelled = false;

    async function loadInitialCount() {
      try {
        const stats = await getPreRegistrationStats();
        
        // 컴포넌트가 언마운트되었으면 setState 하지 않음
        if (cancelled) return;
        
        const initialCount = stats.totalRegistrations;
        setCount(initialCount);
        setDisplayCount(initialCount);
        setIsLoading(false);
        console.log('✅ 초기 사전등록 카운트:', initialCount);
      } catch (error) {
        console.error('Failed to load initial count:', error);
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadInitialCount();

    // Cleanup: 비동기 작업 취소
    return () => {
      cancelled = true;
    };
  }, []);

  // 실시간 구독 (의존성 배열 수정 - count와 displayCount 제거)
  useEffect(() => {
    const unsubscribe = realtimeStatsService.subscribe({
      onUpdate: (newCount) => {
        if (!isMountedRef.current) return;
        
        console.log('📊 실시간 업데이트:', newCount);
        
        // 증가 감지
        setCount((prevCount) => {
          if (newCount > prevCount) {
            setIsIncreasing(true);
            
            // 기존 timeout 정리
            if (increasingTimeoutRef.current) {
              clearTimeout(increasingTimeoutRef.current);
            }
            
            // 새 timeout 설정
            increasingTimeoutRef.current = setTimeout(() => {
              if (isMountedRef.current) {
                setIsIncreasing(false);
              }
            }, 2000);
          }
          return newCount;
        });

        // 기존 애니메이션 취소
        if (animationCancelRef.current) {
          animationCancelRef.current();
        }

        // 애니메이션과 함께 카운트 업데이트
        setDisplayCount((prevDisplayCount) => {
          const cancelAnimation = animateCountUpdate(
            prevDisplayCount,
            newCount,
            1000, // 1초 애니메이션
            (animatedCount) => {
              if (isMountedRef.current) {
                setDisplayCount(animatedCount);
              }
            }
          );
          
          animationCancelRef.current = cancelAnimation;
          return prevDisplayCount; // 애니메이션이 직접 업데이트하므로 여기선 변경 안 함
        });
      },
      onError: (error) => {
        console.error('Realtime subscription error:', error);
      },
      enableAnimation: true,
    });

    // Cleanup: 구독 해제, timeout 정리, 애니메이션 취소
    return () => {
      unsubscribe();
      
      if (increasingTimeoutRef.current) {
        clearTimeout(increasingTimeoutRef.current);
      }
      
      if (animationCancelRef.current) {
        animationCancelRef.current();
      }
    };
  }, []); // 의존성 배열 비움 - 한 번만 구독

  // 컴포넌트 언마운트 감지
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        inline-flex items-center gap-3
        bg-[var(--color-background-dark)]/80 backdrop-blur-sm
        rounded-lg ${styles.container}
        border-2 border-[var(--color-border-gold)]/30
        transition-all duration-[var(--transition-normal)]
        ${isIncreasing ? 'border-[var(--color-primary-gold)] shadow-[0_0_20px_rgba(212,175,55,0.4)]' : ''}
      `}
    >
      <motion.div
        animate={isIncreasing ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <Users className={`${styles.icon} text-[var(--color-primary-gold)]`} />
      </motion.div>
      
      <div className="flex flex-col">
        <p className={`${styles.label} text-[var(--color-text-secondary)] uppercase tracking-wide`}>
          {label || defaultLabel}
        </p>
        
        <div className="flex items-center gap-2">
          <motion.p
            key={displayCount}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`
              ${styles.number}
              font-bold
              font-mono
              text-[var(--color-primary-gold)]
            `}
          >
            {isLoading ? '...' : displayCount.toLocaleString()}
          </motion.p>

          {/* Trend Indicator */}
          {showTrend && isIncreasing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <TrendingUp className="w-4 h-4 text-green-400" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Live Indicator */}
      <motion.div
        animate={{
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex items-center gap-1"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full" />
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          Live
        </span>
      </motion.div>
    </motion.div>
  );
}
