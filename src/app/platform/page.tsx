import LearningPaths from '@/components/LearningPaths';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <p className="mb-4">
        Hey there! Welcome to Codinger. Codinger is designed to help you learn
        web programming and build awesome web applications in no time.
      </p>
      <Button
        className="mx-auto mb-4 block"
        variant="default"
        size="lg"
        asChild
      >
        <Link
          href="/platform/continue-learning"
          className="mx-auto flex w-fit items-center justify-center"
        >
          Continue Learning
        </Link>
      </Button>
      <h2 className="mb-4 font-heading text-2xl">Learning Paths</h2>
      <p className="mb-4">
        You can start your learning journey by choosing one of the following
        paths:
      </p>
      <LearningPaths />
    </>
  );
}
