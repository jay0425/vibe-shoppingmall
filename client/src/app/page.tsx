export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
      <section className="flex flex-1 flex-col justify-center gap-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase text-emerald-700">WearJoy</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">
            일상의 즐거움을 고르는 쇼핑몰
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-700">
            Next.js, Tailwind CSS, TypeScript, TanStack Query 기반의 클라이언트 환경입니다.
          </p>
        </div>
      </section>
    </main>
  );
}
