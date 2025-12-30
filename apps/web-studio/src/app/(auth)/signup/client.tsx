'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@contractspec/lib.design-system';
import { Checkbox } from '@contractspec/lib.ui-kit-web/ui/checkbox';
import { Label } from '@contractspec/lib.ui-kit-web/ui/label';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@contractspec/lib.ui-kit-web/ui/input-group';

export function SignupPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/studio';
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (
    field: 'email' | 'password' | 'username',
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.username) {
      setError('All fields are required');
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

    const { authClient } =
      await import('@contractspec/bundle.studio/presentation/providers/auth/index.web');
    await authClient.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.username,
        // image, // User image URL (optional)
      },
      {
        onSuccess: (_ctx) => {
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
            <h1 className="text-4xl font-bold">Create account</h1>
            <p className="text-muted-foreground">
              Join ContractSpec to build policy-safe apps
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card-subtle space-y-6 p-8">
            {error ? (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>

              <InputGroup>
                <InputGroupInput
                  id="username"
                  placeholder="john_doe"
                  value={formData.username}
                  onChange={(value) =>
                    updateField('username', value.target.value)
                  }
                  required
                  autoComplete="username"
                />
                <InputGroupAddon align="inline-start">
                  <Label htmlFor="username">@</Label>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                keyboard={{ kind: 'email' }}
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(event) => updateField('email', event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
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

            <div className="flex items-start gap-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeToTerms: checked === true,
                  }))
                }
              />
              <Label
                htmlFor="agreeToTerms"
                className="text-muted-foreground inline-block text-sm"
              >
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
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="outline"
              className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-violet-400 hover:text-violet-300"
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
