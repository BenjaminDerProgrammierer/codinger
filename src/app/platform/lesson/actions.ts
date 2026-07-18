'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function setLessonCompletion(
  lessonId: number,
  completed: boolean,
  exercisesPassed = false
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error('You must be signed in to update lesson progress.');
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, content: true },
  });

  if (!lesson) {
    throw new Error('Lesson not found.');
  }

  const hasExercises = /^:{3,}exercise\b/m.test(lesson.content);

  if (completed && hasExercises && !exercisesPassed) {
    throw new Error('Pass all exercise tests before completing this lesson.');
  }

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    create: { userId: session.user.id, lessonId, completed },
    update: { completed },
  });

  revalidatePath('/platform', 'layout');
  return { completed };
}
