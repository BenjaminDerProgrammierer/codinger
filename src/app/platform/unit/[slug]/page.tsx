import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import LessonOverview from '@/components/LessonOverview';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const unit = await prisma.unit.findUnique({
    where: { slug },
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

  return (
    <>
      <p className="text-sm font-medium text-muted-foreground">Unit</p>
      <h2 className="mb-2 font-heading text-2xl">{unit.title}</h2>
      <p className="text-muted-foreground">{unit.description}</p>
      <LessonOverview unit={unit} />
    </>
  );
}
