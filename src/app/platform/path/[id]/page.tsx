import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import UnitOverview from '@/components/UnitOverview';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { confirmNewPath } = (await searchParams) || {};

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });

  if (!session || !user) {
    redirect('/login');
  }

  if (id === 'current') {
    if (user.currentPathId) {
      redirect(`/platform/path/${user.currentPathId}`);
    } else {
      redirect('/platform/');
    }
  }

  const path = await prisma.learningPath.findUnique({
    where: { id: Number.parseInt(id) },
  });

  if (!path) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p>Learning path not found.</p>

        <Button asChild>
          <Link href={`/platform`}>Return to Overview</Link>
        </Button>
      </div>
    );
  }

  if (confirmNewPath === 'true') {
    await prisma.user.update({
      where: { id: user.id },
      data: { currentPathId: path.id },
    });

    // Server-side redirect to the same page without query params
    redirect(`/platform/path/${id}`);
  }

  return (
    <>
      <p className="text-sm font-medium text-muted-foreground">Path</p>
      <h2 className="mb-2 font-heading text-2xl">{path.title}</h2>
      <p className="text-muted-foreground">{path.description}</p>
      <UnitOverview path={path} />
    </>
  );
}
