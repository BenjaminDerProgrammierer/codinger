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

export default async function LearningPaths() {
  const paths = await prisma.learningPath.findMany()

  return (
    <div className="grid grid-cols-2 gap-5 p-5">
      {paths.map((path) => (
        <Card key={path.id}>
          <CardHeader>
            <CardTitle>{path.title}</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            {path.description}
          </CardContent>
          <CardFooter>
            <Button asChild className="mt-auto">
              <Link href={`platform/path/${path.id}`} className="w-full">
                Start Learning
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
