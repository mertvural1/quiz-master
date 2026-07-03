import { translate } from '../lang';

type ResultModalProps = {
  isWithdrawn: boolean;
  wonAmount: number;
  correctAnswer?: string | null;
  onRetry: () => void;
  onClose: () => void;
};

export function ResultModal({ isWithdrawn, wonAmount, correctAnswer, onRetry, onClose }: ResultModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-3 sm:px-4">
      <div className="w-full max-w-md rounded-[24px] border border-rose-500/30 bg-[#0b1122] p-5 text-center shadow-[0_0_120px_rgba(0,0,0,0.7)] sm:rounded-[28px] sm:p-8">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isWithdrawn ? 'bg-emerald-500/15 text-3xl' : 'bg-rose-500/15 text-3xl'}`}>
          {isWithdrawn ? '💰' : '😞'}
        </div>
        <h3 className="mt-5 text-2xl font-bold text-white">{isWithdrawn ? translate('withdrawTitle') : translate('wrongTitle')}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          {isWithdrawn ? translate('resultAmountLabel') : translate('resultEndedLabel', { amount: wonAmount.toLocaleString() })}{' '}
          <span className="font-semibold text-cyan-200">{wonAmount.toLocaleString()} $</span>
        </p>
        {!isWithdrawn && correctAnswer && (
          <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-left">
            <p className="text-sm font-semibold text-cyan-200">{translate('correctAnswer')}</p>
            <p className="mt-1 text-sm text-white">{correctAnswer}</p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onRetry}
            className="w-full rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
          >
            {translate('retryButton')}
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 sm:w-auto"
          >
            {translate('closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
