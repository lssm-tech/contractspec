/**
 * lib/auth-hooks
 * - React Query wrappers for Better Auth; Next.js-friendly
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toastDone, toastError } from './toast';
import { authClient } from '@contractspec/bundle.studio/presentation/providers/auth/client.native';

interface AuthError extends Error {
  code?: string;
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
      lastName: string;
      lang: string;
    }) => {
      try {
        const result = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name,
          // lastName: data.lastName,
          // lang: data.lang,
        });

        if (result.error) {
          // Enhanced error handling with specific error types
          const errorMessage = result.error.message || 'Registration failed';
          const error: AuthError = new Error(errorMessage);
          error.code = result.error.code;
          throw error;
        }

        return result.data;
      } catch (networkError: unknown) {
        // Handle network/connectivity errors
        const err = networkError as { name?: string; code?: string };
        if (err.name === 'TypeError' || err.code === 'NETWORK_ERROR') {
          throw new Error(
            'Network connection failed. Please check your internet and try again.'
          );
        }

        // Handle timeout errors
        if (err.name === 'AbortError' || err.code === 'TIMEOUT') {
          throw new Error('Request timed out. Please try again.');
        }

        // Re-throw other errors
        throw networkError;
      }
    },
    onSuccess: (_data) => {
      // Invalidate and refetch session
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });

      toastDone({
        title: 'Welcome!',
        description: 'Your account has been created successfully.',
      });
    },
    onError: (error: AuthError) => {
      // Categorize errors for better user feedback
      let title = 'Registration Failed';
      let description =
        error.message || 'Something went wrong. Please try again.';

      // Handle specific error types
      if (
        error.message?.toLowerCase().includes('email already exists') ||
        error.message?.toLowerCase().includes('already registered')
      ) {
        title = 'Email Already Registered';
        description =
          'This email is already associated with an account. Try signing in instead.';
      } else if (
        error.message?.toLowerCase().includes('weak password') ||
        error.message?.toLowerCase().includes('password too short')
      ) {
        title = 'Password Too Weak';
        description =
          'Please choose a stronger password with at least 8 characters.';
      } else if (error.message?.toLowerCase().includes('invalid email')) {
        title = 'Invalid Email';
        description = 'Please enter a valid email address.';
      } else if (
        error.message?.toLowerCase().includes('network') ||
        error.message?.toLowerCase().includes('connection')
      ) {
        title = 'Connection Error';
        description =
          'Unable to connect. Please check your internet connection.';
      } else if (
        error.message?.toLowerCase().includes('rate limit') ||
        error.message?.toLowerCase().includes('too many requests')
      ) {
        title = 'Too Many Attempts';
        description = 'Please wait a moment before trying again.';
      }

      toastError({
        title,
        description,
      });
    },
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        if (__DEV__) console.log('Sign In error result', result.error);
        throw new Error(result.error.message);
      }

      if (__DEV__) console.log('signed in', result.data);

      return result.data;
    },
    onSuccess: (_data) => {
      // Invalidate and refetch session
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });

      toastDone({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });
    },
    onError: (error) => {
      if (__DEV__) console.log('Sign In error', error);
      toastError({
        title: 'Sign In Failed',
        description:
          error.message || 'Invalid email or password. Please try again.',
      });
    },
  });
}
