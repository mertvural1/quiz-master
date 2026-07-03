export interface NormalizedQuestion {
  question: string;
  options: string[];
  answer: string;
  difficulty: string;
}

export interface TriviaQuestionItem {
  question?: string;
  options?: string[];
  answer?: string;
  correct_answer?: string;
  incorrect_answers?: string[];
  difficulty?: string;
}

export interface TranslationValues {
  [key: string]: string | number;
}
