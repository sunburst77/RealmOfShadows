import { supabase } from './client';
import type { PreRegistrationResponse, Language } from './types';
import { checkUserExists } from './queries';

export interface PreRegistrationData {
  name: string;
  email: string;
  nickname: string;
  phone?: string;
  language?: Language;
  referredByCode?: string;
}

/**
 * 사전등록 생성 (개선된 중복 체크 및 에러 처리)
 */
export async function createPreRegistration(
  data: PreRegistrationData
): Promise<PreRegistrationResponse> {
  try {
    console.log('🚀 Starting pre-registration process...', {
      email: data.email,
      nickname: data.nickname,
      hasReferralCode: !!data.referredByCode,
    });

    // 1. 중복 체크 (단일 쿼리로 최적화)
    console.log('🔄 Checking for duplicates...');
    const duplicateCheck = await checkUserExists(data.email, data.nickname);
    console.log('✅ Duplicate check result:', duplicateCheck);
    
    if (duplicateCheck.emailExists) {
      throw new Error('이미 등록된 이메일입니다.');
    }
    
    if (duplicateCheck.nicknameExists) {
      throw new Error('이미 사용 중인 닉네임입니다.');
    }

    // 2. 추천 코드 생성
    console.log('🔄 Generating referral code...');
    const { data: refCodeData, error: refCodeError } = await supabase.rpc(
      'generate_referral_code'
    );

    if (refCodeError) {
      console.error('❌ Referral code generation failed:', refCodeError);
      throw refCodeError;
    }

    const referralCode = refCodeData as string;
    console.log('✅ Referral code generated:', referralCode);

    // 3. 추천인 확인 (있는 경우)
    let referredByUserId: string | null = null;
    if (data.referredByCode) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', data.referredByCode.toUpperCase())
        .single();

      if (!referrer) {
        throw new Error('유효하지 않은 추천 코드입니다.');
      }

      referredByUserId = referrer.id;
    }

    // 4. 사용자 생성
    console.log('🔄 Creating user with data:', {
      name: data.name,
      email: data.email.toLowerCase(),
      nickname: data.nickname,
      phone: data.phone || null,
      language: data.language || 'ko',
      referral_code: referralCode,
      referred_by_code: data.referredByCode?.toUpperCase() || null,
      referred_by_user_id: referredByUserId,
    });
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name: data.name,
        email: data.email.toLowerCase(),
        nickname: data.nickname,
        phone: data.phone || null,
        language: data.language || 'ko',
        referral_code: referralCode,
        referred_by_code: data.referredByCode?.toUpperCase() || null,
        referred_by_user_id: referredByUserId,
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ User creation failed:', userError);
      // 중복 에러 처리
      if (userError.code === '23505') {
        if (userError.message.includes('email')) {
          throw new Error('이미 등록된 이메일입니다.');
        }
        if (userError.message.includes('nickname')) {
          throw new Error('이미 사용 중인 닉네임입니다.');
        }
        if (userError.message.includes('referral_code')) {
          // 추천 코드 중복 시 재시도
          return createPreRegistration(data);
        }
      }
      throw userError;
    }

    return {
      success: true,
      user,
      referralCode,
    };
  } catch (error) {
    console.error('❌ Pre-registration failed:', error);
    console.error('❌ Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : '등록에 실패했습니다.',
      stack: error instanceof Error ? error.stack : undefined,
      raw: error,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : '등록에 실패했습니다.',
    };
  }
}

/**
 * 보상 획득 처리
 */
export async function claimReward(userId: string, tierId: string) {
  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .update({
        is_claimed: true,
        claimed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('tier_id', tierId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, reward: data };
  } catch (error) {
    console.error('Failed to claim reward:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to claim reward',
    };
  }
}

/**
 * 사용자 정보 업데이트
 */
export async function updateUserInfo(
  userId: string,
  updates: {
    name?: string;
    nickname?: string;
    phone?: string;
    language?: Language;
  }
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, user: data };
  } catch (error) {
    console.error('Failed to update user info:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user',
    };
  }
}
