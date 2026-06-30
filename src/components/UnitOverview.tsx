import Link from "next/link"

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
import { LearningPath } from "@/generated/prisma/client"

export default async function UnitOverview({ path }: { path: LearningPath }) {
  const units = await prisma.unit.findMany({
    where: { learningPathId: path.id },
  })

  return (
     <div className="flex flex-wrap justify-center gap-5 p-5">
      {units.map((unit) => (
         <Card key={unit.id} className="w-70 flex-col">
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
