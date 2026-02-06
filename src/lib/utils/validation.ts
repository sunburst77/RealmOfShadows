/**
 * 이메일 유효성 검증
 * @param email 검증할 이메일 주소
 * @returns 유효 여부
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 닉네임 유효성 검증 (2-50자, 한글/영문/숫자/-/_)
 * @param nickname 검증할 닉네임
 * @returns 유효 여부
 */
export function validateNickname(nickname: string): boolean {
  if (nickname.length < 2 || nickname.length > 50) {
    return false;
  }

  const nicknameRegex = /^[가-힣a-zA-Z0-9_-]+$/;
  return nicknameRegex.test(nickname);
}

/**
 * 전화번호 유효성 검증 (한국 전화번호 형식)
 * @param phone 검증할 전화번호
 * @returns 유효 여부
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return true; // 선택 사항

  // 숫자와 하이픈만 허용
  const phoneRegex = /^[0-9-]+$/;
  if (!phoneRegex.test(phone)) {
    return false;
  }

  // 최소 길이 체크 (010-0000-0000 형식 기준)
  const digitsOnly = phone.replace(/-/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 11;
}

/**
 * 추천 코드 유효성 검증 (8자리 대문자 영숫자)
 * @param code 검증할 추천 코드
 * @returns 유효 여부
 */
export function validateReferralCode(code: string): boolean {
  const codeRegex = /^[A-Z0-9]{8}$/;
  return codeRegex.test(code);
}

/**
 * 이름 유효성 검증 (1-100자)
 * @param name 검증할 이름
 * @returns 유효 여부
 */
export function validateName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 100;
}
