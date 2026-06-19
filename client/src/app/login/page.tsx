import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LoginForm } from '@/features/login';

export default function LoginPage() {
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

          <LoginForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
