# 배포 가이드

> **Realm of Shadows** - 프로덕션 배포 가이드

---

## 📋 목차

- [배포 전 체크리스트](#배포-전-체크리스트)
- [Vercel 배포](#vercel-배포-권장)
- [Netlify 배포](#netlify-배포)
- [환경 변수 설정](#환경-변수-설정)
- [Supabase 프로덕션 설정](#supabase-프로덕션-설정)
- [도메인 연결](#도메인-연결)
- [모니터링](#모니터링)
- [트러블슈팅](#트러블슈팅)

---

## 배포 전 체크리스트

### 1. 코드 품질
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 경고 없음
- [ ] 모든 테스트 통과
- [ ] 불필요한 console.log 제거

```bash
# 체크 명령어
npm run build        # 빌드 성공 확인
```

### 2. 환경 변수
- [ ] `.env.example` 파일 업데이트
- [ ] 프로덕션 Supabase URL/Key 준비
- [ ] 민감 정보가 코드에 하드코딩되지 않았는지 확인

### 3. 성능
- [ ] 이미지 최적화 (WebP, 압축)
- [ ] 번들 크기 확인 (`npm run build` 후 dist 폴더 크기)
- [ ] Lighthouse 점수 확인

### 4. 보안
- [ ] Supabase RLS 정책 활성화
- [ ] XSS 방지 코드 확인
- [ ] CORS 설정 확인

---

## Vercel 배포 (권장)

### 1. Vercel CLI 설치

```bash
npm i -g vercel
```

### 2. 프로젝트 배포

```bash
# 프로젝트 루트에서
vercel

# 질문에 답변
# ? Set up and deploy "~/realm-of-shadows"? [Y/n] y
# ? Which scope? Your Name
# ? Link to existing project? [y/N] n
# ? What's your project's name? realm-of-shadows
# ? In which directory is your code located? ./
```

### 3. 환경 변수 설정

```bash
# Supabase URL 설정
vercel env add VITE_SUPABASE_URL
# 값 입력: your-project.supabase.co

# Supabase Anon Key 설정
vercel env add VITE_SUPABASE_ANON_KEY
# 값 입력: your-anon-key-here

# 프로덕션 환경으로 설정
# ? Which Environments? Production, Preview, Development
```

### 4. 재배포

```bash
vercel --prod
```

### 5. Vercel Dashboard 설정

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. Settings > Environment Variables
4. 환경 변수 확인/수정

### 빌드 설정 (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

---

## Netlify 배포

### 1. Netlify CLI 설치

```bash
npm i -g netlify-cli
```

### 2. 빌드

```bash
npm run build
```

### 3. 배포

```bash
# 처음 배포
netlify deploy

# 프로덕션 배포
netlify deploy --prod

# 또는 드래그 앤 드롭
# dist 폴더를 Netlify에 드래그
```

### 4. 환경 변수 설정

```bash
# netlify.toml 파일 생성
cat > netlify.toml << EOF
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
```

Netlify Dashboard에서 환경 변수 추가:
1. Site settings > Environment variables
2. `VITE_SUPABASE_URL` 추가
3. `VITE_SUPABASE_ANON_KEY` 추가

---

## 환경 변수 설정

### 프로덕션 환경 변수

```env
# .env.production (로컬 테스트용)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 환경별 분리

```bash
.env.development    # 개발 환경
.env.staging        # 스테이징 환경
.env.production     # 프로덕션 환경
```

### 환경 변수 검증

```typescript
// src/lib/supabase/client.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
```

---

## Supabase 프로덕션 설정

### 1. 프로젝트 업그레이드

Supabase 무료 플랜에서 Pro 플랜으로 업그레이드 고려:
- 더 많은 Database 용량
- 우선 지원
- 일일 백업

### 2. 데이터베이스 최적화

```sql
-- 인덱스 확인
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public';

-- 통계 업데이트
ANALYZE users;
ANALYZE referrals;
```

### 3. RLS 정책 재확인

```sql
-- 모든 테이블의 RLS 활성화 확인
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### 4. 백업 설정

Supabase Dashboard > Settings > Database > Backups
- 자동 백업 활성화
- 백업 주기 설정 (일일 권장)

### 5. 모니터링 설정

Supabase Dashboard > Settings > Monitoring
- 느린 쿼리 모니터링
- 에러 로그 확인

---

## 도메인 연결

### Vercel 커스텀 도메인

1. Vercel Dashboard > 프로젝트 > Settings > Domains
2. 도메인 입력 (예: `realmofshadows.com`)
3. DNS 레코드 추가:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify 커스텀 도메인

1. Netlify Dashboard > Site settings > Domain management
2. Add custom domain
3. DNS 레코드 추가:
   ```
   Type: A
   Name: @
   Value: [Netlify IP]
   
   Type: CNAME
   Name: www
   Value: [your-site].netlify.app
   ```

### SSL 인증서

- Vercel/Netlify 모두 자동으로 Let's Encrypt SSL 인증서 발급
- HTTPS 자동 리다이렉트 활성화

---

## 모니터링

### 1. 에러 추적 (Sentry 추천)

```bash
# Sentry 설치
npm install @sentry/react @sentry/vite-plugin
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
});
```

### 2. 성능 모니터링

```typescript
// Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 3. Supabase 모니터링

Supabase Dashboard에서 확인:
- Database usage
- API requests
- Realtime connections
- 느린 쿼리

---

## 배포 후 체크리스트

### 기능 테스트
- [ ] 사전등록 폼 제출
- [ ] 이메일/닉네임 중복 체크
- [ ] 추천인 코드 생성
- [ ] URL 파라미터 `?ref=CODE` 동작
- [ ] 실시간 카운터 업데이트
- [ ] 추천 네트워크 트리 표시

### 성능 테스트
- [ ] Lighthouse 점수 90+ (Performance)
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] 모바일 반응형 확인

### 보안 테스트
- [ ] XSS 공격 시도 (입력 살균 확인)
- [ ] SQL Injection 시도 (RLS 확인)
- [ ] CORS 정책 확인

---

## 트러블슈팅

### 빌드 실패

```bash
# 캐시 삭제 후 재빌드
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### 환경 변수 미적용

```bash
# Vercel
vercel env pull .env.local

# Netlify
netlify env:list
```

### Supabase 연결 실패

1. URL과 Key가 올바른지 확인
2. Supabase 프로젝트 상태 확인 (일시 중지되지 않았는지)
3. 네트워크 방화벽 확인

### CORS 에러

```typescript
// Supabase에서 CORS 자동 처리
// 추가 설정 불필요
```

### 이미지 로딩 실패

```typescript
// ImageWithFallback 컴포넌트 사용
<ImageWithFallback
  src="https://example.com/image.jpg"
  fallback="/placeholder.jpg"
  alt="Description"
/>
```

---

## CI/CD 파이프라인 (고급)

### GitHub Actions 예시

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 롤백 전략

### Vercel 롤백

```bash
# 이전 배포로 롤백
vercel rollback

# 특정 배포로 롤백 (Dashboard에서)
# Deployments > 이전 배포 선택 > Promote to Production
```

### 데이터베이스 롤백

```sql
-- Supabase에서 백업 복원
-- Dashboard > Settings > Database > Backups > Restore
```

---

## 비용 최적화

### Supabase
- 무료 플랜: 500MB Database, 2GB 파일 스토리지
- Pro 플랜: $25/month (8GB Database, 100GB 파일 스토리지)

### Vercel
- Hobby 플랜: 무료 (개인 프로젝트)
- Pro 플랜: $20/month (팀 협업)

### 최적화 팁
- 이미지 CDN 활용 (Cloudinary, imgix)
- Database 쿼리 최적화 (인덱스, 캐시)
- Realtime 구독 최소화

---

## 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Netlify 문서](https://docs.netlify.com)
- [Supabase 프로덕션 체크리스트](https://supabase.com/docs/guides/platform/going-into-prod)

---

**배포 성공! 🎉**

문제가 발생하면 [Issues](https://github.com/your-repo/issues)에 제보해주세요.
