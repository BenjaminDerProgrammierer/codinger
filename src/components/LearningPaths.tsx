import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function LearningPaths() {
  const paths = await prisma.learningPath.findMany({
    orderBy: { slug: 'asc' },
  });

  return (
    <div className="flex flex-wrap justify-center gap-5 p-5">
      {paths.map((path) => (
        <Card key={path.id} className="w-70 flex-col">
          <CardHeader>
            <CardTitle>{path.title}</CardTitle>
          </CardHeader>
          <CardContent className="h-full">{path.description}</CardContent>
          <CardFooter>
            <Button asChild className="mt-auto">
              <Link
                href={`platform/path/${path.id}?confirmNewPath=true`}
                className="w-full"
              >
                Start Learning
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
