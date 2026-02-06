import { createPreRegistration } from '@/lib/supabase/mutations';
import { checkUserExists } from '@/lib/supabase/queries';
import type { Language } from '@/lib/supabase/types';
import {
  validateEmail,
  validateNickname,
  validatePhone,
} from '@/lib/utils/validation';
import {
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  sanitizeNickname,
  extractReferralCodeFromURL,
} from './security';
import { 
  setLocalStorageItem, 
  STORAGE_KEYS 
} from '@/lib/utils/local-storage';

interface RegistrationFormData {
  name: string;
  email: string;
  nickname: string;
  phone: string;
  agreeToPolicy: boolean;
}

interface RegistrationResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    nickname: string;
  };
  referralCode?: string;
  error?: {
    code: string;
    message: string;
    userMessage: string;
  };
}

class RegistrationAPI {
  private currentLanguage: Language = 'ko';

  /**
   * 현재 언어를 설정합니다.
   */
  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  /**
   * 필드별 유효성 검증
   */
  validateField(field: string, value: string): string | null {
    switch (field) {
      case 'email':
        if (!validateEmail(value)) {
          return this.getErrorMessage('INVALID_EMAIL');
        }
        break;
      case 'nickname':
        if (!validateNickname(value)) {
          return this.getErrorMessage('INVALID_NICKNAME');
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          return this.getErrorMessage('INVALID_PHONE');
        }
        break;
      default:
        break;
    }
    return null;
  }

  /**
   * 이메일 중복 체크
   */
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const result = await checkUserExists(email, '');
      return !result.emailExists;
    } catch (error) {
      console.error('Failed to check email availability:', error);
      return true; // 에러 시 일단 통과
    }
  }

  /**
   * 닉네임 중복 체크
   */
  async checkNicknameAvailability(nickname: string): Promise<boolean> {
    try {
      const result = await checkUserExists('', nickname);
      return !result.nicknameExists;
    } catch (error) {
      console.error('Failed to check nickname availability:', error);
      return true; // 에러 시 일단 통과
    }
  }

  /**
   * 사전등록 처리
   */
  async register(formData: RegistrationFormData): Promise<RegistrationResult> {
    try {
      // 1. 클라이언트 측 검증
      const validationError = this.validateFormData(formData);
      if (validationError) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: validationError,
            userMessage: validationError,
          },
        };
      }

      // 2. 입력 살균
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeEmail(formData.email),
        nickname: sanitizeNickname(formData.nickname),
        phone: sanitizePhone(formData.phone),
        language: this.currentLanguage,
        referredByCode: extractReferralCodeFromURL() || undefined,
      };

      // 3. Supabase 등록 처리
      const result = await createPreRegistration(sanitizedData);

      if (!result.success) {
        return {
          success: false,
          error: {
            code: this.parseErrorCode(result.error || ''),
            message: result.error || '',
            userMessage: this.getErrorMessage(
              this.parseErrorCode(result.error || '')
            ),
          },
        };
      }

      // 4. 로컬 스토리지에 사용자 정보 저장 (추천 시스템용)
      if (result.user && result.referralCode) {
        const userData = {
          userId: result.user.id,
          referralCode: result.referralCode,
          nickname: result.user.nickname,
          email: result.user.email,
        };

        const saved = setLocalStorageItem(STORAGE_KEYS.USER_DATA, userData);
        
        if (!saved) {
          console.warn('Failed to save user data to localStorage');
        }
      }

      return {
        success: true,
        user: result.user,
        referralCode: result.referralCode,
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          userMessage: this.getErrorMessage('UNKNOWN_ERROR'),
        },
      };
    }
  }

  /**
   * 폼 데이터 전체 검증
   */
  private validateFormData(formData: RegistrationFormData): string | null {
    if (!formData.name.trim()) {
      return this.getErrorMessage('REQUIRED_NAME');
    }

    if (!formData.email.trim()) {
      return this.getErrorMessage('REQUIRED_EMAIL');
    }

    if (!validateEmail(formData.email)) {
      return this.getErrorMessage('INVALID_EMAIL');
    }

    if (!formData.nickname.trim()) {
      return this.getErrorMessage('REQUIRED_NICKNAME');
    }

    if (!validateNickname(formData.nickname)) {
      return this.getErrorMessage('INVALID_NICKNAME');
    }

    if (!formData.phone.trim()) {
      return this.getErrorMessage('REQUIRED_PHONE');
    }

    if (!validatePhone(formData.phone)) {
      return this.getErrorMessage('INVALID_PHONE');
    }

    if (!formData.agreeToPolicy) {
      return this.getErrorMessage('REQUIRED_POLICY_AGREEMENT');
    }

    return null;
  }

  /**
   * 에러 메시지 파싱
   */
  private parseErrorCode(errorMessage: string): string {
    if (errorMessage.includes('이미 등록된 이메일')) {
      return 'EMAIL_ALREADY_EXISTS';
    }
    if (errorMessage.includes('이미 사용 중인 닉네임')) {
      return 'NICKNAME_ALREADY_EXISTS';
    }
    if (errorMessage.includes('유효하지 않은 추천 코드')) {
      return 'INVALID_REFERRAL_CODE';
    }
    return 'UNKNOWN_ERROR';
  }

  /**
   * 다국어 에러 메시지 반환
   */
  private getErrorMessage(code: string): string {
    const messages: Record<string, Record<Language, string>> = {
      REQUIRED_NAME: {
        ko: '이름을 입력해주세요',
        en: 'Please enter your name',
        ja: '名前を入力してください',
      },
      REQUIRED_EMAIL: {
        ko: '이메일을 입력해주세요',
        en: 'Please enter your email',
        ja: 'メールアドレスを入力してください',
      },
      INVALID_EMAIL: {
        ko: '유효한 이메일 주소를 입력해주세요',
        en: 'Please enter a valid email address',
        ja: '有効なメールアドレスを入力してください',
      },
      REQUIRED_NICKNAME: {
        ko: '닉네임을 입력해주세요',
        en: 'Please enter a nickname',
        ja: 'ニックネームを入力してください',
      },
      INVALID_NICKNAME: {
        ko: '닉네임은 2자 이상 50자 이하의 한글, 영문, 숫자, -, _만 가능합니다',
        en: 'Nickname must be 2-50 characters (letters, numbers, -, _)',
        ja: 'ニックネームは2文字以上50文字以下の文字、数字、-、_のみ使用可能です',
      },
      REQUIRED_PHONE: {
        ko: '전화번호를 입력해주세요',
        en: 'Please enter your phone number',
        ja: '電話番号を入力してください',
      },
      INVALID_PHONE: {
        ko: '올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)',
        en: 'Please enter a valid phone number format',
        ja: '正しい電話番号形式を入力してください',
      },
      REQUIRED_POLICY_AGREEMENT: {
        ko: '개인정보 처리방침 및 이용약관에 동의해주세요',
        en: 'Please agree to the privacy policy and terms',
        ja: 'プライバシーポリシーと利用規約に同意してください',
      },
      EMAIL_ALREADY_EXISTS: {
        ko: '이미 등록된 이메일입니다',
        en: 'Email is already registered',
        ja: 'このメールアドレスは既に登録されています',
      },
      NICKNAME_ALREADY_EXISTS: {
        ko: '이미 사용 중인 닉네임입니다',
        en: 'Nickname is already in use',
        ja: 'このニックネームは既に使用されています',
      },
      INVALID_REFERRAL_CODE: {
        ko: '유효하지 않은 추천 코드입니다',
        en: 'Invalid referral code',
        ja: '無効な紹介コードです',
      },
      UNKNOWN_ERROR: {
        ko: '등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
        en: 'An error occurred during registration. Please try again later',
        ja: '登録中にエラーが発生しました。後でもう一度お試しください',
      },
    };

    return messages[code]?.[this.currentLanguage] || messages.UNKNOWN_ERROR[this.currentLanguage];
  }
}

// Singleton instance
export const registrationAPI = new RegistrationAPI();
