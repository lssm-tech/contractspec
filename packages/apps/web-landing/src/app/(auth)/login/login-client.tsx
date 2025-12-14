'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@lssm/lib.design-system';
import { authClient } from '@lssm/bundle.contractspec-studio/presentation/providers/auth';
import { Checkbox } from '@lssm/lib.ui-kit-web/ui/checkbox';
import { Label } from '@lssm/lib.ui-kit-web/ui/label';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@lssm/lib.ui-kit-web/ui/input-group';
import { ALLOW_SIGNUP } from '../constants';

interface EmailPasswordClient {
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
}

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/studio';
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
    await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      },
      {
        onSuccess: (ctx) => {
          setLoading(false);
          router.push(redirectTo);
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message);
        },
      }
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center pt-24">
      <section className="section-padding w-full max-w-md">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold">Sign in</h1>
            <p className="text-muted-foreground">
              Welcome back to ContractSpec
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card-subtle space-y-6 p-8">
            {error ? (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                keyboard={{ kind: 'email' }}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(value) => updateField('email', value.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                {ALLOW_SIGNUP && (
                  <Link
                    href="/forgot-password"
                    className="text-xs text-violet-400 hover:text-violet-300"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <InputGroup>
                <InputGroupInput
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(value) =>
                    updateField('password', value.target.value)
                  }
                  required
                  className="pr-12"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Copy"
                    title="Copy"
                    size="icon-xs"
                    onClick={() => setShowPassword((state) => !state)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: checked === true,
                  }))
                }
              />
              <Label
                htmlFor="rememberMe"
                // className="text-muted-foreground text-sm"
              >
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="outline"
              className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{' '}
              {ALLOW_SIGNUP ? (
                <Link
                  href="/signup"
                  className="font-medium text-violet-400 hover:text-violet-300"
                >
                  Create one
                </Link>
              ) : (
                <Link
                  href="/contact#waitlist"
                  className="font-medium text-violet-400 hover:text-violet-300"
                >
                  Apply to waitlist
                </Link>
              )}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
