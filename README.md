# Realm of Shadows - Pre-registration Landing Page

<div align="center">

![Realm of Shadows](https://img.shields.io/badge/Version-1.0.0-gold?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

**다크 판타지 게임 사전예약 랜딩 페이지**

[🎮 Live Demo](#) | [📚 Documentation](#documentation) | [🐛 Report Bug](https://github.com/your-repo/issues)

</div>

---

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [환경 설정](#-환경-설정)
- [프로젝트 구조](#-프로젝트-구조)
- [사용 가이드](#-사용-가이드)
- [API 문서](#-api-문서)
- [배포](#-배포)
- [문서](#-문서)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 개요

**Realm of Shadows**는 다크 판타지 세계관의 게임을 위한 사전예약 랜딩 페이지입니다. 

Figma 디자인을 기반으로 React + TypeScript + Supabase로 구축된 풀스택 애플리케이션으로, 실시간 통계, 추천인 시스템, 보상 티어 관리 등 다양한 기능을 제공합니다.

### 🎨 디자인 원본
- [Figma 디자인 보기](https://www.figma.com/design/lDUJh6zKg0zfdf5EUctrIM/Pre-registration-landing-page)

---

## ✨ 주요 기능

### 1. **사전등록 시스템** 🎫
- ✅ 이메일/닉네임/전화번호 수집
- ✅ 실시간 중복 체크
- ✅ XSS 방지 및 입력 살균
- ✅ 다국어 지원 (한국어, 영어, 일본어)

### 2. **추천인 시스템** 🌳
- ✅ 8자리 고유 추천 코드 자동 생성
- ✅ 2단계 추천 네트워크 시각화
- ✅ URL 파라미터로 자동 추천인 연결 (`?ref=CODE123`)
- ✅ 추천 통계 (직접/간접 초대)

### 3. **보상 티어 시스템** 🏆
- ✅ 추천 수에 따른 단계별 보상
- ✅ 실시간 티어 계산
- ✅ 보상 아이템 관리
- ✅ 다국어 보상 설명

### 4. **실시간 통계** 📊
- ✅ Supabase Realtime으로 사전등록 카운트 업데이트
- ✅ 부드러운 숫자 증가 애니메이션
- ✅ Live 인디케이터

### 5. **다크 판타지 UI/UX** 🎨
- ✅ 시네마틱 히어로 섹션
- ✅ Framer Motion 애니메이션
- ✅ 반응형 디자인 (모바일 최적화)
- ✅ 접근성 준수 (WCAG AA)

---

## 🛠️ 기술 스택

### Frontend
- **React** 18.3.1 - UI 라이브러리
- **TypeScript** 5.x - 타입 안전성
- **Vite** 6.4.1 - 빌드 도구
- **Tailwind CSS** 3.4.18 - 스타일링
- **Framer Motion** (motion) - 애니메이션
- **Radix UI** - 접근성 있는 UI 컴포넌트
- **React Hook Form** - 폼 관리
- **Sonner** - 토스트 알림

### Backend
- **Supabase** - BaaS (Backend as a Service)
  - PostgreSQL 데이터베이스
  - Realtime 구독
  - Row Level Security (RLS)
  - 서버리스 함수

### DevOps & Tools
- **npm** - 패키지 관리
- **ESLint** - 코드 품질
- **PostCSS** - CSS 처리
- **Git** - 버전 관리

---

## 🚀 시작하기

### 사전 요구사항

- **Node.js**: 18.x 이상
- **npm**: 9.x 이상
- **Supabase 계정**: [supabase.com](https://supabase.com)에서 무료 계정 생성

### 설치

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/realm-of-shadows.git
cd realm-of-shadows

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일을 열고 Supabase 정보 입력

# 4. Supabase 데이터베이스 설정
# supabase-migration.sql 파일을 Supabase SQL Editor에서 실행

# 5. 개발 서버 실행
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

---

## ⚙️ 환경 설정

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
# Supabase 설정
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase 설정

1. **프로젝트 생성**
   - [Supabase Dashboard](https://app.supabase.com)에서 새 프로젝트 생성

2. **데이터베이스 마이그레이션**
   ```sql
   -- supabase-migration.sql 파일 내용을 SQL Editor에서 실행
   ```

3. **환경 변수 가져오기**
   - Settings > API에서 URL과 anon key 복사

자세한 내용은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)를 참고하세요.

---

## 📁 프로젝트 구조

```
realm-of-shadows/
├── src/
│   ├── app/
│   │   ├── App.tsx                           # 메인 앱 컴포넌트
│   │   ├── translations.ts                    # 다국어 번역
│   │   └── components/                        # React 컴포넌트
│   │       ├── HeroSection.tsx               # 히어로 섹션
│   │       ├── PreRegistrationSection.tsx    # 사전등록 폼
│   │       ├── ReferralTreeSection.tsx       # 추천 네트워크 트리
│   │       ├── NavigationOverlay.tsx         # 네비게이션 바
│   │       └── ui/                           # 재사용 UI 컴포넌트
│   │           ├── CTAButton.tsx
│   │           ├── RealTimeCounter.tsx
│   │           └── ...
│   │
│   ├── lib/
│   │   ├── supabase/                         # Supabase 통합
│   │   │   ├── client.ts                     # Supabase 클라이언트
│   │   │   ├── types.ts                      # 타입 정의
│   │   │   ├── queries.ts                    # 데이터 조회
│   │   │   └── mutations.ts                  # 데이터 수정
│   │   │
│   │   ├── services/                         # 비즈니스 로직
│   │   │   ├── registration-api.ts           # 사전등록 API
│   │   │   ├── security.ts                   # 보안 유틸리티
│   │   │   ├── realtime-stats.ts             # 실시간 통계
│   │   │   └── error-handler.ts              # 에러 처리
│   │   │
│   │   ├── utils/                            # 유틸리티 함수
│   │   │   ├── validation.ts                 # 입력 검증
│   │   │   ├── local-storage.ts              # 로컬 스토리지
│   │   │   └── abort-controller.ts           # 요청 취소
│   │   │
│   │   └── hooks/                            # 커스텀 훅
│   │       └── use-loading.ts                # 로딩 상태 관리
│   │
│   ├── styles/                               # 글로벌 스타일
│   │   ├── index.css                         # 메인 스타일
│   │   ├── design-tokens.css                 # 디자인 토큰
│   │   └── fonts.css                         # 폰트 정의
│   │
│   └── main.tsx                              # 앱 진입점
│
├── guidelines/
│   └── Guidelines.md                         # 프로젝트 코딩 규칙
│
├── supabase-migration.sql                    # 데이터베이스 스키마
├── .env.example                              # 환경 변수 예시
├── package.json                              # 의존성 관리
├── vite.config.ts                            # Vite 설정
├── tailwind.config.js                        # Tailwind 설정
└── README.md                                 # 이 파일
```

---

## 📖 사용 가이드

### 사전등록 프로세스

1. **사용자 입력**
   ```typescript
   // 사전등록 폼 제출
   {
     name: "홍길동",
     email: "hong@example.com",
     nickname: "DarkKnight",
     phone: "010-1234-5678",
     agreeToPolicy: true
   }
   ```

2. **자동 처리**
   - ✅ 입력 살균 (XSS 방지)
   - ✅ 이메일/닉네임 중복 체크
   - ✅ 8자리 추천 코드 생성 (`ABC12345`)
   - ✅ URL 파라미터에서 추천인 코드 추출

3. **데이터 저장**
   - Supabase `users` 테이블에 저장
   - 추천 관계 자동 생성 (`referrals` 테이블)
   - 로컬 스토리지에 사용자 정보 캐시

4. **결과 반환**
   - 성공 메시지 + 추천 코드 표시
   - 추천 링크 자동 생성

### 추천인 시스템 사용

```typescript
// 추천 링크 예시
https://realmofshadows.com?ref=ABC12345

// 자동 처리:
// 1. URL에서 ref 파라미터 추출
// 2. 추천인 코드 유효성 검증
// 3. 사전등록 시 자동으로 추천 관계 생성
```

### 실시간 통계 구독

```typescript
// RealTimeCounter 컴포넌트가 자동으로 구독
// Supabase Realtime을 통해 새 등록 발생 시 자동 업데이트
```

---

## 📚 API 문서

### Supabase Functions

#### `generate_referral_code()`
8자리 고유 추천 코드 생성 (대문자 + 숫자)

```sql
SELECT generate_referral_code();
-- 반환 예: 'A7K9M2X1'
```

#### `get_referral_network(user_id UUID)`
사용자의 추천 네트워크 조회 (2단계)

```sql
SELECT * FROM get_referral_network('user-uuid-here');
```

#### `calculate_user_tier(user_id UUID)`
사용자의 현재 보상 티어 계산

```sql
SELECT * FROM calculate_user_tier('user-uuid-here');
```

### REST API (Supabase Client)

자세한 API 문서는 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)를 참고하세요.

---

## 🌍 다국어 지원

### 지원 언어
- 🇰🇷 한국어 (ko)
- 🇺🇸 영어 (en)
- 🇯🇵 일본어 (ja)

### 번역 추가

```typescript
// src/app/translations.ts
export const translations: Record<Language, Translations> = {
  ko: {
    nav: {
      hero: '홈',
      // ...
    },
  },
  en: {
    nav: {
      hero: 'Home',
      // ...
    },
  },
};
```

---

## 🎨 커스터마이징

### 디자인 토큰 수정

```css
/* src/styles/design-tokens.css */
:root {
  --color-primary-gold: #D4AF37;        /* 메인 골드 색상 */
  --color-accent-red: #DC2626;          /* 액센트 레드 */
  --text-display-title: 72px;           /* 제목 크기 */
  /* ... */
}
```

### 컴포넌트 스타일

```typescript
// Tailwind CSS 클래스 사용
<CTAButton 
  type="primary" 
  size="large"
  className="custom-class"
>
  버튼
</CTAButton>
```

---

## 🚢 배포

### Vercel 배포 (권장)

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 배포
vercel

# 3. 환경 변수 설정
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Netlify 배포

```bash
# 1. 빌드
npm run build

# 2. dist 폴더를 Netlify에 드래그 앤 드롭
```

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

---

## 📚 문서

### 주요 문서
- [Supabase 설정 가이드](./SUPABASE_SETUP.md)
- [데이터베이스 마이그레이션](./DATABASE_MIGRATION_GUIDE.md)
- [컴포넌트 통합 완료](./COMPONENT_INTEGRATION_COMPLETE.md)
- [메모리 누수 수정](./MEMORY_LEAK_FIX_COMPLETE.md)
- [리소스 관리 보고서](./RESOURCE_MANAGEMENT_REPORT.md)
- [코딩 가이드라인](./guidelines/Guidelines.md)

### API 문서
- [API 서비스 레이어](./API_SERVICE_LAYER_COMPLETE.md)
- [TypeScript 타입 정의](./TYPESCRIPT_UPDATE_COMPLETE.md)

---

## 🤝 기여하기

기여를 환영합니다! 다음 단계를 따라주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 코딩 규칙

프로젝트의 코딩 규칙은 [guidelines/Guidelines.md](./guidelines/Guidelines.md)를 참고하세요.

---

## 🐛 트러블슈팅

### Supabase 연결 실패

```bash
# .env 파일 확인
cat .env

# Supabase URL과 Key가 올바른지 확인
# https://app.supabase.com > Settings > API
```

### Tailwind 스타일 적용 안 됨

```bash
# tailwind.config.js의 content 경로 확인
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

### 타입 에러

```bash
# TypeScript 서버 재시작
# VSCode: Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

더 많은 문제 해결 방법은 [Issues](https://github.com/your-repo/issues)를 확인하세요.

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

---

## 🙏 감사의 글

- [Figma Design](https://www.figma.com/design/lDUJh6zKg0zfdf5EUctrIM/Pre-registration-landing-page) - 디자인 원본
- [Supabase](https://supabase.com) - Backend as a Service
- [Radix UI](https://www.radix-ui.com) - 접근성 있는 UI 컴포넌트
- [Lucide Icons](https://lucide.dev) - 아이콘
- [Unsplash](https://unsplash.com) - 이미지

---

## 📞 문의

프로젝트에 대한 질문이나 제안이 있으시면 Issue를 생성해주세요.

**Made with ❤️ and ⚔️ in the Realm of Shadows**

---

<div align="center">

[⬆ Back to Top](#realm-of-shadows---pre-registration-landing-page)

</div>
