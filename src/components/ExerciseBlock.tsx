'use client';

import {
  // Sandpack,
  // SandpackCodeEditor,
  // SandpackConsole,
  // SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackTests,
  useActiveCode,
  SandpackStack,
  FileTabs,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';

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
        <SandpackProvider
          template="static"
          files={{
            '/index.html': {
              code: starter || '',
              active: true,
            },
            '/exercise.test.js': {
              code: tests || '',
              readOnly: true,
            },
          }}
          options={{
            classes: {
              'sp-layout': 'h-[500px] w-full',
            },
          }}
        >
          <SandpackLayout className="h-full w-full">
            {/* <SandpackFileExplorer /> */}
            {/* <SandpackConsole /> */}
            <MonacoEditor />
            <SandpackTests />
            <SandpackPreview showOpenInCodeSandbox={false}></SandpackPreview>
          </SandpackLayout>
        </SandpackProvider>
      </CardContent>
    </Card>
  );
}

function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const monaco = useMonaco();

  useEffect(() => {
    monaco?.editor.defineTheme('dark-2026', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.lineHighlightBackground': '#2d2d2d',
      },
    });
  }, [monaco]);

  return (
    <SandpackStack>
      <FileTabs />
      <Editor
        width="100%"
        height="100%"
        language="javascript"
        theme="vs-dark"
        key={sandpack.activeFile}
        defaultValue={code}
        onChange={(value) => updateCode(value || '')}
      />
    </SandpackStack>
  );
}
