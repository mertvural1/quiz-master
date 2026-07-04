import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppLanguage } from '../enums/game';
import { setLanguage } from '../lang';
import { normalizeQuestion } from './quiz';

describe('question localization', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('translates fetched questions to Turkish when Turkish is selected', async () => {
    setLanguage(AppLanguage.Turkish);

    vi.stubGlobal('fetch', vi.fn((input: string | URL | Request) => {
      const url = String(input);
      if (url.includes('translate.googleapis.com')) {
        return Promise.resolve({
          json: async () => [[['2 + 2 kaçtır?']], null, null],
        } as Response);
      }

      return Promise.resolve({
        json: async () => ({
          response_code: 0,
          results: [
            {
              question: 'What is 2 + 2?',
              correct_answer: '4',
              incorrect_answers: ['5', '6', '7'],
              difficulty: 'easy',
              type: 'multiple',
              category: 'General Knowledge',
            },
          ],
        }),
      } as Response);
    }));

    const question = await normalizeQuestion({
      question: 'What is 2 + 2?',
      correct_answer: '4',
      incorrect_answers: ['5', '6', '7'],
      difficulty: 'easy',
    });

    expect(question?.question).toBe('2 + 2 kaçtır?');
  });
});
