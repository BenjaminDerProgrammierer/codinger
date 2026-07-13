import PasskeySettings from '@/components/PasskeySettings';
import UserSettings from '@/components/UserSettings';

export default function Page() {
  return (
    <>
      <h1 className="mb-4 font-heading text-2xl">User Settings</h1>
      <PasskeySettings />
      <UserSettings />
    </>
  );
}
