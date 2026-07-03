import { useEffect, useMemo, useRef, useState } from 'react';
import { translate } from '../lang';
import { GameConstants } from '../enums/game';
import type { NormalizedQuestion, TriviaQuestionItem } from '../types/game';
import { normalizeQuestion, prizeLevels, readCachedQuestions, sortQuestionsByDifficulty, writeCachedQuestions } from '../lib/quiz';

export function useQuizGame() {
  const [questions, setQuestions] = useState<NormalizedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(GameConstants.InitialCurrentIndex);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [wonAmount, setWonAmount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [jokerHalf, setJokerHalf] = useState(true);
  const [jokerAudience, setJokerAudience] = useState(true);
  const [audienceResult, setAudienceResult] = useState<number[] | null>(null);
  const [timeLeft, setTimeLeft] = useState(GameConstants.InitialTime);
  const [loading, setLoading] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState<string[]>([]);
  const [isWithdrawn, setIsWithdrawn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [correctAnswerToShow, setCorrectAnswerToShow] = useState<string | null>(null);
  const initialLoadAttemptedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentPrizeRef = useRef<HTMLDivElement | null>(null);

  const ensureAudioContext = () => {
    if (typeof window === 'undefined') return null;
    if (!audioContextRef.current) {
      const AudioContextCtor = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return null;
      audioContextRef.current = new AudioContextCtor();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    return audioContextRef.current;
  };

  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.05) => {
    const audioContext = ensureAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playApplauseSound = () => {
    const sequence = [660, 880, 1040, 1320];
    sequence.forEach((frequency, index) => {
      window.setTimeout(() => playTone(frequency, 0.16, 'triangle', 0.03 + index * 0.005), index * 90);
    });
  };

  const playBooSound = () => {
    const audioContext = ensureAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(180, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(90, audioContext.currentTime + 0.35);
    gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.35);
  };

  const requestFullscreen = () => {
    if (typeof document === 'undefined') return;
    const target = document.documentElement;
    if (target.requestFullscreen) {
      target.requestFullscreen().catch(() => {});
    }
  };

  const resetGameState = () => {
    setCurrentIndex(GameConstants.InitialCurrentIndex);
    setSelected(null);
    setFeedback('');
    setWonAmount(0);
    setGameOver(false);
    setJokerHalf(true);
    setJokerAudience(true);
    setAudienceResult(null);
    setVisibleOptions([]);
    setTimeLeft(GameConstants.InitialTime);
    setIsWithdrawn(false);
    setShowResultModal(false);
    setCorrectAnswerToShow(null);
  };

  const loadQuestions = async (force = false) => {
    if (!force && initialLoadAttemptedRef.current) {
      return;
    }

    if (!force) {
      initialLoadAttemptedRef.current = true;
    }

    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_TRIVIA_API_URL);
      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.response_code !== 0) {
        throw new Error('trivia-api');
      }
      

      const normalized = (
        await Promise.all((Array.isArray(payload.results) ? payload.results : []).map((item: TriviaQuestionItem) => normalizeQuestion(item)))
      ).filter(Boolean) as NormalizedQuestion[];
      const sorted = sortQuestionsByDifficulty(normalized).slice(0, GameConstants.QuestionCount);

      if (sorted.length === GameConstants.QuestionCount) {
        writeCachedQuestions(sorted);
        setQuestions(sorted);
        resetGameState();
        setLoading(false);
        return;
      }

      throw new Error('invalid');
    } catch (error) {
      console.error('Open Trivia API fetch failed', error);
      const cachedQuestions = readCachedQuestions();
      const normalizedCache = (await Promise.all((Array.isArray(cachedQuestions) ? cachedQuestions : []).map((item) => normalizeQuestion(item)))).filter(Boolean) as NormalizedQuestion[];
      if (normalizedCache.length === GameConstants.QuestionCount) {
        setQuestions(normalizedCache);
        resetGameState();
        setLoading(false);
        return;
      }

      setQuestions([]);
      setLoading(false);
      setFeedback(translate('questionsFailed'));
      window.alert(translate('questionsFailedAlert'));
    }
  };

  const handleStartGame = async () => {
    setGameStarted(true);
    requestFullscreen();
    await loadQuestions(true);
  };

  useEffect(() => {
    if (loading || questions.length === 0) return;
    setVisibleOptions(questions[0].options.map((option) => option));
    setTimeLeft(GameConstants.InitialTime);
  }, [loading, questions]);

  useEffect(() => {
    if (loading || gameOver || questions.length === 0 || currentIndex >= GameConstants.BarrierQuestionIndex + 1 || selected !== null) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          playBooSound();
          const safeAmount = currentIndex <= GameConstants.BarrierQuestionIndex ? 0 : prizeLevels[GameConstants.BarrierQuestionIndex] ?? 0;
          setWonAmount(safeAmount);
          setIsWithdrawn(false);
          setFeedback(translate('timeUp'));
          setGameOver(true);
          setCorrectAnswerToShow(null);
          setShowResultModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [loading, gameOver, questions.length, currentIndex, selected]);

  const currentQuestion = questions[currentIndex];
  const safeQuestion = currentQuestion || null;
  const prizeAtCurrentLevel = useMemo(() => prizeLevels[currentIndex] ?? GameConstants.InitialPrizeAmount, [currentIndex]);
  const timerEnabled = !loading && !gameOver && questions.length > 0 && currentIndex <= GameConstants.BarrierQuestionIndex;
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    if (!safeQuestion) return;
    setVisibleOptions(safeQuestion.options.map((option) => option));
    setSelected(null);
    setFeedback('');
    setAudienceResult(null);
    setTimeLeft(GameConstants.InitialTime);
  }, [safeQuestion, currentIndex]);

  useEffect(() => {
    if (currentPrizeRef.current) {
      currentPrizeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex]);

  const handleAnswer = (option: string) => {
    if (!safeQuestion || selected || !visibleOptions.includes(option)) return;

    setSelected(option);
    setFeedback(translate('evaluating'));

    const delayMs = GameConstants.AnswerDelayBaseMs + Math.floor(Math.random() * GameConstants.AnswerDelayRangeMs);
    window.setTimeout(() => {
      if (option === safeQuestion.answer) {
        playApplauseSound();
        setFeedback(translate('correctAnswer'));
        setWonAmount(prizeAtCurrentLevel);
        if (isLastQuestion) {
          setGameOver(true);
        } else {
          window.setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
          }, 800);
        }
      } else {
        playBooSound();
        const previousSafeAmount = currentIndex <= GameConstants.BarrierQuestionIndex ? 0 : prizeLevels[GameConstants.BarrierQuestionIndex] ?? 0;
        setWonAmount(previousSafeAmount);
        setIsWithdrawn(false);
        setFeedback(`${translate('wrongAnswer')} ${translate('resultEndedLabel', { amount: previousSafeAmount.toLocaleString() })}`);
        setGameOver(true);
        setCorrectAnswerToShow(safeQuestion.answer);
        setShowResultModal(true);
      }
    }, delayMs);
  };

  const handleWithdraw = () => {
    if (gameOver || !safeQuestion) return;
    setIsWithdrawn(true);
    setFeedback(translate('withdrawResult', { amount: wonAmount.toLocaleString() }));
    setGameOver(true);
    setCorrectAnswerToShow(null);
    setShowResultModal(true);
  };

  const useHalfJoker = () => {
    if (!jokerHalf || !safeQuestion) return;
    setJokerHalf(false);
    const correctIndex = safeQuestion.options.indexOf(safeQuestion.answer);
    const removeIndices = [0, 1, 2, 3].filter((idx) => idx !== correctIndex);
    const toRemove = removeIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    const nextVisible = safeQuestion.options.map((option, idx) => (toRemove.includes(idx) ? null : option));
    setVisibleOptions(nextVisible.filter((option): option is string => typeof option === 'string'));
    setFeedback(translate('halfJokerUsed'));
  };

  const useAudienceJoker = () => {
    if (!jokerAudience || !safeQuestion) return;
    setJokerAudience(false);
    const correctChance = Math.random() < 0.6;
    const votes = [0, 0, 0, 0];
    const correctIndex = safeQuestion.options.indexOf(safeQuestion.answer);
    votes[correctIndex] = correctChance ? GameConstants.AudienceCorrectChancePercent : GameConstants.AudienceWrongChancePercent;
    const others = 100 - votes[correctIndex];
    const split = others / GameConstants.AudienceVoteSplitCount;
    for (let i = 0; i < votes.length; i += 1) {
      if (i !== correctIndex) votes[i] = Math.round(split);
    }
    setAudienceResult(votes);
    setFeedback(translate('audienceJokerUsed'));
  };

  const restartGame = async () => {
    await loadQuestions(true);
  };

  const closeResultModal = () => {
    setShowResultModal(false);
  };

  return {
    questions,
    currentIndex,
    selected,
    feedback,
    wonAmount,
    gameOver,
    jokerHalf,
    jokerAudience,
    audienceResult,
    timeLeft,
    loading,
    visibleOptions,
    isWithdrawn,
    gameStarted,
    showResultModal,
    correctAnswerToShow,
    safeQuestion,
    prizeAtCurrentLevel,
    timerEnabled,
    isLastQuestion,
    currentPrizeRef,
    handleStartGame,
    handleAnswer,
    handleWithdraw,
    useHalfJoker,
    useAudienceJoker,
    restartGame,
    closeResultModal,
  };
}
