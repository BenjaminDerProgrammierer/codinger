import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface PlatformLayoutProps {
  children: React.ReactNode
}

export default function PlatformLayout({
  children,
}: Readonly<PlatformLayoutProps>) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col p-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border bg-card/80 p-4">
          <h1 className="text-lg font-semibold font-heading"><Link href="/platform">Codinger</Link></h1>
          <nav>
            <ul>
              <li>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/platform">Home</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </header>

        <Separator className="my-6" />

        <main className="flex-1 border bg-card p-6 sm:p-8">
          {children}
        </main>

        <Separator className="my-6" />

        <footer className="pb-2 text-sm text-muted-foreground">
          <p className="float-right">&copy; 2026 Codinger</p>
        </footer>
      </div>
    </main>
  )
}
