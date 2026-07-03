import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { prisma } from '@/lib/prisma';
import vscode2026DarkTheme from '@/lib/vscode-2026-dark.theme.json';
import { convertVscodeThemeToPrism } from '@/lib/vscode-theme-to-prism';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Unit } from '@/generated/prisma/client';

const vscode2026Dark = convertVscodeThemeToPrism(vscode2026DarkTheme);

export default async function LessonOverview({ unit }: { unit: Unit }) {
  const lessons = await prisma.lesson.findMany({
    where: { unitId: unit.id },
  });

  return (
    <Accordion type="single" collapsible defaultValue="item-0">
      {lessons.map((lesson, index) => (
        <AccordionItem value={`item-${index}`} key={lesson.id}>
          <AccordionTrigger>{lesson.title}</AccordionTrigger>
          <AccordionContent className="h-auto">
            <div className="wrap-break-word whitespace-pre-wrap">
              <Markdown
                components={{
                  code(props) {
                    const { children, className, ...rest } = props as Omit<
                      typeof props,
                      'ref' | 'node'
                    >;
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        language={match[1]}
                        style={vscode2026Dark}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...rest} className={className}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {lesson.content}
              </Markdown>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
