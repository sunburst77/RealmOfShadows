import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Share2, ChevronDown, Crown, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CTAButton } from './ui/CTAButton';
import { TreeNodeCard } from './ui/TreeNodeCard';
import { Translations, Language } from '../translations';
import { getReferralNetwork, getUserByReferralCode } from '@/lib/supabase';
import type { ReferralNode as ApiReferralNode } from '@/lib/supabase/types';
import { getLocalStorageItem, STORAGE_KEYS } from '@/lib/utils/local-storage';

interface TreeNode {
  id: string;
  nickname: string;
  children: TreeNode[];
  level: number;
}

interface ReferralTreeSectionProps {
  translations: Translations['referral'];
  language: Language;
}

// 사용자 정보 타입
interface StoredUserData {
  userId: string;
  referralCode: string;
  nickname: string;
  email: string;
}

export function ReferralTreeSection({ translations, language }: ReferralTreeSectionProps) {
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [empireSize, setEmpireSize] = useState(0);
  const [directInvites, setDirectInvites] = useState(0);
  const [indirectInvites, setIndirectInvites] = useState(0);

  // 메모리 누수 방지용 ref
  const isMountedRef = useRef(true);

  // 컴포넌트 언마운트 감지
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 로컬 스토리지에서 사용자 정보 로드
  useEffect(() => {
    const loadUserData = () => {
      const stored = getLocalStorageItem<StoredUserData>(STORAGE_KEYS.USER_DATA);
      
      if (stored) {
        setUserData(stored);
        console.log('✅ 사용자 정보 로드:', stored);
      } else {
        console.log('ℹ️ 저장된 사용자 정보 없음');
      }
    };

    loadUserData();
  }, []);

  // 추천 네트워크 로드
  useEffect(() => {
    let cancelled = false;

    async function loadReferralNetwork() {
      if (!userData?.userId) {
        if (!cancelled && isMountedRef.current) {
          setIsLoading(false);
        }
        return;
      }

      if (!cancelled && isMountedRef.current) {
        setIsLoading(true);
      }

      try {
        const result = await getReferralNetwork(userData.userId);

        // 컴포넌트가 언마운트되었거나 취소되었으면 setState 하지 않음
        if (cancelled || !isMountedRef.current) return;

        if (!result.success || !result.network) {
          console.warn('추천 네트워크를 불러오지 못했습니다:', result.error);
          setTreeData(null);
          setIsLoading(false);
          return;
        }

        // API 응답을 UI TreeNode 형식으로 변환
        const convertedTree: TreeNode = {
          id: userData.userId,
          nickname: userData.nickname,
          level: 0,
          children: result.network.map((level1Node) => ({
            id: level1Node.userId,
            nickname: level1Node.nickname,
            level: 1,
            children: (level1Node.children || []).map((level2Node) => ({
              id: level2Node.userId,
              nickname: level2Node.nickname,
              level: 2,
              children: [],
            })),
          })),
        };

        setTreeData(convertedTree);
        setDirectInvites(result.stats?.directInvites || 0);
        setIndirectInvites(result.stats?.indirectInvites || 0);
        setEmpireSize(result.stats?.totalSize || 1);

        console.log('✅ 추천 네트워크 로드 성공:', {
          directInvites: result.stats?.directInvites,
          indirectInvites: result.stats?.indirectInvites,
          totalSize: result.stats?.totalSize,
        });
      } catch (error) {
        console.error('Failed to load referral network:', error);
        if (!cancelled && isMountedRef.current) {
          setTreeData(null);
        }
      } finally {
        if (!cancelled && isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    loadReferralNetwork();

    // Cleanup: 비동기 작업 취소
    return () => {
      cancelled = true;
    };
  }, [userData]);

  // 추천 링크 복사
  const copyReferralLink = () => {
    if (!userData?.referralCode) {
      toast.error(language === 'ko' 
        ? '사전등록을 먼저 완료해주세요' 
        : language === 'en'
        ? 'Please complete pre-registration first'
        : 'まず事前登録を完了してください'
      );
      return;
    }

    const referralLink = `${window.location.origin}?ref=${userData.referralCode}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(referralLink)
        .then(() => {
          toast.success(translations?.copySuccess || '복사되었습니다');
        })
        .catch(() => {
          fallbackCopyTextToClipboard(referralLink);
        });
    } else {
      fallbackCopyTextToClipboard(referralLink);
    }
  };

  // Fallback 복사 메서드
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success(translations.copySuccess);
      } else {
        toast.error(translations?.copyError || '복사 실패');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      toast.error(translations.copyError);
    }

    document.body.removeChild(textArea);
  };

  // 공유 기능
  const shareReferralLink = async () => {
    if (!userData?.referralCode) {
      toast.error(language === 'ko' 
        ? '사전등록을 먼저 완료해주세요' 
        : language === 'en'
        ? 'Please complete pre-registration first'
        : 'まず事前登録を完了してください'
      );
      return;
    }

    const referralLink = `${window.location.origin}?ref=${userData.referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Realm of Shadows',
          text: translations?.shareText || '',
          url: referralLink,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      copyReferralLink();
    }
  };

  // 트리 노드 렌더링 (재귀)
  const renderTreeNode = (node: TreeNode, isRoot = false) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="relative">
        {/* Tree Node Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <TreeNodeCard
            avatar={isRoot ? '👑' : node.level === 1 ? '⚔️' : '🛡️'}
            nickname={node.nickname}
            isRoot={isRoot}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onToggle={() => setIsExpanded(!isExpanded)}
            level={node.level}
          />
        </motion.div>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 ml-8 space-y-4 border-l-2 border-[var(--color-border-gold)]/20 pl-6"
            >
              {node.children.map((child) => renderTreeNode(child, false))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 lg:py-[var(--spacing-3xl)] px-4 sm:px-6 md:px-8"
      style={{
        background: `linear-gradient(to bottom, var(--color-background-deep-black), var(--color-primary-gold)/5, var(--color-background-deep-black))`,
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, var(--color-primary-gold)/10 50px, var(--color-primary-gold)/10 51px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-full mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-[var(--spacing-2xl)]"
        >
          <h2
            className="font-['Cinzel'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-[var(--spacing-md)]"
            style={{
              color: 'var(--color-primary-gold)',
              letterSpacing: '-1px',
            }}
          >
            {translations?.title || '나의 제국'}
          </h2>
          <p className="text-[var(--color-text-primary)] text-sm sm:text-base md:text-lg">
            {translations?.subtitle || '친구를 초대하고 함께 어둠의 군주가 되어라'}
          </p>
        </motion.div>

        {/* Empire Stats */}
        {userData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-[var(--spacing-2xl)]"
          >
            {/* Total Empire Size */}
            <div
              className="bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30 rounded-lg p-6 text-center"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <Crown className="w-12 h-12 text-[var(--color-primary-gold)] mx-auto mb-4" />
              <p className="text-4xl font-bold text-[var(--color-primary-gold)] mb-2">
                {empireSize}
              </p>
              <p className="text-[var(--color-text-secondary)]">{translations?.stats?.empireSize || '제국 규모'}</p>
            </div>

            {/* Direct Invites */}
            <div
              className="bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30 rounded-lg p-6 text-center"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <Users className="w-12 h-12 text-[var(--color-primary-gold)] mx-auto mb-4" />
              <p className="text-4xl font-bold text-[var(--color-primary-gold)] mb-2">
                {directInvites}
              </p>
              <p className="text-[var(--color-text-secondary)]">{translations?.stats?.directInvites || '직접 초대'}</p>
            </div>

            {/* Indirect Invites */}
            <div
              className="bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30 rounded-lg p-6 text-center"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <Users className="w-12 h-12 text-[var(--color-primary-gold)] mx-auto mb-4" />
              <p className="text-4xl font-bold text-[var(--color-primary-gold)] mb-2">
                {indirectInvites}
              </p>
              <p className="text-[var(--color-text-secondary)]">{translations?.stats?.indirectInvites || '간접 초대'}</p>
            </div>
          </motion.div>
        )}

        {/* Referral Link Section */}
        {userData ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30 rounded-lg p-[var(--spacing-xl)] mb-[var(--spacing-2xl)]"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <h3 className="text-2xl text-[var(--color-primary-gold)] font-semibold mb-4">
              {translations?.shareTitle || '친구 초대하기'}
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {translations?.shareDescription || '아래 링크를 공유하여 친구를 초대하세요'}
            </p>

            {/* Referral Code Display */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="flex-1 w-full">
                <div className="bg-[var(--color-background-dark)] border-2 border-[var(--color-border-gold)]/30 rounded-lg px-4 py-3 font-mono text-[var(--color-primary-gold)] text-lg">
                  {window.location.origin}?ref=<span className="font-bold">{userData.referralCode}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <CTAButton type="secondary" size="medium" onClick={copyReferralLink}>
                  <Copy className="w-5 h-5 mr-2" />
                  {translations?.copyButton || '복사'}
                </CTAButton>
                <CTAButton type="primary" size="medium" onClick={shareReferralLink}>
                  <Share2 className="w-5 h-5 mr-2" />
                  {translations?.shareButton || '공유'}
                </CTAButton>
              </div>
            </div>

            {/* Reward Preview */}
            <div className="bg-[var(--color-accent-red)]/10 border border-[var(--color-accent-red)]/30 rounded-lg p-4">
              <p className="text-[var(--color-text-primary)] text-sm">
                💎 <strong>{translations?.rewardPreview?.title || '보상'}:</strong> {translations?.rewardPreview?.description || '친구를 초대하고 보상을 받으세요'}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30 rounded-lg p-[var(--spacing-xl)] mb-[var(--spacing-2xl)] text-center"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <Users className="w-16 h-16 text-[var(--color-primary-gold)] mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl text-[var(--color-primary-gold)] font-semibold mb-4">
              {language === 'ko' ? '사전등록 후 추천 시스템을 이용하세요' : language === 'en' ? 'Complete Pre-Registration to Use Referral System' : '事前登録後、紹介システムをご利用ください'}
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {language === 'ko' 
                ? '사전등록을 완료하면 나만의 추천 코드를 받고 친구를 초대할 수 있습니다.'
                : language === 'en'
                ? 'Complete pre-registration to receive your unique referral code and invite friends.'
                : '事前登録を完了すると、独自の紹介コードを受け取り、友達を招待できます。'
              }
            </p>
            <div className="flex justify-center">
              <CTAButton
                type="primary"
                size="large"
                onClick={() => {
                  const element = document.getElementById('registration');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {language === 'ko' ? '사전등록 하러 가기' : language === 'en' ? 'Go to Pre-Registration' : '事前登録に移動'}
              </CTAButton>
            </div>
          </motion.div>
        )}

        {/* Referral Tree Visualization */}
        {userData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30 rounded-lg p-[var(--spacing-xl)]"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <h3 className="text-2xl text-[var(--color-primary-gold)] font-semibold mb-6">
              {translations?.treeTitle || '추천 트리'}
            </h3>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-[var(--color-primary-gold)] animate-spin" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && (!treeData || treeData.children.length === 0) && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-[var(--color-primary-gold)] mx-auto mb-4 opacity-50" />
                <p className="text-[var(--color-text-secondary)]">
                  {language === 'ko' 
                    ? '아직 초대한 친구가 없습니다. 위의 추천 링크를 공유해보세요!'
                    : language === 'en'
                    ? 'No invited friends yet. Share your referral link above!'
                    : 'まだ招待した友達はいません。上記の紹介リンクを共有してください！'
                  }
                </p>
              </div>
            )}

            {/* Tree Data */}
            {!isLoading && treeData && treeData.children.length > 0 && (
              <div className="space-y-4">{renderTreeNode(treeData, true)}</div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
