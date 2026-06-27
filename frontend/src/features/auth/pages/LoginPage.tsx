import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { login } from '@/api/auth.api';
import { useAuth } from '@/features/auth/auth-context';
import { loginSchema, type LoginFormValues } from '@/features/auth/login.schema';
import { getApiErrorMessage } from '@/utils/api-error';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      signIn(data);
      navigate('/invoices', { replace: true });
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  const submitError = loginMutation.isError
    ? getApiErrorMessage(loginMutation.error, 'Invalid email or password.')
    : null;

  return (
    <main className="h-dvh overflow-hidden text-slate-950">
      <div className="mx-auto grid h-full max-w-[1500px] overflow-hidden bg-white shadow-[0_28px_110px_rgba(15,23,42,0.18)] lg:grid-cols-[1.05fr_0.95fr]">
        <HeroPanel />

        <section className="flex min-h-0 flex-col bg-white px-6 py-6 sm:px-10 lg:px-14 lg:py-8 xl:px-16">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="w-full max-w-[520px]">
              <div className="mb-14 hidden lg:block xl:mb-20 2xl:mb-24">
                <span className="text-3xl font-bold text-slate-950">SimpleInvoice</span>
              </div>

              <div className="mb-8 text-center lg:text-left xl:mb-10">
                <span className="mx-auto mb-10 block text-2xl font-bold text-slate-950 lg:hidden">SimpleInvoice</span>

                <h1 className="text-4xl font-semibold text-slate-950 sm:text-5xl">
                  Sign In
                </h1>

                <p className="mt-4 text-base text-slate-500">
                  Welcome back! Please sign in to continue.
                </p>
              </div>

              <form className="space-y-4 xl:space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      aria-hidden="true"
                      className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                      strokeWidth={2}
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
                      aria-invalid={Boolean(errors.email)}
                      className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-5 text-base text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 xl:h-16"
                      {...register('email')}
                    />
                  </div>

                  {errors.email ? (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      aria-hidden="true"
                      className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                      strokeWidth={2}
                    />

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Password"
                      aria-invalid={Boolean(errors.password)}
                      className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-14 text-base text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 xl:h-16"
                      {...register('password')}
                    />

                    <button
                      type="button"
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff aria-hidden="true" className="size-5" strokeWidth={2} />
                      ) : (
                        <Eye aria-hidden="true" className="size-5" strokeWidth={2} />
                      )}
                    </button>
                  </div>

                  {errors.password ? (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>

                {submitError ? (
                  <div className="whitespace-pre-line rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {submitError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="mt-6 h-14 w-full rounded-xl bg-[#0D1F3C] text-2xl font-semibold text-white transition hover:bg-[#1B3460] focus:outline-none focus:ring-4 focus:ring-[#0D1F3C]/20 disabled:bg-slate-400 disabled:shadow-none xl:mt-8 xl:h-16"
                >
                  {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
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

function HeroPanel() {
  return (
    <section className="relative hidden overflow-hidden bg-[#0D1F3C] lg:block">
      <img
        src="/images/login-hero.png"
        alt="SimpleInvoice invoicing dashboard preview"
        className="h-full w-full select-none object-cover object-center"
        draggable={false}
      />
    </section>
  );
}