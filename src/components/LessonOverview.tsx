import Markdown, { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import ExerciseBlock from '@/components/ExerciseBlock';

type MDASTNode = {
  type: string;
  name?: string;
  value?: string;
  children?: MDASTNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

import vscode2026DarkTheme from '@/lib/vscode-2026-dark.theme.json';
import { convertVscodeThemeToPrism } from '@/lib/vscode-theme-to-prism';

const vscode2026Dark = convertVscodeThemeToPrism(vscode2026DarkTheme);
type MarkdownCodeProps = {
  children?: React.ReactNode;
  className?: string;
};

const markdownComponents = {
  'exercise-block': ExerciseBlock,
  table: ({ children, ...props }: { children: React.ReactNode }) => (
    <table className="w-full border-collapse text-sm" {...props}>
      {children}
    </table>
  ),
  thead: ({ children, ...props }: { children: React.ReactNode }) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: { children: React.ReactNode }) => (
    <tbody {...props}>{children}</tbody>
  ),
  tr: ({ children, ...props }: { children: React.ReactNode }) => (
    <tr className="border-t" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: { children: React.ReactNode }) => (
    <th className="px-2 py-1 text-left font-medium" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: { children: React.ReactNode }) => (
    <td className="px-2 py-1" {...props}>
      {children}
    </td>
  ),
  h1: ({ children, ...props }: { children: React.ReactNode }) => (
    <h1 className="mt-4 mb-2 font-heading text-3xl" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: { children: React.ReactNode }) => (
    <h2 className="mt-4 mb-2 font-heading text-2xl" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: { children: React.ReactNode }) => (
    <h3 className="mt-4 mb-2 font-heading text-xl" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: { children: React.ReactNode }) => (
    <h4 className="mt-4 mb-2 font-heading text-lg" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: { children: React.ReactNode }) => (
    <h5 className="mt-4 mb-2 font-heading text-base" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: { children: React.ReactNode }) => (
    <h6 className="mt-4 mb-2 font-heading text-sm" {...props}>
      {children}
    </h6>
  ),
  code(props: MarkdownCodeProps) {
    const { children, className, ...rest } = props as Omit<
      MarkdownCodeProps,
      'ref' | 'node'
    >;
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <SyntaxHighlighter
        {...rest}
        PreTag="div"
        className="max-w-full overflow-x-auto"
        language={match[1]}
        style={vscode2026Dark}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code
        {...rest}
        className={`${className ?? ''} rounded bg-accent px-1 font-mono`}
      >
        {children}
      </code>
    );
  },
} as Components;

export default function LessonOverview({ content }: { content: string }) {
  return (
    <div className="wrap-break-word whitespace-pre-wrap *:m-0!">
      <Markdown
        remarkPlugins={[remarkDirective, remarkGfm, myRemarkPlugin]}
        components={markdownComponents}
      >
        {content}
      </Markdown>
    </div>
  );
}

function myRemarkPlugin() {
  return (tree: MDASTNode): void => {
    visit(tree as unknown as MDASTNode, (node: unknown) => {
      const n = node as MDASTNode;
      if (
        n.type === 'containerDirective' ||
        n.type === 'leafDirective' ||
        n.type === 'textDirective'
      ) {
        if (n.name !== 'exercise') return;

        const children = n.children ?? [];

        const textContents = children
          .filter((child) => child.type === 'paragraph')
          .map((child) =>
            (child.children ?? []).map((gc) => gc.value ?? '').join('')
          )
          .join('\n\n');

        const codeBlocks = children.filter((child) => child.type === 'code');

        const id = textContents.match(/id:\s*(.*)/)?.[1]?.trim();
        const language = textContents.match(/language:\s*(.*)/)?.[1]?.trim();
        const difficulty = textContents
          .match(/difficulty:\s*(.*)/)?.[1]
          ?.trim();
        const prompt = textContents
          .match(/Prompt:\s*\n\n([\s\S]*?)\n\nStarter:/)?.[1]
          ?.trim();

        const starter = codeBlocks[0]?.value;
        const tests = codeBlocks[1]?.value;

        n.data = {
          hName: 'exercise-block',
          hProperties: {
            id,
            language,
            difficulty,
            prompt,
            starter,
            tests,
          },
        };
      }
    });
  };
}
