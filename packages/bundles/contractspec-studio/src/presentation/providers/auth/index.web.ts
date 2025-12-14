export { authClient, impersonateUser } from './client';
export { AuthProvider, useAuthContext } from './context';

// export async function stopImpersonation() {
//   if (authClient?.admin?.stopImpersonation) {
//     return authClient.admin.stopImpersonation();
//   }
//   if (authClient?.stopImpersonation) {
//     return authClient.stopImpersonation();
//   }
//   throw new Error('Stop impersonation API not available');
// }
