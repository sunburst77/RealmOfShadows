/**
 * AbortController 유틸리티
 * 네트워크 요청 취소를 위한 헬퍼 함수
 */

/**
 * 여러 AbortController를 그룹으로 관리하는 클래스
 */
export class AbortControllerGroup {
  private controllers: Map<string, AbortController> = new Map();

  /**
   * 새 AbortController를 생성하고 그룹에 추가
   * @param key 컨트롤러 식별자
   * @returns AbortSignal
   */
  create(key: string): AbortSignal {
    // 기존 컨트롤러가 있으면 먼저 취소
    this.abort(key);

    const controller = new AbortController();
    this.controllers.set(key, controller);
    return controller.signal;
  }

  /**
   * 특정 키의 요청 취소
   * @param key 컨트롤러 식별자
   */
  abort(key: string): void {
    const controller = this.controllers.get(key);
    if (controller) {
      controller.abort();
      this.controllers.delete(key);
    }
  }

  /**
   * 모든 요청 취소
   */
  abortAll(): void {
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
  }

  /**
   * 특정 키의 컨트롤러가 존재하는지 확인
   * @param key 컨트롤러 식별자
   * @returns 존재 여부
   */
  has(key: string): boolean {
    return this.controllers.has(key);
  }

  /**
   * 그룹 내 컨트롤러 개수
   */
  get size(): number {
    return this.controllers.size;
  }
}

/**
 * React useEffect에서 사용하기 위한 AbortController 생성
 * @returns AbortController
 */
export function createAbortController(): AbortController {
  return new AbortController();
}

/**
 * 타임아웃 기능이 있는 AbortController 생성
 * @param timeoutMs 타임아웃 시간 (밀리초)
 * @returns AbortController
 */
export function createAbortControllerWithTimeout(
  timeoutMs: number
): AbortController {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort(new Error('Request timeout'));
  }, timeoutMs);

  return controller;
}

/**
 * AbortSignal이 취소되었는지 확인
 * @param signal AbortSignal
 * @returns 취소 여부
 */
export function isAborted(signal: AbortSignal): boolean {
  return signal.aborted;
}
