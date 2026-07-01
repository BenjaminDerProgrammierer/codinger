import type { Metadata } from 'next';
import { Space_Grotesk, Orbitron, Cascadia_Code } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
});

const orbitronHeading = Orbitron({
  variable: '--font-heading',
  subsets: ['latin'],
});

const fontMono = Cascadia_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  fallback: ['monospace'],
});

export const metadata: Metadata = {
  title: 'Codinger: Learn to Code',
  description:
    'A platform to learn to code by completing interactive coding exercises.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        spaceGrotesk.variable,
        orbitronHeading.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
