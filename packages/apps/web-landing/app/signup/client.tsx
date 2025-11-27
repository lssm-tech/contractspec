"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@lssm/lib.design-system';
import { authClient } from '@lssm/bundle.contractspec-studio/presentation/providers/auth';

type EmailPasswordClient = {
  email?: {
    signUp?: (payload: { email: string; password: string }) => Promise<unknown>;
  };
  signUp?: (payload: { email: string; password: string }) => Promise<unknown>;
};

export default function SignupPageClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (
    field: 'email' | 'password' | 'confirmPassword',
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const client = authClient as unknown as EmailPasswordClient;
      if (client.email?.signUp) {
        await client.email.signUp({
          email: formData.email,
          password: formData.password,
        });
      } else if (client.signUp) {
        await client.signUp({
          email: formData.email,
          password: formData.password,
        });
      } else {
        throw new Error('Auth client is not configured for email sign-up.');
      }

      router.replace('/onboarding/org-select');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to create account.'
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
            <h1 className="text-4xl font-bold">Create account</h1>
            <p className="text-muted-foreground">
              Join ContractSpec to build policy-safe apps
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
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
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

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(value) => updateField('confirmPassword', value)}
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((state) => !state)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeToTerms: event.currentTarget.checked,
                  }))
                }
                className="mt-1 w-4 h-4 rounded accent-violet-500"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link
                  href="/legal/terms"
                  className="text-violet-400 hover:text-violet-300"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/legal/privacy"
                  className="text-violet-400 hover:text-violet-300"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-violet-400 hover:text-violet-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
