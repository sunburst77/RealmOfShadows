import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle, Sparkles, User, Phone, GamepadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { CTAButton } from './ui/CTAButton';
import { FormInput } from './ui/FormInput';
import { RealTimeCounter } from './ui/RealTimeCounter';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Translations } from '../translations';

interface PreRegistrationSectionProps {
  translations: Translations['registration'];
}

interface FormData {
  name: string;
  email: string;
  nickname: string;
  phone: string;
}

export function PreRegistrationSection({ translations }: PreRegistrationSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    nickname: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = translations.emailError;
    }
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요';
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!agreedToPolicy) {
      toast.error(translations.policyAgreementError);
      return;
    }

    setIsValidating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setIsValidating(false);
    setIsSubmitted(true);
    setIsModalOpen(false);
    
    toast.success(translations.registrationSuccess, {
      description: translations.confirmationEmailSent
    });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center py-[var(--spacing-3xl)] px-4"
      style={{ 
        background: `linear-gradient(to bottom, var(--color-background-deep-black), var(--color-accent-red)/5, var(--color-background-deep-black))` 
      }}
    >
      {/* SectionBackdrop - Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-primary-gold)/10 2px, var(--color-primary-gold)/10 4px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-auto">
        {/* RealTimeCounter - Featured */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mb-[var(--spacing-xl)]"
        >
          <RealTimeCounter size="featured" label={translations.counterLabel} showTrend />
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
                className="font-['Cinzel'] text-[var(--text-heading-1)] font-bold text-center mb-[var(--spacing-lg)]"
                style={{ 
                  color: 'var(--color-primary-gold)',
                  letterSpacing: '-1px'
                }}
              >
                {translations.title}
              </h2>
              <p className="text-center text-[var(--color-text-primary)] mb-[var(--spacing-xl)] text-[var(--text-body-large)]">
                {translations.subtitle}
              </p>

              {/* 혜택 안내 */}
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

              {/* 사전예약 모달 버튼 */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <CTAButton
                    type="primary"
                    size="large"
                    className="w-full"
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

                  {/* 모달 내부 폼 */}
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* 이름 */}
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary-gold)] z-10" />
                      <FormInput
                        inputType="text"
                        inputSize="medium"
                        placeholder={translations.modal.namePlaceholder}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        error={errors.name}
                        className="pl-11"
                        required
                      />
                    </div>

                    {/* 이메일 */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary-gold)] z-10" />
                      <FormInput
                        inputType="email"
                        inputSize="medium"
                        placeholder={translations.form.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        className="pl-11"
                        required
                      />
                    </div>

                    {/* 닉네임 */}
                    <div className="relative">
                      <GamepadIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary-gold)] z-10" />
                      <FormInput
                        inputType="text"
                        inputSize="medium"
                        placeholder={translations.form.nicknamePlaceholder}
                        value={formData.nickname}
                        onChange={(e) => handleInputChange('nickname', e.target.value)}
                        error={errors.nickname}
                        className="pl-11"
                        required
                      />
                    </div>

                    {/* 전화번호 */}
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary-gold)] z-10" />
                      <FormInput
                        inputType="tel"
                        inputSize="medium"
                        placeholder={translations.modal.phonePlaceholder}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        error={errors.phone}
                        className="pl-11"
                        required
                      />
                    </div>

                    {/* 개인정보 동의 */}
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="privacy-consent-modal"
                        checked={agreedToPolicy}
                        onChange={(e) => setAgreedToPolicy(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-2 border-[var(--color-border-gold)] bg-[var(--color-background-panel)] checked:bg-[var(--color-primary-gold)] focus:ring-2 focus:ring-[var(--color-glow-gold)] transition-all cursor-pointer"
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

                    {/* 제출 버튼 */}
                    <CTAButton
                      type="primary"
                      size="large"
                      loading={isValidating}
                      disabled={!agreedToPolicy}
                      className="w-full mt-6"
                    >
                      {isValidating ? translations.modal.processingText : translations.form.submitButton}
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
              {/* CompletionHero */}
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
                사전예약 완료!
              </h3>
              <p className="text-[var(--color-text-primary)] mb-[var(--spacing-xl)] text-[var(--text-body-large)]">
                환영합니다, 용사여. 당신의 여정이 시작되었습니다.
              </p>

              {/* EpisodeUnlockCelebration */}
              <div 
                className="bg-[var(--color-background-panel)] border-2 border-[var(--color-border-gold)]/30 rounded-lg p-[var(--spacing-lg)] mb-[var(--spacing-xl)]"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex items-center justify-center mb-[var(--spacing-md)]">
                  <Sparkles className="w-6 h-6 text-[var(--color-primary-gold)] mr-2" />
                  <h4 className="text-xl text-[var(--color-primary-gold)] font-semibold">
                    첫 번째 에피소드 잠금 해제!
                  </h4>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                  "어둠의 기사" 캐릭터 에피소드를 확인하세요
                </p>
              </div>

              <CTAButton
                type="secondary"
                size="medium"
                onClick={() => {
                  const element = document.getElementById('characters');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                에피소드 보기
              </CTAButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}