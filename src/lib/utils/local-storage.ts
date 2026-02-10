/**
 * 로컬 스토리지 유틸리티
 * 타입 안전한 로컬 스토리지 접근
 */

// 로컬 스토리지 키 상수
export const STORAGE_KEYS = {
  USER_DATA: 'ros_user_data',
  LANGUAGE: 'ros_language',
  THEME: 'ros_theme',
  AB_TEST_GROUP: 'ros_ab_test_group',
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * 로컬 스토리지에서 값 읽기 (JSON 파싱)
 * @param key 스토리지 키
 * @returns 파싱된 값 또는 null
 */
export function getLocalStorageItem<T = unknown>(key: StorageKey): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to read from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * 로컬 스토리지에 값 저장 (JSON 직렬화)
 * @param key 스토리지 키
 * @param value 저장할 값
 * @returns 성공 여부
 */
export function setLocalStorageItem<T = unknown>(
  key: StorageKey,
  value: T
): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write to localStorage (${key}):`, error);
    // QuotaExceededError 처리
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Consider clearing old data.');
    }
    return false;
  }
}

/**
 * 로컬 스토리지에서 값 삭제
 * @param key 스토리지 키
 */
export function removeLocalStorageItem(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove from localStorage (${key}):`, error);
  }
}

/**
 * 모든 앱 관련 로컬 스토리지 데이터 삭제
 */
export function clearAllLocalStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * 로컬 스토리지가 사용 가능한지 확인
 * @returns 사용 가능 여부
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * 로컬 스토리지 사용량 추정 (바이트)
 * @returns 사용 중인 바이트 수
 */
export function getLocalStorageSize(): number {
  let size = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    }
  } catch (error) {
    console.error('Failed to calculate localStorage size:', error);
  }
  return size;
}

/**
 * 로컬 스토리지 사용량을 읽기 쉬운 형식으로 반환
 * @returns 사용량 문자열 (예: "2.5 KB")
 */
export function getLocalStorageSizeFormatted(): string {
  const size = getLocalStorageSize();
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * 로컬 스토리지 변경 감지 (커스텀 이벤트)
 * @param key 감지할 키
 * @param callback 변경 시 실행할 콜백
 * @returns 이벤트 리스너 제거 함수
 */
export function watchLocalStorageItem(
  key: StorageKey,
  callback: (newValue: unknown) => void
): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === key && e.newValue !== null) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback(parsed);
      } catch (error) {
        console.error('Failed to parse storage event:', error);
      }
    }
  };

  window.addEventListener('storage', handler);
  
  return () => {
    window.removeEventListener('storage', handler);
  };
}
