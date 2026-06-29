"use client"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation";

export default function SignOutButton({
  ...props
}: React.ComponentProps<typeof Button>) {
  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
            redirect("/login");
        },
      },
    })
  }

  return (
    <Button onClick={handleSignOut} {...props}>
      Sign Out
    </Button>
  )
}
