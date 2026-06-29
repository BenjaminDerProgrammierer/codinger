import { Button } from "@/components/ui/button"
import UnitOverview from "@/components/UnitOverview"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const unit = await prisma.unit.findUnique({
    where: { id: Number.parseInt(id) },
  })

  if (!unit) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>Unit not found.</p>

        <Button asChild>
          <Link href={`/platform`}>Return to Overview</Link>
        </Button>
      </div>
    )
  }

  return (
    <h1>Unit {unit.title}</h1>
  )
}
