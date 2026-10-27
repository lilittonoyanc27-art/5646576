import React, { useState } from 'react';
import { VERB_CONJUGATIONS, COMMON_GERUNDS, CONJUGATION_DRILL_QUESTIONS } from './conjugationData';
import { UserStats } from './types';
import { Volume2, CheckCircle2, XCircle, Sparkles, BookOpen, Layers } from 'lucide-react';
import { speakSpanish, playSuccessSound, playErrorSound, playClickSound } from './soundUtils';

interface ConjugationViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const ConjugationView: React.FC<ConjugationViewProps> = ({ stats, onUpdateStats }) => {
  const [activeSubTab, setActiveSubTab] = useState<'drill' | 'reference' | 'gerunds'>('drill');
  const [selectedVerbKey, setSelectedVerbKey] = useState<string>('estar');

  // Drill quiz state
  const [drillIndex, setDrillIndex] = useState<number>(0);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [drillScore, setDrillScore] = useState<number>(0);

  const currentQuestion = CONJUGATION_DRILL_QUESTIONS[drillIndex % CONJUGATION_DRILL_QUESTIONS.length];

  const handleSelectForm = (form: string) => {
    if (isAnswered) {
      handleNextQuestion();
      return;
    }
    playClickSound();
    setSelectedForm(form);
    setIsAnswered(true);

    const correct = form === currentQuestion.correctForm;
    const updated = {
      ...stats,
      completedExercisesCount: (stats.completedExercisesCount || 0) + 1,
      correctAnswersCount: (stats.correctAnswersCount || 0) + (correct ? 1 : 0),
      xp: (stats.xp || 0) + (correct ? 10 : 0),
    };

    if (correct) {
      playSuccessSound();
      setDrillScore(prev => prev + 1);
    } else {
      playErrorSound();
    }

    onUpdateStats(updated);
  };

  const handleNextQuestion = () => {
    playClickSound();
    setSelectedForm(null);
    setIsAnswered(false);
    setDrillIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-4 border-amber-300">
        <div className="flex items-center gap-2 bg-amber-400 text-blue-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 w-max">
          <Sparkles className="w-3.5 h-3.5" />
          Спряжения Presente de Indicativo
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">Запомни глагол и герундий</h2>
        <p className="text-sky-100 text-xs sm:text-sm mt-1 max-w-xl">
          Спрягай глаголы estar, seguir, llevar, ir, tener, querer безошибочно для каждого лица (yo, tú, él, nosotros, vosotros, ellos).
        </p>
      </div>

      {/* Sub tabs */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => {
            playClickSound();
            setActiveSubTab('drill');
          }}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'drill'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-blue-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Тренажёр спряжений</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveSubTab('reference');
          }}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'reference'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-blue-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Таблицы глаголов</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveSubTab('gerunds');
          }}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'gerunds'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-blue-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Все герундии</span>
        </button>
      </div>

      {/* 1. DRILL MODE */}
      {activeSubTab === 'drill' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-sky-100 space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Вопрос {drillIndex + 1} из {CONJUGATION_DRILL_QUESTIONS.length}</span>
            <span className="text-amber-600 font-extrabold">Баллы: {drillScore}</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-sky-700 tracking-wider">
              Выбери правильную форму глагола:
            </span>
            <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200">
              <span className="text-xs text-slate-500 font-semibold block mb-1">
                Лицо: <strong>{currentQuestion.pronoun}</strong> ({currentQuestion.pronounRu})
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentQuestion.contextSentenceEs}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                🇷🇺 {currentQuestion.contextSentenceRu}
              </p>
            </div>
          </div>

          {/* 4 options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map(opt => {
              const isSelected = selectedForm === opt;
              const isCorrectOpt = opt === currentQuestion.correctForm;

              let style = 'bg-slate-50 border-2 border-slate-200 text-slate-800 hover:bg-sky-50 hover:border-sky-300';
              if (isSelected && !isAnswered) {
                style = 'bg-blue-50 border-2 border-blue-600 text-blue-950 ring-2 ring-blue-200';
              }
              if (isAnswered) {
                if (isCorrectOpt) {
                  style = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200';
                } else if (isSelected && !isCorrectOpt) {
                  style = 'bg-rose-50 border-2 border-rose-500 text-rose-950 ring-2 ring-rose-200';
                } else {
                  style = 'bg-slate-50 border-2 border-slate-100 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectForm(opt)}
                  className={`p-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {isAnswered && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-rose-600" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl border-2 space-y-1 ${
              selectedForm === currentQuestion.correctForm ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
            }`}>
              <div className="font-bold text-sm text-slate-900">
                {selectedForm === currentQuestion.correctForm ? 'Верно!' : 'Ошибка!'}
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action button */}
          <div>
            {!isAnswered ? (
              <div className="text-center text-xs text-slate-500 font-semibold py-2">
                👆 Нажми на подходящую форму выше, чтобы сразу проверить ответ
              </div>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full py-4 rounded-2xl font-black text-base bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-xl transition-all cursor-pointer transform hover:scale-101 active:scale-99"
              >
                Следующее спряжение →
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. VERB TABLES REFERENCE */}
      {activeSubTab === 'reference' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-sky-100 space-y-6">
          <div className="flex flex-wrap gap-2">
            {Object.keys(VERB_CONJUGATIONS).map(vKey => (
              <button
                key={vKey}
                onClick={() => {
                  playClickSound();
                  setSelectedVerbKey(vKey);
                }}
                className={`px-4 py-2 rounded-xl font-black text-sm uppercase transition-all ${
                  selectedVerbKey === vKey
                    ? 'bg-amber-400 text-blue-950 shadow-md ring-2 ring-amber-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-sky-50'
                }`}
              >
                {vKey}
              </button>
            ))}
          </div>

          {/* Active verb table */}
          {(() => {
            const verbData = VERB_CONJUGATIONS[selectedVerbKey];
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-black text-blue-950 uppercase">{verbData.verb}</h3>
                    <span className="text-xs text-slate-500 font-medium">{verbData.translationRu}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { p: 'yo (я)', f: verbData.forms.yo },
                    { p: 'tú (ты)', f: verbData.forms.tu },
                    { p: 'él / ella (он / она)', f: verbData.forms.el },
                    { p: 'nosotros (мы)', f: verbData.forms.nosotros },
                    { p: 'vosotros (вы)', f: verbData.forms.vosotros },
                    { p: 'ellos / ellas (они)', f: verbData.forms.ellos },
                  ].map(item => (
                    <div key={item.p} className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 text-center space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 block uppercase">{item.p}</span>
                      <span className="text-xl font-black text-blue-900 block">{item.f}</span>
                      <button
                        onClick={() => speakSpanish(item.f)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        title="Слушать"
                      >
                        <Volume2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-amber-900 bg-amber-50 p-3.5 rounded-xl border border-amber-200 font-medium">
                  💡 <strong>Подсказка:</strong> {verbData.notesRu}
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. GERUNDS REFERENCE */}
      {activeSubTab === 'gerunds' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-sky-100 space-y-6">
          <h3 className="text-lg font-black text-slate-900">Таблица популярных герундиев (Gerundio)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMMON_GERUNDS.map(g => (
              <div key={g.infinitive} className="p-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-blue-900 text-base">{g.gerund}</span>
                    <span className="text-xs text-slate-400 font-mono">({g.infinitive})</span>
                    {g.isIrregular && (
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-black">
                        исключение
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">{g.translationRu}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{g.ruleRu}</div>
                </div>
                <button
                  onClick={() => speakSpanish(g.gerund)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors shadow-xs shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
