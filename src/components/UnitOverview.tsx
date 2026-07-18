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
import { LearningPath } from '@/generated/prisma/client';
import { Progress } from '@/components/ui/progress';
import { Field, FieldLabel } from '@/components/ui/field';

export default async function UnitOverview({
  path,
  userId,
}: {
  path: LearningPath;
  userId: string;
}) {
  const units = await prisma.unit.findMany({
    where: { learningPathId: path.id },
    orderBy: { slug: 'asc' },
    include: {
      lessons: {
        orderBy: { slug: 'asc' },
        include: {
          userProgresses: {
            where: { userId, completed: true },
            select: { id: true },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-wrap justify-center gap-5 p-5">
      {units.map((unit) => {
        const completed = unit.lessons.filter(
          (lesson) => lesson.userProgresses.length > 0
        ).length;
        return (
          <Card key={unit.id} className="w-70 flex-col">
            <CardHeader>
              <CardTitle>{unit.title}</CardTitle>
            </CardHeader>
            <CardContent className="h-full flex gap-5 flex-col justify-between">
              <p>{unit.description}</p>

              <Field className="w-full max-w-sm">
                <FieldLabel htmlFor="lesson-progress" className="flex">
                  <span>
                    {completed}/{unit.lessons.length} lessons
                  </span>
                  <span className="ml-auto">
                    {unit.lessons.length > 0
                      ? Math.round((completed / unit.lessons.length) * 100)
                      : 0}
                    %
                  </span>
                </FieldLabel>
                <Progress
                  value={(completed / unit.lessons.length) * 100}
                  id="lesson-progress"
                />
              </Field>
            </CardContent>
            <CardFooter>
              <Button asChild className="mt-auto">
                <Link href={`/platform/unit/${unit.slug}`} className="w-full">
                  {unit.lessons.length === 0
                    ? 'Coming Soon'
                    : completed === unit.lessons.length
                      ? 'Review Unit'
                      : 'Continue Learning'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
