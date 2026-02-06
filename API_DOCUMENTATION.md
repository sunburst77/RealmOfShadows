# API Documentation

> **Realm of Shadows** - 사전등록 랜딩 페이지 API 문서

---

## 📋 목차

- [개요](#개요)
- [Supabase Client](#supabase-client)
- [Database Functions](#database-functions)
- [TypeScript API](#typescript-api)
- [에러 처리](#에러-처리)

---

## 개요

이 문서는 Realm of Shadows 프로젝트의 모든 API를 설명합니다.

### 기본 정보
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: None (사전등록 전용)
- **Row Level Security**: Enabled

---

## Supabase Client

### 초기화

```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);
```

---

## Database Functions

### `generate_referral_code()`

8자리 고유 추천 코드 생성

**시그니처**:
```sql
CREATE FUNCTION generate_referral_code() RETURNS TEXT
```

**반환값**: 8자리 대문자 영숫자 (예: `A7K9M2X1`)

**사용 예시**:
```typescript
const { data, error } = await supabase.rpc('generate_referral_code');
console.log(data); // 'A7K9M2X1'
```

**특징**:
- 중복 방지 로직 내장
- 최대 10회 재시도

---

### `get_referral_network(user_id UUID)`

사용자의 추천 네트워크 조회 (2단계)

**시그니처**:
```sql
CREATE FUNCTION get_referral_network(target_user_id UUID)
RETURNS TABLE (
  level INTEGER,
  referee_id UUID,
  referee_email TEXT,
  referee_nickname TEXT,
  referee_code TEXT,
  referee_created_at TIMESTAMPTZ
)
```

**파라미터**:
| 이름 | 타입 | 설명 |
|------|------|------|
| `target_user_id` | UUID | 조회할 사용자 ID |

**반환값**: 추천인 목록 (level 1, 2)

**사용 예시**:
```typescript
const { data, error } = await supabase
  .rpc('get_referral_network', { 
    target_user_id: 'user-uuid-here' 
  });

// 데이터 구조:
[
  {
    level: 1,
    referee_id: '...',
    referee_email: 'user1@example.com',
    referee_nickname: 'DarkKnight',
    referee_code: 'A7K9M2X1',
    referee_created_at: '2026-02-06T...'
  },
  // ...
]
```

---

### `calculate_user_tier(user_id UUID)`

사용자의 현재 보상 티어 계산

**시그니처**:
```sql
CREATE FUNCTION calculate_user_tier(target_user_id UUID)
RETURNS TABLE (
  tier_id INTEGER,
  tier_name TEXT,
  required_referrals INTEGER,
  next_tier_id INTEGER,
  remaining_referrals INTEGER
)
```

**파라미터**:
| 이름 | 타입 | 설명 |
|------|------|------|
| `target_user_id` | UUID | 조회할 사용자 ID |

**반환값**: 현재 티어 정보

**사용 예시**:
```typescript
const { data, error } = await supabase
  .rpc('calculate_user_tier', { 
    target_user_id: 'user-uuid-here' 
  });

// 데이터 구조:
{
  tier_id: 2,
  tier_name: 'Silver',
  required_referrals: 5,
  next_tier_id: 3,
  remaining_referrals: 3 // 다음 티어까지 3명
}
```

---

## TypeScript API

### `getPreRegistrationStats()`

사전등록 통계 조회

**위치**: `src/lib/supabase/queries.ts`

**시그니처**:
```typescript
async function getPreRegistrationStats(): Promise<{
  totalRegistrations: number;
  registrationsToday: number;
}>
```

**사용 예시**:
```typescript
import { getPreRegistrationStats } from '@/lib/supabase';

const stats = await getPreRegistrationStats();
console.log(stats.totalRegistrations); // 12345
```

---

### `subscribeToRegistrationCount()`

실시간 사전등록 카운트 구독

**위치**: `src/lib/supabase/queries.ts`

**시그니처**:
```typescript
function subscribeToRegistrationCount(
  callback: (count: number) => void
): () => void
```

**파라미터**:
| 이름 | 타입 | 설명 |
|------|------|------|
| `callback` | `(count: number) => void` | 카운트 업데이트 콜백 |

**반환값**: 구독 해제 함수

**사용 예시**:
```typescript
import { subscribeToRegistrationCount } from '@/lib/supabase';

const unsubscribe = subscribeToRegistrationCount((newCount) => {
  console.log('새 등록:', newCount);
});

// cleanup
unsubscribe();
```

---

### `getReferralNetwork(userId: string)`

사용자의 추천 네트워크 조회 (최적화된 버전)

**위치**: `src/lib/supabase/queries.ts`

**시그니처**:
```typescript
async function getReferralNetwork(
  userId: string
): Promise<ReferralNetworkResponse>

interface ReferralNetworkResponse {
  success: boolean;
  network?: ReferralNode[];
  stats?: {
    directInvites: number;
    indirectInvites: number;
    totalSize: number;
  };
  error?: string;
}
```

**사용 예시**:
```typescript
import { getReferralNetwork } from '@/lib/supabase';

const result = await getReferralNetwork('user-uuid');

if (result.success) {
  console.log('직접 초대:', result.stats.directInvites);
  console.log('간접 초대:', result.stats.indirectInvites);
  console.log('네트워크:', result.network);
}
```

---

### `createPreRegistration(data: PreRegistrationData)`

사전등록 처리

**위치**: `src/lib/supabase/mutations.ts`

**시그니처**:
```typescript
async function createPreRegistration(
  data: PreRegistrationData
): Promise<PreRegistrationResponse>

interface PreRegistrationData {
  name: string;
  email: string;
  nickname: string;
  phone?: string;
  language?: Language;
  referredByCode?: string;
}

interface PreRegistrationResponse {
  success: boolean;
  user?: User;
  referralCode?: string;
  error?: string;
}
```

**사용 예시**:
```typescript
import { createPreRegistration } from '@/lib/supabase';

const result = await createPreRegistration({
  name: '홍길동',
  email: 'hong@example.com',
  nickname: 'DarkKnight',
  phone: '010-1234-5678',
  language: 'ko',
  referredByCode: 'ABC12345'
});

if (result.success) {
  console.log('추천 코드:', result.referralCode);
}
```

---

### `checkUserExists(email: string, nickname: string)`

이메일/닉네임 중복 체크

**위치**: `src/lib/supabase/queries.ts`

**시그니처**:
```typescript
async function checkUserExists(
  email: string,
  nickname: string
): Promise<DuplicateCheckResult>

interface DuplicateCheckResult {
  emailExists: boolean;
  nicknameExists: boolean;
}
```

**사용 예시**:
```typescript
import { checkUserExists } from '@/lib/supabase';

const result = await checkUserExists('hong@example.com', 'DarkKnight');

if (result.emailExists) {
  console.log('이미 등록된 이메일입니다');
}
```

---

## Service Layer API

### `registrationAPI`

사전등록 비즈니스 로직을 캡슐화한 서비스 클래스

**위치**: `src/lib/services/registration-api.ts`

#### `setLanguage(language: Language)`

언어 설정

```typescript
import { registrationAPI } from '@/lib/services';

registrationAPI.setLanguage('ko');
```

#### `validateField(field: string, value: string)`

필드별 유효성 검증

```typescript
const error = registrationAPI.validateField('email', 'test@example.com');
if (error) {
  console.log(error); // '유효한 이메일 주소를 입력해주세요'
}
```

#### `checkEmailAvailability(email: string)`

이메일 사용 가능 여부 확인

```typescript
const isAvailable = await registrationAPI.checkEmailAvailability('test@example.com');
```

#### `checkNicknameAvailability(nickname: string)`

닉네임 사용 가능 여부 확인

```typescript
const isAvailable = await registrationAPI.checkNicknameAvailability('DarkKnight');
```

#### `register(formData: RegistrationFormData)`

사전등록 처리 (통합 API)

```typescript
const result = await registrationAPI.register({
  name: '홍길동',
  email: 'hong@example.com',
  nickname: 'DarkKnight',
  phone: '010-1234-5678',
  agreeToPolicy: true
});

if (result.success) {
  console.log('등록 완료:', result.user);
  console.log('추천 코드:', result.referralCode);
}
```

---

## 에러 처리

### 에러 코드

| 코드 | 의미 | HTTP 상태 |
|------|------|-----------|
| `EMAIL_ALREADY_EXISTS` | 이미 등록된 이메일 | 409 |
| `NICKNAME_ALREADY_EXISTS` | 이미 사용 중인 닉네임 | 409 |
| `INVALID_REFERRAL_CODE` | 유효하지 않은 추천 코드 | 400 |
| `VALIDATION_ERROR` | 입력 검증 실패 | 400 |
| `UNKNOWN_ERROR` | 알 수 없는 에러 | 500 |

### 에러 응답 예시

```typescript
{
  success: false,
  error: {
    code: 'EMAIL_ALREADY_EXISTS',
    message: 'Duplicate email',
    userMessage: '이미 등록된 이메일입니다'
  }
}
```

### 에러 처리 예시

```typescript
try {
  const result = await createPreRegistration(data);
  
  if (!result.success) {
    // 에러 처리
    switch (result.error?.code) {
      case 'EMAIL_ALREADY_EXISTS':
        toast.error('이미 등록된 이메일입니다');
        break;
      case 'NICKNAME_ALREADY_EXISTS':
        toast.error('이미 사용 중인 닉네임입니다');
        break;
      default:
        toast.error('등록에 실패했습니다');
    }
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

---

## 성능 최적화

### 쿼리 최적화

1. **인덱스 활용**
   ```sql
   -- users 테이블
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_users_nickname ON users(nickname);
   CREATE INDEX idx_users_referral_code ON users(referral_code);
   
   -- referrals 테이블
   CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
   CREATE INDEX idx_referrals_referee ON referrals(referee_id);
   ```

2. **캐시 활용**
   ```typescript
   // referral_count_cache 컬럼 사용
   // 매번 COUNT 쿼리 대신 캐시된 값 사용
   ```

3. **JOIN 최적화**
   ```typescript
   // recursive CTE 대신 JOIN 사용 (2.5배 빠름)
   const { data } = await supabase
     .from('referrals')
     .select('*, referee:users!referee_id(*)');
   ```

---

## Rate Limiting

현재 Rate Limiting은 Supabase 기본 설정을 따릅니다:
- **Anon Key**: 60 requests/minute
- **Realtime**: 100 concurrent connections

추가 제한이 필요한 경우 Supabase Dashboard에서 설정 가능합니다.

---

## 테스트

### API 테스트

```typescript
// src/lib/supabase/test-connection.ts
import { testSupabaseConnection } from '@/lib/supabase/test-connection';

await testSupabaseConnection();
```

### 수동 테스트

```bash
# Supabase SQL Editor에서 직접 테스트
SELECT * FROM generate_referral_code();
SELECT * FROM get_referral_network('user-uuid');
```

---

## 추가 리소스

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated**: 2026-02-06
