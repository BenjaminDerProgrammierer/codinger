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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Editor, { EditorProps, useMonaco } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { emmetHTML, emmetCSS } from 'emmet-monaco-es';

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
          customSetup={{
            environment: 'parcel',
            entry: '/index.html',
          }}
          files={{
            '/index.html': {
              code: starter || '',
              active: true,
            },
            '/exercise.test.js': {
              code: tests || '',
              readOnly: true,
              hidden: true,
            },
          }}
        >
          <SandpackLayout className="block!" suppressHydrationWarning>
            <FileTabs />
            <MonacoEditor className="h-80" />
            <SandpackPreview className="h-80" />
            <SandpackTests className="h-60" />
          </SandpackLayout>
        </SandpackProvider>
      </CardContent>
    </Card>
  );
}

function MonacoEditor(props?: EditorProps) {
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
      onChange={(value) => updateCode(value || '')}
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
