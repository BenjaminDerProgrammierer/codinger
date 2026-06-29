import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import SignOutButton from "@/components/SignOutButton"

interface PlatformLayoutProps {
  children: React.ReactNode
}

export default async function PlatformLayout({
  children,
}: Readonly<PlatformLayoutProps>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col p-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border bg-card/80 p-4">
          <h1 className="font-heading text-lg font-semibold">
            <Link href="/platform">Codinger</Link>
          </h1>
          <div className="flex items-center gap-4">
            <nav>
              <ul className="flex gap-2">
                <li>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/platform">Home</Link>
                  </Button>
                </li>
                <li>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/platform/path/current">
                      Current Learning Path
                    </Link>
                  </Button>
                </li>
              </ul>
            </nav>
            <Separator orientation="vertical" />
            <div className="flex items-center gap-2">
              <p>Signed in as {session.user.name}</p>
              <SignOutButton variant="outline" size="sm">
                Sign Out
              </SignOutButton>
            </div>
          </div>
        </header>

        <Separator className="my-6" />

        <main className="flex-1 border bg-card p-6 sm:p-8">{children}</main>

        <Separator className="my-6" />

        <footer className="pb-2 text-sm text-muted-foreground">
          <p className="float-right">&copy; 2026 Codinger</p>
        </footer>
      </div>
    </main>
  )
}
