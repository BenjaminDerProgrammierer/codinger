import PasskeySettings from '@/components/PasskeySettings';
import UserSettings from '@/components/UserSettings';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Page() {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  return (
    <>
      <h1 className="mb-4 font-heading text-2xl">User Settings</h1>
      <PasskeySettings />
      <UserSettings
        initialHasPassword={accounts.some(
          (account) => account.providerId === 'credential'
        )}
        hasHackClub={accounts.some(
          (account) => account.providerId === 'hackclub'
        )}
      />
    </>
  );
}
