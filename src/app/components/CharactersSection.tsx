import { motion } from 'motion/react';
import { Sword, Shield, Zap, Crown } from 'lucide-react';
import { EpisodeCard } from './ui/EpisodeCard';
import { toast } from 'sonner';
import { Translations } from '../translations';
import { getABTestGroup } from '../../lib/utils/ab-test';

interface CharactersSectionProps {
  translations: Translations['characters'];
}

export function CharactersSection({ translations }: CharactersSectionProps) {
  // A/B 테스트: 캐릭터 카드 hover 효과 (10% Variant)
  const abTestGroup = getABTestGroup('character-card-hover-effect', 10);
  const isVariant = abTestGroup === 'variant';
  
  // A/B 테스트 상태 로그 (환경 변수로 제어)
  const shouldLog = import.meta.env.VITE_ENABLE_AB_TEST_LOGS === 'true' || import.meta.env.DEV;
  if (shouldLog) {
    console.log(`🎨 [Character Cards] A/B Test 적용:`, {
      testName: 'character-card-hover-effect',
      group: abTestGroup,
      isVariant,
      hoverEffect: isVariant 
        ? 'Variant: 그림자 + 살짝 튀어나오는 효과' 
        : 'Control: 노란색 테두리 효과',
    });
  }
  
  const icons = [
    <Sword className="w-8 h-8" key="sword" />,
    <Shield className="w-8 h-8" key="shield" />,
    <Zap className="w-8 h-8" key="zap" />,
    <Crown className="w-8 h-8" key="crown" />
  ];
  
  const imageUrls = [
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwa25pZ2h0JTIwYXJtb3J8ZW58MXx8fHwxNzM4ODU2NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3RoaWMlMjBxdWVlbiUyMGRhcmt8ZW58MXx8fHwxNzM4ODU2NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1635608478001-4169e5e2bbbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpYyUyMHdpemFyZCUyMGRhcmt8ZW58MXx8fHwxNzM4ODU2NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYXNzYXNzaW58ZW58MXx8fHwxNzM4ODU2NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080'
  ];
  
  const states = ['unlocked-unread', 'unlocked-read', 'locked', 'locked'] as const;

  const handleEpisodeClick = (episode: { title: string; status: string }, index: number) => {
    if (states[index] !== 'locked') {
      toast.info(`"${episode.title}" ${translations.episodes[index].status}`);
    }
  };

  return (
    <section 
      className="relative min-h-screen py-12 sm:py-16 md:py-20 lg:py-[var(--spacing-3xl)] px-4 sm:px-6 md:px-8"
      style={{ 
        background: 'linear-gradient(to bottom, var(--color-background-deep-black), var(--color-accent-red)/3, var(--color-background-deep-black))' 
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-['Cinzel'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-primary-gold)] mb-4 sm:mb-6 md:mb-[var(--spacing-md)] text-center"
          style={{ letterSpacing: '-1px' }}
        >
          {translations.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-[var(--color-text-secondary)] mb-8 sm:mb-12 md:mb-16 lg:mb-[var(--spacing-2xl)] text-sm sm:text-base md:text-lg"
        >
          {translations.subtitle}
        </motion.p>

        {/* Integrated Hero Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-[var(--spacing-lg)]">
          {translations.episodes.map((episode, index) => {
            const stats = [
              { attack: 5, defense: 4, speed: 3 },
              { attack: 4, defense: 3, speed: 5 },
              { attack: 5, defense: 2, speed: 3 },
              { attack: 4, defense: 2, speed: 5 }
            ];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={isVariant ? { scale: 1.05, y: -12 } : undefined}
                onClick={() => states[index] !== 'locked' && handleEpisodeClick(episode, index)}
                className={`relative rounded-xl overflow-hidden ${
                  states[index] === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'
                } group`}
              >
                {/* Unified Card */}
                <div 
                  className={`relative bg-gradient-to-b from-[var(--color-accent-red)]/10 to-[var(--color-background-deep-black)] border-2 transition-all duration-300 ${
                    states[index] === 'unlocked-unread'
                      ? 'border-[var(--color-border-gold)] shadow-[var(--shadow-glow-gold)] hover:border-[var(--color-primary-gold)] hover:shadow-[var(--shadow-glow-gold-intense)]'
                      : states[index] === 'unlocked-read'
                      ? 'border-[var(--color-border-default)]'
                      : 'border-[#3a3a3a]'
                  } ${
                    // Control 그룹: unlocked 카드에 hover 시 노란색 테두리
                    !isVariant && states[index] !== 'locked'
                      ? 'group-hover:border-[var(--color-primary-gold)]'
                      : ''
                  } ${
                    // Variant 그룹: unlocked 카드에 hover 시 그림자 효과
                    isVariant && states[index] !== 'locked'
                      ? 'group-hover:shadow-[var(--shadow-glow-gold-intense)]'
                      : ''
                  }`}
                >
                  {/* Background Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrls[index]}
                      alt={episode.title}
                      className="w-full h-full object-cover transition-transform duration-[var(--transition-slow)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background-deep-black)] via-transparent to-transparent" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-3 left-3 bg-[var(--color-background-deep-black)]/80 backdrop-blur-sm rounded-lg p-2">
                      {icons[index]}
                    </div>

                    {/* Status Badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {states[index] === 'unlocked-unread' && (
                        <span className="bg-[var(--color-accent-red)] text-white text-xs font-bold px-2 py-1 rounded">
                          {translations.episodeCard.newBadge}
                        </span>
                      )}
                      {states[index] === 'locked' && (
                        <span className="bg-[var(--color-background-dark)]/80 backdrop-blur-sm text-[var(--color-text-secondary)] text-xs font-semibold px-2 py-1 rounded">
                          {translations.episodeCard.locked}
                        </span>
                      )}
                    </div>

                    {/* Locked Overlay */}
                    {states[index] === 'locked' && (
                      <div className="absolute inset-0 bg-[var(--color-background-deep-black)]/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl mb-2">🔒</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-5 space-y-4">
                    {/* Episode Info */}
                    <div>
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
                        {episode.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)] mb-2">
                        {episode.status}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                        {episode.description}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border-gold)]/30 to-transparent" />

                    {/* Character Abilities */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {icons[index]}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-[var(--color-primary-gold)]">
                            {translations.characterNames[index]}
                          </h4>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            {translations.characterDescriptions[index]}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[var(--color-text-muted)]">{translations.abilities.attack}</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full transition-all ${
                                  i < stats[index].attack 
                                    ? 'bg-[var(--color-accent-red)] shadow-[0_0_4px_var(--color-accent-red)]' 
                                    : 'bg-[var(--color-background-dark)]'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[var(--color-text-muted)]">{translations.abilities.defense}</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full transition-all ${
                                  i < stats[index].defense 
                                    ? 'bg-[var(--color-primary-gold)] shadow-[0_0_4px_var(--color-primary-gold)]' 
                                    : 'bg-[var(--color-background-dark)]'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[var(--color-text-muted)]">{translations.abilities.speed}</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full transition-all ${
                                  i < stats[index].speed 
                                    ? 'bg-[var(--color-text-secondary)] shadow-[0_0_4px_var(--color-text-secondary)]' 
                                    : 'bg-[var(--color-background-dark)]'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-[var(--spacing-2xl)] text-center"
        >
          <div 
            className="inline-block bg-[var(--color-background-panel)] border border-[var(--color-border-gold)]/30 rounded-lg px-[var(--spacing-lg)] py-[var(--spacing-md)]"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <p className="text-sm text-[var(--color-text-secondary)]">
              {translations.unlockHint}
            </p>
          </div>
        </motion.div>

        {/* Special Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-[120px] text-center bg-gradient-to-r from-[var(--color-accent-red)]/10 via-[var(--color-primary-gold)]/10 to-[var(--color-accent-red)]/10 rounded-2xl p-[var(--spacing-2xl)]"
        >
          <h3 
            className="font-['Cinzel'] text-[var(--text-heading-2)] font-bold text-[var(--color-primary-gold)] mb-[var(--spacing-md)]"
            style={{ letterSpacing: '-1px' }}
          >
            {translations.rewards.title}
          </h3>
          <p className="text-[var(--color-text-secondary)] text-[var(--text-body-large)] mb-[var(--spacing-2xl)] max-w-2xl mx-auto">
            {translations.rewards.subtitle}
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-[var(--spacing-lg)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-lg)] md:gap-0">
              {[
                { icon: '⚔️', ...translations.rewards.items[0] },
                { icon: '💎', ...translations.rewards.items[1] },
                { icon: '✨', ...translations.rewards.items[2] }
              ].map((reward, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="relative p-[var(--spacing-xl)] transition-all duration-[var(--transition-normal)]"
                >
                  <div className="text-6xl mb-[var(--spacing-md)]">{reward.icon}</div>
                  <h4 className="text-[var(--text-heading-4)] font-bold text-[var(--color-primary-gold)] mb-[var(--spacing-sm)]">
                    {reward.name}
                  </h4>
                  <p className="text-[var(--text-body-small)] text-[var(--color-text-secondary)]">
                    {reward.description}
                  </p>
                  
                  {/* Gradient Divider */}
                  {index !== 2 && (
                    <div 
                      className="absolute top-0 right-0 w-0.5 h-full hidden md:block"
                      style={{
                        background: 'linear-gradient(to bottom, transparent, var(--color-border-gold) 50%, transparent)',
                        opacity: 0.5
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}