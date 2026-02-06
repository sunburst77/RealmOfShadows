/**
 * Empire 페이지 (로그인 후 메인 페이지)
 * 사용자 대시보드, 프로필, 보상, 추천 네트워크
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Award, 
  Copy, 
  CheckCircle,
  TrendingUp,
  Gift,
  Network
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { getUserRewardInfo, getReferralNetwork } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Translations } from '../translations';
import type { UserRewardInfo, ReferralNetworkResponse } from '@/lib/supabase/types';
import { ReferralTreeSection } from '../components/ReferralTreeSection';

interface EmpirePageProps {
  translations: Translations['empire'];
  referralTranslations: Translations['referral'];
  language: 'ko' | 'en' | 'ja';
}

export function EmpirePage({ translations, referralTranslations, language }: EmpirePageProps) {
  const { user } = useAuth();
  const [rewardInfo, setRewardInfo] = useState<UserRewardInfo | null>(null);
  const [networkData, setNetworkData] = useState<ReferralNetworkResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      if (!user?.id) return;

      try {
        setLoading(true);

        // 사용자 보상 정보 로드
        const rewardData = await getUserRewardInfo(user.id);
        setRewardInfo(rewardData);

        // 추천 네트워크 로드
        const network = await getReferralNetwork(user.id);
        setNetworkData(network);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  const handleCopyReferralCode = async () => {
    if (!rewardInfo?.user.referral_code) return;

    try {
      await navigator.clipboard.writeText(rewardInfo.user.referral_code);
      setCopiedCode(true);
      toast.success(translations.profile.codeCopied);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error('코드 복사 실패:', error);
      toast.error('코드 복사에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-background-deep-black)',
          color: 'var(--color-text-primary)',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--color-primary-gold)' }}
          />
          <p className="text-lg opacity-70">Loading...</p>
        </motion.div>
      </div>
    );
  }

  const directInvites = networkData?.stats.directInvites || 0;
  const indirectInvites = networkData?.stats.indirectInvites || 0;
  const totalInvites = directInvites + indirectInvites;

  return (
    <div
      className="min-h-screen py-20 px-4"
      style={{
        backgroundColor: 'var(--color-background-deep-black)',
        color: 'var(--color-text-primary)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: 'var(--color-primary-gold)' }}
          >
            {translations.title}
          </h1>
          <p className="text-xl opacity-80">
            {translations.welcomeMessage}, {rewardInfo?.user.nickname || user?.email}!
          </p>
          <p className="text-lg opacity-60 mt-2">
            {translations.subtitle}
          </p>
        </motion.div>

        {/* 대시보드 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* 총 초대 */}
          <StatCard
            icon={<Users className="w-8 h-8" />}
            label={translations.dashboard.stats.totalInvites}
            value={totalInvites}
            color="var(--color-primary-gold)"
          />

          {/* 직접 초대 */}
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            label={translations.dashboard.stats.directInvites}
            value={directInvites}
            color="var(--color-accent-emerald)"
          />

          {/* 간접 초대 */}
          <StatCard
            icon={<Network className="w-8 h-8" />}
            label={translations.dashboard.stats.indirectInvites}
            value={indirectInvites}
            color="var(--color-accent-crimson)"
          />

          {/* 현재 등급 */}
          <StatCard
            icon={<Award className="w-8 h-8" />}
            label={translations.dashboard.stats.currentTier}
            value={rewardInfo?.currentTier.name || '-'}
            color="var(--color-primary-gold)"
          />
        </motion.div>

        {/* 프로필 & 보상 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* 프로필 카드 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-background-panel)',
              borderColor: 'var(--color-border-gold)',
            }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: 'var(--color-primary-gold)' }}
            >
              {translations.profile.title}
            </h2>

            <div className="space-y-4">
              <ProfileItem
                label={translations.profile.nickname}
                value={rewardInfo?.user.nickname || '-'}
              />
              <ProfileItem
                label={translations.profile.email}
                value={rewardInfo?.user.email || user?.email || '-'}
              />
              <ProfileItem
                label={translations.profile.referralCode}
                value={
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg"
                      style={{ color: 'var(--color-primary-gold)' }}
                    >
                      {rewardInfo?.user.referral_code || '-'}
                    </span>
                    <button
                      onClick={handleCopyReferralCode}
                      className="p-2 rounded hover:bg-opacity-20 transition-all"
                      style={{ backgroundColor: 'var(--color-primary-gold)' }}
                    >
                      {copiedCode ? (
                        <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-accent-emerald)' }} />
                      ) : (
                        <Copy className="w-5 h-5" style={{ color: 'var(--color-primary-gold)' }} />
                      )}
                    </button>
                  </div>
                }
              />
              <ProfileItem
                label={translations.profile.joinedDate}
                value={rewardInfo?.user.created_at 
                  ? new Date(rewardInfo.user.created_at).toLocaleDateString(language)
                  : '-'
                }
              />
            </div>
          </motion.div>

          {/* 보상 카드 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-background-panel)',
              borderColor: 'var(--color-border-gold)',
            }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: 'var(--color-primary-gold)' }}
            >
              {translations.rewards.title}
            </h2>

            <p className="text-sm opacity-70 mb-6">
              {translations.rewards.subtitle}
            </p>

            {rewardInfo && rewardInfo.rewards.length > 0 ? (
              <div className="space-y-4">
                {rewardInfo.rewards.map((reward, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.05)',
                      borderColor: 'var(--color-border-gold)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Gift className="w-6 h-6" style={{ color: 'var(--color-primary-gold)' }} />
                      <div>
                        <p className="font-semibold">{reward.name}</p>
                        <p className="text-sm opacity-70">{reward.description}</p>
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                      style={{
                        backgroundColor: reward.claimed 
                          ? 'rgba(212, 175, 55, 0.2)' 
                          : 'var(--color-primary-gold)',
                        color: reward.claimed 
                          ? 'var(--color-primary-gold)' 
                          : 'var(--color-background-deep-black)',
                      }}
                      disabled={reward.claimed}
                    >
                      {reward.claimed ? translations.rewards.claimedButton : translations.rewards.claimButton}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 opacity-50">
                <Gift className="w-16 h-16 mx-auto mb-4" />
                <p>{translations.rewards.noRewards}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* 추천 네트워크 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ReferralTreeSection translations={referralTranslations} language={language} />
        </motion.div>

        {/* 사전등록 하러 가기 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="/#registration"
            className="w-full flex items-center justify-center py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, var(--color-primary-gold-dark) 0%, #92400e 100%)',
              color: 'var(--color-text-primary)',
              boxShadow: '0 0 30px var(--color-glow-gold)',
            }}
          >
            {translations.goToRegistration}
          </a>
        </motion.div>
      </div>
    </div>
  );
}

// 통계 카드 컴포넌트
function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  color: string;
}) {
  return (
    <div
      className="p-6 rounded-lg border transition-all hover:scale-105"
      style={{
        backgroundColor: 'var(--color-background-panel)',
        borderColor: 'var(--color-border-gold)',
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div style={{ color }}>{icon}</div>
        <p className="text-sm opacity-70">{label}</p>
      </div>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

// 프로필 항목 컴포넌트
function ProfileItem({ 
  label, 
  value 
}: { 
  label: string; 
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-opacity-20"
      style={{ borderColor: 'var(--color-border-gold)' }}
    >
      <span className="text-sm opacity-70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
