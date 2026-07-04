import { AppLanguage, DifficultyRank, GameConstants, PrizeLevelValue } from '../enums/game';
import { getLanguage } from '../lang';
import type { NormalizedQuestion, TriviaQuestionItem } from '../types/game';

export const prizeLevels = [
  PrizeLevelValue.One,
  PrizeLevelValue.Two,
  PrizeLevelValue.Three,
  PrizeLevelValue.Four,
  PrizeLevelValue.Five,
  PrizeLevelValue.Six,
  PrizeLevelValue.Seven,
  PrizeLevelValue.Eight,
  PrizeLevelValue.Nine,
  PrizeLevelValue.Ten,
  PrizeLevelValue.Eleven,
  PrizeLevelValue.Twelve,
  PrizeLevelValue.Thirteen,
  PrizeLevelValue.Fourteen,
  PrizeLevelValue.Fifteen,
];

export function getDifficultyRank(difficulty?: string) {
  const value = String(difficulty || 'Kolay').toLowerCase();
  if (value.includes('zor') || value.includes('hard')) return DifficultyRank.Hard;
  if (value.includes('orta') || value.includes('medium')) return DifficultyRank.Medium;
  return DifficultyRank.Easy;
}

export function sortQuestionsByDifficulty(items: NormalizedQuestion[]) {
  const remaining = [...items];
  const ordered: NormalizedQuestion[] = [];
  const targetBuckets = [
    { rank: DifficultyRank.Easy, count: 5 },
    { rank: DifficultyRank.Medium, count: 5 },
    { rank: DifficultyRank.Hard, count: 5 },
  ];

  targetBuckets.forEach(({ rank, count }) => {
    for (let index = 0; index < count; index += 1) {
      const matchIndex = remaining.findIndex((item) => getDifficultyRank(item.difficulty) === rank);
      const nextItem = matchIndex >= 0 ? remaining.splice(matchIndex, 1)[0] : remaining.shift();
      if (nextItem) {
        ordered.push(nextItem);
      }
    }
  });

  return ordered.slice(0, GameConstants.QuestionCount);
}

export function shuffle<T>(array: T[]) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function decodeTriviaValue(value: string) {
  if (typeof value !== 'string') return '';
  try {
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      const binary = window.atob(value);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    }
  } catch (error) {
    console.error('Failed to decode trivia value', error);
  }
  return value;
}

async function translateText(value: string) {
  if (typeof value !== 'string' || !value.trim()) return value;

  const language = getLanguage();
  if (language !== AppLanguage.Turkish) return value;

  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(value)}`);
    const payload = await response.json().catch(() => null);

    if (Array.isArray(payload) && Array.isArray(payload[0])) {
      return payload[0].map((item) => (Array.isArray(item) ? item[0] : '')).join('');
    }
  } catch (error) {
    console.error('Failed to translate trivia text', error);
  }

  return value;
}

export async function normalizeQuestion(item?: TriviaQuestionItem): Promise<NormalizedQuestion | null> {
  if (!item) return null;

  if (typeof item.question === 'string' && Array.isArray(item.options) && typeof item.answer === 'string') {
    const rawQuestion = decodeTriviaValue(item.question);
    const rawOptions = item.options.map(decodeTriviaValue).filter(Boolean).slice(0, GameConstants.OptionCount);
    if (rawOptions.length < GameConstants.OptionCount) return null;
    const answer = decodeTriviaValue(item.answer);
    const options = shuffle([answer, ...rawOptions.filter((option) => option !== answer)]).filter(Boolean);
    const [translatedQuestion, translatedAnswer, ...translatedOptions] = await Promise.all([
      translateText(rawQuestion),
      translateText(answer),
      ...options.slice(0, GameConstants.OptionCount).map((option) => translateText(option)),
    ]);

    return {
      question: translatedQuestion,
      options: translatedOptions.slice(0, GameConstants.OptionCount),
      answer: translatedAnswer,
      difficulty: item.difficulty || 'Kolay',
    };
  }

  if (typeof item.question === 'string' && typeof item.correct_answer === 'string' && Array.isArray(item.incorrect_answers)) {
    const question = decodeTriviaValue(item.question);
    const answer = decodeTriviaValue(item.correct_answer);
    const incorrectAnswers = item.incorrect_answers.map(decodeTriviaValue).filter(Boolean);
    const options = shuffle([answer, ...incorrectAnswers]).filter(Boolean);
    if (options.length < GameConstants.OptionCount) return null;
    const [translatedQuestion, translatedAnswer, ...translatedOptions] = await Promise.all([
      translateText(question),
      translateText(answer),
      ...options.slice(0, GameConstants.OptionCount).map((option) => translateText(option)),
    ]);

    return {
      question: translatedQuestion,
      options: translatedOptions.slice(0, GameConstants.OptionCount),
      answer: translatedAnswer,
      difficulty: item.difficulty === 'hard' ? 'Zor' : item.difficulty === 'medium' ? 'Orta' : 'Kolay',
    };
  }

  return null;
}

export const QUESTION_CACHE_KEY = 'kim-1m-dolar-questions';

export function readCachedQuestions() {
  if (typeof window === 'undefined') return null;
  try {
    const cached = window.localStorage.getItem(QUESTION_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error('Failed to read cached questions', error);
    return null;
  }
}

export function writeCachedQuestions(items: NormalizedQuestion[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(QUESTION_CACHE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cached questions', error);
  }
}
