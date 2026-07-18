'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ExerciseProgressContextValue = {
  allExercisesPassed: boolean;
  registerExercise: (exerciseKey: string) => () => void;
  reportExerciseResult: (exerciseKey: string, passed: boolean) => void;
};

const ExerciseProgressContext =
  createContext<ExerciseProgressContextValue | null>(null);

export function LessonExerciseProgressProvider({
  children,
  exerciseCount,
}: {
  children: React.ReactNode;
  exerciseCount: number;
}) {
  const [results, setResults] = useState<Record<string, boolean>>({});

  const registerExercise = useCallback((exerciseKey: string) => {
    setResults((current) => ({ ...current, [exerciseKey]: false }));

    return () => {
      setResults((current) => {
        const next = { ...current };
        delete next[exerciseKey];
        return next;
      });
    };
  }, []);

  const reportExerciseResult = useCallback(
    (exerciseKey: string, passed: boolean) => {
      setResults((current) => ({ ...current, [exerciseKey]: passed }));
    },
    []
  );

  const allExercisesPassed =
    exerciseCount === 0 ||
    (Object.keys(results).length === exerciseCount &&
      Object.values(results).every(Boolean));

  const value = useMemo(
    () => ({
      allExercisesPassed,
      registerExercise,
      reportExerciseResult,
    }),
    [allExercisesPassed, registerExercise, reportExerciseResult]
  );

  return (
    <ExerciseProgressContext.Provider value={value}>
      {children}
    </ExerciseProgressContext.Provider>
  );
}

export function useLessonExerciseProgress() {
  const context = useContext(ExerciseProgressContext);

  if (!context) {
    throw new Error(
      'useLessonExerciseProgress must be used inside LessonExerciseProgressProvider.'
    );
  }

  return context;
}
