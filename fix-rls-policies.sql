-- ============================================
-- RLS 정책 수정: anon 사용자 권한 추가
-- ============================================

-- 1. users 테이블 RLS 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.users;
DROP POLICY IF EXISTS "Enable select for anon users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

-- users 테이블: anon 사용자가 INSERT 가능하도록
CREATE POLICY "Enable insert for anon users" 
ON public.users
FOR INSERT
TO anon
WITH CHECK (true);

-- users 테이블: anon 사용자가 SELECT 가능하도록
CREATE POLICY "Enable select for anon users" 
ON public.users
FOR SELECT
TO anon
USING (true);

-- 2. pre_registration_stats 테이블 RLS 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Enable insert for service role" ON public.pre_registration_stats;
DROP POLICY IF EXISTS "Enable select for all" ON public.pre_registration_stats;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.pre_registration_stats;
DROP POLICY IF EXISTS "Public read access" ON public.pre_registration_stats;

-- pre_registration_stats: anon 사용자도 읽기/쓰기 가능하도록
CREATE POLICY "Enable select for anon users" 
ON public.pre_registration_stats
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable insert for anon users" 
ON public.pre_registration_stats
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Enable update for anon users" 
ON public.pre_registration_stats
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- 3. referrals 테이블도 anon 접근 허용
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.referrals;

CREATE POLICY "Enable insert for anon users" 
ON public.referrals
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. reward_tiers 테이블 읽기 허용
DROP POLICY IF EXISTS "Enable select for anon users" ON public.reward_tiers;

CREATE POLICY "Enable select for anon users" 
ON public.reward_tiers
FOR SELECT
TO anon
USING (true);

-- ============================================
-- 완료 메시지
-- ============================================
DO $$ 
BEGIN 
  RAISE NOTICE '✅ RLS 정책 수정 완료!';
  RAISE NOTICE '✅ anon 사용자 권한 추가됨';
END $$;
