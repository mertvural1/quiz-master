import translations from './tr.json';

export type TranslationKey = keyof typeof translations;

export const tr = translations as Record<string, string>;

export function translate(key: string, values: Record<string, string | number> = {}) {
  const template = tr[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, token: string) => String(values[token] ?? ''));
}
