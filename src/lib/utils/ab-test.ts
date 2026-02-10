/**
 * A/B 테스트 유틸리티
 * 사용자를 Control/Variant 그룹으로 분할하고 일관성 있게 관리
 */

import { 
  getLocalStorageItem, 
  setLocalStorageItem, 
  STORAGE_KEYS 
} from './local-storage';

export type ABTestGroup = 'control' | 'variant';

export interface ABTestAssignment {
  testName: string;
  group: ABTestGroup;
  assignedAt: string;
}

/**
 * 간단한 해시 함수 (문자열을 숫자로 변환)
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  return Math.abs(hash);
}

/**
 * 사용자 ID 생성 (또는 기존 ID 가져오기)
 * localStorage에 저장된 사용자 ID가 있으면 사용, 없으면 새로 생성
 */
function getOrCreateUserId(): string {
  const stored = getLocalStorageItem<{ userId?: string }>(STORAGE_KEYS.USER_DATA);
  
  if (stored?.userId) {
    return stored.userId;
  }
  
  // 새 사용자 ID 생성 (타임스탬프 + 랜덤)
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  
  // 저장
  const userData = { ...stored, userId };
  setLocalStorageItem(STORAGE_KEYS.USER_DATA, userData);
  
  return userId;
}

/**
 * A/B 테스트 그룹 할당
 * @param testName 테스트 이름
 * @param variantPercentage Variant 그룹 비율 (0-100, 기본값: 10)
 * @returns 할당된 그룹 ('control' 또는 'variant')
 */
export function getABTestGroup(
  testName: string,
  variantPercentage: number = 10
): ABTestGroup {
  // 기존 할당 확인
  const stored = getLocalStorageItem<Record<string, ABTestAssignment>>(
    STORAGE_KEYS.AB_TEST_GROUP
  );
  
  if (stored?.[testName]) {
    return stored[testName].group;
  }
  
  // 새 할당 생성
  const userId = getOrCreateUserId();
  const hash = simpleHash(`${testName}_${userId}`);
  const percentage = hash % 100;
  
  const group: ABTestGroup = percentage < variantPercentage ? 'variant' : 'control';
  
  // 저장
  const assignments = stored || {};
  assignments[testName] = {
    testName,
    group,
    assignedAt: new Date().toISOString(),
  };
  
  setLocalStorageItem(STORAGE_KEYS.AB_TEST_GROUP, assignments);
  
  return group;
}

/**
 * 특정 테스트의 그룹 확인 (할당 없으면 할당 수행)
 * @param testName 테스트 이름
 * @returns 할당된 그룹
 */
export function useABTest(testName: string): ABTestGroup {
  return getABTestGroup(testName);
}

/**
 * A/B 테스트 그룹 정보 가져오기
 * @param testName 테스트 이름
 * @returns 할당 정보 또는 null
 */
export function getABTestAssignment(testName: string): ABTestAssignment | null {
  const stored = getLocalStorageItem<Record<string, ABTestAssignment>>(
    STORAGE_KEYS.AB_TEST_GROUP
  );
  
  return stored?.[testName] || null;
}

/**
 * 모든 A/B 테스트 할당 정보 가져오기
 * @returns 모든 테스트 할당 정보
 */
export function getAllABTestAssignments(): Record<string, ABTestAssignment> {
  const stored = getLocalStorageItem<Record<string, ABTestAssignment>>(
    STORAGE_KEYS.AB_TEST_GROUP
  );
  
  return stored || {};
}
