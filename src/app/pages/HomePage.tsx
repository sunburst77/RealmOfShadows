/**
 * 홈 페이지 (랜딩 페이지)
 * 기존 App.tsx의 메인 콘텐츠
 */

import { HeroSection } from '../components/HeroSection';
import { StoryUnfoldSection } from '../components/StoryUnfoldSection';
import { CharactersSection } from '../components/CharactersSection';
import { PreRegistrationSection } from '../components/PreRegistrationSection';
import { ReferralTreeSection } from '../components/ReferralTreeSection';
import type { Translations, Language } from '../translations';

interface HomePageProps {
  translations: Translations;
  language: Language;
}

export function HomePage({ translations, language }: HomePageProps) {
  return (
    <main className="relative w-full">
      {/* HeroSection - Full viewport cinematic intro */}
      <div id="hero" className="relative z-0">
        <HeroSection translations={translations.hero} />
      </div>
      
      {/* StoryUnfoldSection - Scrolling story chapters */}
      <div id="story">
        <StoryUnfoldSection translations={translations.story} />
      </div>
      
      {/* CharactersSection - Episode cards grid */}
      <div id="characters">
        <CharactersSection translations={translations.characters} />
      </div>
      
      {/* PreRegistrationSection - Main CTA with form */}
      <div id="registration">
        <PreRegistrationSection translations={translations.registration} language={language} />
      </div>
      
      {/* ReferralTreeSection - Friend invitation tree */}
      <div id="empire">
        <ReferralTreeSection translations={translations.referral} language={language} />
      </div>
    </main>
  );
}
