import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseLoadingResult {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(
    asyncFn: () => Promise<T>,
    loadingMessage?: string
  ) => Promise<T>;
}

/**
 * 비동기 작업의 로딩 상태를 관리하는 커스텀 훅입니다.
 * @returns 로딩 상태 및 제어 함수
 */
export function useLoading(): UseLoadingResult {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  const withLoading = useCallback(
    async <T,>(
      asyncFn: () => Promise<T>,
      loadingMessage?: string
    ): Promise<T> => {
      startLoading();

      // 로딩 메시지가 있으면 토스트 표시
      let toastId: string | number | undefined;
      if (loadingMessage) {
        toastId = toast.loading(loadingMessage);
      }

      try {
        const result = await asyncFn();
        return result;
      } catch (error) {
        console.error('Error in withLoading:', error);
        throw error;
      } finally {
        stopLoading();

        // 로딩 토스트 닫기
        if (toastId) {
          toast.dismiss(toastId);
        }
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}
