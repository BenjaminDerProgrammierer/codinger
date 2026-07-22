'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function LoginToast({
  emailVerified,
  error,
}: {
  emailVerified?: string;
  error?: string;
}) {
  useEffect(() => {
    if (error === 'oauth_code_verification_failed') {
      toast.error(
        'Hack Club login failed. Please try again or use another login method.',
        { id: 'oauth-code-verification-failed' }
      );
      return;
    }

    if (emailVerified === 'true') {
      if (error) {
        toast.error(`Error verifying email: ${error}`);
      } else {
        toast.success('Your email has been verified! You can now log in.');
      }
    }
  }, [emailVerified, error]);

  return null;
}
