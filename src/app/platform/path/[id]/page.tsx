import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const path = await prisma.learningPath.findUnique({
    where: { id: Number.parseInt((await params).id) },
  })

  if (!path) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>Learning path not found.</p>

        <Button asChild>
          <Link href={`..`}>
            Return to Overview
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p>{path?.title}</p>
    </div>
  )
}
