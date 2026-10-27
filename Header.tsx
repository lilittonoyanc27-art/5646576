import React from 'react';
import { Flame, Star, AlertTriangle, BookOpen, Layers, Zap, Shuffle, Edit3, Bookmark, RotateCcw } from 'lucide-react';
import { UserStats } from './types';
import { playClickSound } from './soundUtils';

export type NavTab =
  | 'levels'
  | 'theory'
  | 'blitz'
  | 'compare'
  | 'conjugation'
  | 'word_order'
  | 'mistakes';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  stats: UserStats;
  onResetProgress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, stats, onResetProgress }) => {
  const unresolvedMistakesCount = stats.failedExerciseIds.filter(
    id => !stats.resolvedMistakeIds.includes(id)
  ).length;

  const handleTabClick = (tab: NavTab) => {
    playClickSound();
    onSelectTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-700 via-sky-600 to-amber-500 text-white shadow-lg border-b-4 border-amber-400">
      {/* Top Brand Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabClick('levels')}>
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-blue-950 font-black text-2xl flex items-center justify-center shadow-md transform hover:rotate-3 transition-transform">
            ¡O!
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight leading-tight flex items-center gap-2">
              <span>Español paso a paso</span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-300 text-blue-900 shadow-sm">
                A1–A2 Presente
              </span>
            </h1>
            <p className="text-xs text-sky-100 font-medium hidden md:block">
              Тренажёр настоящего времени: estar, seguir, llevar, ir, tener, querer
            </p>
          </div>
        </div>

        {/* Stats and Gamification Counters */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-orange-600/80 hover:bg-orange-600 px-3 py-1.5 rounded-xl font-bold text-sm shadow-inner transition-colors border border-orange-400/50" title="Серия дней занятий">
            <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
            <span>{stats.streak} {stats.streak === 1 ? 'день' : 'дн.'}</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 bg-yellow-400 text-blue-950 px-3 py-1.5 rounded-xl font-extrabold text-sm shadow-md" title="Очки опыта (XP)">
            <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span>{stats.xp} XP</span>
          </div>

          {/* Mistake Bank Button */}
          <button
            onClick={() => handleTabClick('mistakes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm shadow transition-all border cursor-pointer ${
              unresolvedMistakesCount > 0
                ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-300 animate-bounce'
                : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
            }`}
            title="Ошибки на повторение"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{unresolvedMistakesCount}</span>
          </button>

          {/* Reset All Progress Button */}
          {onResetProgress && (
            <button
              onClick={onResetProgress}
              className="flex items-center gap-1 bg-white/15 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-xl font-bold text-xs border border-white/20 transition-all cursor-pointer hover:border-amber-300"
              title="Сбросить прогресс обучения"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Сброс</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-blue-900/40 backdrop-blur-md px-2 border-t border-sky-400/30 overflow-x-auto scrollbar-none">
        <div className="max-w-6xl mx-auto flex items-center space-x-1 py-1.5">
          <button
            onClick={() => handleTabClick('levels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              currentTab === 'levels'
                ? 'bg-amber-400 text-blue-950 shadow-md scale-102'
                : 'text-sky-100 hover:bg-white/15'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>10 Уровней</span>
          </button>

          <button
            onClick={() => handleTabClick('theory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              currentTab === 'theory'
                ? 'bg-amber-400 text-blue-950 shadow-md scale-102'
                : 'text-sky-100 hover:bg-white/15'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Теория и правила</span>
          </button>

          <button
            onClick={() => handleTabClick('blitz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              currentTab === 'blitz'
                ? 'bg-amber-400 text-blue-950 shadow-md scale-102'
                : 'text-sky-100 hover:bg-white/15'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Быстрый перевод</span>
          </button>

          <button
            onClick={() => handleTabClick('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              currentTab === 'compare'
                ? 'bg-amber-400 text-blue-950 shadow-md scale-102'
                : 'text-sky-100 hover:bg-white/15'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>Не путай!</span>
          </button>

          <button
            onClick={() => handleTabClick('conjugation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              currentTab === 'conjugation'
                ? 'bg-amber-400 text-blue-950 shadow-md scale-102'
                : 'text-sky-100 hover:bg-white/15'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Запомни глагол</span>
          </button>

          <button
            onClick={() => handleTabClick('word_order')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              currentTab === 'word_order'
                ? 'bg-amber-400 text-blue-950 shadow-md scale-102'
                : 'text-sky-100 hover:bg-white/15'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Составь фразу</span>
          </button>

          <button
            onClick={() => handleTabClick('mistakes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              currentTab === 'mistakes'
                ? 'bg-amber-400 text-blue-950 shadow-md scale-102'
                : 'text-sky-100 hover:bg-white/15'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Мои ошибки {unresolvedMistakesCount > 0 && `(${unresolvedMistakesCount})`}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
