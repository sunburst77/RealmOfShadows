import { supabase } from './client';
import type {
  ReferralNetworkResponse,
  ReferralNode,
  UserRewardInfo,
  Language,
  DuplicateCheckResult,
} from './types';

/**
 * 사전등록 통계 조회
 */
export async function getPreRegistrationStats() {
  const { data, error } = await supabase
    .from('pre_registration_stats')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Failed to fetch stats:', error);
    return { totalRegistrations: 0, registrationsToday: 0 };
  }

  return {
    totalRegistrations: data.total_registrations,
    registrationsToday: data.registrations_today,
  };
}

/**
 * 실시간 사전등록 카운트 구독
 */
export function subscribeToRegistrationCount(
  callback: (count: number) => void
) {
  const channel = supabase
    .channel('registration-count')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'pre_registration_stats',
      },
      (payload) => {
        if (payload.new && 'total_registrations' in payload.new) {
          callback(payload.new.total_registrations as number);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * 사용자 추천 네트워크 조회 (개선된 버전)
 */
export async function getReferralNetwork(
  userId: string
): Promise<ReferralNetworkResponse> {
  try {
    // referrals 테이블에서 추천 관계와 피추천인 정보를 JOIN하여 조회
    const { data: referralsData, error: referralsError } = await supabase
      .from('referrals')
      .select(`
        level,
        referee:users!referee_id(
          id,
          email,
          nickname,
          referral_code,
          created_at
        )
      `)
      .eq('referrer_id', userId)
      .order('level', { ascending: true })
      .order('created_at', { ascending: true });

    if (referralsError) throw referralsError;

    // 1차와 2차 추천을 분리하여 트리 구조로 변환
    const level1Map = new Map<string, ReferralNode>();
    const level2ByParent = new Map<string, ReferralNode[]>();

    referralsData?.forEach((rel: any) => {
      const referee = rel.referee;
      const node: ReferralNode = {
        level: rel.level,
        userId: referee.id,
        email: referee.email,
        nickname: referee.nickname,
        referralCode: referee.referral_code,
        createdAt: referee.created_at,
        children: [],
      };

      if (rel.level === 1) {
        level1Map.set(referee.id, node);
      } else if (rel.level === 2) {
        level2ByParent.set(referee.id, [node]);
      }
    });

    // 2차 추천을 1차 추천의 자식으로 연결
    if (level2ByParent.size > 0) {
      const level2Ids = Array.from(level2ByParent.keys());
      const { data: parentData } = await supabase
        .from('users')
        .select('id, referred_by_user_id')
        .in('id', level2Ids);

      parentData?.forEach((parent) => {
        const level2Nodes = level2ByParent.get(parent.id);
        if (level2Nodes && parent.referred_by_user_id) {
          const parentNode = level1Map.get(parent.referred_by_user_id);
          if (parentNode) {
            parentNode.children = [
              ...(parentNode.children || []),
              ...level2Nodes,
            ];
          }
        }
      });
    }

    const level1Nodes = Array.from(level1Map.values());
    const directInvites = level1Nodes.length;
    const indirectInvites = level1Nodes.reduce(
      (sum, node) => sum + (node.children?.length || 0),
      0
    );

    return {
      success: true,
      network: level1Nodes,
      stats: {
        directInvites,
        indirectInvites,
        totalSize: 1 + directInvites + indirectInvites,
      },
    };
  } catch (error) {
    console.error('Failed to fetch referral network:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 사용자 보상 정보 조회
 */
export async function getUserRewardInfo(
  userId: string,
  language: Language = 'ko'
): Promise<UserRewardInfo> {
  try {
    // 캐시된 추천 카운트 사용
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('referral_count_cache')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const referralCount = userData?.referral_count_cache || 0;

    // 모든 티어 가져오기
    const { data: tiers } = await supabase
      .from('reward_tiers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!tiers || tiers.length === 0) {
      return {
        currentTier: null,
        nextTier: null,
        referralCount: 0,
        referralsToNext: 0,
        unlockedRewards: [],
      };
    }

    // 현재 티어 찾기
    const currentTier = [...tiers]
      .reverse()
      .find(
        (tier) =>
          referralCount >= tier.min_referrals &&
          (tier.max_referrals === null || referralCount <= tier.max_referrals)
      );

    // 다음 티어 찾기
    const nextTier =
      tiers.find((tier) => tier.min_referrals > referralCount) || null;

    const referralsToNext = nextTier
      ? nextTier.min_referrals - referralCount
      : 0;

    return {
      currentTier: currentTier || null,
      nextTier,
      referralCount,
      referralsToNext,
      unlockedRewards: currentTier?.rewards || [],
    };
  } catch (error) {
    console.error('Failed to fetch user reward info:', error);
    return {
      currentTier: null,
      nextTier: null,
      referralCount: 0,
      referralsToNext: 0,
      unlockedRewards: [],
    };
  }
}

/**
 * 추천 코드로 사용자 조회
 */
export async function getUserByReferralCode(referralCode: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, nickname, referral_code')
    .eq('referral_code', referralCode.toUpperCase())
    .single();

  if (error) {
    console.error('Failed to fetch user by referral code:', error);
    return null;
  }

  return data;
}

/**
 * 이메일로 users 테이블의 사용자 조회
 */
export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 사용자를 찾을 수 없음
        return null;
      }
      console.error('Failed to fetch user by email:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

/**
 * 이메일 & 닉네임 중복 체크 (단일 쿼리로 최적화)
 */
export async function checkUserExists(
  email: string,
  nickname: string
): Promise<DuplicateCheckResult> {
  const { data, error } = await supabase
    .from('users')
    .select('email, nickname')
    .or(`email.eq.${email.toLowerCase()},nickname.eq.${nickname}`)
    .limit(2);

  if (error) {
    console.error('Failed to check user exists:', error);
    return { emailExists: false, nicknameExists: false };
  }

  return {
    emailExists: data?.some((u) => u.email === email.toLowerCase()) ?? false,
    nicknameExists: data?.some((u) => u.nickname === nickname) ?? false,
  };
}

/**
 * 이메일 중복 확인
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  return data !== null;
}

/**
 * 닉네임 중복 확인
 */
export async function checkNicknameExists(nickname: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('nickname', nickname)
    .single();

  return data !== null;
}

/**
 * 사용자 정보 조회 (ID로)
 */
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Failed to fetch user by ID:', error);
    return null;
  }

  return data;
}

/**
 * 보상 티어 목록 조회
 */
export async function getRewardTiers(language: Language = 'ko') {
  const { data, error } = await supabase
    .from('reward_tiers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Failed to fetch reward tiers:', error);
    return [];
  }

  return data;
}
