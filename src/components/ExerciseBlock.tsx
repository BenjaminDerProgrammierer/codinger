'use client';

import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackTests,
  useActiveCode,
  FileTabs,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Editor, { EditorProps, useMonaco } from '@monaco-editor/react';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { emmetHTML, emmetCSS } from 'emmet-monaco-es';
import { useLessonExerciseProgress } from './LessonExerciseProgress';
import { explainTestResult } from '@/app/platform/lesson/actions';
import { Button } from './ui/button';

type ExerciseBlockProps = {
  id?: string;
  language?: string;
  difficulty?: string;
  prompt?: string;
  starter?: string;
  tests?: string;
};

export default function ExerciseBlock({
  id,
  language,
  difficulty,
  prompt,
  starter,
  tests,
}: ExerciseBlockProps) {
  const exerciseKey = useId();
  const { registerExercise, reportExerciseResult } =
    useLessonExerciseProgress();
  const [failedTestResult, setFailedTestResult] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<string | null>(null);
  const [guidanceError, setGuidanceError] = useState<string | null>(null);
  const [isGuidancePending, startGuidanceTransition] = useTransition();
  const failedTestResultRef = useRef<string | null>(null);
  const currentDocumentRef = useRef(starter || '');
  const sandpackFiles = useMemo(
    () => ({
      '/index.html': {
        code: starter || '',
        active: true,
      },
      '/exercise.test.js': {
        code: tests || '',
        readOnly: true,
        hidden: true,
      },
    }),
    [starter, tests]
  );

  useEffect(
    () => registerExercise(exerciseKey),
    [exerciseKey, registerExercise]
  );

  function handleCodeChange(document: string) {
    currentDocumentRef.current = document;
    reportExerciseResult(exerciseKey, false);
  }

  function handleTestsComplete(specs: Record<string, TestBlock>) {
    if (Object.keys(specs).length === 0) return;

    const passed = allTestsPassed(specs);
    reportExerciseResult(exerciseKey, passed);

    if (passed) {
      failedTestResultRef.current = null;
      setFailedTestResult(null);
      setGuidance(null);
      setGuidanceError(null);
      return;
    }

    const nextFailedTestResult = formatFailedTestResult(specs);
    if (failedTestResultRef.current !== nextFailedTestResult) {
      setGuidance(null);
      setGuidanceError(null);
    }
    failedTestResultRef.current = nextFailedTestResult;
    setFailedTestResult(nextFailedTestResult);
  }

  function requestGuidance() {
    if (!failedTestResult) return;

    const requestedTestResult = failedTestResult;
    const requestedDocument = currentDocumentRef.current;
    setGuidanceError(null);
    startGuidanceTransition(async () => {
      try {
        const nextGuidance = await explainTestResult(
          requestedTestResult,
          requestedDocument,
          tests || ''
        );
        if (
          failedTestResultRef.current === requestedTestResult &&
          currentDocumentRef.current === requestedDocument
        ) {
          setGuidance(nextGuidance);
        }
      } catch {
        if (
          failedTestResultRef.current === requestedTestResult &&
          currentDocumentRef.current === requestedDocument
        ) {
          setGuidanceError(
            'Guidance is unavailable right now. Please try again shortly.'
          );
        }
      }
    });
  }

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Exercise {id}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex w-full flex-wrap justify-center gap-2">
          <Badge variant="default">{language}</Badge>
          <Badge variant="secondary">{difficulty}</Badge>
        </div>
        {prompt && <div className="whitespace-pre-wrap">{prompt}</div>}
        <SandpackProvider customSetup={SANDPACK_SETUP} files={sandpackFiles}>
          <SandpackLayout className="block!" suppressHydrationWarning>
            <FileTabs />
            <MonacoEditor className="h-80" onCodeChange={handleCodeChange} />
            <SandpackPreview className="h-80" />
            <SandpackTests
              className="h-60 [&_.sp-test-error]:hidden"
              showVerboseButton={false}
              onComplete={handleTestsComplete}
            />
          </SandpackLayout>
        </SandpackProvider>
        {failedTestResult && (
          <section
            className="space-y-3 border border-border bg-muted/40 p-4"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-sm font-medium">
                  Need help with the failed tests?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Get a short explanation without revealing the solution.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={requestGuidance}
                disabled={isGuidancePending || Boolean(guidance)}
              >
                {isGuidancePending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                {isGuidancePending ? 'Explaining…' : 'Explain failed tests'}
              </Button>
            </div>
            {guidance && (
              <p className="text-sm whitespace-pre-wrap">{guidance}</p>
            )}
            {guidanceError && (
              <p className="text-sm text-destructive">{guidanceError}</p>
            )}
          </section>
        )}
      </CardContent>
    </Card>
  );
}

const SANDPACK_SETUP = {
  environment: 'parcel' as const,
  entry: '/index.html',
};

type TestBlock = {
  name?: string;
  error?: unknown;
  tests?: Record<
    string,
    {
      name?: string;
      status: string;
      path?: string;
      blocks?: string[];
      errors?: unknown[];
    }
  >;
  describes?: Record<string, TestBlock>;
};

function allTestsPassed(specs: Record<string, TestBlock>) {
  const tests = Object.values(specs).flatMap(getTests);

  return (
    Object.values(specs).every((spec) => !spec.error) &&
    tests.length > 0 &&
    tests.every((test) => test.status === 'pass')
  );
}

function getTests(block: TestBlock): Array<{ status: string }> {
  return [
    ...Object.values(block.tests ?? {}),
    ...Object.values(block.describes ?? {}).flatMap(getTests),
  ];
}

function formatFailedTestResult(specs: Record<string, TestBlock>) {
  const lines: string[] = [];

  for (const [fileName, spec] of Object.entries(specs)) {
    if (spec.error) {
      lines.push(
        'Test heading: Test setup',
        `Hidden diagnostic (do not mention): ${fileName}: ${formatError(spec.error)}`
      );
    }

    collectFailedTests(spec, lines, []);
  }

  return lines.length > 0
    ? lines.join('\n')
    : 'The test run failed without returning detailed error information.';
}

function collectFailedTests(
  block: TestBlock,
  lines: string[],
  parentNames: string[]
) {
  for (const test of Object.values(block.tests ?? {})) {
    if (test.status !== 'fail') continue;

    const testName = [...parentNames, ...(test.blocks ?? []), test.name]
      .filter(Boolean)
      .join(' > ');

    lines.push(`Test heading: ${testName || 'Unnamed test'}`);

    if (test.path) {
      lines.push(`Hidden diagnostic (do not mention): Path: ${test.path}`);
    }
    for (const error of test.errors ?? []) {
      lines.push(`Hidden diagnostic (do not mention): ${formatError(error)}`);
    }
  }

  for (const describe of Object.values(block.describes ?? {})) {
    collectFailedTests(
      describe,
      lines,
      describe.name ? [...parentNames, describe.name] : parentNames
    );
  }
}

function formatError(error: unknown) {
  if (typeof error === 'string') return error;
  if (!error || typeof error !== 'object') return String(error);

  const errorWithMessage = error as { message?: unknown; stack?: unknown };
  if (typeof errorWithMessage.message === 'string') {
    return errorWithMessage.message;
  }
  if (typeof errorWithMessage.stack === 'string') return errorWithMessage.stack;

  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown test error';
  }
}

function MonacoEditor({
  onCodeChange,
  ...props
}: EditorProps & { onCodeChange: (code: string) => void }) {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const monaco = useMonaco();
  const editorRef = useRef<unknown>(null);

  useEffect(() => {
    if (!monaco || !editorRef.current) return;

    // Define custom theme
    monaco.editor.defineTheme('dark-2026', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.lineHighlightBackground': '#2d2d2d',
      },
    });
  }, [monaco]);

  // Register Emmet tab-expansion + completions for HTML and CSS
  useEffect(() => {
    if (!monaco) return;
    const disposeHTML = emmetHTML(monaco, ['html']);
    const disposeCSS = emmetCSS(monaco, ['css']);
    return () => {
      disposeHTML();
      disposeCSS();
    };
  }, [monaco]);

  return (
    <Editor
      {...props}
      width="100%"
      height="100%"
      language={sandpack.activeFile
        ?.split('.')
        .pop()
        ?.replace('js', 'javascript')}
      theme="vs-dark"
      key={sandpack.activeFile}
      defaultValue={code}
      onChange={(value) => {
        const nextCode = value || '';
        updateCode(nextCode);
        onCodeChange(nextCode);
      }}
      onMount={(editor) => {
        editorRef.current = editor;
      }}
      options={{
        suggest: {
          showSnippets: true,
        },
      }}
    />
  );
}
