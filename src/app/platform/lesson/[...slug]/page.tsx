import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, Circle } from 'lucide-react';

import LessonCompletion from '@/components/LessonCompletion';
import LessonOverview from '@/components/LessonOverview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { LessonExerciseProgressProvider } from '@/components/LessonExerciseProgress';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/login');

  const lesson = await prisma.lesson.findUnique({
    where: { slug: slug.join('/') },
    include: {
      unit: {
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
      },
      userProgresses: {
        where: { userId: session.user.id },
        select: { completed: true },
      },
    },
  });

  if (!lesson) notFound();

  const lessons = lesson.unit.lessons;
  const currentIndex = lessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const completed = lesson.userProgresses[0]?.completed ?? false;
  const completedCount = lessons.filter(
    (item) => item.userProgresses.length > 0
  ).length;
  const exerciseCount = (lesson.content.match(/^:{3,}exercise\b/gm) ?? [])
    .length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/platform/unit/${lesson.unit.slug}`}>
            <ChevronLeft />
            Unit overview
          </Link>
        </Button>
        <Link
          href={`/platform/path/${lesson.unit.learningPath.slug}`}
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          {lesson.unit.learningPath.title}
        </Link>
      </div>

      <LessonExerciseProgressProvider exerciseCount={exerciseCount}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <article className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {lesson.unit.title} · Lesson {currentIndex + 1} of{' '}
              {lessons.length}
            </p>
            <h1 className="mt-1 mb-2 font-heading text-3xl">{lesson.title}</h1>

            <LessonOverview content={lesson.content} />

            <nav
              className="mt-10 grid gap-3 border-t pt-6 sm:grid-cols-2"
              aria-label="Lesson navigation"
            >
              {previousLesson ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-auto justify-start py-3"
                >
                  <Link href={`/platform/lesson/${previousLesson.slug}`}>
                    <ChevronLeft aria-hidden="true" />
                    <span className="min-w-0 text-left">
                      <span className="block text-xs text-muted-foreground">
                        Previous
                      </span>
                      <span className="block truncate">
                        {previousLesson.title}
                      </span>
                    </span>
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-auto justify-end py-3"
                >
                  <Link href={`/platform/lesson/${nextLesson.slug}`}>
                    <span className="min-w-0 text-right">
                      <span className="block text-xs text-muted-foreground">
                        Next
                      </span>
                      <span className="block truncate">{nextLesson.title}</span>
                    </span>
                    <ChevronRight aria-hidden="true" />
                  </Link>
                </Button>
              ) : (
                <Button asChild className="h-auto py-3">
                  <Link href={`/platform/unit/${lesson.unit.slug}`}>
                    Finish unit
                    <ChevronRight aria-hidden="true" />
                  </Link>
                </Button>
              )}
            </nav>
          </article>

          <aside className="space-y-4 lg:order-last">
            <Card className="border bg-card">
              <CardHeader>
                <CardTitle>Lesson outline</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-1">
                  {lessons.map((item, index) => {
                    const itemCompleted = item.userProgresses.length > 0;
                    return (
                      <li key={item.id}>
                        <Link
                          href={`/platform/lesson/${item.slug}`}
                          className={cn(
                            'flex items-start gap-2 px-2 py-2 text-sm transition-colors hover:bg-accent',
                            item.id === lesson.id && 'bg-accent font-medium'
                          )}
                        >
                          {itemCompleted ? (
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          ) : (
                            <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                          )}
                          <span>
                            {index + 1}. {item.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>

            <Card className="lg:sticky lg:top-5">
              <CardHeader>
                <CardTitle>Lesson status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <Field className="w-full">
                  <FieldLabel htmlFor="progress-unit">
                    <span>Unit progress</span>
                    <span className="ml-auto">
                      {Math.round((completedCount / lessons.length) * 100)}%
                    </span>
                  </FieldLabel>
                  <Progress
                    value={(completedCount / lessons.length) * 100}
                    id="progress-unit"
                  />
                </Field>
                <LessonCompletion
                  lessonId={lesson.id}
                  initialCompleted={completed}
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </LessonExerciseProgressProvider>
    </div>
  );
}
