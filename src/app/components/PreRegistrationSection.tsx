import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle, Sparkles, User, Phone, GamepadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { CTAButton } from './ui/CTAButton';
import { FormInput } from './ui/FormInput';
import { RealTimeCounter } from './ui/RealTimeCounter';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Translations, Language } from '../translations';
import { registrationAPI } from '@/lib/services';
import { useLoading } from '@/lib/hooks/use-loading';
import { extractReferralCodeFromURL } from '@/lib/services/security';

interface PreRegistrationSectionProps {
  translations: Translations['registration'];
  language: Language;
}

interface FormData {
  name: string;
  email: string;
  nickname: string;
  phone: string;
}

export function PreRegistrationSection({ translations, language }: PreRegistrationSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [userReferralCode, setUserReferralCode] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    nickname: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { isLoading, withLoading } = useLoading();

  // 메모리 누수 방지용 ref
  const isMountedRef = useRef(true);

  // 컴포넌트 언마운트 감지
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // API 언어 설정
  useEffect(() => {
    registrationAPI.setLanguage(language);
  }, [language]);

  // URL에서 추천 코드 추출 (보안 처리 포함)
  useEffect(() => {
    const refCode = extractReferralCodeFromURL();
    if (refCode) {
      console.log('✅ 추천 코드 감지:', refCode);
    }
  }, []);

  // 실시간 필드 검증
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 입력 중 에러 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // 실시간 검증 (debounce 없이 즉시)
    if (value.length > 2) {
      const error = registrationAPI.validateField(field, value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    }
  };

  // 비동기 중복 체크 (이메일)
  const handleEmailBlur = async () => {
    if (!formData.email || errors.email) return;

    try {
      const isAvailable = await registrationAPI.checkEmailAvailability(formData.email);
      
      // 컴포넌트가 언마운트되었으면 setState 하지 않음
      if (!isMountedRef.current) return;
      
      if (!isAvailable) {
        setErrors(prev => ({ ...prev, email: '이미 등록된 이메일입니다.' }));
      }
    } catch (error) {
      console.error('Email check failed:', error);
    }
  };

  // 비동기 중복 체크 (닉네임)
  const handleNicknameBlur = async () => {
    if (!formData.nickname || errors.nickname) return;

    try {
      const isAvailable = await registrationAPI.checkNicknameAvailability(formData.nickname);
      
      // 컴포넌트가 언마운트되었으면 setState 하지 않음
      if (!isMountedRef.current) return;
      
      if (!isAvailable) {
        setErrors(prev => ({ ...prev, nickname: '이미 사용 중인 닉네임입니다.' }));
      }
    } catch (error) {
      console.error('Nickname check failed:', error);
    }
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 개인정보 동의 체크
    if (!agreedToPolicy) {
      toast.error(translations.policyAgreementError);
      return;
    }

    // 사전등록 실행 (모든 검증 자동 처리)
    const result = await withLoading(
      () => registrationAPI.register({
        name: formData.name,
        email: formData.email,
        nickname: formData.nickname,
        phone: formData.phone,
        agreeToPolicy: agreedToPolicy,
      }),
      translations.modal.processingText
    );

    // 컴포넌트가 언마운트되었으면 setState 하지 않음
    if (!isMountedRef.current) return;

    if (!result.success) {
      // 에러 처리
      const errorMessage = result.error?.userMessage || translations.errorMessage;
      toast.error(errorMessage);

      // 필드별 에러 표시
      if (result.error?.code === 'EMAIL_ALREADY_EXISTS') {
        setErrors({ ...errors, email: errorMessage });
      } else if (result.error?.code === 'NICKNAME_ALREADY_EXISTS') {
        setErrors({ ...errors, nickname: errorMessage });
      }

      return;
    }

    // 성공 처리
    console.log('✅ 사전등록 성공:', {
      userId: result.user?.id,
      referralCode: result.referralCode,
    });

    setUserReferralCode(result.referralCode || '');
    setIsSubmitted(true);
    setIsModalOpen(false);

    toast.success(translations.registrationSuccess, {
      description: translations.confirmationEmailSent,
    });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 lg:py-[var(--spacing-3xl)] px-4 sm:px-6 md:px-8"
      style={{ 
        background: `linear-gradient(to bottom, var(--color-background-deep-black), var(--color-accent-red)/5, var(--color-background-deep-black))` 
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-primary-gold)/10 2px, var(--color-primary-gold)/10 4px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-full sm:max-w-xl md:max-w-2xl w-full mx-auto">
        {/* Real-Time Counter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mb-[var(--spacing-xl)]"
        >
          <RealTimeCounter 
            size="featured" 
            label={translations.counterLabel} 
            showTrend 
            language={language}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 
                className="font-['Cinzel'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6 md:mb-[var(--spacing-lg)]"
                style={{ 
                  color: 'var(--color-primary-gold)',
                  letterSpacing: '-1px'
                }}
              >
                {translations.title}
              </h2>
              <p className="text-center text-[var(--color-text-primary)] mb-6 sm:mb-8 md:mb-[var(--spacing-xl)] text-sm sm:text-base md:text-lg">
                {translations.subtitle}
              </p>

              {/* Benefits Card */}
              <div 
                className="bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30 rounded-lg p-[var(--spacing-lg)] mb-[var(--spacing-xl)]"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <h3 className="text-xl text-[var(--color-primary-gold)] font-semibold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  {translations.benefits.title}
                </h3>
                <ul className="space-y-2">
                  {translations.benefits.items.map((item, index) => (
                    <li key={index} className="text-[var(--color-text-primary)] flex items-start">
                      <CheckCircle className="w-5 h-5 text-[var(--color-primary-gold)] mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pre-Registration Modal */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <CTAButton
                    type="primary"
                    size="large"
                    className="w-full"
                    disabled={isLoading}
                    ariaLabel={translations.openModalButton}
                  >
                    {translations.openModalButton}
                  </CTAButton>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-['Cinzel'] text-2xl text-[var(--color-primary-gold)]">
                      {translations.modal.title}
                    </DialogTitle>
                    <DialogDescription className="text-[var(--color-text-secondary)]">
                      {translations.modal.description}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Name */}
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary-gold)] z-10" aria-hidden="true" />
                      <FormInput
                        inputType="text"
                        inputSize="medium"
                        label={translations.modal.nameLabel || translations.modal.namePlaceholder}
                        placeholder={translations.modal.namePlaceholder}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        error={errors.name}
                        className="pl-11"
                        required
                        disabled={isLoading}
                        aria-label={translations.modal.nameLabel || translations.modal.namePlaceholder}
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary-gold)] z-10" aria-hidden="true" />
                      <FormInput
                        inputType="email"
                        inputSize="medium"
                        label={translations.form.emailLabel || translations.form.emailPlaceholder}
                        placeholder={translations.form.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={handleEmailBlur}
                        error={errors.email}
                        className="pl-11"
                        required
                        disabled={isLoading}
                        aria-label={translations.form.emailLabel || translations.form.emailPlaceholder}
                      />
                    </div>

                    {/* Nickname */}
                    <div className="relative">
                      <GamepadIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary-gold)] z-10" aria-hidden="true" />
                      <FormInput
                        inputType="text"
                        inputSize="medium"
                        label={translations.form.nicknameLabel || translations.form.nicknamePlaceholder}
                        placeholder={translations.form.nicknamePlaceholder}
                        value={formData.nickname}
                        onChange={(e) => handleInputChange('nickname', e.target.value)}
                        onBlur={handleNicknameBlur}
                        error={errors.nickname}
                        className="pl-11"
                        required
                        disabled={isLoading}
                        aria-label={translations.form.nicknameLabel || translations.form.nicknamePlaceholder}
                      />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary-gold)] z-10" aria-hidden="true" />
                      <FormInput
                        inputType="tel"
                        inputSize="medium"
                        label={translations.modal.phonePlaceholder}
                        placeholder={translations.modal.phonePlaceholder}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        error={errors.phone}
                        className="pl-11"
                        disabled={isLoading}
                        aria-label={translations.modal.phonePlaceholder}
                      />
                    </div>

                    {/* Privacy Policy Agreement */}
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="privacy-consent-modal"
                        checked={agreedToPolicy}
                        onChange={(e) => setAgreedToPolicy(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-2 border-[var(--color-border-gold)] bg-[var(--color-background-panel)] checked:bg-[var(--color-primary-gold)] focus:ring-2 focus:ring-[var(--color-glow-gold)] transition-all cursor-pointer"
                        disabled={isLoading}
                      />
                      <label 
                        htmlFor="privacy-consent-modal" 
                        className="text-sm text-[var(--color-text-secondary)] cursor-pointer"
                      >
                        {translations.modal.agreementPrefix}
                        <a href="#" className="text-[var(--color-primary-gold)] hover:text-[var(--color-primary-gold-light)] underline">
                          {translations.modal.privacyPolicyLink}
                        </a>
                        {translations.modal.agreementConnector}
                        <a href="#" className="text-[var(--color-primary-gold)] hover:text-[var(--color-primary-gold-light)] underline">
                          {translations.modal.termsLink}
                        </a>
                        {translations.modal.agreementSuffix}
                      </label>
                    </div>

                    {/* Submit Button */}
                    <CTAButton
                      type="primary"
                      size="large"
                      loading={isLoading}
                      disabled={!agreedToPolicy || isLoading}
                      className="w-full mt-6"
                      ariaLabel={isLoading ? translations.modal.processingText : translations.form.submitButton}
                    >
                      {isLoading ? translations.modal.processingText : translations.form.submitButton}
                    </CTAButton>
                  </form>
                </DialogContent>
              </Dialog>

              <p className="text-center text-[var(--text-caption)] text-[var(--color-text-muted)] mt-[var(--spacing-lg)]">
                {translations.policyNotice}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-24 h-24 text-[var(--color-primary-gold)] mx-auto mb-[var(--spacing-lg)]" />
              </motion.div>

              <h3 
                className="font-['Cinzel'] text-[var(--text-heading-2)] font-bold text-[var(--color-primary-gold)] mb-[var(--spacing-md)]"
                style={{ letterSpacing: '-0.5px' }}
              >
                {translations.successMessage}
              </h3>
              <p className="text-[var(--color-text-primary)] mb-[var(--spacing-xl)] text-[var(--text-body-large)]">
                {language === 'ko' 
                  ? '환영합니다, 용사여. 당신의 여정이 시작되었습니다.'
                  : language === 'en'
                  ? 'Welcome, warrior. Your journey has begun.'
                  : 'ようこそ、戦士よ。あなたの旅が始まりました。'
                }
              </p>

              {/* Referral Code Display */}
              {userReferralCode && (
                <div 
                  className="bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30 rounded-lg p-[var(--spacing-lg)] mb-[var(--spacing-xl)]"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="flex items-center justify-center mb-[var(--spacing-md)]">
                    <Sparkles className="w-6 h-6 text-[var(--color-primary-gold)] mr-2" />
                    <h4 className="text-xl text-[var(--color-primary-gold)] font-semibold">
                      {language === 'ko' ? '나의 추천 코드' : language === 'en' ? 'My Referral Code' : '私の紹介コード'}
                    </h4>
                  </div>
                  <p className="text-3xl font-mono font-bold text-[var(--color-primary-gold)] tracking-wider">
                    {userReferralCode}
                  </p>
                  <p className="text-[var(--color-text-secondary)] mt-2 text-sm">
                    {language === 'ko' 
                      ? '친구를 초대하고 함께 보상을 받으세요!'
                      : language === 'en'
                      ? 'Invite friends and earn rewards together!'
                      : '友達を招待して一緒に報酬を獲得しましょう！'
                    }
                  </p>
                </div>
              )}

              {/* Episode Unlock */}
              <div 
                className="bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30 rounded-lg p-[var(--spacing-lg)] mb-[var(--spacing-xl)]"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex items-center justify-center mb-[var(--spacing-md)]">
                  <Sparkles className="w-6 h-6 text-[var(--color-primary-gold)] mr-2" />
                  <h4 className="text-xl text-[var(--color-primary-gold)] font-semibold">
                    {language === 'ko' 
                      ? '첫 번째 에피소드 잠금 해제!'
                      : language === 'en'
                      ? 'First Episode Unlocked!'
                      : '最初のエピソードがアンロックされました！'
                    }
                  </h4>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                  {language === 'ko' 
                    ? '"어둠의 기사" 캐릭터 에피소드를 확인하세요'
                    : language === 'en'
                    ? 'Check out the "Dark Knight" character episode'
                    : '「闇の騎士」キャラクターエピソードを確認してください'
                  }
                </p>
              </div>

              <CTAButton
                type="secondary"
                size="medium"
                onClick={() => {
                  const element = document.getElementById('characters');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                ariaLabel={language === 'ko' ? '에피소드 보기 - 캐릭터 섹션으로 이동' : language === 'en' ? 'View Episode - Navigate to Characters Section' : 'エピソードを見る - キャラクターセクションへ移動'}
              >
                {language === 'ko' ? '에피소드 보기' : language === 'en' ? 'View Episode' : 'エピソードを見る'}
              </CTAButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
