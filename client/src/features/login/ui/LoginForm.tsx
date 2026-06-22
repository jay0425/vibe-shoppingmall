'use client';

import type React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import {
  normalizeLoginForm,
  useLogin,
  validateLoginForm,
  type LoginFormErrors,
  type LoginFormValues,
} from '@/features/login/model';

const initialForm: LoginFormValues = {
  email: '',
  password: '',
};

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [form, setForm] = useState<LoginFormValues>(initialForm);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [remember, setRemember] = useState(false);

  function update(key: keyof LoginFormValues, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    loginMutation.reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loginMutation.isPending) {
      return;
    }

    const nextErrors = validateLoginForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    loginMutation.mutate(
      {
        ...normalizeLoginForm(form),
        remember,
      },
      {
        onSuccess: () => {
          router.push('/');
        },
      },
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
            placeholder="비밀번호를 입력해주세요"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded border-input"
            />
            로그인 유지
          </label>
          <Link href="#" className="text-muted-foreground underline-offset-4 hover:underline">
            비밀번호 찾기
          </Link>
        </div>

        {loginMutation.isError && (
          <p className="text-sm text-destructive">{loginMutation.error.message}</p>
        )}

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        아직 회원이 아니신가요?{' '}
        <Link
          href="/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          회원가입
        </Link>
      </p>
    </>
  );
}
