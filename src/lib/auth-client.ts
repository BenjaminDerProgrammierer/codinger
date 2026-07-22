import { createAuthClient } from 'better-auth/react';
import { passkeyClient } from '@better-auth/passkey/client';
import { genericOAuthClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [passkeyClient(), genericOAuthClient()],
});
