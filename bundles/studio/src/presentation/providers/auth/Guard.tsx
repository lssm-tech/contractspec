import React from 'react';
import { useAuthContext } from './context';

export function AuthGuard({
  children,
  redirect,
}: {
  children: React.ReactNode;
  redirect?: () => void;
}) {
  const { isAuthenticated } = useAuthContext();
  React.useEffect(() => {
    if (!isAuthenticated && redirect) redirect();
  }, [isAuthenticated, redirect]);
  if (!isAuthenticated && !redirect) return null;
  return <>{children}</>;
}
