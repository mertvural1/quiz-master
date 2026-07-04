import { describe, expect, it } from 'vitest';
import { AppLanguage } from '../enums/game';
import { setLanguage, translate } from './index';

describe('language translations', () => {
  it('switches UI text to English when English is selected', () => {
    setLanguage(AppLanguage.English);
    expect(translate('startButton')).toBe('Start');
    expect(translate('gameTitle')).toBe('WHO WANTS TO BE A MILLIONAIRE');
  });
});
