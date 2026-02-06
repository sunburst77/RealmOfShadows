/**
 * 통합 에러 핸들링 서비스
 * 일관된 에러 메시지와 로깅
 */

export enum ErrorCode {
  // 유효성 검사 에러
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_NICKNAME = 'INVALID_NICKNAME',
  INVALID_PHONE = 'INVALID_PHONE',
  INVALID_REFERRAL_CODE = 'INVALID_REFERRAL_CODE',

  // 중복 에러
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  NICKNAME_ALREADY_EXISTS = 'NICKNAME_ALREADY_EXISTS',

  // 데이터베이스 에러
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',

  // 비즈니스 로직 에러
  REFERRAL_CODE_NOT_FOUND = 'REFERRAL_CODE_NOT_FOUND',
  REGISTRATION_FAILED = 'REGISTRATION_FAILED',

  // 보안 에러
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT = 'INVALID_INPUT',

  // 알 수 없는 에러
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string;
  originalError?: unknown;
}

/**
 * 에러 메시지 매핑 (다국어 지원)
 */
const errorMessages: Record<ErrorCode, Record<string, string>> = {
  [ErrorCode.INVALID_EMAIL]: {
    ko: '올바른 이메일 주소를 입력해주세요.',
    en: 'Please enter a valid email address.',
    ja: '有効なメールアドレスを入力してください。',
  },
  [ErrorCode.INVALID_NICKNAME]: {
    ko: '닉네임은 2-50자의 한글, 영문, 숫자만 사용할 수 있습니다.',
    en: 'Nickname must be 2-50 characters (Korean, English, numbers only).',
    ja: 'ニックネームは2-50文字（韓国語、英語、数字のみ）である必要があります。',
  },
  [ErrorCode.INVALID_PHONE]: {
    ko: '올바른 전화번호 형식을 입력해주세요.',
    en: 'Please enter a valid phone number.',
    ja: '有効な電話番号を入力してください。',
  },
  [ErrorCode.INVALID_REFERRAL_CODE]: {
    ko: '유효하지 않은 추천 코드입니다.',
    en: 'Invalid referral code.',
    ja: '無効な紹介コードです。',
  },
  [ErrorCode.EMAIL_ALREADY_EXISTS]: {
    ko: '이미 등록된 이메일입니다.',
    en: 'This email is already registered.',
    ja: 'このメールアドレスは既に登録されています。',
  },
  [ErrorCode.NICKNAME_ALREADY_EXISTS]: {
    ko: '이미 사용 중인 닉네임입니다.',
    en: 'This nickname is already taken.',
    ja: 'このニックネームは既に使用されています。',
  },
  [ErrorCode.DATABASE_ERROR]: {
    ko: '데이터베이스 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    en: 'A database error occurred. Please try again later.',
    ja: 'データベースエラーが発生しました。後でもう一度お試しください。',
  },
  [ErrorCode.CONNECTION_ERROR]: {
    ko: '네트워크 연결을 확인해주세요.',
    en: 'Please check your network connection.',
    ja: 'ネットワーク接続を確認してください。',
  },
  [ErrorCode.REFERRAL_CODE_NOT_FOUND]: {
    ko: '존재하지 않는 추천 코드입니다.',
    en: 'Referral code not found.',
    ja: '紹介コードが見つかりません。',
  },
  [ErrorCode.REGISTRATION_FAILED]: {
    ko: '사전등록에 실패했습니다. 다시 시도해주세요.',
    en: 'Pre-registration failed. Please try again.',
    ja: '事前登録に失敗しました。もう一度お試しください。',
  },
  [ErrorCode.RATE_LIMIT_EXCEEDED]: {
    ko: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.',
    en: 'Too many requests. Please try again later.',
    ja: 'リクエストが多すぎます。後でもう一度お試しください。',
  },
  [ErrorCode.INVALID_INPUT]: {
    ko: '입력값이 올바르지 않습니다.',
    en: 'Invalid input.',
    ja: '入力が無効です。',
  },
  [ErrorCode.UNKNOWN_ERROR]: {
    ko: '알 수 없는 오류가 발생했습니다.',
    en: 'An unknown error occurred.',
    ja: '不明なエラーが発生しました。',
  },
};

/**
 * AppError 생성
 */
export function createError(
  code: ErrorCode,
  language: 'ko' | 'en' | 'ja' = 'ko',
  originalError?: unknown
): AppError {
  return {
    code,
    message: errorMessages[code].ko, // 로깅용은 항상 한국어
    userMessage: errorMessages[code][language] || errorMessages[code].ko,
    originalError,
  };
}

/**
 * 에러 로깅
 */
export function logError(error: AppError): void {
  console.error(`[${error.code}] ${error.message}`, {
    userMessage: error.userMessage,
    originalError: error.originalError,
    timestamp: new Date().toISOString(),
  });

  // 프로덕션 환경에서는 에러 추적 서비스로 전송
  // 예: Sentry, LogRocket 등
  if (import.meta.env.PROD) {
    // sendToErrorTrackingService(error);
  }
}

/**
 * Supabase 에러 코드 매핑
 */
export function mapSupabaseError(error: any): ErrorCode {
  if (!error) return ErrorCode.UNKNOWN_ERROR;

  // PostgreSQL 에러 코드
  if (error.code === '23505') {
    // Unique constraint violation
    if (error.message?.includes('email')) {
      return ErrorCode.EMAIL_ALREADY_EXISTS;
    }
    if (error.message?.includes('nickname')) {
      return ErrorCode.NICKNAME_ALREADY_EXISTS;
    }
  }

  if (error.code === '23503') {
    // Foreign key violation
    return ErrorCode.REFERRAL_CODE_NOT_FOUND;
  }

  // 네트워크 에러
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return ErrorCode.CONNECTION_ERROR;
  }

  // 기본 데이터베이스 에러
  return ErrorCode.DATABASE_ERROR;
}

/**
 * 에러 핸들러 래퍼
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  language: 'ko' | 'en' | 'ja' = 'ko'
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    const errorCode = mapSupabaseError(err);
    const error = createError(errorCode, language, err);
    logError(error);
    return { data: null, error };
  }
}
