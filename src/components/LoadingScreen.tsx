import { translate } from '../lang';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-md rounded-[24px] border border-cyan-400/20 bg-[#050a19]/95 p-6 text-center shadow-[0_0_120px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:rounded-[32px] sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        <h2 className="mt-6 text-2xl font-semibold text-cyan-100">{translate('loadingTitle')}</h2>
        <p className="mt-3 text-sm text-slate-400">{translate('loadingSubtitle')}</p>
      </div>
    </div>
  );
}
