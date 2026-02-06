import { useState } from 'react';
import { Toaster } from 'sonner';
import { NavigationOverlay } from './components/NavigationOverlay';
import { HeroSection } from './components/HeroSection';
import { StoryUnfoldSection } from './components/StoryUnfoldSection';
import { CharactersSection } from './components/CharactersSection';
import { PreRegistrationSection } from './components/PreRegistrationSection';
import { ReferralTreeSection } from './components/ReferralTreeSection';
import { FooterSection } from './components/FooterSection';
import { Language, translations } from './translations';

export default function App() {
  const [language, setLanguage] = useState<Language>('ko');
  const t = translations[language];

  return (
    <div 
      className="min-h-screen overflow-x-hidden"
      style={{ 
        backgroundColor: 'var(--color-background-deep-black)',
        color: 'var(--color-text-primary)'
      }}
    >
      <NavigationOverlay 
        translations={t.nav} 
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
      
      <main>
        {/* HeroSection - Full viewport cinematic intro */}
        <div id="hero">
          <HeroSection translations={t.hero} />
        </div>
        
        {/* StoryUnfoldSection - Scrolling story chapters */}
        <div id="story">
          <StoryUnfoldSection translations={t.story} />
        </div>
        
        {/* CharactersSection - Episode cards grid */}
        <div id="characters">
          <CharactersSection translations={t.characters} />
        </div>
        
        {/* PreRegistrationSection - Main CTA with form */}
        <div id="registration">
          <PreRegistrationSection translations={t.registration} />
        </div>
        
        {/* ReferralTreeSection - Friend invitation tree */}
        <div id="empire">
          <ReferralTreeSection translations={t.referral} />
        </div>
      </main>

      {/* FooterSection */}
      <FooterSection 
        translations={t.footer} 
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--color-background-panel)',
            color: 'var(--color-primary-gold)',
            border: '1px solid var(--color-border-gold)/30'
          }
        }}
      />
    </div>
  );
}