/**
 * Supabase 연결 테스트 스크립트
 * 
 * 사용법:
 * 1. 브라우저 개발자 도구 콘솔에서 실행
 * 2. 또는 컴포넌트에서 import하여 useEffect에서 실행
 */

import { supabase } from './client';
import { getPreRegistrationStats, getRewardTiers } from './queries';

export async function testSupabaseConnection() {
  console.log('🔍 Supabase 연결 테스트 시작...\n');

  try {
    // 1. 환경 변수 확인
    console.log('1️⃣ 환경 변수 확인');
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      console.error('❌ 환경 변수가 설정되지 않았습니다!');
      console.log('   .env 파일을 확인하세요.');
      return false;
    }
    
    console.log(`✅ URL: ${url}`);
    console.log(`✅ Key: ${key.substring(0, 20)}...`);
    console.log('');

    // 2. 테이블 존재 확인 (users)
    console.log('2️⃣ users 테이블 확인');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (usersError) {
      console.error('❌ users 테이블 접근 실패:', usersError.message);
      console.log('   → 데이터베이스 마이그레이션을 실행하세요.');
      return false;
    }
    console.log('✅ users 테이블 접근 성공');
    console.log('');

    // 3. 통계 테이블 확인
    console.log('3️⃣ 통계 데이터 조회');
    const stats = await getPreRegistrationStats();
    console.log('✅ 통계 조회 성공:', stats);
    console.log('');

    // 4. 보상 티어 확인
    console.log('4️⃣ 보상 티어 데이터 조회');
    const tiers = await getRewardTiers('ko');
    
    if (!tiers || tiers.length === 0) {
      console.warn('⚠️ 보상 티어 데이터가 없습니다.');
      console.log('   → 초기 데이터 삽입 SQL을 실행하세요.');
      return false;
    }
    
    console.log(`✅ 보상 티어 ${tiers.length}개 조회 성공:`);
    tiers.forEach((tier) => {
      console.log(`   - ${tier.tier_translations.ko.title} (${tier.min_referrals}명 이상)`);
    });
    console.log('');

    // 5. 함수 테스트 (추천 코드 생성)
    console.log('5️⃣ 추천 코드 생성 함수 테스트');
    const { data: refCode, error: refCodeError } = await supabase.rpc(
      'generate_referral_code'
    );

    if (refCodeError) {
      console.error('❌ 추천 코드 생성 실패:', refCodeError.message);
      console.log('   → generate_referral_code 함수를 생성하세요.');
      return false;
    }
    
    console.log(`✅ 추천 코드 생성 성공: ${refCode}`);
    console.log('');

    // 최종 결과
    console.log('🎉 모든 테스트 통과!');
    console.log('✅ Supabase 연결 정상');
    console.log('✅ 데이터베이스 스키마 정상');
    console.log('✅ 초기 데이터 정상');
    console.log('✅ 함수 작동 정상');
    console.log('\n준비 완료! 사전등록 기능을 사용할 수 있습니다. 🚀');
    
    return true;
  } catch (error) {
    console.error('❌ 예상치 못한 오류 발생:', error);
    return false;
  }
}

/**
 * 테스트 데이터 생성 (개발용)
 */
export async function createTestUser() {
  console.log('🧪 테스트 사용자 생성 중...');

  try {
    const { data: refCode } = await supabase.rpc('generate_referral_code');

    const testUser = {
      name: '테스트 사용자',
      email: `test${Date.now()}@example.com`,
      nickname: `테스터${Date.now()}`,
      phone: '010-1234-5678',
      language: 'ko' as const,
      referral_code: refCode as string,
    };

    const { data, error } = await supabase
      .from('users')
      .insert(testUser)
      .select()
      .single();

    if (error) {
      console.error('❌ 테스트 사용자 생성 실패:', error.message);
      return null;
    }

    console.log('✅ 테스트 사용자 생성 성공:');
    console.log(`   - ID: ${data.id}`);
    console.log(`   - 이메일: ${data.email}`);
    console.log(`   - 닉네임: ${data.nickname}`);
    console.log(`   - 추천 코드: ${data.referral_code}`);

    return data;
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    return null;
  }
}
