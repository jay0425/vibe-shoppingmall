'use client';

import type React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import {
  normalizeSignupForm,
  useSignup,
  validateSignupForm,
  type SignupFormErrors,
  type SignupFormValues,
} from '@/features/signup/model';

const initialForm: SignupFormValues = {
  name: '',
  email: '',
  password: '',
  confirm: '',
};

export function SignupForm() {
  const router = useRouter();
  const signupMutation = useSignup();
  const [form, setForm] = useState<SignupFormValues>(initialForm);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [agree, setAgree] = useState(false);

  function resetSignupForm() {
    setForm(initialForm);
    setErrors({});
    setAgree(false);
    signupMutation.reset();
  }

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        resetSignupForm();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  });

  function update(key: keyof SignupFormValues, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    signupMutation.reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (signupMutation.isPending) {
      return;
    }

    const nextErrors = validateSignupForm(form, agree);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const normalizedForm = normalizeSignupForm(form);

    signupMutation.mutate(
      {
        name: normalizedForm.name,
        email: normalizedForm.email,
        password: normalizedForm.password,
      },
      {
        onSuccess: () => {
          resetSignupForm();
          router.push('/login');
        },
      },
    );
  }

  const isSubmitDisabled = signupMutation.isPending;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            이름
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="홍길동"
            className="h-11 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            이메일
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            className="h-11 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="8자 이상 입력해주세요"
            className="h-11 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-xs text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm" className="text-sm font-medium">
            비밀번호 확인
          </label>
          <input
            id="confirm"
            type="password"
            required
            value={form.confirm}
            onChange={(e) => update('confirm', e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
            className="h-11 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            aria-invalid={Boolean(errors.confirm)}
            aria-describedby={errors.confirm ? 'confirm-error' : undefined}
          />
          {errors.confirm && (
            <p id="confirm-error" className="text-xs text-destructive">
              {errors.confirm}
            </p>
          )}
        </div>

        <label className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              setErrors((prev) => ({ ...prev, agree: undefined }));
            }}
            className="mt-0.5 size-4 rounded border-input"
            aria-invalid={Boolean(errors.agree)}
          />
          <span>
            <span className="text-foreground">이용약관</span> 및{' '}
            <span className="text-foreground">개인정보 처리방침</span>에 동의합니다.
          </span>
        </label>
        {errors.agree && <p className="text-xs text-destructive">{errors.agree}</p>}

        {signupMutation.isError && (
          <p className="text-sm text-destructive">{signupMutation.error.message}</p>
        )}

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitDisabled}>
          {signupMutation.isPending ? '가입 중...' : '회원가입'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{' '}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          로그인
        </Link>
      </p>
    </>
  );
}
