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
import { KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  authClient.getSession().then(({ data }) => {
    if (data?.session) {
      redirect('/platform');
    }
  });

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        const { error } = await authClient.signIn.email({
          email,
          password,
          rememberMe: true,
        });
        if (error) {
          reject(error);
        } else {
          redirect('/platform');
        }
      }),
      {
        loading: 'Logging in...',
        success: 'Logged in successfully!',
        error: (err) => err.message || 'An error occurred while logging in.',
      }
    );
  }

  async function handleForgotPassword() {
    // TODO: https://better-auth.com/docs/authentication/email-password#request-password-reset
    toast(
      'Forgot password functionality is not implemented yet. Please contact support.'
    );
  }

  async function handlePasskeyLogin() {
    const { error } = await authClient.signIn.passkey();

    if (error) {
      toast.error(`${error.status} ${error.statusText}: ${error.message}`);
    } else {
      redirect('/platform');
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    onClick={handleForgotPassword}
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" name="password" required />
              </Field>

              <Field>
                <Button type="submit">Login</Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handlePasskeyLogin}
                >
                  <KeyRound />
                  Login with a Passkey
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
