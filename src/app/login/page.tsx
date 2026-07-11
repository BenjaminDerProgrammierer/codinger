import { LoginForm } from '@/components/login-form';
import { LoginToast } from '@/components/LoginToast';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ emailVerified?: string; error?: string }>;
}) {
  const { emailVerified, error } = await searchParams;
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginToast emailVerified={emailVerified} error={error} />
        <LoginForm />
      </div>
    </div>
  );
}
