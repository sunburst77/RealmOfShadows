import { subscribeToRegistrationCount } from '@/lib/supabase/queries';

interface SubscribeOptions {
  onUpdate: (count: number) => void;
  onError?: (error: unknown) => void;
  enableAnimation?: boolean;
}

/**
 * 실시간 사전등록 통계 서비스
 */
export const realtimeStatsService = {
  /**
   * 실시간 사전등록 카운트를 구독합니다.
   * @param options 구독 옵션
   * @returns 구독 해제 함수
   */
  subscribe: (options: SubscribeOptions): (() => void) => {
    const { onUpdate, onError, enableAnimation = true } = options;

    return subscribeToRegistrationCount((newCount) => {
      if (enableAnimation) {
        onUpdate(newCount);
      } else {
        onUpdate(newCount);
      }
    });
  },
};

/**
 * 숫자 애니메이션 (부드러운 카운트 업)
 * @param from 시작 값
 * @param to 끝 값
 * @param duration 애니메이션 지속 시간 (ms)
 * @param onUpdate 업데이트 콜백
 * @returns 애니메이션 취소 함수
 */
export function animateCountUpdate(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void
): () => void {
  const startTime = Date.now();
  const diff = to - from;
  let animationFrameId: number | null = null;
  let isCancelled = false;

  const animate = () => {
    if (isCancelled) return;

    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (easeOutQuad)
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const currentValue = Math.round(from + diff * easeProgress);

    onUpdate(currentValue);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  // 취소 함수 반환
  return () => {
    isCancelled = true;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
