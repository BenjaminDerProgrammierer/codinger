import type { CSSProperties } from 'react';

type ThemeTokenColor = {
  scope?: string | string[];
  settings?: {
    foreground?: string;
    background?: string;
    fontStyle?: string;
  };
};

type VscodeTheme = {
  colors?: Record<string, string>;
  tokenColors?: ThemeTokenColor[];
};

const PRISM_SCOPE_MAP: Record<string, string[]> = {
  comment: ['comment'],
  punctuation: ['punctuation'],
  keyword: [
    'keyword',
    'storage.type',
    'storage.modifier.import',
    'storage.modifier.package',
    'storage',
  ],
  string: ['string'],
  number: ['constant.numeric', 'number'],
  constant: [
    'constant.other.placeholder',
    'constant.character',
    'constant',
    'entity.name.constant',
    'variable.other.constant',
    'variable.other.enummember',
    'variable.language',
    'entity',
  ],
  function: ['entity.name.function', 'support.function'],
  tag: ['entity.name.tag', 'support.class.component'],
  'attr-name': [
    'meta.property-name',
    'support.type.property-name',
    'entity.other.attribute-name',
  ],
  'attr-value': ['string', 'constant.character'],
  variable: [
    'variable.parameter.function',
    'meta.jsx.children',
    'meta.block',
    'meta.tag.attributes',
    'meta.object.member',
    'meta.embedded.expression',
    'variable',
    'variable.other',
  ],
  builtin: ['support', 'support.constant', 'support.variable', 'support.type'],
  regex: ['source.regexp', 'string.regexp'],
  important: ['invalid', 'message.error'],
  operator: ['operator', 'punctuation.section.embedded'],
  deleted: [
    'markup.deleted',
    'punctuation.definition.deleted',
    'meta.diff.header.from-file',
  ],
  inserted: [
    'markup.inserted',
    'punctuation.definition.inserted',
    'meta.diff.header.to-file',
  ],
  changed: ['markup.changed', 'punctuation.definition.changed'],
  selector: ['selector', 'meta.selector'],
  'class-name': ['entity.name', 'entity.name.type.class', 'support.class'],
};

function toCssProperties(
  fontStyle?: string,
  foreground?: string
): CSSProperties {
  const styles: CSSProperties = {};

  if (foreground) {
    styles.color = foreground;
  }

  if (!fontStyle) {
    return styles;
  }

  const parts = fontStyle.split(/\s+/).filter(Boolean);

  if (parts.includes('italic')) {
    styles.fontStyle = 'italic';
  }

  if (parts.includes('bold')) {
    styles.fontWeight = 'bold';
  }

  if (parts.includes('underline')) {
    styles.textDecoration = 'underline';
  }

  return styles;
}

function scopeMatches(scope: string, target: string): boolean {
  return (
    scope === target ||
    scope.startsWith(`${target}.`) ||
    scope.startsWith(`${target} `) ||
    scope.includes(`.${target}.`)
  );
}

function normalizeScopes(scope?: string | string[]): string[] {
  if (!scope) {
    return [];
  }

  return Array.isArray(scope) ? scope : [scope];
}

export function convertVscodeThemeToPrism(
  theme: VscodeTheme
): Record<string, CSSProperties> {
  const colors = theme.colors ?? {};
  const prismTheme: Record<string, CSSProperties> = {
    'code[class*="language-"]': {
      color: colors.foreground ?? '#bfbfbf',
      background:
        colors['textCodeBlock.background'] ??
        colors['editor.background'] ??
        '#121314',
    },
    'pre[class*="language-"]': {
      color: colors.foreground ?? '#bfbfbf',
      background:
        colors['textCodeBlock.background'] ??
        colors['editor.background'] ??
        '#121314',
    },
    token: {
      color: colors.foreground ?? '#bfbfbf',
    },
    doctype: {
      color: colors['textPreformat.foreground'] ?? '#8C8C8C',
    },
    'doctype-tag': {
      color: colors['textPreformat.foreground'] ?? '#8C8C8C',
    },
  };

  for (const [prismToken, scopes] of Object.entries(PRISM_SCOPE_MAP)) {
    for (const tokenColor of theme.tokenColors ?? []) {
      const tokenScopes = normalizeScopes(tokenColor.scope);

      if (
        !tokenScopes.some((scope) =>
          scopes.some((targetScope) => scopeMatches(scope, targetScope))
        )
      ) {
        continue;
      }

      const { foreground, fontStyle } = tokenColor.settings ?? {};
      const currentStyle = prismTheme[prismToken] ?? {};

      prismTheme[prismToken] = {
        ...currentStyle,
        ...toCssProperties(fontStyle, foreground),
      };
    }
  }

  return prismTheme;
}
