# 인증 및 권한 관리 점검 보고서

**작성일**: 2026-02-06  
**프로젝트**: Realm of Shadows - Pre-registration Landing Page  
**상태**: ✅ 완료

---

## 📋 목차

1. [개요](#개요)
2. [구현된 기능](#구현된-기능)
3. [보안 강화 사항](#보안-강화-사항)
4. [아키텍처](#아키텍처)
5. [API 문서](#api-문서)
6. [사용 예시](#사용-예시)
7. [테스트 체크리스트](#테스트-체크리스트)
8. [향후 개선 사항](#향후-개선-사항)

---

## 개요

Realm of Shadows 프로젝트에 **Supabase Auth 기반 인증 시스템**을 구축했습니다. 이 시스템은 **매직 링크 로그인**, **세션 관리**, **Rate Limiting**, **에러 처리** 등을 포함하며, React Hook을 통해 쉽게 통합할 수 있습니다.

### 주요 특징

- ✅ **타입 안정성**: TypeScript로 모든 타입 정의
- ✅ **보안 강화**: Rate Limiting, XSS 방지, 에러 메시지 한글화
- ✅ **성능 최적화**: 세션 캐싱 (5분), 메모리 누수 방지
- ✅ **사용자 경험**: 명확한 에러 메시지, 로딩 상태 관리
- ✅ **확장 가능**: 모듈화된 구조, 쉬운 커스터마이징

---

## 구현된 기능

### 1. 인증 모듈 (`src/lib/supabase/auth.ts`)

#### 1.1 매직 링크 로그인

```typescript
// 기본 매직 링크 로그인
signInWithMagicLink(email: string): Promise<MagicLinkResponse>

// Rate Limiting 적용된 안전한 로그인
signInWithMagicLinkSecure(email: string): Promise<MagicLinkResponse>
```

**특징**:
- 이메일 유효성 검사 (정규식)
- 사전등록된 사용자만 로그인 가능 (`shouldCreateUser: false`)
- 이메일 정규화 (소문자 변환, 공백 제거)
- 에러 메시지 한글화

#### 1.2 세션 관리

```typescript
// 세션 가져오기 (캐싱 포함)
getSession(forceRefresh?: boolean): Promise<Session | null>

// 현재 사용자 정보
getCurrentUser(): Promise<User | null>

// 인증 여부 확인
isAuthenticated(): Promise<boolean>

// 토큰 갱신
refreshSession(): Promise<Session | null>
```

**특징**:
- **세션 캐싱**: 5분간 캐시 유지 → API 호출 최소화
- **강제 새로고침**: `forceRefresh` 옵션으로 캐시 무시
- **에러 처리**: 실패 시 캐시 초기화 및 null 반환

#### 1.3 로그아웃

```typescript
signOut(): Promise<void>
```

**특징**:
- 세션 캐시 초기화
- Supabase Auth 로그아웃
- 선택적 로컬 스토리지 정리

#### 1.4 인증 상태 구독

```typescript
// 전체 인증 상태 구독
onAuthStateChange(callback: AuthStateCallback): Subscription

// 사용자 ID만 구독 (간단한 버전)
onUserIdChange(callback: (userId: string | null) => void): () => void
```

**특징**:
- 실시간 인증 상태 변경 감지
- 캐시 자동 업데이트
- 이벤트 로깅 (`SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED` 등)

---

### 2. Rate Limiting 및 보안

#### 2.1 Rate Limiting

```typescript
// 내부 함수 (자동 적용)
checkRateLimit(email: string): void
recordLoginAttempt(email: string, success: boolean): void
```

**설정**:
- **최대 시도 횟수**: 5회
- **잠금 기간**: 15분
- **저장소**: 메모리 기반 (`Map`)

**동작 방식**:
1. 이메일당 로그인 시도 횟수 추적
2. 5회 실패 시 15분간 로그인 차단
3. 성공 시 카운터 초기화
4. 잠금 기간 경과 시 자동 초기화

#### 2.2 커스텀 에러 클래스

```typescript
class AuthError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  )
}
```

**에러 코드**:
- `invalid_credentials`: 이메일 또는 비밀번호 오류
- `user_not_found`: 등록되지 않은 사용자
- `otp_expired`: 인증 링크 만료
- `rate_limit_exceeded`: Rate limit 초과
- `invalid_email`: 유효하지 않은 이메일
- `over_email_send_rate_limit`: 이메일 전송 한도 초과

#### 2.3 에러 메시지 한글화

```typescript
function getErrorMessage(error: SupabaseAuthError | any): string
```

모든 Supabase 에러를 사용자 친화적인 한글 메시지로 변환합니다.

---

### 3. React Hook (`src/lib/hooks/use-auth.ts`)

#### 3.1 `useAuth` - 전체 인증 관리

```typescript
function useAuth(): UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}
```

**특징**:
- 초기 세션 자동 로드
- 인증 상태 실시간 구독
- 메모리 누수 방지 (`isMountedRef`)
- 사용자 등록 여부 자동 확인
- 로딩 상태 및 에러 관리

#### 3.2 `useRequireAuth` - 간단한 인증 확인

```typescript
function useRequireAuth(): {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}
```

인증 필요 여부만 확인하는 경량 Hook입니다.

#### 3.3 `useCurrentUser` - 사용자 정보만 필요한 경우

```typescript
function useCurrentUser(): {
  user: User | null;
  loading: boolean;
}
```

---

## 보안 강화 사항

### 1. Rate Limiting

- ✅ 이메일당 5회 시도 제한
- ✅ 15분 잠금 기간
- ✅ 메모리 기반 저장소 (서버 재시작 시 초기화)

### 2. 입력 검증

- ✅ 이메일 정규식 검증
- ✅ 이메일 정규화 (소문자, 공백 제거)
- ✅ 사전등록 사용자만 로그인 가능

### 3. 세션 관리

- ✅ 5분 캐싱으로 불필요한 API 호출 방지
- ✅ 토큰 자동 갱신 (Supabase 기본 기능)
- ✅ 로그아웃 시 캐시 초기화

### 4. 에러 처리

- ✅ 모든 에러 한글화
- ✅ 명확한 에러 코드 제공
- ✅ HTTP 상태 코드 포함

### 5. 메모리 누수 방지

- ✅ `isMountedRef`로 언마운트된 컴포넌트 상태 업데이트 방지
- ✅ `useEffect` cleanup 함수로 구독 해제
- ✅ 비동기 작업 취소 처리

---

## 아키텍처

### 디렉토리 구조

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Supabase 클라이언트 설정
│   │   ├── auth.ts            # 인증 모듈 (새로 추가)
│   │   ├── types.ts           # 타입 정의
│   │   ├── queries.ts         # 조회 함수
│   │   ├── mutations.ts       # 수정 함수
│   │   └── index.ts           # Export 통합
│   │
│   └── hooks/
│       ├── use-auth.ts        # 인증 Hook (새로 추가)
│       ├── use-loading.ts     # 로딩 Hook
│       └── index.ts           # Export 통합
```

### 데이터 흐름

```
┌─────────────────┐
│  React Component │
│   (useAuth)      │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  use-auth.ts    │
│  (Hook Layer)   │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  auth.ts        │
│  (Service Layer)│
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  Supabase Auth  │
│  (Backend)      │
└─────────────────┘
```

---

## API 문서

### 인증 함수

#### `signInWithMagicLinkSecure(email: string)`

**설명**: Rate Limiting이 적용된 매직 링크 로그인

**매개변수**:
- `email` (string): 로그인할 이메일 주소

**반환값**: `Promise<MagicLinkResponse>`
```typescript
{
  user: User | null;
  session: Session | null;
}
```

**에러**:
- `AuthError`: 로그인 실패 또는 Rate limit 초과

**예시**:
```typescript
try {
  const result = await signInWithMagicLinkSecure('user@example.com');
  console.log('매직 링크 전송 완료');
} catch (error) {
  if (error instanceof AuthError) {
    console.error(error.message);
  }
}
```

---

#### `signOut()`

**설명**: 로그아웃 및 세션 초기화

**반환값**: `Promise<void>`

**에러**:
- `AuthError`: 로그아웃 실패

**예시**:
```typescript
try {
  await signOut();
  console.log('로그아웃 완료');
} catch (error) {
  console.error('로그아웃 실패:', error);
}
```

---

#### `getSession(forceRefresh?: boolean)`

**설명**: 현재 세션 가져오기 (캐싱 포함)

**매개변수**:
- `forceRefresh` (boolean, optional): 캐시 무시 여부 (기본값: `false`)

**반환값**: `Promise<Session | null>`

**예시**:
```typescript
// 캐시된 세션 사용
const session = await getSession();

// 강제 새로고침
const freshSession = await getSession(true);
```

---

#### `isAuthenticated()`

**설명**: 인증된 사용자인지 확인

**반환값**: `Promise<boolean>`

**예시**:
```typescript
const authenticated = await isAuthenticated();
if (authenticated) {
  console.log('로그인됨');
}
```

---

#### `onAuthStateChange(callback: AuthStateCallback)`

**설명**: 인증 상태 변경 구독

**매개변수**:
- `callback` (AuthStateCallback): 상태 변경 시 실행할 콜백

**반환값**: `Subscription` (구독 객체)

**예시**:
```typescript
const subscription = onAuthStateChange((event, session, user) => {
  console.log('인증 상태 변경:', event);
  console.log('사용자:', user?.email);
});

// 구독 해제
subscription.unsubscribe();
```

---

### React Hook API

#### `useAuth()`

**설명**: 전체 인증 상태 관리 Hook

**반환값**: `UseAuthReturn`
```typescript
{
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}
```

**예시**:
```typescript
function LoginComponent() {
  const { user, loading, error, signIn, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}</p>
        <button onClick={signOut}>Logout</button>
      </div>
    );
  }
  
  return (
    <div>
      {error && <p className="error">{error}</p>}
      <button onClick={() => signIn('user@example.com')}>
        Login with Magic Link
      </button>
    </div>
  );
}
```

---

## 사용 예시

### 1. 기본 로그인 컴포넌트

```tsx
import { useState } from 'react';
import { useAuth } from '@/lib/hooks';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const { loading, error, signIn, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await signIn(email);
      toast.success('이메일을 확인해주세요!');
    } catch (err) {
      // 에러는 useAuth에서 자동으로 설정됨
      console.error('로그인 실패:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력하세요"
        disabled={loading}
      />
      
      {error && <p className="error">{error}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? '전송 중...' : '매직 링크 전송'}
      </button>
    </form>
  );
}
```

---

### 2. 보호된 라우트

```tsx
import { useRequireAuth } from '@/lib/hooks';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useRequireAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

---

### 3. 사용자 정보 표시

```tsx
import { useCurrentUser } from '@/lib/hooks';

export function UserProfile() {
  const { user, loading } = useCurrentUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
    </div>
  );
}
```

---

### 4. 인증 상태 구독 (고급)

```tsx
import { useEffect, useState } from 'react';
import { onAuthStateChange } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function AuthListener() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const subscription = onAuthStateChange((event, session, user) => {
      console.log('Auth event:', event);
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      {user ? `Logged in as ${user.email}` : 'Not logged in'}
    </div>
  );
}
```

---

## 테스트 체크리스트

### 기능 테스트

- [ ] **매직 링크 로그인**
  - [ ] 유효한 이메일로 로그인 시도
  - [ ] 이메일 수신 확인
  - [ ] 매직 링크 클릭 후 로그인 성공
  
- [ ] **Rate Limiting**
  - [ ] 5회 연속 실패 시 잠금 확인
  - [ ] 잠금 기간 동안 로그인 차단 확인
  - [ ] 15분 후 자동 해제 확인
  
- [ ] **세션 관리**
  - [ ] 세션 캐싱 동작 확인 (5분)
  - [ ] 강제 새로고침 동작 확인
  - [ ] 토큰 자동 갱신 확인
  
- [ ] **로그아웃**
  - [ ] 로그아웃 시 세션 초기화 확인
  - [ ] 로그아웃 후 보호된 페이지 접근 차단 확인
  
- [ ] **에러 처리**
  - [ ] 유효하지 않은 이메일 입력 시 에러 메시지 확인
  - [ ] 등록되지 않은 이메일 로그인 시도 시 에러 확인
  - [ ] 네트워크 오류 시 적절한 에러 메시지 확인

### 보안 테스트

- [ ] **입력 검증**
  - [ ] SQL Injection 방지 확인
  - [ ] XSS 공격 방지 확인
  - [ ] 이메일 형식 검증 확인
  
- [ ] **Rate Limiting**
  - [ ] Brute Force 공격 방지 확인
  - [ ] 다른 이메일로 시도 시 독립적인 카운터 확인
  
- [ ] **세션 보안**
  - [ ] 토큰 만료 시 자동 갱신 확인
  - [ ] 로그아웃 시 토큰 무효화 확인

### 성능 테스트

- [ ] **캐싱**
  - [ ] 5분 내 중복 요청 시 캐시 사용 확인
  - [ ] 캐시 만료 후 새로운 요청 확인
  
- [ ] **메모리 누수**
  - [ ] 컴포넌트 언마운트 시 구독 해제 확인
  - [ ] 비동기 작업 취소 확인

---

## 향후 개선 사항

### 1. 서버 사이드 Rate Limiting

**현재 문제**:
- 메모리 기반 Rate Limiting은 서버 재시작 시 초기화됨
- 여러 서버 인스턴스에서 공유되지 않음

**개선 방안**:
- Redis 또는 Supabase Database를 사용한 영구 저장
- IP 주소 기반 추가 제한

```typescript
// 예시: Redis 기반 Rate Limiting
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function checkRateLimitRedis(email: string): Promise<boolean> {
  const key = `rate_limit:${email}`;
  const attempts = await redis.incr(key);
  
  if (attempts === 1) {
    await redis.expire(key, 900); // 15분
  }
  
  return attempts <= MAX_ATTEMPTS;
}
```

---

### 2. 2단계 인증 (2FA)

**개선 방안**:
- TOTP (Time-based One-Time Password) 지원
- SMS 인증 추가

```typescript
// 예시: 2FA 활성화
async function enable2FA(userId: string): Promise<string> {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
  });
  
  if (error) throw error;
  
  return data.totp.qr_code; // QR 코드 URL
}
```

---

### 3. 소셜 로그인

**개선 방안**:
- Google, Facebook, Apple 로그인 추가

```typescript
// 예시: Google 로그인
async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/empire`,
    },
  });
  
  if (error) throw error;
}
```

---

### 4. 세션 만료 알림

**개선 방안**:
- 세션 만료 5분 전 사용자에게 알림
- 자동 갱신 또는 재로그인 유도

```typescript
// 예시: 세션 만료 알림
function useSessionExpiryWarning() {
  useEffect(() => {
    const checkExpiry = async () => {
      const session = await getSession();
      if (!session) return;
      
      const expiresAt = new Date(session.expires_at!).getTime();
      const now = Date.now();
      const timeLeft = expiresAt - now;
      
      if (timeLeft < 5 * 60 * 1000) { // 5분 미만
        toast.warning('세션이 곧 만료됩니다. 다시 로그인해주세요.');
      }
    };
    
    const interval = setInterval(checkExpiry, 60000); // 1분마다 확인
    return () => clearInterval(interval);
  }, []);
}
```

---

### 5. 감사 로그 (Audit Log)

**개선 방안**:
- 모든 인증 이벤트 기록
- 의심스러운 활동 감지

```typescript
// 예시: 감사 로그 기록
async function logAuthEvent(
  userId: string,
  event: string,
  metadata?: Record<string, any>
): Promise<void> {
  await supabase.from('auth_logs').insert({
    user_id: userId,
    event,
    metadata,
    ip_address: getClientIP(),
    user_agent: navigator.userAgent,
    created_at: new Date().toISOString(),
  });
}
```

---

## 결론

✅ **Supabase Auth 기반 인증 시스템 구축 완료**

- **타입 안정성**: 모든 함수 및 타입 정의 완료
- **보안 강화**: Rate Limiting, 에러 처리, 입력 검증
- **성능 최적화**: 세션 캐싱, 메모리 누수 방지
- **사용자 경험**: 명확한 에러 메시지, 로딩 상태 관리
- **확장 가능**: 모듈화된 구조, React Hook 통합

### 다음 단계

1. **Supabase Dashboard 설정**
   - Auth 설정에서 Magic Link 활성화
   - 이메일 템플릿 커스터마이징
   - Redirect URL 설정

2. **프론트엔드 통합**
   - 로그인 페이지 구현
   - 보호된 라우트 설정
   - 사용자 프로필 페이지 구현

3. **테스트**
   - 기능 테스트 수행
   - 보안 테스트 수행
   - 성능 테스트 수행

4. **배포**
   - 환경 변수 설정
   - HTTPS 적용
   - 프로덕션 배포

---

**문의사항이나 개선 제안이 있으시면 언제든지 말씀해주세요!** 🚀
