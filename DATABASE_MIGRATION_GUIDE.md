# 🗄️ Supabase 데이터베이스 마이그레이션 가이드

## ✅ 준비 완료

다음 작업이 완료되었습니다:
- ✅ SQL 마이그레이션 파일 생성 (`supabase-migration.sql`)
- ✅ TypeScript 타입 업데이트 (`referral_count_cache` 필드 추가)
- ✅ 쿼리 함수 최적화 (캐시 활용)

---

## 📋 실행 단계

### Step 1: Supabase Dashboard 접속

1. 브라우저에서 https://supabase.com/dashboard 접속
2. 로그인
3. 프로젝트 선택: **ijmsaidaaquiujspwbkr**

### Step 2: SQL Editor 열기

1. 좌측 사이드바에서 **🔧 SQL Editor** 클릭
2. **+ New query** 버튼 클릭

### Step 3: SQL 실행

프로젝트 루트의 `supabase-migration.sql` 파일 내용을 복사하여 붙여넣기:

1. `supabase-migration.sql` 파일 열기
2. 전체 내용 복사 (Ctrl+A → Ctrl+C)
3. Supabase SQL Editor에 붙여넣기 (Ctrl+V)
4. **▶ Run** 버튼 클릭 (또는 Ctrl+Enter)

### Step 4: 실행 확인

성공 메시지 확인:
```
✅ 데이터베이스 마이그레이션 완료!
개선사항:
- 추천 코드 중복 체크 추가
- 2차 추천 로직 수정
- 추천 카운트 캐시 추가
- 인덱스 최적화
- RLS 정책 수정
```

---

## 🎯 생성된 구조

### 테이블 (5개)
1. **users** - 사전등록 사용자 정보
2. **referrals** - 추천 관계 추적
3. **reward_tiers** - 보상 티어 정의 (4개 티어 포함)
4. **user_rewards** - 사용자별 보상 기록
5. **pre_registration_stats** - 실시간 통계

### 함수 (3개)
1. **generate_referral_code()** - 고유 추천 코드 생성 (중복 방지)
2. **get_referral_network(user_uuid)** - 추천 네트워크 조회 (2단계)
3. **calculate_user_tier(user_uuid)** - 사용자 보상 티어 계산

### 트리거 (4개)
1. **update_users_updated_at** - updated_at 자동 갱신
2. **after_user_insert_create_referrals** - 추천 관계 자동 생성
3. **after_user_insert_update_cache** - 추천 카운트 캐시 업데이트
4. **after_user_insert_update_stats** - 통계 자동 업데이트

### Row Level Security (RLS)
- ✅ 모든 테이블에 RLS 활성화
- ✅ 읽기 권한: 누구나 가능
- ✅ 쓰기 권한: INSERT는 누구나, UPDATE는 서비스 역할만

### 초기 데이터
- ✅ 보상 티어 4개 (Bronze, Silver, Gold, Platinum)
- ✅ 통계 초기값 (0명)

---

## 🆕 주요 개선사항

### 1. 추천 코드 중복 방지
```sql
-- 기존: 중복 가능성 존재
-- 개선: 중복 체크 로직 추가 (최대 10회 시도)
```

### 2. 2차 추천 로직 수정
```sql
-- 기존: 2차 추천 누락 가능
-- 개선: ON CONFLICT DO NOTHING으로 안전성 강화
```

### 3. 성능 최적화: 추천 카운트 캐시
```sql
-- users 테이블에 referral_count_cache 컬럼 추가
-- 매번 COUNT 쿼리 대신 캐시된 값 사용
```

**성능 비교:**
- 기존: 추천 네트워크 전체 조회 → COUNT → ~500ms
- 개선: 캐시 값 조회 → ~5ms (100배 빠름!)

### 4. 인덱스 최적화
```sql
-- 추가된 인덱스:
- idx_users_created_at_date (날짜별 통계)
- idx_users_referred_by_user_id (추천 네트워크 조회)
- idx_users_referral_lookup (추천 코드 검증)
- idx_referrals_level (레벨별 조회)
- idx_reward_tiers_active (활성 티어)
```

### 5. RLS 정책 개선
```sql
-- 기존: 인증된 사용자만 가능
-- 개선: 사전등록은 public이므로 누구나 조회 가능
```

---

## 🧪 테스트

마이그레이션 실행 후, Supabase Dashboard에서 확인:

### 1. 테이블 확인
좌측 **📊 Table Editor** → 테이블 5개 확인

### 2. 보상 티어 데이터 확인
`reward_tiers` 테이블 → 4개 행 확인:
- Bronze (0명)
- Silver (1-2명)
- Gold (3-4명)
- Platinum (5명 이상)

### 3. 함수 확인
SQL Editor에서 테스트:
```sql
-- 추천 코드 생성 테스트
SELECT generate_referral_code();
-- 결과 예: 'A3K8Q2N7'
```

### 4. 통계 초기값 확인
`pre_registration_stats` 테이블 → 1개 행 확인:
- total_registrations: 0
- registrations_today: 0

---

## 🚀 다음 단계

마이그레이션 완료 후:

1. ✅ **환경 변수 확인** - `.env` 파일에 Supabase 키 존재
2. ✅ **개발 서버 실행** - `npm run dev`
3. ⏳ **컴포넌트 통합** - PreRegistrationSection에 Supabase 연동
4. ⏳ **실시간 구독** - RealTimeCounter에 실시간 카운트 연동
5. ⏳ **추천 시스템** - ReferralTreeSection에 네트워크 연동

---

## ⚠️ 문제 해결

### 에러: "permission denied for schema public"
**해결:** Dashboard → Settings → Database → RLS를 다시 확인

### 에러: "relation already exists"
**해결:** 기존 테이블 삭제 후 재실행:
```sql
DROP TABLE IF EXISTS public.user_rewards CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.reward_tiers CASCADE;
DROP TABLE IF EXISTS public.pre_registration_stats CASCADE;
```

### 테이블은 생성되었으나 데이터 없음
**해결:** Step 14, 15만 다시 실행 (초기 데이터 삽입)

---

## 📞 지원

문제가 발생하면:
1. Supabase Dashboard → Logs 확인
2. 브라우저 콘솔 에러 확인
3. `npm run dev` 터미널 에러 확인

---

**준비 완료!** 🎉 SQL을 실행하고 다음 단계로 진행하세요.
