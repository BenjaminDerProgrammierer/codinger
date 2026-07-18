import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Check, Circle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/login');

  const unit = await prisma.unit.findUnique({
    where: { slug: slug.join('/') },
    include: {
      learningPath: true,
      lessons: {
        orderBy: { slug: 'asc' },
        include: {
          userProgresses: {
            where: { userId: session.user.id, completed: true },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!unit) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>Unit not found.</p>

        <Button asChild>
          <Link href={`/platform`}>Return to Overview</Link>
        </Button>
      </div>
    );
  }

  const completedCount = unit.lessons.filter(
    (lesson) => lesson.userProgresses.length > 0
  ).length;
  const firstIncomplete = unit.lessons.find(
    (lesson) => lesson.userProgresses.length === 0
  );
  const startLesson = firstIncomplete ?? unit.lessons[0];

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/platform/path/${unit.learningPath.slug}`}>
          ← {unit.learningPath.title}
        </Link>
      </Button>
      <p className="text-sm font-medium text-muted-foreground">Unit</p>
      <h1 className="font-heading text-3xl">{unit.title}</h1>
      <p className="text-muted-foreground">{unit.description}</p>
      <Field className="w-full">
        <FieldLabel htmlFor="progress-unit">
          <span>
            {completedCount}/{unit.lessons.length} units
          </span>
          <span className="ml-auto">
            {unit.lessons.length > 0
              ? Math.round((completedCount / unit.lessons.length) * 100)
              : 100}
            %
          </span>
        </FieldLabel>
        <Progress
          value={(completedCount / unit.lessons.length) * 100}
          id="progress-unit"
        />
      </Field>

      {startLesson && (
        <Button asChild size="lg" className="mx-auto flex w-fit items-center">
          <Link href={`/platform/lesson/${startLesson.slug}`}>
            {completedCount === unit.lessons.length
              ? 'Review unit'
              : completedCount > 0
                ? 'Continue unit'
                : 'Start unit'}
          </Link>
        </Button>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {unit.lessons.map((lesson, index) => {
          const completed = lesson.userProgresses.length > 0;
          return (
            <Card key={lesson.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg">
                    {index + 1}. {lesson.title}
                  </CardTitle>
                  {completed ? (
                    <Check className="size-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 text-sm text-muted-foreground"></CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant={completed ? 'outline' : 'secondary'}
                  className="w-full"
                >
                  <Link href={`/platform/lesson/${lesson.slug}`}>
                    {completed ? 'Review lesson' : 'Open lesson'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
