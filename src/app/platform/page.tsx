import LearningPaths from '@/components/LearningPaths';

export default function Page() {
  return (
    <>
      <p className="mb-4">
        Hey there! Welcome to Codinger. Codinger is designed to help you learn
        web programming and build awesome web applications in no time. To get
        started, choose one of the following learning paths:
      </p>
      <h2 className="mb-4 font-heading text-2xl">Learning Paths</h2>
      <p className="mb-4">You may choose one of the following paths:</p>
      <LearningPaths />
    </>
  );
}
