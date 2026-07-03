import type { RefObject } from 'react';
import { translate } from '../lang';
import { prizeLevels } from '../lib/quiz';

type PrizePanelProps = {
  currentIndex: number;
  wonAmount: number;
  gameOver: boolean;
  currentPrizeRef: RefObject<HTMLDivElement | null>;
  onRestart: () => void;
};

export function PrizePanel({ currentIndex, wonAmount, gameOver, currentPrizeRef, onRestart }: PrizePanelProps) {
  return (
    <div className="w-full max-w-sm rounded-[24px] border border-slate-700/70 bg-slate-900/95 p-4 shadow-[0_0_80px_rgba(0,0,0,0.35)] sm:rounded-[32px] sm:p-6 lg:max-h-[calc(100vh-2rem)] lg:overflow-hidden lg:flex lg:flex-col">
      <h2 className="mb-4 text-xl font-semibold text-cyan-200">{translate('prizeTableTitle')}</h2>
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {prizeLevels.slice().reverse().map((prize, index) => {
          const level = prizeLevels.length - index;
          const isCurrent = level === currentIndex + 1;
          const isPassed = level <= currentIndex + 1;
          return (
            <div
              key={prize}
              ref={isCurrent ? currentPrizeRef : null}
              className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-sm font-semibold transition ${isCurrent ? 'border-cyan-400 bg-cyan-500/25 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]' : isPassed ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : 'border-transparent bg-slate-800/80 text-slate-300'}`}
            >
              <span>{translate('prizeRowLabel', { level })}</span>
              <span>{prize.toLocaleString()} $</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-300 sm:mt-6">
        <p className="font-semibold text-white">{translate('statusTitle')}</p>
        <p className="mt-2">{translate('protectedAmount', { amount: wonAmount.toLocaleString() })}</p>
        <p className="mt-2 text-cyan-300">{translate('barrierQuestion')}</p>
        {gameOver && <p className="mt-2 text-rose-300">{translate('gameOverStatus')}</p>}
        {!gameOver && <p className="mt-2 text-emerald-300">{translate('gameOngoingStatus')}</p>}
      </div>

      <button onClick={onRestart} className="mt-4 w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 sm:mt-6">
        {translate('restartButton')}
      </button>
    </div>
  );
}
