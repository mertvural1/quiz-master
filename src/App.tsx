import { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultModal } from './components/ResultModal';
import { GameBoard } from './components/GameBoard';
import { PrizePanel } from './components/PrizePanel';
import { useQuizGame } from './hooks/useQuizGame';
import { AppLanguage } from './enums/game';
import { setLanguage, translate } from './lang';

function App() {
  const [language, setLanguageState] = useState<AppLanguage>(AppLanguage.Turkish);
  const {
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
    currentPrizeRef,
    handleStartGame,
    handleAnswer,
    handleWithdraw,
    useHalfJoker,
    useAudienceJoker,
    restartGame,
    closeResultModal,
  } = useQuizGame();

  const handleLanguageChange = (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    setLanguage(nextLanguage);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#02061b,_#02040f_40%,_#050d26_100%)] p-2 text-white sm:p-4 md:p-6">
      {!gameStarted && !loading ? (
        <StartScreen language={language} onLanguageChange={handleLanguageChange} onStart={handleStartGame} />
      ) : loading && questions.length === 0 ? (
        <LoadingScreen />
      ) : (
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:gap-5 lg:grid lg:grid-cols-[1.8fr_0.9fr] lg:items-start">
          <div className="rounded-3xl border border-cyan-400/15 bg-[#050a19]/95 p-4 shadow-[0_0_120px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:rounded-[32px] sm:p-5 md:p-8">
            {showResultModal && (
              <ResultModal
                isWithdrawn={isWithdrawn}
                wonAmount={wonAmount}
                correctAnswer={correctAnswerToShow}
                onRetry={() => {
                  closeResultModal();
                  restartGame();
                }}
                onClose={closeResultModal}
              />
            )}

            <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-4 text-center shadow-inner shadow-slate-950/20 sm:rounded-[28px] sm:px-6 sm:py-5">
              <h1 className="text-lg font-black tracking-[0.18em] text-white sm:text-3xl md:text-4xl">{translate('gameTitle')}</h1>
            </div>

            <GameBoard
              safeQuestion={safeQuestion}
              loading={loading}
              currentIndex={currentIndex}
              prizeAtCurrentLevel={prizeAtCurrentLevel}
              timerEnabled={timerEnabled}
              timeLeft={timeLeft}
              selected={selected}
              visibleOptions={visibleOptions}
              feedback={feedback}
              audienceResult={audienceResult}
              jokerHalf={jokerHalf}
              jokerAudience={jokerAudience}
              gameOver={gameOver}
              onAnswer={handleAnswer}
              onHalfJoker={useHalfJoker}
              onAudienceJoker={useAudienceJoker}
              onWithdraw={handleWithdraw}
              currentPrizeRef={currentPrizeRef}
            />
          </div>

          <PrizePanel
            currentIndex={currentIndex}
            wonAmount={wonAmount}
            gameOver={gameOver}
            currentPrizeRef={currentPrizeRef}
            onRestart={restartGame}
          />
        </div>
      )}
    </div>
  );
}

export default App;
