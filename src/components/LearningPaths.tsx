import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Field, FieldLabel } from './ui/field';

export default async function LearningPaths() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const paths = await prisma.learningPath.findMany({
    orderBy: { slug: 'asc' },
    include: {
      courses: {
        include: {
          lessons: {
            include: {
              userProgresses: {
                where: { userId: session.user.id, completed: true },
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-wrap justify-center gap-5 p-5">
      {paths.map((path) => {
        const lessons = path.courses.flatMap((unit) => unit.lessons);
        const completed = lessons.filter(
          (lesson) => lesson.userProgresses.length > 0
        ).length;
        return (
          <Card key={path.id} className="w-70 flex-col">
            <CardHeader>
              <CardTitle>{path.title}</CardTitle>
            </CardHeader>
            <CardContent className="h-full space-y-5">
              <p>{path.description}</p>

              <Field className="w-full max-w-sm">
                <FieldLabel htmlFor="lesson-progress" className="flex">
                  <span>{completed}/{lessons.length} lessons</span>
                  <span className="ml-auto">{lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0}%</span>
                </FieldLabel>
                <Progress value={(completed / lessons.length) * 100} id="lesson-progress" />
              </Field>
            </CardContent>
            <CardFooter>
              <Button asChild className="mt-auto" variant="secondary">
                <Link
                  href={lessons.length === 0 ? '' : `/platform/path/${path.slug}?confirmNewPath=true`}
                  className="w-full"
                >
                  {lessons.length === 0 ? 'Coming Soon' : (completed === lessons.length ? 'Review Path' : 'Continue Learning')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
