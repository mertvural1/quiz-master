import { AppLanguage } from '../enums/game';
import { translate } from '../lang';

type StartScreenProps = {
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  onStart: () => void;
};

export function StartScreen({ language, onLanguageChange, onStart }: StartScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-xl rounded-[24px] border border-cyan-400/20 bg-[#050a19]/95 p-6 text-center shadow-[0_0_120px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:rounded-[32px] sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-cyan-400/20 border-cyan-400/70 text-2xl font-black text-cyan-200">
          ?
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-cyan-100 sm:text-3xl">{translate('introTitle')}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">{translate('introDescription')}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => onLanguageChange(AppLanguage.Turkish)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${language === AppLanguage.Turkish ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200' : 'border-white/15 bg-slate-800/70 text-slate-300'}`}
          >
            Türkçe
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange(AppLanguage.English)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${language === AppLanguage.English ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200' : 'border-white/15 bg-slate-800/70 text-slate-300'}`}
          >
            English
          </button>
        </div>

        <button
          onClick={onStart}
          className="mt-8 w-full rounded-full bg-cyan-500 px-8 py-3 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
        >
          {translate('startButton')}
        </button>
      </div>
    </div>
  );
}
