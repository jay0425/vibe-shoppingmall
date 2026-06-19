'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push('/');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl tracking-tight">로그인</h1>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              밀크코코아에 다시 오신 걸 환영해요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="size-4 rounded border-input" />
                로그인 유지
              </label>
              <Link href="#" className="text-muted-foreground underline-offset-4 hover:underline">
                비밀번호 찾기
              </Link>
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full">
              로그인
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
