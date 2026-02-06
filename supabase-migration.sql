-- ============================================
-- Realm of Shadows - 데이터베이스 마이그레이션
-- 실행 날짜: 2026-02-06
-- ============================================

-- ============================================
-- 1. users 테이블 (사전등록 사용자)
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  language VARCHAR(5) DEFAULT 'ko' CHECK (language IN ('ko', 'en', 'ja')),
  
  -- 추천인 관련
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_by_code VARCHAR(20),
  referred_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- 성능 최적화: 추천 카운트 캐시
  referral_count_cache INT DEFAULT 0,
  
  -- 메타데이터
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- 제약조건
  CONSTRAINT check_nickname_length CHECK (char_length(nickname) >= 2)
);

-- 인덱스 생성
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_users_referred_by_code ON public.users(referred_by_code);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);
-- 날짜별 인덱스는 제거 (표현식 인덱스 IMMUTABLE 제약으로 인한 에러 방지)

-- 성능 최적화: 추천 네트워크 조회용 인덱스
CREATE INDEX idx_users_referred_by_user_id 
ON public.users(referred_by_user_id) 
WHERE referred_by_user_id IS NOT NULL;

-- 추천 코드 검증 최적화
CREATE INDEX idx_users_referral_lookup 
ON public.users(referral_code, id, nickname);

-- ============================================
-- 2. referrals 테이블 (추천 관계 추적)
-- ============================================
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  level INT NOT NULL DEFAULT 1 CHECK (level IN (1, 2)), -- 1차, 2차 추천
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- 중복 방지
  UNIQUE(referrer_id, referee_id)
);

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referee ON public.referrals(referee_id);
CREATE INDEX idx_referrals_level ON public.referrals(referrer_id, level);

-- ============================================
-- 3. reward_tiers 테이블 (보상 티어 정의)
-- ============================================
CREATE TABLE public.reward_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name VARCHAR(50) NOT NULL,
  min_referrals INT NOT NULL,
  max_referrals INT,
  
  -- 보상 아이템 (JSON)
  rewards JSONB NOT NULL DEFAULT '[]',
  
  -- 잠금 해제 콘텐츠
  unlocked_episodes INT[] DEFAULT '{}',
  
  -- 다국어 정보
  tier_translations JSONB NOT NULL DEFAULT '{}',
  
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_reward_tiers_referrals ON public.reward_tiers(min_referrals, max_referrals);
CREATE INDEX idx_reward_tiers_active ON public.reward_tiers(is_active, sort_order);

-- ============================================
-- 4. user_rewards 테이블 (사용자 보상 기록)
-- ============================================
CREATE TABLE public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES public.reward_tiers(id) ON DELETE CASCADE,
  
  -- 보상 상태
  is_claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(user_id, tier_id)
);

CREATE INDEX idx_user_rewards_user ON public.user_rewards(user_id);
CREATE INDEX idx_user_rewards_claimed ON public.user_rewards(is_claimed);

-- ============================================
-- 5. pre_registration_stats 테이블 (통계)
-- ============================================
CREATE TABLE public.pre_registration_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_registrations INT NOT NULL DEFAULT 0,
  registrations_today INT NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  UNIQUE(date)
);

-- ============================================
-- 6. 함수: 추천 코드 생성 (중복 체크 포함)
-- ============================================
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- 혼동 문자 제외
  result TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    
    -- 중복 체크
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.users WHERE referral_code = result
    );
    
    attempts := attempts + 1;
    IF attempts > 10 THEN
      RAISE EXCEPTION 'Failed to generate unique referral code after 10 attempts';
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. 함수: 사용자 추천 네트워크 조회
-- ============================================
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
    -- 1차 추천 (직접 초대)
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
    
    -- 2차 추천 (간접 초대)
    SELECT 
      rt.level + 1,
      u.id,
      u.email,
      u.nickname,
      u.referral_code,
      u.created_at
    FROM public.users u
    INNER JOIN referral_tree rt ON u.referred_by_user_id = rt.user_id
    WHERE rt.level < 2  -- 최대 2단계까지만
  )
  SELECT * FROM referral_tree
  ORDER BY level, created_at;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. 함수: 사용자 보상 티어 계산
-- ============================================
CREATE OR REPLACE FUNCTION calculate_user_tier(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  referral_count INT;
  tier_uuid UUID;
BEGIN
  -- 캐시된 추천 카운트 사용
  SELECT referral_count_cache INTO referral_count
  FROM public.users
  WHERE id = user_uuid;
  
  -- 해당하는 티어 찾기
  SELECT id INTO tier_uuid
  FROM public.reward_tiers
  WHERE is_active = true
    AND min_referrals <= referral_count
    AND (max_referrals IS NULL OR max_referrals >= referral_count)
  ORDER BY min_referrals DESC
  LIMIT 1;
  
  RETURN tier_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. 트리거: updated_at 자동 업데이트
-- ============================================
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

-- ============================================
-- 10. 트리거: 추천 관계 자동 생성 (수정됨)
-- ============================================
CREATE OR REPLACE FUNCTION create_referral_relationships()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referred_by_user_id IS NOT NULL THEN
    -- 1차: 직접 추천인과의 관계 (레벨 1)
    INSERT INTO public.referrals (referrer_id, referee_id, level)
    VALUES (NEW.referred_by_user_id, NEW.id, 1)
    ON CONFLICT (referrer_id, referee_id) DO NOTHING;
    
    -- 2차: 직접 추천인의 추천인과의 관계 (레벨 2)
    INSERT INTO public.referrals (referrer_id, referee_id, level)
    SELECT u.referred_by_user_id, NEW.id, 2
    FROM public.users u
    WHERE u.id = NEW.referred_by_user_id
      AND u.referred_by_user_id IS NOT NULL
    ON CONFLICT (referrer_id, referee_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_user_insert_create_referrals
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_relationships();

-- ============================================
-- 11. 트리거: 추천 카운트 캐시 업데이트 (신규)
-- ============================================
CREATE OR REPLACE FUNCTION update_referral_count_cache()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referred_by_user_id IS NOT NULL THEN
    -- 1차 추천인 카운트 증가
    UPDATE public.users 
    SET referral_count_cache = referral_count_cache + 1
    WHERE id = NEW.referred_by_user_id;
    
    -- 2차 추천인 카운트 증가
    UPDATE public.users u
    SET referral_count_cache = referral_count_cache + 1
    FROM public.users ref
    WHERE ref.id = NEW.referred_by_user_id
      AND u.id = ref.referred_by_user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_user_insert_update_cache
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_referral_count_cache();

-- ============================================
-- 12. 트리거: 통계 업데이트
-- ============================================
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

-- ============================================
-- 13. Row Level Security (RLS) 정책
-- ============================================
-- users 테이블
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 조회 가능 (사전등록은 public)
CREATE POLICY "Users can view all data"
  ON public.users FOR SELECT
  USING (true);

-- 새 사용자 등록은 누구나 가능
CREATE POLICY "Anyone can register"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- 업데이트는 서비스 역할만 가능 (사전등록에서는 불필요)
CREATE POLICY "Service role can update users"
  ON public.users FOR UPDATE
  USING (auth.jwt()->>'role' = 'service_role');

-- referrals 테이블
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view referrals"
  ON public.referrals FOR SELECT
  USING (true);

-- reward_tiers 테이블
ALTER TABLE public.reward_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active reward tiers"
  ON public.reward_tiers FOR SELECT
  USING (is_active = true);

-- user_rewards 테이블
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all rewards"
  ON public.user_rewards FOR SELECT
  USING (true);

-- pre_registration_stats 테이블
ALTER TABLE public.pre_registration_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stats"
  ON public.pre_registration_stats FOR SELECT
  USING (true);

-- ============================================
-- 14. 초기 보상 티어 데이터 삽입
-- ============================================
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

-- ============================================
-- 15. 초기 통계 데이터
-- ============================================
INSERT INTO public.pre_registration_stats (total_registrations, registrations_today, date)
VALUES (0, 0, CURRENT_DATE);

-- ============================================
-- 완료 메시지
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ 데이터베이스 마이그레이션 완료!';
  RAISE NOTICE '개선사항:';
  RAISE NOTICE '- 추천 코드 중복 체크 추가';
  RAISE NOTICE '- 2차 추천 로직 수정';
  RAISE NOTICE '- 추천 카운트 캐시 추가';
  RAISE NOTICE '- 인덱스 최적화';
  RAISE NOTICE '- RLS 정책 수정';
END $$;
