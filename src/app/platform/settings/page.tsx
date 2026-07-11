'use client';
import { Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAuthenticatorName, Passkey } from '@better-auth/passkey';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { authClient } from '@/lib/auth-client';
import { Field } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// TODO: Change name, email, password
export default function Page() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [renamingPasskeyId, setRenamingPasskeyId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchPasskeys() {
      setPasskeys(await getPasskeys());
    }
    fetchPasskeys();
  }, []);

  async function getPasskeys(): Promise<Passkey[]> {
    const { data, error } = await authClient.passkey.listUserPasskeys();
    if (error) {
      toast.error(`${error.status} ${error.statusText}: ${error.message}`);
    }
    console.log('Fetched passkeys:', data);
    return data || [];
  }

  function handleAddPasskey() {
    toast.promise(
      new Promise(async (resolve, reject) => {
        const { data, error } = await authClient.passkey.addPasskey({
          returnWebAuthnResponse: true,
        });

        if (error) {
          reject(error);
        } else {
          setPasskeys(await getPasskeys());
          resolve(data);
          console.log('Passkey added:', data);
        }
      }),
      {
        success: 'Passkey added successfully!',
        error: (e) => `${e.status} ${e.statusText}: ${e.message}`,
        loading: 'Adding passkey...',
      }
    );
  }

  async function handleRemovePasskey(passkeyId: string) {
    toast.promise(
      new Promise(async (resolve, reject) => {
        const { data, error } = await authClient.passkey.deletePasskey({
          id: passkeyId,
        });

        if (error) {
          reject(error);
        } else {
          setPasskeys(await getPasskeys());
          resolve(data);
          console.log('Passkey removed:', data);
        }
      }),
      {
        success: 'Passkey removed successfully!',
        error: (e) => `${e.status} ${e.statusText}: ${e.message}`,
        loading: 'Removing passkey...',
      }
    );
  }

  async function handleRenamePasskey(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get('name') as string;
    const passkeyId = formData.get('passkeyId') as string;

    if (!newName) {
      toast.error('New name is required.');
      return;
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        const { data, error } = await authClient.passkey.updatePasskey({
          id: passkeyId,
          name: newName,
        });

        if (error) {
          reject(error);
        } else {
          setPasskeys(await getPasskeys());
          resolve(data);
          console.log('Passkey renamed:', data);
          setRenamingPasskeyId(null);
        }
      }),
      {
        success: 'Passkey renamed successfully!',
        error: (e) => `${e.status} ${e.statusText}: ${e.message}`,
        loading: 'Renaming passkey...',
      }
    );
  }

  return (
    <>
      <h1 className="mb-4 font-heading text-2xl">User Settings</h1>
      <section id="passkeys">
        <h2 className="mb-2 font-heading text-xl">Passkeys</h2>
        {passkeys.length > 0 ? (
          <ul className="mb-4">
            {passkeys.map((passkey) => (
              <li key={passkey.id} className="flex items-center gap-2">
                {getLabelForPasskey(passkey)}, created at:{' '}
                {new Date(passkey.createdAt).toLocaleString()}{' '}
                <AlertDialog>
                  <Button asChild variant="destructive">
                    <AlertDialogTrigger>Delete Passkey</AlertDialogTrigger>
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Delete passkey?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this passkey. You might
                        loose access to your account if you don&apos;t have any
                        other passkeys or login methods registered.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel variant="outline">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => handleRemovePasskey(passkey.id)}
                      >
                        Permanently Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Dialog
                  open={renamingPasskeyId === passkey.id}
                  onOpenChange={(open) =>
                    setRenamingPasskeyId(open ? passkey.id : null)
                  }
                >
                  <Button variant="outline" type="button" asChild>
                    <DialogTrigger>Rename Passkey</DialogTrigger>
                  </Button>

                  <DialogContent className="sm:max-w-sm">
                    <form onSubmit={handleRenamePasskey}>
                      <DialogHeader>
                        <DialogTitle>Rename Passkey</DialogTitle>
                        <DialogDescription>
                          Rename this passkey to something more memorable. This
                          name is only stored on the server and is not shared
                          with any other services.
                        </DialogDescription>
                      </DialogHeader>

                      <Input
                        type="hidden"
                        name="passkeyId"
                        value={passkey.id}
                      />

                      <Field>
                        <Label htmlFor={`name-${passkey.id}`}>New Name</Label>
                        <Input
                          id={`name-${passkey.id}`}
                          name="name"
                          defaultValue={passkey.name}
                        />
                      </Field>

                      <DialogFooter>
                        <Button asChild variant="outline">
                          <DialogClose>Cancel</DialogClose>
                        </Button>

                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4">No passkeys registered.</p>
        )}
        <Button variant="default" onClick={handleAddPasskey}>
          Add Passkey
        </Button>
      </section>
    </>
  );
}

function getLabelForPasskey(passkey: Passkey): string {
  const authenticatorName = getAuthenticatorName(passkey.aaguid);

  if (passkey.name) {
    return passkey.name;
  }
  if (authenticatorName) {
    return `Unnamed Passkey, probably generated by ${authenticatorName}`;
  }
  return 'Unknown';
}
