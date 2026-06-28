import { LoginForm } from './LoginForm';
import { LoginHeroPanel } from './LoginHeroPanel';

export function LoginPage() {
  return (
    <main className="h-dvh overflow-hidden text-slate-950">
      <div className="mx-auto grid h-full max-w-[1500px] overflow-hidden bg-white shadow-[0_28px_110px_rgba(15,23,42,0.18)] lg:grid-cols-[1.05fr_0.95fr]">
        <LoginHeroPanel />

        <section className="flex min-h-0 flex-col bg-white px-6 py-6 sm:px-10 lg:px-14 lg:py-8 xl:px-16">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="w-full max-w-[520px]">
              <div className="mb-14 hidden lg:block xl:mb-20 2xl:mb-24">
                <img
                  src="/brand/simple-invoice-logo.png"
                  alt="SimpleInvoice"
                  className="h-14 w-auto"
                />
              </div>

              <div className="mb-8 text-center lg:text-left xl:mb-10">
                <img
                  src="/brand/simple-invoice-logo.png"
                  alt="SimpleInvoice"
                  className="mx-auto mb-10 block h-12 w-auto lg:hidden"
                />

                <h1 className="text-4xl font-semibold text-slate-950 sm:text-5xl">
                  Sign In
                </h1>

                <p className="mt-4 text-base text-slate-500">
                  Welcome back! Please sign in to continue.
                </p>
              </div>

              <LoginForm />
            </div>
          </div>

          <footer className="mx-auto mt-6 flex w-full max-w-[520px] flex-col items-start justify-between gap-3 text-sm text-slate-500 sm:flex-row xl:mt-8">
            <p>© 2026 SimpleInvoice. All rights reserved.</p>
          </footer>
        </section>
      </div>
    </main>
  );
}
