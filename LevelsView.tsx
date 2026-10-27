import React from 'react';
import { UserStats } from './types';
import { Play, CheckCircle2, Lock, Star, Sparkles, Award, RotateCcw } from 'lucide-react';
import { playClickSound } from './soundUtils';

export interface LevelMetadata {
  id: number;
  title: string;
  description: string;
  questionCount: number;
  icon: string;
  color: string;
  focus: string;
}

export const LEVELS_CONFIG: LevelMetadata[] = [
  {
    id: 1,
    title: 'Уровень 1. Узнай значение',
    description: 'Русское предложение → испанский перевод. Базовое сопоставление смыслов.',
    questionCount: 15,
    icon: '🎯',
    color: 'from-sky-500 to-blue-600',
    focus: 'Все 7 конструкций',
  },
  {
    id: 2,
    title: 'Уровень 2. Выбери правильную конструкцию',
    description: 'Определи разницу: действие сейчас, продолжение или длительность.',
    questionCount: 15,
    icon: '🧭',
    color: 'from-blue-600 to-indigo-600',
    focus: 'Estar vs Seguir vs Llevar',
  },
  {
    id: 3,
    title: 'Уровень 3. Правильное спряжение',
    description: 'Тренируй yo, tú, él, ella, nosotros, vosotros, ellos во всех конструкциях.',
    questionCount: 15,
    icon: '⚡',
    color: 'from-amber-500 to-orange-500',
    focus: 'Лица и спряжения в Presente',
  },
  {
    id: 4,
    title: 'Уровень 4. Tener / Tener que / Querer',
    description: 'Разделяй владение («у меня есть»), долг («мне нужно») и желание («я хочу»).',
    questionCount: 15,
    icon: '💡',
    color: 'from-rose-500 to-pink-600',
    focus: 'Tener vs Tener que vs Querer',
  },
  {
    id: 5,
    title: 'Уровень 5. Четыре конструкции с герундием',
    description: 'Тонкая грань между estar, seguir, llevar и ir + gerundio.',
    questionCount: 15,
    icon: '🔄',
    color: 'from-emerald-500 to-teal-600',
    focus: 'Все формы герундия',
  },
  {
    id: 6,
    title: 'Уровень 6. Найди и исправь ошибку',
    description: 'Ищи типичные ошибки в испанских предложениях и выбирай правильный вариант.',
    questionCount: 15,
    icon: '🔍',
    color: 'from-violet-600 to-purple-700',
    focus: 'Работа над ошибками',
  },
  {
    id: 7,
    title: 'Уровень 7. Ситуации из жизни',
    description: 'Звонки по телефону, общение с друзьями, дом, работа и кафе.',
    questionCount: 15,
    icon: '📱',
    color: 'from-cyan-600 to-blue-700',
    focus: 'Живые диалоги и контекст',
  },
  {
    id: 8,
    title: 'Уровень 8. Перевод с русского на испанский',
    description: 'От коротких фраз (3–5 слов) к полным предложениям (8–12 слов).',
    questionCount: 15,
    icon: '📝',
    color: 'from-orange-500 to-amber-600',
    focus: 'Постепенное усложнение',
  },
  {
    id: 9,
    title: 'Уровень 9. Смешанный экзамен',
    description: 'Все конструкции перемешаны без подсказок. Проверь интуицию.',
    questionCount: 15,
    icon: '🎓',
    color: 'from-indigo-600 to-blue-800',
    focus: 'Комплексная проверка',
  },
  {
    id: 10,
    title: 'Уровень 10. Финальное испытание',
    description: '40 разнообразных заданий по всем темам с детальным разбором.',
    questionCount: 40,
    icon: '👑',
    color: 'from-amber-400 via-orange-500 to-red-600',
    focus: 'Большой экзамен (40 вопросов)',
  },
];

interface LevelsViewProps {
  stats: UserStats;
  onSelectLevel: (levelId: number) => void;
  onOpenTheory: () => void;
  onResetProgress?: () => void;
}

export const LevelsView: React.FC<LevelsViewProps> = ({ stats, onSelectLevel, onOpenTheory, onResetProgress }) => {
  // All levels are open by user request
  const isLevelUnlocked = (_levelId: number) => true;

  const completedCount = Object.values(stats.levelScores).filter(s => s.completed).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-blue-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Все 10 уровней открыты для выбора
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Освой испанское настоящее время шаг за шагом
          </h2>
          <p className="text-sky-100 text-sm sm:text-base font-medium leading-relaxed">
            Выбирай любой уровень для тренировки: от базового понимания до финального экзамена из 40 вопросов. Навсегда избавься от путаницы в конструкциях!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-xs sm:text-sm font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Пройдено уровней: {completedCount} из 10</span>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onOpenTheory();
              }}
              className="bg-amber-400 hover:bg-amber-300 text-blue-950 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-102 active:scale-98"
            >
              📖 Открыть теорию и правила
            </button>
          </div>
        </div>

        {/* Decorative background sun & bubbles */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 10 Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LEVELS_CONFIG.map(lvl => {
          const unlocked = isLevelUnlocked(lvl.id);
          const scoreData = stats.levelScores[lvl.id];
          const isDone = scoreData?.completed;
          const stars = scoreData?.stars || 0;

          return (
            <div
              key={lvl.id}
              onClick={() => {
                if (unlocked) {
                  playClickSound();
                  onSelectLevel(lvl.id);
                }
              }}
              className={`rounded-3xl p-5 sm:p-6 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                unlocked
                  ? 'bg-white hover:border-amber-400 hover:shadow-xl cursor-pointer group'
                  : 'bg-slate-100/80 border-slate-200 opacity-70 cursor-not-allowed'
              } ${isDone ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-100 to-amber-100 border border-amber-200 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                      {lvl.icon}
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider">
                        {lvl.focus}
                      </span>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-blue-900 transition-colors">
                        {lvl.title}
                      </h3>
                    </div>
                  </div>

                  {/* Lock / Completed / Stars Badge */}
                  {unlocked ? (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 fill-slate-100'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-slate-200 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-4">
                  {lvl.description}
                </p>
              </div>

              {/* Bottom Card Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-bold">
                  {lvl.questionCount} {lvl.questionCount === 40 ? 'вопросов' : 'заданий'}
                </span>

                {unlocked ? (
                  <div className="flex items-center gap-1.5 font-extrabold text-blue-600 group-hover:text-amber-600 group-hover:translate-x-1 transition-all">
                    <span>{isDone ? 'Пройти снова' : 'Начать уровень'}</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                ) : (
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Пройди предыдущий уровень
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Reset Option */}
      {onResetProgress && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={onResetProgress}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white text-slate-600 hover:text-rose-600 border border-slate-300 font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            title="Сбросить все набранные очки, звёзды и историю ошибок"
          >
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span>Сбросить весь прогресс обучения</span>
          </button>
        </div>
      )}
    </div>
  );
};
