import { Helmet } from 'react-helmet-async';
import type { Language } from '../translations';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  language?: Language;
  keywords?: string;
}

const defaultTitle = 'Realm of Shadows - Pre-registration';
const defaultDescription = '다크 판타지 게임 Realm of Shadows 사전등록 페이지. 지금 사전등록하고 특별한 보상을 받으세요!';
const defaultImage = 'https://realm-of-shadows.vercel.app/og-image.jpg';
const defaultUrl = 'https://realm-of-shadows.vercel.app';

const languageMap = {
  ko: 'ko_KR',
  en: 'en_US',
  ja: 'ja_JP',
} as const;

export function SEO({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  url = defaultUrl,
  type = 'website',
  language = 'ko',
  keywords = 'Realm of Shadows, 게임, 사전등록, 다크 판타지, RPG, 게임 사전등록, 프리레지스터',
}: SEOProps) {
  const fullTitle = title.includes('Realm of Shadows') ? title : `${title} | Realm of Shadows`;
  const locale = languageMap[language];
  const currentUrl = typeof window !== 'undefined' ? window.location.href : url;

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Realm of Shadows" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="Realm of Shadows" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={currentUrl} />
      
      {/* 다국어 */}
      <link rel="alternate" hreflang="ko" href={`${url}?lang=ko`} />
      <link rel="alternate" hreflang="en" href={`${url}?lang=en`} />
      <link rel="alternate" hreflang="ja" href={`${url}?lang=ja`} />
      <link rel="alternate" hreflang="x-default" href={url} />
    </Helmet>
  );
}
