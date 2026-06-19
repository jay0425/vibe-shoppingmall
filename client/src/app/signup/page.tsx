import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { SignupForm } from '@/features/signup';

export default function SignupPage() {
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

          <SignupForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
