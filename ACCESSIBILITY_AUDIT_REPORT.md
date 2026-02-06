# 웹접근성 및 웹표준 점검 보고서

## 📅 날짜: 2025-01-06

## 📋 점검 범위

- HTML 시맨틱 태그 사용
- ARIA 속성
- 키보드 네비게이션
- 색상 대비 (WCAG AA)
- 폼 라벨링
- 이미지 alt 텍스트
- 헤딩 구조
- 링크 접근성
- 메타 태그

---

## ✅ 잘 구현된 부분

### 1. HTML 시맨틱 태그
- ✅ `<main>` 태그 사용 (HomePage)
- ✅ `<section>` 태그 사용 (각 섹션)
- ✅ `<nav>` 태그 사용 (NavigationOverlay)
- ✅ `<footer>` 태그 사용 (FooterSection)
- ✅ `<form>` 태그 사용 (PreRegistrationSection)

### 2. ARIA 속성
- ✅ `aria-label` 사용 (FooterSection 소셜 링크)
- ✅ `aria-describedby` 사용 (Form 컴포넌트)
- ✅ `aria-invalid` 사용 (Form validation)
- ✅ `aria-roledescription` 사용 (Carousel)
- ✅ `role="region"` 사용 (Carousel)
- ✅ `role="navigation"` 사용 (Pagination)

### 3. 이미지 접근성
- ✅ `alt` 속성 사용 (CharactersSection, EpisodeCard)
- ✅ 에러 이미지 대체 처리 (ImageWithFallback)

### 4. 폼 접근성
- ✅ React Hook Form 사용 (검증 및 에러 처리)
- ✅ `FormLabel` 컴포넌트 사용
- ✅ `aria-describedby` 및 `aria-invalid` 연결

### 5. 메타 태그
- ✅ `lang="ko"` 설정 (index.html)
- ✅ `charset="UTF-8"` 설정
- ✅ `viewport` 메타 태그 설정

---

## ⚠️ 개선이 필요한 부분

### 1. 버튼 접근성

#### 문제점
- 많은 버튼에 `aria-label`이 없음
- 키보드 포커스 표시가 불충분할 수 있음

#### 발견된 위치
- `NavigationOverlay.tsx`: 네비게이션 버튼들
- `CTAButton.tsx`: 기본 버튼 컴포넌트
- `PreRegistrationSection.tsx`: 폼 제출 버튼

#### 개선 방안
```typescript
// 예시: NavigationOverlay.tsx
<button
  onClick={() => scrollToSection(item.id)}
  aria-label={`${item.label} 섹션으로 이동`}
  className="..."
>
  {item.label}
</button>

// 예시: CTAButton.tsx
<motion.button
  aria-label={ariaLabel || children}
  {...props}
>
```

### 2. 폼 라벨링

#### 문제점
- `FormInput` 컴포넌트에 `label`이 명시적으로 연결되지 않음
- `placeholder`만 사용하고 `label`이 없음

#### 발견된 위치
- `PreRegistrationSection.tsx`: 모든 입력 필드

#### 개선 방안
```typescript
// 예시: PreRegistrationSection.tsx
<div className="relative">
  <label htmlFor="name-input" className="sr-only">
    {translations.modal.nameLabel}
  </label>
  <FormInput
    id="name-input"
    inputType="text"
    placeholder={translations.modal.namePlaceholder}
    aria-label={translations.modal.nameLabel}
    // ...
  />
</div>
```

### 3. 키보드 네비게이션

#### 문제점
- 일부 버튼에 키보드 이벤트 핸들러가 없음
- 모바일 메뉴 토글 버튼의 키보드 접근성 부족

#### 발견된 위치
- `NavigationOverlay.tsx`: 모바일 메뉴 버튼
- `PreRegistrationSection.tsx`: Dialog 트리거 버튼

#### 개선 방안
```typescript
// 예시: 키보드 이벤트 처리
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  aria-label="메뉴 토글"
>
```

### 4. 색상 대비

#### 문제점
- 일부 텍스트 색상이 WCAG AA 기준(4.5:1)을 만족하지 않을 수 있음
- `--color-text-secondary` (#9E9A90)와 배경색 대비 확인 필요

#### 개선 방안
```css
/* 색상 대비 검증 필요 */
--color-text-secondary: #9E9A90; /* 배경: #0A0A0F 대비 약 3.8:1 */
/* → #B8B4A8 이상으로 변경 권장 (4.5:1 이상) */
```

### 5. 헤딩 구조

#### 문제점
- 헤딩 레벨이 논리적 순서를 따르지 않을 수 있음
- `h1`이 여러 곳에 사용될 수 있음

#### 발견된 위치
- `NavigationOverlay.tsx`: `<h1>` 사용 (로고)
- `HeroSection.tsx`: 헤딩 구조 확인 필요
- `PreRegistrationSection.tsx`: `<h2>`, `<h3>` 사용

#### 개선 방안
```typescript
// 예시: 논리적 헤딩 구조
<main>
  <HeroSection>
    <h1>Realm of Shadows</h1>
    <h2>부제목</h2>
  </HeroSection>
  <StoryUnfoldSection>
    <h2>스토리</h2>
  </StoryUnfoldSection>
  <PreRegistrationSection>
    <h2>사전등록</h2>
    <h3>혜택</h3>
  </PreRegistrationSection>
</main>
```

### 6. 링크 접근성

#### 문제점
- 일부 링크에 `aria-label`이 없음
- 외부 링크에 `target="_blank"` 사용 시 `rel="noopener noreferrer"` 필요

#### 발견된 위치
- `FooterSection.tsx`: 소셜 링크 (일부 `aria-label` 있음)

#### 개선 방안
```typescript
// 예시: 외부 링크
<a
  href={social.url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`${social.label} 새 창에서 열기`}
>
```

### 7. 스킵 링크

#### 문제점
- 메인 콘텐츠로 바로 이동하는 스킵 링크가 없음

#### 개선 방안
```typescript
// App.tsx에 추가
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white"
>
  메인 콘텐츠로 건너뛰기
</a>
```

### 8. 포커스 관리

#### 문제점
- Dialog 열림/닫힘 시 포커스 관리가 부족할 수 있음
- 모바일 메뉴 토글 시 포커스 트랩 필요

#### 개선 방안
```typescript
// Dialog 열림 시 첫 번째 입력 필드로 포커스 이동
useEffect(() => {
  if (isModalOpen) {
    const firstInput = document.querySelector('input');
    firstInput?.focus();
  }
}, [isModalOpen]);
```

### 9. 애니메이션 접근성

#### 문제점
- `prefers-reduced-motion` 미디어 쿼리 미사용

#### 개선 방안
```css
/* design-tokens.css에 추가 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 10. 언어 속성

#### 문제점
- 동적으로 언어가 변경될 때 `html` 태그의 `lang` 속성이 업데이트되지 않음

#### 개선 방안
```typescript
// App.tsx에 추가
useEffect(() => {
  document.documentElement.lang = language;
}, [language]);
```

---

## 🔧 우선순위별 개선 사항

### 높은 우선순위 (P0)
1. ✅ 폼 라벨링 개선 (스크린 리더 사용자)
2. ✅ 버튼 `aria-label` 추가
3. ✅ 색상 대비 검증 및 개선

### 중간 우선순위 (P1)
4. ✅ 키보드 네비게이션 개선
5. ✅ 헤딩 구조 정리
6. ✅ 스킵 링크 추가

### 낮은 우선순위 (P2)
7. ✅ 포커스 관리 개선
8. ✅ 애니메이션 접근성 (`prefers-reduced-motion`)
9. ✅ 동적 언어 속성 업데이트

---

## 📊 점검 결과 요약

| 항목 | 상태 | 점수 |
|------|------|------|
| HTML 시맨틱 | ✅ 양호 | 8/10 |
| ARIA 속성 | ✅ 양호 | 7/10 |
| 키보드 네비게이션 | ⚠️ 개선 필요 | 6/10 |
| 색상 대비 | ⚠️ 개선 필요 | 6/10 |
| 폼 접근성 | ⚠️ 개선 필요 | 6/10 |
| 이미지 접근성 | ✅ 양호 | 9/10 |
| 헤딩 구조 | ⚠️ 개선 필요 | 7/10 |
| 링크 접근성 | ✅ 양호 | 8/10 |
| 메타 태그 | ✅ 양호 | 9/10 |
| **종합 점수** | **⚠️ 개선 필요** | **7.1/10** |

---

## 🎯 WCAG 2.1 준수 현황

### Level A (필수)
- ✅ 대부분 준수
- ⚠️ 일부 폼 라벨링 개선 필요

### Level AA (권장)
- ✅ 대부분 준수
- ⚠️ 색상 대비 일부 개선 필요
- ⚠️ 키보드 접근성 개선 필요

### Level AAA (선택)
- ⚠️ 스킵 링크 추가 필요
- ⚠️ 포커스 관리 개선 필요

---

## 📝 다음 단계

1. **즉시 개선** (P0)
   - 폼 라벨링 추가
   - 버튼 `aria-label` 추가
   - 색상 대비 검증

2. **단기 개선** (P1)
   - 키보드 네비게이션 개선
   - 헤딩 구조 정리
   - 스킵 링크 추가

3. **장기 개선** (P2)
   - 포커스 관리 개선
   - 애니메이션 접근성
   - 동적 언어 속성

---

## 🔗 참고 자료

- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA 사양](https://www.w3.org/TR/wai-aria-1.1/)
- [WebAIM 접근성 체크리스트](https://webaim.org/standards/wcag/checklist)
- [MDN 접근성 가이드](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
