'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [agree, setAgree] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push('/login');
  }

  const passwordMismatch = form.confirm.length > 0 && form.password !== form.confirm;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl tracking-tight">회원가입</h1>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              밀크코코아의 새로운 무드를 가장 먼저 만나보세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              />
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
              />
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
              />
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
              />
              {passwordMismatch && (
                <p className="text-xs text-destructive">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>

            <label className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 size-4 rounded border-input"
              />
              <span>
                <span className="text-foreground">이용약관</span> 및{' '}
                <span className="text-foreground">개인정보 처리방침</span>에 동의합니다.
              </span>
            </label>

            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full"
              disabled={!agree || passwordMismatch}
            >
              회원가입
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
