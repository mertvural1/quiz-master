export enum GameConstants {
  QuestionCount = 15,
  InitialCurrentIndex = 0,
  InitialTime = 30,
  OptionCount = 4,
  BarrierQuestionIndex = 4,
  InitialPrizeAmount = 1000000,
  AnswerDelayBaseMs = 2000,
  AnswerDelayRangeMs = 3000,
  AudienceCorrectChancePercent = 60,
  AudienceWrongChancePercent = 40,
  AudienceVoteSplitCount = 3,
}

export enum DifficultyRank {
  Easy = 1,
  Medium = 2,
  Hard = 3,
}

export enum PrizeLevelValue {
  One = 100,
  Two = 200,
  Three = 300,
  Four = 500,
  Five = 1000,
  Six = 2000,
  Seven = 4000,
  Eight = 8000,
  Nine = 16000,
  Ten = 32000,
  Eleven = 64000,
  Twelve = 125000,
  Thirteen = 250000,
  Fourteen = 500000,
  Fifteen = 1000000,
}

export enum AppLanguage {
  Turkish = 'tr',
  English = 'en',
}
