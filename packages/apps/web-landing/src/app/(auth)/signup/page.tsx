import { SignupPageClient } from './client';
import { ALLOW_SIGNUP } from '../constants';
import { redirect } from 'next/navigation';

export default function SignupPage() {
  if (!ALLOW_SIGNUP) {
    redirect('/contact#waitlist');
  }

  return <SignupPageClient />;
}
