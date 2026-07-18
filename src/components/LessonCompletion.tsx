'use client';

import { useState, useTransition } from 'react';
import { Check, Circle, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import { setLessonCompletion } from '@/app/platform/lesson/actions';
import { Button } from '@/components/ui/button';
import { useLessonExerciseProgress } from './LessonExerciseProgress';

export default function LessonCompletion({
  lessonId,
  initialCompleted,
}: {
  lessonId: number;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const { allExercisesPassed } = useLessonExerciseProgress();
  const completionLocked = !completed && !allExercisesPassed;

  function toggleCompletion() {
    const nextCompleted = !completed;
    setCompleted(nextCompleted);

    startTransition(async () => {
      try {
        await setLessonCompletion(
          lessonId,
          nextCompleted,
          nextCompleted ? allExercisesPassed : true
        );
      } catch {
        setCompleted(!nextCompleted);
        toast.error('Could not update lesson progress. Please try again.');
      }
    });
  }

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex items-center gap-2 text-sm font-medium">
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : completed ? (
          <Check className="size-4 text-primary" />
        ) : (
          <Circle className="size-4 text-muted-foreground" />
        )}
        <span>{completed ? 'Lesson completed' : 'Lesson in progress'}</span>
      </div>
      <Button
        className="w-full"
        variant={completed ? 'outline' : 'default'}
        onClick={toggleCompletion}
        disabled={isPending || completionLocked}
      >
        {completed ? 'Mark as incomplete' : 'Mark lesson complete'}
      </Button>
      {completionLocked && (
        <p className="text-sm text-muted-foreground">
          Pass all exercise tests to complete this lesson.
        </p>
      )}
    </div>
  );
}
