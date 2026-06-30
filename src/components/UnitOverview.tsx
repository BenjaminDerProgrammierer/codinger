import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { LearningPath } from "@/generated/prisma/client"

export default async function UnitOverview({ path }: { path: LearningPath }) {
  const units = await prisma.unit.findMany({
    where: { learningPathId: path.id },
  })

  return (
    <div className="grid grid-cols-2 gap-5 p-5">
      {units.map((unit) => (
        <Card key={unit.id}>
          <CardHeader>
            <CardTitle>{unit.title}</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            {unit.description}
          </CardContent>
          <CardFooter>
            <Button asChild className="mt-auto">
              <Link href={`/platform/unit/${unit.id}`} className="w-full">
                Start Learning
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
