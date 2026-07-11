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
