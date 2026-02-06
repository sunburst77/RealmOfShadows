export type Language = 'ko' | 'en' | 'ja';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          nickname: string;
          name: string;
          phone: string | null;
          language: Language;
          referral_code: string;
          referred_by_code: string | null;
          referred_by_user_id: string | null;
          referral_count_cache: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          nickname: string;
          name: string;
          phone?: string | null;
          language?: Language;
          referral_code: string;
          referred_by_code?: string | null;
          referred_by_user_id?: string | null;
          referral_count_cache?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          nickname?: string;
          name?: string;
          phone?: string | null;
          language?: Language;
          referral_count_cache?: number;
          updated_at?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referee_id: string;
          level: 1 | 2;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referee_id: string;
          level?: 1 | 2;
          created_at?: string;
        };
      };
      reward_tiers: {
        Row: {
          id: string;
          tier_name: string;
          min_referrals: number;
          max_referrals: number | null;
          rewards: RewardItem[];
          unlocked_episodes: number[];
          tier_translations: TierTranslations;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
      };
      user_rewards: {
        Row: {
          id: string;
          user_id: string;
          tier_id: string;
          is_claimed: boolean;
          claimed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier_id: string;
          is_claimed?: boolean;
          claimed_at?: string | null;
          created_at?: string;
        };
      };
      pre_registration_stats: {
        Row: {
          id: string;
          total_registrations: number;
          registrations_today: number;
          last_updated: string;
          date: string;
        };
      };
    };
    Functions: {
      generate_referral_code: {
        Returns: string;
      };
      get_referral_network: {
        Args: { user_uuid: string };
        Returns: {
          level: number;
          user_id: string;
          email: string;
          nickname: string;
          referral_code: string;
          created_at: string;
        }[];
      };
      calculate_user_tier: {
        Args: { user_uuid: string };
        Returns: string | null;
      };
    };
  };
}

// 보상 아이템 타입
export interface RewardItem {
  type: 'weapon' | 'currency' | 'skin' | 'mount' | 'title';
  name: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'divine' | 'unique';
  amount?: number;
}

// 티어 번역
export interface TierTranslations {
  ko: { title: string; description: string };
  en: { title: string; description: string };
  ja: { title: string; description: string };
}

// API 응답 타입
export interface PreRegistrationResponse {
  success: boolean;
  user?: Database['public']['Tables']['users']['Row'];
  referralCode?: string;
  error?: string;
}

export interface ReferralNetworkResponse {
  success: boolean;
  network?: ReferralNode[];
  stats?: {
    directInvites: number;
    indirectInvites: number;
    totalSize: number;
  };
  error?: string;
}

export interface ReferralNode {
  level: number;
  userId: string;
  email: string;
  nickname: string;
  referralCode: string;
  createdAt: string;
  children?: ReferralNode[];
}

export interface UserRewardInfo {
  currentTier: Database['public']['Tables']['reward_tiers']['Row'] | null;
  nextTier: Database['public']['Tables']['reward_tiers']['Row'] | null;
  referralCount: number;
  referralsToNext: number;
  unlockedRewards: RewardItem[];
}

export interface DuplicateCheckResult {
  emailExists: boolean;
  nicknameExists: boolean;
}
