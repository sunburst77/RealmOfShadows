/**
 * 로그인 페이지
 * 매직 링크를 통한 이메일 로그인
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { toast } from 'sonner';
import type { Translations } from '../translations';

interface LoginPageProps {
  translations: Translations['login'];
}

export function LoginPage({ translations }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { loading, error, signIn, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email.trim()) {
      toast.error('이메일을 입력해주세요');
      return;
    }

    try {
      await signIn(email);
      setIsSuccess(true);
      toast.success('매직 링크가 전송되었습니다!');
    } catch (err) {
      // 에러는 useAuth에서 자동으로 처리됨
      console.error('로그인 실패:', err);
    }
  };

  if (isSuccess) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          backgroundColor: 'var(--color-background-deep-black)',
          color: 'var(--color-text-primary)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-6"
          >
            <CheckCircle
              className="w-20 h-20"
              style={{ color: 'var(--color-primary-gold)' }}
            />
          </motion.div>

          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: 'var(--color-primary-gold)' }}
          >
            {translations.successTitle}
          </h1>

          <p className="text-lg mb-8 opacity-80">
            {translations.successMessage}
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--color-primary-gold)',
              color: 'var(--color-background-deep-black)',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            {translations.backToHome}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: 'var(--color-background-deep-black)',
        color: 'var(--color-text-primary)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* 헤더 */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-4"
            style={{ color: 'var(--color-primary-gold)' }}
          >
            {translations.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg opacity-80"
          >
            {translations.subtitle}
          </motion.p>
        </div>

        {/* 로그인 폼 */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* 이메일 입력 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-primary-gold)' }}
            >
              {translations.emailLabel}
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={translations.emailPlaceholder}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-background-panel)',
                  borderColor: 'var(--color-border-gold)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-4 rounded-lg"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              backgroundColor: 'var(--color-primary-gold)',
              color: 'var(--color-background-deep-black)',
            }}
          >
            {loading ? translations.sendingButton : translations.submitButton}
          </button>
        </motion.form>

        {/* 사전등록 링크 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <p className="text-sm opacity-70 mb-4 text-center">
            {translations.notRegistered}
          </p>
          <Link
            to="/#registration"
            className="w-full flex items-center justify-center py-3 rounded-lg font-semibold transition-all hover:scale-105 border-2"
            style={{ 
              color: 'var(--color-primary-gold)',
              borderColor: 'var(--color-primary-gold)',
              backgroundColor: 'transparent'
            }}
          >
            {translations.registerNow}
          </Link>
        </motion.div>

        {/* 홈으로 돌아가기 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            {translations.backToHome}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
