# Supabase 초기 설정 완료 ✅

## 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 추가하세요:

```env
VITE_SUPABASE_URL=https://ijmsaidaaquiujspwbkr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqbXNhaWRhYXF1aXVqc3B3YmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMjAwMjksImV4cCI6MjA4NTg5NjAyOX0.Srkkp37DOCpWWW1vGCcitySMlsVyQ9Sq5u9_cR3C0B0
```

> ⚠️ **중요**: `.env` 파일은 `.gitignore`에 이미 포함되어 있으므로 Git에 커밋되지 않습니다.

## 2. 완료된 작업

### ✅ 패키지 설치
- `@supabase/supabase-js` 설치 완료

### ✅ 파일 구조 생성
```
src/lib/supabase/
├── client.ts       # Supabase 클라이언트 인스턴스
├── types.ts        # TypeScript 타입 정의
├── queries.ts      # 데이터 조회 함수
└── mutations.ts    # 데이터 생성/수정 함수
```

### ✅ 주요 기능 구현

#### `client.ts`
- Supabase 클라이언트 초기화
- 환경 변수 검증
- 타입 안전성 설정

#### `types.ts`
- Database 스키마 타입 정의
- 사용자, 추천, 보상 관련 타입
- API 응답 인터페이스

#### `queries.ts`
- `getPreRegistrationStats()` - 사전등록 통계 조회
- `subscribeToRegistrationCount()` - 실시간 카운트 구독
- `getReferralNetwork()` - 추천 네트워크 조회
- `getUserRewardInfo()` - 사용자 보상 정보
- `getUserByReferralCode()` - 추천 코드로 사용자 찾기
- `checkEmailExists()` - 이메일 중복 확인
- `checkNicknameExists()` - 닉네임 중복 확인

#### `mutations.ts`
- `createPreRegistration()` - 사전등록 생성
- `claimReward()` - 보상 획득 처리
- `updateUserInfo()` - 사용자 정보 업데이트

## 3. 다음 단계: 데이터베이스 스키마 생성

Supabase Dashboard의 SQL Editor에서 아래 스크립트를 실행해야 합니다:

### 📍 Supabase Dashboard 접속
1. https://supabase.com/dashboard 로그인
2. 프로젝트 선택: `ijmsaidaaquiujspwbkr`
3. 좌측 메뉴에서 **SQL Editor** 클릭
4. **New query** 버튼 클릭

### 📝 실행할 SQL 스크립트

아래 순서대로 실행하세요:

#### Step 1: 테이블 생성
```sql
-- 1. users 테이블
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  language VARCHAR(5) DEFAULT 'ko' CHECK (language IN ('ko', 'en', 'ja')),
  
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_by_code VARCHAR(20),
  referred_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  CONSTRAINT check_nickname_length CHECK (char_length(nickname) >= 2)
);

-- 인덱스 생성
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_users_referred_by_code ON public.users(referred_by_code);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);

-- 2. referrals 테이블
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  level INT NOT NULL DEFAULT 1 CHECK (level IN (1, 2)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(referrer_id, referee_id)
);

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referee ON public.referrals(referee_id);

-- 3. reward_tiers 테이블
CREATE TABLE public.reward_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name VARCHAR(50) NOT NULL,
  min_referrals INT NOT NULL,
  max_referrals INT,
  rewards JSONB NOT NULL DEFAULT '[]',
  unlocked_episodes INT[] DEFAULT '{}',
  tier_translations JSONB NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_reward_tiers_referrals ON public.reward_tiers(min_referrals, max_referrals);

-- 4. user_rewards 테이블
CREATE TABLE public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES public.reward_tiers(id) ON DELETE CASCADE,
  is_claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(user_id, tier_id)
);

CREATE INDEX idx_user_rewards_user ON public.user_rewards(user_id);
CREATE INDEX idx_user_rewards_claimed ON public.user_rewards(is_claimed);

-- 5. pre_registration_stats 테이블
CREATE TABLE public.pre_registration_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_registrations INT NOT NULL DEFAULT 0,
  registrations_today INT NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  UNIQUE(date)
);
```

#### Step 2: 함수 생성
```sql
-- 추천 코드 생성 함수
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 사용자 추천 네트워크 조회 함수
CREATE OR REPLACE FUNCTION get_referral_network(user_uuid UUID)
RETURNS TABLE (
  level INT,
  user_id UUID,
  email VARCHAR,
  nickname VARCHAR,
  referral_code VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE referral_tree AS (
    SELECT 
      1 AS level,
      u.id,
      u.email,
      u.nickname,
      u.referral_code,
      u.created_at
    FROM public.users u
    WHERE u.referred_by_user_id = user_uuid
    
    UNION ALL
    
    SELECT 
      rt.level + 1,
      u.id,
      u.email,
      u.nickname,
      u.referral_code,
      u.created_at
    FROM public.users u
    INNER JOIN referral_tree rt ON u.referred_by_user_id = rt.user_id
    WHERE rt.level < 2
  )
  SELECT * FROM referral_tree
  ORDER BY level, created_at;
END;
$$ LANGUAGE plpgsql;
```

#### Step 3: 트리거 생성
```sql
-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 추천 관계 자동 생성 트리거
CREATE OR REPLACE FUNCTION create_referral_relationships()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referred_by_user_id IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referee_id, level)
    VALUES (NEW.referred_by_user_id, NEW.id, 1);
    
    INSERT INTO public.referrals (referrer_id, referee_id, level)
    SELECT referred_by_user_id, NEW.id, 2
    FROM public.users
    WHERE id = NEW.referred_by_user_id
      AND referred_by_user_id IS NOT NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_user_insert_create_referrals
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_relationships();

-- 통계 업데이트 트리거
CREATE OR REPLACE FUNCTION update_registration_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.pre_registration_stats (total_registrations, registrations_today, date)
  VALUES (1, 1, CURRENT_DATE)
  ON CONFLICT (date) DO UPDATE
  SET 
    total_registrations = pre_registration_stats.total_registrations + 1,
    registrations_today = pre_registration_stats.registrations_today + 1,
    last_updated = TIMEZONE('utc', NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_user_insert_update_stats
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_registration_stats();
```

#### Step 4: RLS (Row Level Security) 설정
```sql
-- users 테이블
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all data"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Anyone can register"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- referrals 테이블
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view referrals"
  ON public.referrals FOR SELECT
  USING (true);

-- reward_tiers 테이블
ALTER TABLE public.reward_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reward tiers"
  ON public.reward_tiers FOR SELECT
  USING (is_active = true);

-- user_rewards 테이블
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rewards"
  ON public.user_rewards FOR SELECT
  USING (true);

-- pre_registration_stats 테이블
ALTER TABLE public.pre_registration_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stats"
  ON public.pre_registration_stats FOR SELECT
  USING (true);
```

#### Step 5: 초기 데이터 삽입
```sql
-- 보상 티어 데이터
INSERT INTO public.reward_tiers (tier_name, min_referrals, max_referrals, rewards, unlocked_episodes, tier_translations, sort_order) VALUES
(
  'Bronze',
  0,
  0,
  '[
    {"type": "weapon", "name": "Fangs of Darkness", "rarity": "legendary"},
    {"type": "currency", "name": "Gold", "amount": 10000},
    {"type": "currency", "name": "Diamond", "amount": 500}
  ]'::jsonb,
  ARRAY[1, 2],
  '{
    "ko": {"title": "브론즈 티어", "description": "사전예약 기본 보상"},
    "en": {"title": "Bronze Tier", "description": "Pre-registration basic rewards"},
    "ja": {"title": "ブロンズティア", "description": "事前登録基本報酬"}
  }'::jsonb,
  1
),
(
  'Silver',
  1,
  2,
  '[
    {"type": "weapon", "name": "Shadow Blade", "rarity": "epic"},
    {"type": "currency", "name": "Gold", "amount": 25000},
    {"type": "currency", "name": "Diamond", "amount": 1000},
    {"type": "skin", "name": "Shadow Lord Set", "rarity": "exclusive"}
  ]'::jsonb,
  ARRAY[1, 2, 3],
  '{
    "ko": {"title": "실버 티어", "description": "1-2명 초대 보상"},
    "en": {"title": "Silver Tier", "description": "1-2 referrals rewards"},
    "ja": {"title": "シルバーティア", "description": "1-2人招待報酬"}
  }'::jsonb,
  2
),
(
  'Gold',
  3,
  4,
  '[
    {"type": "weapon", "name": "Void Scepter", "rarity": "mythic"},
    {"type": "currency", "name": "Gold", "amount": 50000},
    {"type": "currency", "name": "Diamond", "amount": 2000},
    {"type": "skin", "name": "Dark Emperor Set", "rarity": "mythic"},
    {"type": "mount", "name": "Shadow Dragon", "rarity": "legendary"}
  ]'::jsonb,
  ARRAY[1, 2, 3, 4],
  '{
    "ko": {"title": "골드 티어", "description": "3-4명 초대 보상"},
    "en": {"title": "Gold Tier", "description": "3-4 referrals rewards"},
    "ja": {"title": "ゴールドティア", "description": "3-4人招待報酬"}
  }'::jsonb,
  3
),
(
  'Platinum',
  5,
  NULL,
  '[
    {"type": "weapon", "name": "Cosmic Destroyer", "rarity": "divine"},
    {"type": "currency", "name": "Gold", "amount": 100000},
    {"type": "currency", "name": "Diamond", "amount": 5000},
    {"type": "skin", "name": "Supreme Overlord Collection", "rarity": "divine"},
    {"type": "mount", "name": "Celestial Phoenix", "rarity": "divine"},
    {"type": "title", "name": "Empire Founder", "rarity": "unique"}
  ]'::jsonb,
  ARRAY[1, 2, 3, 4],
  '{
    "ko": {"title": "플래티넘 티어", "description": "5명 이상 초대 최고 보상"},
    "en": {"title": "Platinum Tier", "description": "5+ referrals ultimate rewards"},
    "ja": {"title": "プラチナティア", "description": "5人以上招待最高報酬"}
  }'::jsonb,
  4
);

-- 초기 통계 데이터
INSERT INTO public.pre_registration_stats (total_registrations, registrations_today, date)
VALUES (0, 0, CURRENT_DATE);
```

## 4. 테스트

개발 서버를 실행하여 Supabase 연결을 테스트하세요:

```bash
npm run dev
```

콘솔에서 Supabase 관련 에러가 없는지 확인하세요.

## 5. 다음 작업

- [ ] 데이터베이스 스키마 생성 (위 SQL 실행)
- [ ] PreRegistrationSection 컴포넌트에 Supabase 연동
- [ ] ReferralTreeSection 컴포넌트에 Supabase 연동
- [ ] RealTimeCounter에 실시간 구독 연동

---

**설정 완료!** 🎉 문제가 있으면 언제든지 문의하세요.
