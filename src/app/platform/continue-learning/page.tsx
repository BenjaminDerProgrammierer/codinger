import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { currentPathSlug: true },
  });

  if (!user?.currentPathSlug) redirect('/platform');

  const lessons = await prisma.lesson.findMany({
    where: { unit: { learningPath: { slug: user.currentPathSlug } } },
    orderBy: { slug: 'asc' },
    include: {
      userProgresses: {
        where: { userId: session.user.id, completed: true },
        select: { id: true },
      },
    },
  });

  const lesson =
    lessons.find((item) => item.userProgresses.length === 0) ?? lessons.at(-1);

  if (!lesson) redirect(`/platform/path/${user.currentPathSlug}`);
  redirect(`/platform/lesson/${lesson.slug}`);
}
