"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@lssm/lib.design-system';
import { authClient } from '@lssm/bundle.contractspec-studio/presentation/providers/auth';

type EmailPasswordClient = {
  email?: {
    signIn?: (payload: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => Promise<unknown>;
  };
  signIn?: (payload: {
    identifier: string;
    password: string;
    rememberMe?: boolean;
  }) => Promise<unknown>;
};

export default function LoginPageClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (name: 'email' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const client = authClient as unknown as EmailPasswordClient;
      if (client.email?.signIn) {
        await client.email.signIn({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });
      } else if (client.signIn) {
        await client.signIn({
          identifier: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });
      } else {
        throw new Error('Auth client is not configured for email sign-in.');
      }
      router.replace('/studio');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to sign in right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 min-h-screen flex items-center justify-center">
      <section className="section-padding w-full max-w-md">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Sign in</h1>
            <p className="text-muted-foreground">
              Welcome back to ContractSpec
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card-subtle p-8 space-y-6">
            {error ? (
              <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(value) => updateField('email', value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-violet-400 hover:text-violet-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(value) => updateField('password', value)}
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((state) => !state)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: event.currentTarget.checked,
                  }))
                }
                className="w-4 h-4 rounded accent-violet-500"
              />
              <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-violet-400 hover:text-violet-300 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
