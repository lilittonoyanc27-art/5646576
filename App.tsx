import React, { useState, useEffect, useMemo } from 'react';
import { Header, NavTab } from './Header';
import { LevelsView } from './LevelsView';
import { TheoryView } from './TheoryView';
import { QuizView } from './QuizView';
import { WordOrderView } from './WordOrderView';
import { ConjugationView } from './ConjugationView';
import { CompareView } from './CompareView';
import { MistakesView } from './MistakesView';
import { UserStats } from './types';
import { getExercisesForLevel, getBlitzExercises } from './exerciseData';
import { playClickSound } from './soundUtils';

const STORAGE_KEY = 'espanol_paso_a_paso_stats_v1';

const INITIAL_STATS: UserStats = {
  xp: 0,
  streak: 1,
  lastStudiedDate: new Date().toISOString().split('T')[0],
  completedExercisesCount: 0,
  correctAnswersCount: 0,
  levelScores: {},
  failedExerciseIds: [],
  resolvedMistakeIds: [],
  constructionMastery: {
    estar_gerundio: { correct: 0, total: 0 },
    seguir_gerundio: { correct: 0, total: 0 },
    llevar_gerundio: { correct: 0, total: 0 },
    ir_gerundio: { correct: 0, total: 0 },
    tener: { correct: 0, total: 0 },
    tener_que: { correct: 0, total: 0 },
    querer: { correct: 0, total: 0 },
  },
};

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check streak on load
        const today = new Date().toISOString().split('T')[0];
        if (parsed.lastStudiedDate !== today) {
          // If yesterday was studied, increment or keep streak
          const lastDate = new Date(parsed.lastStudiedDate);
          const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            parsed.streak = (parsed.streak || 1) + 1;
          } else if (diffDays > 1) {
            parsed.streak = 1;
          }
          parsed.lastStudiedDate = today;
        }
        return { ...INITIAL_STATS, ...parsed };
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_STATS;
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('levels');
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [isBlitzActive, setIsBlitzActive] = useState<boolean>(false);

  // Stable memoized exercises so re-renders of App do not create new array references!
  const currentLevelExercises = useMemo(() => {
    if (activeLevelId !== null) {
      return getExercisesForLevel(activeLevelId);
    }
    return [];
  }, [activeLevelId]);

  const currentBlitzExercises = useMemo(() => {
    if (isBlitzActive) {
      return getBlitzExercises(20);
    }
    return [];
  }, [isBlitzActive]);

  // Save to localStorage whenever stats update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
  };

  const handleSelectLevel = (levelId: number) => {
    playClickSound();
    setActiveLevelId(levelId);
  };

  const handleCompleteLevelQuiz = (score: number, total: number) => {
    if (!activeLevelId) return;

    const percentage = Math.round((score / Math.max(total, 1)) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
    const completed = percentage >= 50; // Pass mark 50%

    const updated = { ...stats };
    const prev = updated.levelScores[activeLevelId] || { stars: 0, highScore: 0, completed: false };

    updated.levelScores[activeLevelId] = {
      stars: Math.max(prev.stars, stars),
      highScore: Math.max(prev.highScore, score),
      completed: prev.completed || completed,
    };

    setStats(updated);
  };

  const handleExitQuiz = () => {
    playClickSound();
    setActiveLevelId(null);
    setIsBlitzActive(false);
  };

  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const handleOpenResetModal = () => {
    playClickSound();
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    playClickSound();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setStats({
      ...INITIAL_STATS,
      lastStudiedDate: new Date().toISOString().split('T')[0],
    });
    setActiveLevelId(null);
    setIsBlitzActive(false);
    setCurrentTab('levels');
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 text-slate-800 flex flex-col font-sans selection:bg-amber-300 selection:text-blue-950">
      {/* Header Bar */}
      <Header
        currentTab={activeLevelId || isBlitzActive ? 'levels' : currentTab}
        onSelectTab={(tab) => {
          setActiveLevelId(null);
          setIsBlitzActive(false);
          setCurrentTab(tab);
        }}
        stats={stats}
        onResetProgress={handleOpenResetModal}
      />

      {/* In-App Confirmation Modal for Resetting All Progress (immune to iframe sandbox!) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-300 space-y-5 text-center transform scale-100 transition-all">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl shadow-inner">
              🔄
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Сбросить весь прогресс?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Это действие полностью обнулит очки опыта (XP), звёзды за уровни и историю в банке ошибок. Вы сможете начать изучение испанского с самого чистого листа!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowResetModal(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-300"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-3 px-4 rounded-xl font-black bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors cursor-pointer"
              >
                Да, сбросить всё
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* 1. Level Quiz In Progress */}
        {activeLevelId !== null ? (
          <QuizView
            key={`level-${activeLevelId}`}
            title={`Уровень ${activeLevelId}`}
            subtitle={activeLevelId === 10 ? 'Финальное испытание (40 вопросов)' : 'Практика настоящего времени'}
            exercises={currentLevelExercises}
            stats={stats}
            onUpdateStats={handleUpdateStats}
            onCompleteQuiz={handleCompleteLevelQuiz}
            onExit={handleExitQuiz}
            levelNumber={activeLevelId}
          />
        ) : isBlitzActive ? (
          /* 2. Blitz Mode In Progress */
          <QuizView
            key="blitz-mode"
            title="Быстрый перевод (Блиц-раунд)"
            subtitle="20 коротких русских предложений для мгновенной проверки"
            exercises={currentBlitzExercises}
            stats={stats}
            onUpdateStats={handleUpdateStats}
            onCompleteQuiz={() => {}}
            onExit={handleExitQuiz}
          />
        ) : (
          /* 3. Regular Views */
          <>
            {currentTab === 'levels' && (
              <LevelsView
                stats={stats}
                onSelectLevel={handleSelectLevel}
                onOpenTheory={() => setCurrentTab('theory')}
                onResetProgress={handleOpenResetModal}
              />
            )}

            {currentTab === 'theory' && <TheoryView />}

            {currentTab === 'blitz' && (
              <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-amber-300 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-4xl shadow-md">
                    ⚡
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950">
                    Быстрый перевод: 20 вопросов
                  </h2>
                  <p className="text-slate-600 font-medium text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                    Проверь скорость мышления: случайные 20 предложений на все конструкции настоящего времени. Выбирай испанский перевод быстро и точно!
                  </p>
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsBlitzActive(true);
                    }}
                    className="py-4 px-8 rounded-2xl font-black text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg transition-transform hover:scale-102 active:scale-98 cursor-pointer"
                  >
                    🚀 Начать блиц-раунд
                  </button>
                </div>
              </div>
            )}

            {currentTab === 'compare' && (
              <CompareView stats={stats} onUpdateStats={handleUpdateStats} />
            )}

            {currentTab === 'conjugation' && (
              <ConjugationView stats={stats} onUpdateStats={handleUpdateStats} />
            )}

            {currentTab === 'word_order' && (
              <WordOrderView stats={stats} onUpdateStats={handleUpdateStats} />
            )}

            {currentTab === 'mistakes' && (
              <MistakesView
                stats={stats}
                onUpdateStats={handleUpdateStats}
                onGoToLevels={() => setCurrentTab('levels')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-950/80 text-sky-200 py-6 border-t border-sky-600/40 text-center text-xs space-y-1">
        <p className="font-extrabold text-sm text-amber-300">
          Español paso a paso — Практика настоящего времени
        </p>
        <p className="text-sky-300">
          Интерактивный учебный тренажёр: estar, seguir, llevar, ir, tener, tener que, querer.
        </p>
        <p className="text-slate-400 text-[11px] pt-1">
          Только Presente de Indicativo (A1–A2) для русскоязычных учеников.
        </p>
      </footer>
    </div>
  );
}
