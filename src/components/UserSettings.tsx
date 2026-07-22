'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';

interface UserSettingsProps {
  initialHasPassword: boolean;
  hasHackClub: boolean;
}

export default function UserSettings({
  initialHasPassword,
  hasHackClub,
}: UserSettingsProps) {
  const [isLinkingHackClub, setIsLinkingHackClub] = useState(false);

  function handleChangePassword(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = formData.get('current-password') as string;
    const newPassword = formData.get('new-password') as string;
    const confirmPassword = formData.get('confirm-password') as string;
    const revokeOtherSessions = formData.get('revoke-sessions') === 'on';

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        const { error } = await authClient.changePassword({
          newPassword,
          currentPassword,
          revokeOtherSessions,
        });

        if (error) {
          reject(error);
        } else {
          resolve();
          form.reset();
        }
      }),
      {
        loading: 'Changing password...',
        success: 'Password changed successfully!',
        error: (error) => `Failed to change password: ${error.message}`,
      }
    );
  }

  async function handleLinkHackClub() {
    setIsLinkingHackClub(true);

    const { error } = await authClient.oauth2.link({
      providerId: 'hackclub',
      callbackURL: '/platform/settings',
      errorCallbackURL: '/platform/settings',
      scopes: ['openid', 'profile'],
    });

    if (error) {
      toast.error(error.message || 'Failed to link Hack Club account.');
      setIsLinkingHackClub(false);
    }
  }

  async function handleChangeName(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;

    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        const { error } = await authClient.updateUser({ name });

        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }),
      {
        loading: 'Updating name...',
        success: 'Name updated successfully!',
        error: (error) => `Failed to update name: ${error.message}`,
      }
    );
  }

  return (
    <>
      <section className="mb-6">
        <h2 className="mb-2 font-heading text-xl">Connected Accounts</h2>
        <Field>
          <FieldLabel>Hack Club</FieldLabel>
          <FieldDescription>
            {hasHackClub
              ? 'Your Hack Club account is connected.'
              : 'Connect Hack Club as another way to sign in.'}
          </FieldDescription>
          <Button
            type="button"
            variant="outline"
            disabled={hasHackClub || isLinkingHackClub}
            onClick={handleLinkHackClub}
          >
            {hasHackClub
              ? 'Hack Club Connected'
              : isLinkingHackClub
                ? 'Connecting...'
                : 'Connect Hack Club'}
          </Button>
        </Field>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 font-heading text-xl">Personal Data</h2>
        {initialHasPassword && (
          <>
            <h3 className="mb-2 font-heading text-lg">Change Password</h3>
            <form onSubmit={handleChangePassword} className="mb-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="current-password">
                    Current Password
                  </FieldLabel>
                  <Input
                    id="current-password"
                    name="current-password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                  <Input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <FieldDescription>
                    Please confirm your password.
                  </FieldDescription>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="revoke-sessions"
                    name="revoke-sessions"
                    defaultChecked
                  />
                  <FieldLabel htmlFor="revoke-sessions">
                    Sign out of all other devices
                  </FieldLabel>
                </Field>
                <Field>
                  <Button type="submit">Change Password</Button>
                </Field>
              </FieldGroup>
            </form>
          </>
        )}

        <form onSubmit={handleChangeName}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" name="name" type="text" required />
            </Field>
            <Field>
              <Button type="submit">Update Name</Button>
            </Field>
          </FieldGroup>
        </form>
      </section>
    </>
  );
}
