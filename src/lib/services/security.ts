import DOMPurify from 'dompurify';
import { validateReferralCode } from '@/lib/utils/validation';

/**
 * 사용자 입력을 살균하여 XSS 공격을 방지합니다.
 * @param input 살균할 문자열
 * @returns 살균된 문자열
 */
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

/**
 * URL 파라미터를 안전하게 추출하고 유효성을 검사합니다.
 * @param paramName 추출할 파라미터 이름
 * @param validator 유효성 검사 함수 (선택 사항)
 * @returns 유효한 파라미터 값 또는 null
 */
export function validateUrlParam(
  paramName: string,
  validator?: (value: string) => boolean
): string | null {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(paramName);

  if (!value) {
    return null;
  }

  const sanitizedValue = sanitizeInput(value);

  if (validator && !validator(sanitizedValue)) {
    console.warn(`Invalid URL parameter: ${paramName}=${sanitizedValue}`);
    return null;
  }

  return sanitizedValue;
}

/**
 * URL에서 추천 코드를 안전하게 추출합니다.
 * @returns 유효한 추천 코드 또는 null
 */
export function extractReferralCodeFromURL(): string | null {
  return validateUrlParam('ref', (value) => {
    // 추천 코드 형식 검증 (8자리 대문자 영숫자)
    return validateReferralCode(value.toUpperCase());
  });
}

/**
 * 이메일 주소를 안전하게 살균합니다.
 * @param email 이메일 주소
 * @returns 살균된 이메일 주소
 */
export function sanitizeEmail(email: string): string {
  return sanitizeInput(email.toLowerCase().trim());
}

/**
 * 전화번호를 안전하게 살균합니다 (숫자와 하이픈만 허용).
 * @param phone 전화번호
 * @returns 살균된 전화번호
 */
export function sanitizePhone(phone: string): string {
  return sanitizeInput(phone.replace(/[^0-9-]/g, ''));
}

/**
 * 닉네임을 안전하게 살균합니다.
 * @param nickname 닉네임
 * @returns 살균된 닉네임
 */
export function sanitizeNickname(nickname: string): string {
  return sanitizeInput(nickname.trim());
}
