'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

export function ResetPasswordForm({
  token,
  className,
  ...props
}: React.ComponentProps<'div'> & { token?: string }) {
  if (!token) {
    toast.error('Invalid or missing token.');
    redirect('/login');
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        const { error } = await authClient.resetPassword({
          newPassword: password,
          token,
        });
        if (error) {
          reject(error);
        } else {
          resolve();
          redirect('/platform');
        }
      }),
      {
        loading: 'Resetting password...',
        success: 'Password reset successfully!',
        error: (err) =>
          err.message || 'An error occurred while resetting the password.',
      }
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your new password"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Reset Password</Button>
                <FieldDescription className="text-center">
                  Changed your mind? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
