/**
 * 통합 폼 검증 서비스
 * 클라이언트 측 유효성 검사 + 보안 검증
 */

import {
  validateEmail,
  validateNickname,
  validatePhone,
  validateReferralCode,
  validateName,
} from '@/lib/utils/validation';
import {
  sanitizeEmail,
  sanitizeNickname,
  sanitizePhone,
  validateSafeInput,
} from './security';
import { ErrorCode, createError, type AppError } from './error-handler';

export interface FormValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
  sanitizedData?: {
    name: string;
    email: string;
    nickname: string;
    phone?: string;
  };
}

/**
 * 사전등록 폼 검증
 */
export function validatePreRegistrationForm(
  data: {
    name: string;
    email: string;
    nickname: string;
    phone?: string;
    referralCode?: string;
  },
  language: 'ko' | 'en' | 'ja' = 'ko'
): FormValidationResult {
  const errors: Partial<Record<string, string>> = {};

  // 1. 이름 검증
  if (!data.name || !data.name.trim()) {
    const error = createError(ErrorCode.INVALID_INPUT, language);
    errors.name = '이름을 입력해주세요.';
  } else if (!validateName(data.name)) {
    errors.name = '이름은 1-100자 이내로 입력해주세요.';
  } else {
    try {
      validateSafeInput(data.name, '이름');
    } catch (err) {
      errors.name =
        err instanceof Error ? err.message : '이름에 유효하지 않은 문자가 있습니다.';
    }
  }

  // 2. 이메일 검증
  if (!data.email || !data.email.trim()) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!validateEmail(data.email)) {
    const error = createError(ErrorCode.INVALID_EMAIL, language);
    errors.email = error.userMessage;
  } else {
    try {
      validateSafeInput(data.email, '이메일');
    } catch (err) {
      errors.email =
        err instanceof Error
          ? err.message
          : '이메일에 유효하지 않은 문자가 있습니다.';
    }
  }

  // 3. 닉네임 검증
  if (!data.nickname || !data.nickname.trim()) {
    errors.nickname = '닉네임을 입력해주세요.';
  } else if (!validateNickname(data.nickname)) {
    const error = createError(ErrorCode.INVALID_NICKNAME, language);
    errors.nickname = error.userMessage;
  } else {
    try {
      validateSafeInput(data.nickname, '닉네임');
    } catch (err) {
      errors.nickname =
        err instanceof Error
          ? err.message
          : '닉네임에 유효하지 않은 문자가 있습니다.';
    }
  }

  // 4. 전화번호 검증 (선택사항)
  if (data.phone && data.phone.trim()) {
    if (!validatePhone(data.phone)) {
      const error = createError(ErrorCode.INVALID_PHONE, language);
      errors.phone = error.userMessage;
    } else {
      try {
        validateSafeInput(data.phone, '전화번호');
      } catch (err) {
        errors.phone =
          err instanceof Error
            ? err.message
            : '전화번호에 유효하지 않은 문자가 있습니다.';
      }
    }
  }

  // 5. 추천 코드 검증 (선택사항)
  if (data.referralCode && data.referralCode.trim()) {
    if (!validateReferralCode(data.referralCode.toUpperCase())) {
      const error = createError(ErrorCode.INVALID_REFERRAL_CODE, language);
      errors.referralCode = error.userMessage;
    }
  }

  const isValid = Object.keys(errors).length === 0;

  // 검증 통과 시 정제된 데이터 반환
  const sanitizedData = isValid
    ? {
        name: data.name.trim(),
        email: sanitizeEmail(data.email),
        nickname: sanitizeNickname(data.nickname),
        phone: data.phone ? sanitizePhone(data.phone) : undefined,
      }
    : undefined;

  return {
    isValid,
    errors,
    sanitizedData,
  };
}

/**
 * 실시간 필드 검증 (입력 중)
 */
export function validateField(
  fieldName: string,
  value: string,
  language: 'ko' | 'en' | 'ja' = 'ko'
): string | null {
  switch (fieldName) {
    case 'email':
      if (value && !validateEmail(value)) {
        const error = createError(ErrorCode.INVALID_EMAIL, language);
        return error.userMessage;
      }
      break;

    case 'nickname':
      if (value && !validateNickname(value)) {
        const error = createError(ErrorCode.INVALID_NICKNAME, language);
        return error.userMessage;
      }
      break;

    case 'phone':
      if (value && !validatePhone(value)) {
        const error = createError(ErrorCode.INVALID_PHONE, language);
        return error.userMessage;
      }
      break;

    case 'referralCode':
      if (value && !validateReferralCode(value.toUpperCase())) {
        const error = createError(ErrorCode.INVALID_REFERRAL_CODE, language);
        return error.userMessage;
      }
      break;
  }

  return null;
}

/**
 * 폼 데이터 정제
 */
export function sanitizeFormData(data: {
  name: string;
  email: string;
  nickname: string;
  phone?: string;
}): {
  name: string;
  email: string;
  nickname: string;
  phone?: string;
} {
  return {
    name: data.name.trim(),
    email: sanitizeEmail(data.email),
    nickname: sanitizeNickname(data.nickname),
    phone: data.phone ? sanitizePhone(data.phone) : undefined,
  };
}
