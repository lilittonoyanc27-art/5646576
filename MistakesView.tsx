import React, { useState } from 'react';
import { UserStats, Exercise } from './types';
import { getAllExercises } from './exerciseData';
import { QuizView } from './QuizView';
import { AlertTriangle, CheckCircle2, Volume2, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { speakSpanish, playClickSound } from './soundUtils';

interface MistakesViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onGoToLevels: () => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({ stats, onUpdateStats, onGoToLevels }) => {
  const [isDrillActive, setIsDrillActive] = useState<boolean>(false);
  const allExercises = getAllExercises();

  // Find all exercises the user failed
  const failedExercises = allExercises.filter(ex => stats.failedExerciseIds.includes(ex.id));
  const unresolvedMistakes = failedExercises.filter(ex => !stats.resolvedMistakeIds.includes(ex.id));
  const resolvedMistakes = failedExercises.filter(ex => stats.resolvedMistakeIds.includes(ex.id));

  const handleStartDrill = () => {
    playClickSound();
    setIsDrillActive(true);
  };

  const handleClearAllMistakes = () => {
    playClickSound();
    onUpdateStats({
      ...stats,
      failedExerciseIds: [],
      resolvedMistakeIds: [],
    });
  };

  if (isDrillActive) {
    return (
      <QuizView
        title="Работа над моими ошибками"
        subtitle="Тренируйся, пока не исправишь все неточности"
        exercises={unresolvedMistakes.length > 0 ? unresolvedMistakes : failedExercises}
        stats={stats}
        onUpdateStats={onUpdateStats}
        onCompleteQuiz={() => setIsDrillActive(false)}
        onExit={() => setIsDrillActive(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-4 border-amber-300">
        <div className="flex items-center gap-2 bg-amber-400 text-blue-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 w-max">
          <Sparkles className="w-3.5 h-3.5" />
          Персональный банк ошибок
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">Повтори мои ошибки</h2>
        <p className="text-rose-100 text-xs sm:text-sm mt-1 max-w-xl">
          Все предложения, в которых ты допустил неточность, сохраняются здесь. Отработай их, чтобы закрыть пробелы!
        </p>
      </div>

      {/* Stats summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 text-center shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase block">Нужно повторить</span>
          <span className="text-3xl font-black text-rose-600">{unresolvedMistakes.length}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-emerald-200 text-center shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase block">Исправлено</span>
          <span className="text-3xl font-black text-emerald-600">{resolvedMistakes.length}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-sky-200 text-center shadow-sm col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-500 font-bold uppercase block">Всего было ошибок</span>
          <span className="text-3xl font-black text-blue-900">{failedExercises.length}</span>
        </div>
      </div>

      {/* Action to drill */}
      {unresolvedMistakes.length > 0 ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleStartDrill}
            className="flex-1 py-4 px-6 rounded-2xl font-black text-base bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-lg transition-transform hover:scale-101 active:scale-99 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Начать тренировку по ошибкам ({unresolvedMistakes.length})</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleClearAllMistakes}
            className="py-4 px-6 rounded-2xl font-bold text-xs text-slate-500 hover:text-rose-600 bg-white border border-slate-200 transition-colors"
          >
            Сбросить банк
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border-2 border-emerald-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">
            🎉
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {failedExercises.length === 0
              ? 'Твой банк ошибок пока пуст!'
              : 'Все ошибки успешно исправлены!'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
            Ты ещё не совершал ошибок или уже закрыл все сложные моменты. Продолжай проходить уровни!
          </p>
          <button
            onClick={onGoToLevels}
            className="px-6 py-3 rounded-2xl font-black text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors inline-block"
          >
            Перейти к 10 уровням →
          </button>
        </div>
      )}

      {/* List of Unresolved Questions */}
      {unresolvedMistakes.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-rose-100 space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>Предложения, требующие внимания:</span>
          </h3>

          <div className="space-y-3">
            {unresolvedMistakes.map(ex => {
              const correctOpt = ex.options.find(o => o.isCorrect);
              return (
                <div key={ex.id} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block">Русский оригинал:</span>
                      <div className="font-black text-slate-900 text-base">{ex.promptRu}</div>
                    </div>
                    {correctOpt && (
                      <button
                        onClick={() => speakSpanish(correctOpt.textEs)}
                        className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600"
                        title="Слушать правильный ответ"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {correctOpt && (
                    <div className="text-xs font-bold text-emerald-800 bg-white/80 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Правильно: {correctOpt.textEs}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 font-medium">
                    {ex.errorExplanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
