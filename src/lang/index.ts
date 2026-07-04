import { AppLanguage } from '../enums/game';
import trTranslations from './tr.json';
import enTranslations from './en.json';

export type TranslationKey = keyof typeof trTranslations;

const dictionaries = {
  [AppLanguage.Turkish]: trTranslations as Record<string, string>,
  [AppLanguage.English]: enTranslations as Record<string, string>,
};

let currentLanguage: keyof typeof dictionaries = AppLanguage.Turkish;

export function setLanguage(language: keyof typeof dictionaries) {
  currentLanguage = language;
}

export function getLanguage() {
  return currentLanguage;
}

export function translate(key: string, values: Record<string, string | number> = {}) {
  const template = dictionaries[currentLanguage][key] ?? dictionaries[AppLanguage.Turkish][key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, token: string) => String(values[token] ?? ''));
}
