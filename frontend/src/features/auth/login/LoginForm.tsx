import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { loginSchema, type LoginFormValues } from '@/features/auth/login.schema';
import { getApiErrorMessage } from '@/shared/lib/api-error';
import { PasswordInput, TextInput } from '@/shared/ui/form';

import { useLogin } from './use-login';

export function LoginForm() {
  const loginMutation = useLogin();

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

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  const submitError = loginMutation.isError
    ? getApiErrorMessage(loginMutation.error, 'Invalid email or password.')
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 xl:space-y-5">
      <TextInput
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <PasswordInput
        label="Password"
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password')}
      />

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
  );
}
