import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  url?: string;
  language?: 'ko' | 'en' | 'ja';
}

export function StructuredData({
  url = 'https://realm-of-shadows.vercel.app',
  language = 'ko',
}: StructuredDataProps) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Realm of Shadows",
    "description": language === 'ko' 
      ? "다크 판타지 게임 Realm of Shadows 사전등록 페이지"
      : language === 'en'
      ? "Dark fantasy game Realm of Shadows pre-registration page"
      : "ダークファンタジーゲーム Realm of Shadows 事前登録ページ",
    "url": url,
    "inLanguage": language,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "Realm of Shadows",
    "description": language === 'ko'
      ? "다크 판타지 RPG 게임. 어둠의 제국을 건설하고 전략적인 전투를 즐기세요."
      : language === 'en'
      ? "Dark fantasy RPG game. Build your dark empire and enjoy strategic battles."
      : "ダークファンタジーRPGゲーム。闇の帝国を築き、戦略的な戦闘を楽しもう。",
    "genre": ["RPG", "Strategy", "Fantasy"],
    "gamePlatform": ["Web", "Mobile"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW",
      "availability": "https://schema.org/PreOrder"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Realm of Shadows",
    "url": url,
    "logo": `${url}/logo.png`,
    "sameAs": [
      // 소셜 미디어 링크 추가 가능
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(gameSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
}
