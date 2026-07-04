import { translate } from '../lang';
import { GameConstants } from '../enums/game';
import type { NormalizedQuestion } from '../types/game';
import type { RefObject } from 'react';

type GameBoardProps = {
  safeQuestion: NormalizedQuestion | null;
  loading: boolean;
  currentIndex: number;
  prizeAtCurrentLevel: number;
  timerEnabled: boolean;
  timeLeft: number;
  selected: string | null;
  visibleOptions: string[];
  feedback: string;
  audienceResult: number[] | null;
  jokerHalf: boolean;
  jokerAudience: boolean;
  gameOver: boolean;
  onAnswer: (option: string) => void;
  onHalfJoker: () => void;
  onAudienceJoker: () => void;
  onWithdraw: () => void;
  currentPrizeRef: RefObject<HTMLDivElement | null>;
};

export function GameBoard({
  safeQuestion,
  loading,
  currentIndex,
  prizeAtCurrentLevel,
  timerEnabled,
  timeLeft,
  selected,
  visibleOptions,
  feedback,
  audienceResult,
  jokerHalf,
  jokerAudience,
  gameOver,
  onAnswer,
  onHalfJoker,
  onAudienceJoker,
  onWithdraw,
  currentPrizeRef,
}: GameBoardProps) {
  if (!safeQuestion || loading) {
    return (
      <div className="mx-auto mt-8 max-w-4xl rounded-[28px] border border-white/10 bg-slate-950/80 px-6 py-10 text-center text-slate-200">
        {loading ? translate('loadingState') : translate('loadingFallback')}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-4xl rounded-[24px] border border-cyan-500/20 bg-[#071324]/95 p-4 shadow-[inset_0_0_20px_rgba(14,122,255,0.12)] sm:mt-6 sm:rounded-[28px] sm:p-6">
      <div className="space-y-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-3 text-left sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400 sm:text-xs">{translate('levelLabel', { level: currentIndex + 1 })}</span>
            <span className="rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-semibold text-cyan-200 sm:px-3 sm:text-xs">{timerEnabled ? translate('timerLabel', { seconds: timeLeft }) : translate('timerDisabled')}</span>
          </div>
          <div className="mt-3 text-center text-2xl font-black text-white sm:text-3xl">{prizeAtCurrentLevel.toLocaleString()} $</div>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-[#0d1c35]/95 p-4 text-center text-base font-semibold leading-7 text-cyan-50 break-words sm:p-6 sm:text-xl sm:leading-8">
          {safeQuestion.question}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2">
        {safeQuestion.options.map((option, index) => {
          const isDisabled = selected !== null || !visibleOptions.includes(option);
          return (
            <button
              key={`${option}-${index}`}
              onClick={() => onAnswer(option)}
              disabled={isDisabled}
              className={`min-h-[56px] rounded-2xl border px-4 py-3 text-left text-sm font-semibold leading-6 transition sm:px-5 sm:py-4 ${
                !visibleOptions.includes(option)
                  ? 'cursor-not-allowed border-slate-700 bg-slate-900/60 text-slate-500'
                  : 'border-slate-700 bg-slate-900/80 hover:border-cyan-400 hover:bg-slate-800'
              } ${selected === option ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200' : 'text-white'}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-3">
        <button
          onClick={onHalfJoker}
          disabled={!jokerHalf || selected !== null}
          className="w-full rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-3 text-sm font-semibold text-fuchsia-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {translate('halfJoker', { status: jokerHalf ? translate('activeStatus') : translate('usedStatus') })}
        </button>
        <button
          onClick={onAudienceJoker}
          disabled={!jokerAudience || selected !== null}
          className="w-full rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {translate('audienceJoker', { status: jokerAudience ? translate('activeStatus') : translate('usedStatus') })}
        </button>
        <button
          onClick={onWithdraw}
          disabled={gameOver || selected !== null || currentIndex <= GameConstants.BarrierQuestionIndex}
          className="w-full rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {translate('withdraw')}
        </button>
      </div>

      {feedback && <p className="mt-4 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-center text-sm text-slate-200">{feedback}</p>}
      {audienceResult && (
        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
          <p className="mb-2 font-semibold">{translate('audienceVotesTitle')}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {audienceResult.map((vote, index) => (
              <div key={`${safeQuestion.options[index]}-${index}`} className="rounded-xl bg-slate-900/80 p-3 text-center">
                <div className="text-xs text-slate-400">{safeQuestion.options[index]}</div>
                <div className="mt-1 text-xl font-semibold">{vote}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
