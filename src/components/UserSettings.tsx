'use client';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { FieldGroup, Field, FieldLabel, FieldDescription } from './ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from './ui/input';
import { authClient } from '@/lib/auth-client';

export default function UserSettings() {
  function handleChangePassword(event: React.SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
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
        }
      }),
      {
        loading: 'Changing password...',
        success: 'Password changed successfully!',
        error: (err) => `Failed to change password: ${err.message}`,
      }
    );
  }

  async function handleChangeName(event: React.SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
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
        error: (err) => `Failed to update name: ${err.message}`,
      }
    );
  }

  return (
    <>
      <h2 className="mb-2 font-heading text-xl">Personal Data</h2>
      <h3 className="mb-2 font-heading text-lg">Change Password</h3>
      <form onSubmit={handleChangePassword} className="mb-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
            <Input
              id="current-password"
              name="current-password"
              type="password"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-password">New Password</FieldLabel>
            <Input
              id="new-password"
              name="new-password"
              type="password"
              required
            />
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
            />
            <FieldDescription>Please confirm your password.</FieldDescription>
          </Field>
          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox id="revoke-sessions" defaultChecked />
              <FieldLabel htmlFor="revoke-sessions">
                Sign out of all other devices
              </FieldLabel>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <Button type="submit">Change Password</Button>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
      <form onSubmit={handleChangeName}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" name="name" type="text" required />
          </Field>
          <FieldGroup>
            <Field>
              <Button type="submit">Update Name</Button>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </>
  );
}
