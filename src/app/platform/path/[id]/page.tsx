import { Button } from "@/components/ui/button"
import UnitOverview from "@/components/UnitOverview"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const { confirmNewPath } = (await searchParams) || {}

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
  })

  if (!session || !user) {
    redirect("/login")
  }

  if (id === "current") {
    if (user.currentPathId) {
      redirect(`/platform/path/${user.currentPathId}`)
    } else {
      redirect("/platform/")
    }
  }

  const path = await prisma.learningPath.findUnique({
    where: { id: Number.parseInt(id) },
  })

  if (!path) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>Learning path not found.</p>

        <Button asChild>
          <Link href={`..`}>Return to Overview</Link>
        </Button>
      </div>
    )
  }

  if (confirmNewPath === "true") {
    await prisma.user.update({
      where: { id: user.id },
      data: { currentPathId: path.id },
    })
    console.log("User confirmed new learning path:", path?.title)

    // Server-side redirect to the same page without query params
    redirect(`/platform/path/${id}`)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <UnitOverview path={path} />
    </div>
  )
}
