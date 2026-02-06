import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Share2, ChevronDown, Crown, Users } from 'lucide-react';
import { toast } from 'sonner';
import { CTAButton } from './ui/CTAButton';
import { Translations } from '../translations';

interface TreeNode {
  id: string;
  avatar: string;
  nickname: string;
  children: TreeNode[];
  level: number;
}

const getMockTreeData = (translations: Translations['referral']): TreeNode => ({
  id: 'you',
  nickname: translations.rootNickname,
  avatar: '👑',
  level: 0,
  children: [
    {
      id: '1',
      nickname: translations.mockFriends.friendA,
      avatar: '⚔️',
      level: 1,
      children: [
        { id: '1-1', nickname: translations.mockFriends.friendA1, avatar: '🛡️', level: 2, children: [] },
        { id: '1-2', nickname: translations.mockFriends.friendA2, avatar: '🗡️', level: 2, children: [] }
      ]
    },
    {
      id: '2',
      nickname: translations.mockFriends.friendB,
      avatar: '🏹',
      level: 1,
      children: [
        { id: '2-1', nickname: translations.mockFriends.friendB1, avatar: '⚡', level: 2, children: [] }
      ]
    },
    {
      id: '3',
      nickname: translations.mockFriends.friendC,
      avatar: '🔮',
      level: 1,
      children: []
    }
  ]
});

interface ReferralTreeSectionProps {
  translations: Translations['referral'];
}

export function ReferralTreeSection({ translations }: ReferralTreeSectionProps) {
  const [referralLink] = useState('https://realmofshadows.com/invite/abc123xyz');
  const mockTreeData = getMockTreeData(translations);
  const empireSize = 1 + mockTreeData.children.length + 
    mockTreeData.children.reduce((acc, child) => acc + child.children.length, 0);

  const copyReferralLink = () => {
    // Try modern clipboard API first, fallback to older method
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(referralLink)
        .then(() => {
          toast.success(translations.copySuccess);
        })
        .catch(() => {
          // Fallback to older method
          fallbackCopyTextToClipboard(referralLink);
        });
    } else {
      // Use fallback method
      fallbackCopyTextToClipboard(referralLink);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      toast.success(translations.copySuccess);
    } catch (err) {
      toast.error(translations.copyFailed);
    }
    
    document.body.removeChild(textArea);
  };

  const shareToSocial = (platform: string) => {
    toast.info(`${platform}${translations.shareToast}`);
  };

  const directInvites = mockTreeData.children.length;
  const indirectInvites = mockTreeData.children.reduce((acc, child) => acc + child.children.length, 0);

  return (
    <section 
      className="relative min-h-screen py-[var(--spacing-3xl)] px-4"
      style={{ 
        background: 'linear-gradient(to bottom, var(--color-background-deep-black), var(--color-primary-gold)/3, var(--color-background-deep-black))' 
      }}
    >
      <div className="max-w-7xl mx-auto space-y-[var(--spacing-2xl)]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 
            className="font-['Cinzel'] text-[var(--text-heading-1)] font-bold text-[var(--color-primary-gold)] mb-[var(--spacing-md)] text-center"
            style={{ letterSpacing: '-1px' }}
          >
            {translations.title}
          </h2>
          <p className="text-[var(--text-body-large)] text-[var(--color-text-secondary)] mb-[var(--spacing-2xl)] text-center max-w-2xl mx-auto">
            {translations.subtitle}
          </p>
        </motion.div>

        {/* Stats Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-lg)]"
        >
          {/* Total Empire Size */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-[var(--color-primary-gold)]/20 to-[var(--color-background-panel)] border border-[var(--color-border-gold)]/50 rounded-xl p-5 backdrop-blur-sm hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] transition-all"
          >
            <div className="flex items-center gap-4">
              <Crown className="w-10 h-10 text-[var(--color-primary-gold)]" />
              <div className="flex-1">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl font-bold font-mono text-[var(--color-primary-gold)] mb-1"
                >
                  {empireSize}
                </motion.div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{translations.empireSizeLabel}</p>
              </div>
            </div>
          </motion.div>

          {/* Direct Invites */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-[var(--color-background-panel)] border border-[var(--color-border-gold)]/30 rounded-xl p-5 backdrop-blur-sm hover:border-[var(--color-border-gold)]/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.2)] transition-all"
          >
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 text-[var(--color-primary-gold)]" />
              <div className="flex-1">
                <div className="text-3xl font-bold font-mono text-[var(--color-text-primary)] mb-1">
                  {directInvites}
                </div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">{translations.directInvitesLabel}</p>
              </div>
            </div>
          </motion.div>

          {/* Indirect Invites */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-[var(--color-background-panel)] border border-[var(--color-border-gold)]/20 rounded-xl p-5 backdrop-blur-sm hover:border-[var(--color-border-gold)]/40 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition-all"
          >
            <div className="flex items-center gap-4">
              <Share2 className="w-10 h-10 text-[var(--color-primary-gold)]/70" />
              <div className="flex-1">
                <div className="text-3xl font-bold font-mono text-[var(--color-text-secondary)] mb-1">
                  {indirectInvites}
                </div>
                <p className="text-sm font-medium text-[var(--color-text-muted)]">{translations.level2Label}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Invite Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div 
            className="bg-[var(--color-background-panel)] rounded-2xl p-[var(--spacing-xl)]"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <h3 className="text-[var(--text-heading-3)] font-bold text-[var(--color-primary-gold)] mb-[var(--spacing-lg)] flex items-center gap-3">
              <Copy className="w-6 h-6" />
              {translations.inviteLinkLabel}
            </h3>
            
            <div className="flex gap-4 flex-col sm:flex-row mb-[var(--spacing-lg)]">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-5 py-4 bg-[var(--color-background-dark)] border-2 border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] font-mono text-base focus:border-[var(--color-border-gold)] focus:outline-none transition-colors"
              />
              <CTAButton
                type="secondary"
                size="medium"
                onClick={copyReferralLink}
                className="sm:w-auto"
              >
                <Copy className="w-5 h-5" />
                {translations.copyButton}
              </CTAButton>
            </div>

            {/* Social Share Buttons */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {['Twitter', 'Facebook', 'KakaoTalk'].map((platform) => (
                <motion.button
                  key={platform}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToSocial(platform)}
                  className="px-5 py-3 bg-[var(--color-background-dark)] hover:bg-[var(--color-primary-gold)]/10 border-2 border-[var(--color-border-gold)]/30 hover:border-[var(--color-border-gold)] rounded-lg text-[var(--color-primary-gold)] text-base font-semibold transition-all duration-[var(--transition-normal)] flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  {platform}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Network & Progress Container */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div 
            className="relative bg-[var(--color-background-panel)]/50 backdrop-blur-sm rounded-2xl p-[var(--spacing-xl)]"
            style={{ boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.2)' }}
          >
            {/* Section Title */}
            <div className="mb-[var(--spacing-xl)] text-center">
              <h3 className="font-['Cinzel'] text-[var(--text-heading-2)] font-bold text-[var(--color-primary-gold)] mb-[var(--spacing-sm)] flex items-center justify-center gap-3">
                <Users className="w-8 h-8" />
                {translations.networkTitle}
              </h3>
              <p className="text-[var(--text-body-large)] text-[var(--color-text-secondary)]">
                {translations.networkSubtitle}
              </p>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-xl)]">
              {/* Left Column - Profile & Progress */}
              <div className="space-y-[var(--spacing-xl)]">
                {/* Your Profile Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <div className="relative bg-gradient-to-br from-[var(--color-primary-gold)] to-[var(--color-primary-gold-dark)] rounded-2xl p-[var(--spacing-xl)] overflow-hidden shadow-[0_8px_30px_rgba(212,175,55,0.5)]">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-background-deep-black)] rounded-full blur-3xl" />
                    </div>

                    {/* Crown Icon */}
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0], y: [0, -4, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute top-6 right-6"
                    >
                      <Crown className="w-10 h-10 text-[var(--color-background-deep-black)]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                    </motion.div>

                    <div className="relative flex items-center gap-6">
                      <div className="text-6xl">{mockTreeData.avatar}</div>
                      <div className="flex-1">
                        <div className="inline-block px-3 py-1 bg-[var(--color-background-deep-black)]/20 rounded-full mb-2">
                          <p className="text-xs font-semibold text-[var(--color-background-deep-black)]/70 uppercase tracking-wide">
                            {translations.rootNickname}
                          </p>
                        </div>
                        <h4 className="text-3xl font-bold text-[var(--color-background-deep-black)] mb-3">
                          {mockTreeData.nickname}
                        </h4>
                        <div className="flex items-center gap-2 text-[var(--color-background-deep-black)]/80">
                          <Users className="w-5 h-5" />
                          <span className="text-base font-semibold">
                            {translations.totalInvited}: <span className="text-xl">{empireSize - 1}</span>{translations.treeNode.peopleCountUnit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Progress Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="bg-gradient-to-br from-[var(--color-primary-gold)]/5 to-transparent rounded-xl p-[var(--spacing-lg)]">
                    <h4 className="text-[var(--text-heading-3)] font-bold text-[var(--color-primary-gold)] mb-[var(--spacing-lg)] flex items-center gap-3">
                      <ChevronDown className="w-6 h-6" />
                      {translations.progress.title}
                    </h4>
                    <div className="space-y-[var(--spacing-md)]">
                      {/* Progress Item 1 */}
                      <div className="flex items-center justify-between p-5 bg-[var(--color-background-panel)] rounded-lg">
                        <span className="text-[var(--text-body-large)] text-[var(--color-text-primary)] font-medium">
                          {translations.progress.inviteGoal} 1{translations.progress.peopleCount}
                        </span>
                        <span className="text-[var(--color-primary-gold)] font-bold flex items-center gap-2">
                          <div className="w-7 h-7 bg-[var(--color-primary-gold)] rounded-full flex items-center justify-center text-[var(--color-background-deep-black)] text-sm">
                            ✓
                          </div>
                          {translations.progress.completed}
                        </span>
                      </div>

                      {/* Progress Item 2 */}
                      <div className="flex items-center justify-between p-5 bg-[var(--color-background-panel)] rounded-lg">
                        <span className="text-[var(--text-body-large)] text-[var(--color-text-primary)] font-medium">
                          {translations.progress.inviteGoal} 3{translations.progress.peopleCount}
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="w-36 h-2.5 bg-[var(--color-background-dark)] rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '66%' }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-[var(--color-primary-gold)] to-[var(--color-primary-gold-light)] rounded-full"
                            />
                          </div>
                          <span className="text-[var(--color-primary-gold)] font-bold text-base min-w-[45px]">
                            2/3
                          </span>
                        </div>
                      </div>

                      {/* Progress Item 3 */}
                      <div className="flex items-center justify-between p-5 bg-[var(--color-background-panel)]/50 rounded-lg">
                        <span className="text-[var(--text-body-large)] text-[var(--color-text-secondary)] font-medium">
                          {translations.progress.inviteGoal} 5{translations.progress.peopleCount}
                        </span>
                        <span className="text-[var(--color-text-muted)] font-bold text-base">0/5</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Friends List */}
              {mockTreeData.children.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-[var(--spacing-lg)]">
                    <div className="w-1.5 h-10 bg-gradient-to-b from-[var(--color-primary-gold)] to-transparent rounded-full" />
                    <h4 className="text-[var(--text-heading-3)] font-bold text-[var(--color-primary-gold)]">
                      {translations.directInvitesLabel} <span className="text-[var(--color-text-secondary)] font-normal text-[var(--text-body-large)]">
                        ({mockTreeData.children.length}{translations.treeNode.peopleCountUnit})
                      </span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 gap-[var(--spacing-lg)]">
                  {mockTreeData.children.map((friend, index) => {
                    const subFriends = friend.children.length;
                    return (
                      <motion.div
                        key={friend.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index, type: "spring" }}
                        whileHover={{ scale: 1.03, y: -8 }}
                        className="bg-[var(--color-background-panel)] border border-[var(--color-primary-gold)]/30 rounded-xl p-5 hover:border-[var(--color-primary-gold)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{friend.avatar}</div>
                            <div>
                              <p className="font-semibold text-[var(--color-text-primary)]">
                                {friend.nickname}
                              </p>
                              <p className="text-xs text-[var(--color-text-muted)]">
                                {translations.level1Label}
                              </p>
                            </div>
                          </div>
                          {subFriends > 0 && (
                            <div className="bg-[var(--color-primary-gold)]/20 text-[var(--color-primary-gold)] px-2 py-1 rounded-full text-xs font-bold">
                              +{subFriends}
                            </div>
                          )}
                        </div>

                        {/* Sub Friends */}
                        {subFriends > 0 && (
                          <div className="pt-3 border-t border-[var(--color-border-gold)]/10">
                            <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                              {translations.level2Label} ({subFriends}{translations.treeNode.peopleCountUnit})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {friend.children.map((subFriend) => (
                                <div
                                  key={subFriend.id}
                                  className="flex items-center gap-1 bg-[var(--color-background-dark)] px-2 py-1 rounded-md"
                                >
                                  <span className="text-sm">{subFriend.avatar}</span>
                                  <span className="text-xs text-[var(--color-text-secondary)]">
                                    {subFriend.nickname}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}