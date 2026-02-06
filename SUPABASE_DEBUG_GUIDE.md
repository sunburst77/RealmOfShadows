# Supabase 연결 오류 해결 가이드

## 문제 상황
- "Failed to fetch" 에러
- Supabase와 통신 불가능

## 해결 단계

### 1️⃣ Supabase 프로젝트 상태 확인
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 목록에서 해당 프로젝트 클릭
3. 프로젝트 상태 확인:
   - ✅ **Active** (정상)
   - ⚠️ **Paused** (일시 중지) → Resume 버튼 클릭
   - ❌ **Deleted** (삭제됨) → 새 프로젝트 생성 필요

### 2️⃣ API 키 및 URL 재확인
1. Supabase Dashboard → Project Settings → API
2. 다음 정보 복사:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...
   ```
3. `.env` 파일 열기
4. 다음 형식으로 정확히 입력되었는지 확인:
   ```env
   VITE_SUPABASE_URL=https://zgtcsblcgawpxtvgqfak.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   ⚠️ **주의사항**:
   - 따옴표 없이 입력
   - 공백 없이 입력
   - `=` 앞뒤 공백 없이

### 3️⃣ 데이터베이스 테이블 및 RLS 정책 확인

#### 3-1. 테이블 존재 여부 확인
Supabase Dashboard → Table Editor → 다음 테이블이 있는지 확인:
- ✅ `users`
- ✅ `referrals`
- ✅ `reward_tiers`
- ✅ `user_rewards`
- ✅ `pre_registration_stats`

없으면 → `supabase-migration.sql` 실행 필요

#### 3-2. RLS (Row Level Security) 정책 확인
Supabase Dashboard → Authentication → Policies

**`users` 테이블에 다음 정책이 있어야 합니다:**

1. **Enable insert for anon users** (INSERT)
   ```sql
   CREATE POLICY "Enable insert for anon users" ON users
   FOR INSERT
   TO anon
   WITH CHECK (true);
   ```

2. **Enable select for anon users** (SELECT)
   ```sql
   CREATE POLICY "Enable select for anon users" ON users
   FOR SELECT
   TO anon
   USING (true);
   ```

### 4️⃣ RPC 함수 확인
Supabase Dashboard → Database → Functions

다음 함수가 존재해야 합니다:
- ✅ `generate_referral_code`
- ✅ `get_referral_network`
- ✅ `calculate_user_tier`

없으면 → `supabase-migration.sql` 재실행 필요

### 5️⃣ 네트워크 및 방화벽 확인
1. 회사 네트워크나 VPN 사용 중이면 해제 후 재시도
2. 다른 브라우저에서 시도 (Chrome, Firefox, Edge)
3. 방화벽이 Supabase 도메인을 차단하지 않는지 확인

### 6️⃣ 서버 재시작
터미널에서:
```bash
# 1. 서버 중지 (Ctrl+C)
# 2. Vite 캐시 삭제
Remove-Item -Recurse -Force node_modules\.vite

# 3. 서버 재시작
npm run dev
```

## 빠른 테스트

터미널에서 다음 명령어 실행:
```bash
curl https://zgtcsblcgawpxtvgqfak.supabase.co/rest/v1/
```

- ✅ 정상: JSON 응답
- ❌ 실패: 에러 메시지 → URL이 잘못되었거나 프로젝트가 삭제됨

## 여전히 해결되지 않으면

1. `.env` 파일 내용 확인 (민감 정보 제외하고 형식만)
2. Supabase Dashboard의 프로젝트 상태 스크린샷
3. 브라우저 콘솔의 전체 에러 로그
4. Network 탭의 실패한 요청 상세 정보

위 정보를 공유해주시면 정확한 해결책을 제공하겠습니다.
