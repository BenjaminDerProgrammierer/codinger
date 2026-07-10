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
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { KeyRound } from 'lucide-react';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  authClient.getSession().then(({ data }) => {
    if (data?.session) {
      redirect('/platform');
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, error } = await authClient.signIn.email(
      {
        /**
         * The user email
         */
        email,
        /**
         * The user password
         */
        password,
        /**
         * A URL to redirect to after the user verifies their email (optional)
         */
        callbackURL: '/',
        /**
         * remember the user session after the browser is closed.
         * @default true
         */
        rememberMe: true,
      },
      {
        onRequest: () => {
          setError(null);
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          redirect('/platform');
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message);
        },
      }
    );
    console.log({ data, error });
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
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input id="password" type="password" name="password" required />
              </Field>
              <p>
                {loading && 'Creating account...'}{' '}
                <span className="text-destructive">{error}</span>
              </p>

              <Field>
                <Button type="submit">Login</Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={async () => {
                    const { data, error } = await authClient.signIn.passkey({
                      returnWebAuthnResponse: true,
                    });

                    if (error) {
                      setError(`${error.status} ${error.statusText}: ${error.message}`);
                    } else {
                      console.log('Passkey login successful:', data);
                      redirect('/platform');
                    }
                  }}
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
