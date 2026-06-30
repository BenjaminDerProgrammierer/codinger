import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Unit } from '@/generated/prisma/client';

export default async function LessonOverview({ unit }: { unit: Unit }) {
  const lessons = await prisma.lesson.findMany({
    where: { unitId: unit.id },
  });

  return (
    <Accordion type="single" collapsible defaultValue="item-0">
      {lessons.map((lesson, index) => (
        // TODO: Disabled until this lesson is reached/previous lesson is completed
        <AccordionItem value={`item-${index}`} key={lesson.id}>
          <AccordionTrigger>{lesson.title}</AccordionTrigger>
          <AccordionContent>
            {/* TODO: Implement lesson content */}
            <p>Lesson content goes here.</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
