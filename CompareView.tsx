import React, { useState } from 'react';
import { GrammarConstruction, UserStats } from './types';
import { getExercisesForComparison } from './exerciseData';
import { QuizView } from './QuizView';
import { Volume2, ArrowRight, Sparkles, Shuffle } from 'lucide-react';
import { speakSpanish, playClickSound } from './soundUtils';

interface ComparePair {
  id: string;
  name: string;
  c1: {
    id: GrammarConstruction;
    title: string;
    exampleEs: string;
    exampleRu: string;
    formula: string;
    color: string;
  };
  c2: {
    id: GrammarConstruction;
    title: string;
    exampleEs: string;
    exampleRu: string;
    formula: string;
    color: string;
  };
  keyDifferenceRu: string;
  trapRu: string;
}

const COMPARISON_PAIRS: ComparePair[] = [
  {
    id: 'estar-vs-seguir',
    name: 'Estar + gerundio vs Seguir + gerundio',
    c1: {
      id: 'estar_gerundio',
      title: 'Действие прямо сейчас',
      exampleEs: 'Estoy trabajando.',
      exampleRu: 'Я сейчас работаю (в этот момент).',
      formula: 'estar + gerundio',
      color: 'bg-sky-50 border-sky-300 text-sky-900',
    },
    c2: {
      id: 'seguir_gerundio',
      title: 'Всё ещё продолжаю делать',
      exampleEs: 'Sigo trabajando.',
      exampleRu: 'Я всё ещё работаю (продолжаю начатое ранее).',
      formula: 'seguir + gerundio',
      color: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    },
    keyDifferenceRu: 'Estar констатирует то, что происходит прямо сейчас. Seguir подчёркивает: действие началось раньше и не остановилось вопреки времени или ожиданиям.',
    trapRu: 'Не путай: если по-русски есть «продолжаю» или «всё ещё» — выбирай seguir!',
  },
  {
    id: 'estar-vs-llevar',
    name: 'Estar + gerundio vs Llevar + tiempo + gerundio',
    c1: {
      id: 'estar_gerundio',
      title: 'Процесс в моменте',
      exampleEs: 'Estoy estudiando.',
      exampleRu: 'Я сейчас занимаюсь.',
      formula: 'estar + gerundio (БЕЗ времени)',
      color: 'bg-sky-50 border-sky-300 text-sky-900',
    },
    c2: {
      id: 'llevar_gerundio',
      title: 'Уже столько времени делаю',
      exampleEs: 'Llevo dos horas estudiando.',
      exampleRu: 'Я учусь уже два часа.',
      formula: 'llevar + время + gerundio',
      color: 'bg-amber-50 border-amber-300 text-amber-900',
    },
    keyDifferenceRu: 'Estar НЕ сочетается с отрезком времени. Если в русском предложении есть «уже 2 часа / 3 года / месяц», испанцы ОБЯЗАТЕЛЬНО используют глагол Llevar.',
    trapRu: 'Никогда не говори: «Estoy estudiando dos horas»! Это грубейшая калька с других языков. Правильно: «Llevo dos horas estudiando».',
  },
  {
    id: 'estar-vs-ir',
    name: 'Estar + gerundio vs Ir + gerundio',
    c1: {
      id: 'estar_gerundio',
      title: 'Действие в моменте речи',
      exampleEs: 'Estoy aprendiendo.',
      exampleRu: 'Я сейчас учусь.',
      formula: 'estar + gerundio',
      color: 'bg-sky-50 border-sky-300 text-sky-900',
    },
    c2: {
      id: 'ir_gerundio',
      title: 'Постепенное развитие (шаг за шагом)',
      exampleEs: 'Voy aprendiendo poco a poco.',
      exampleRu: 'Я постепенно учусь понемногу.',
      formula: 'ir + gerundio (poco a poco)',
      color: 'bg-orange-50 border-orange-300 text-orange-900',
    },
    keyDifferenceRu: 'Ir добавляет оттенок медленного, но уверенного прогресса («мало-помалу, потихоньку»). Часто употребляется с «poco a poco».',
    trapRu: 'Не ставь предлог "a" перед герундием в этой конструкции: «Voy aprendiendo», а не «Voy a aprendiendo».',
  },
  {
    id: 'tener-vs-tenerque',
    name: 'Tener vs Tener que + infinitivo',
    c1: {
      id: 'tener',
      title: 'Обладание предметом',
      exampleEs: 'Tengo un libro / Tengo tiempo.',
      exampleRu: 'У меня есть книга / есть время.',
      formula: 'tener + существительное',
      color: 'bg-blue-50 border-blue-300 text-blue-900',
    },
    c2: {
      id: 'tener_que',
      title: 'Обязанность и долг',
      exampleEs: 'Tengo que estudiar.',
      exampleRu: 'Мне нужно учиться.',
      formula: 'tener QUE + инфинитив',
      color: 'bg-rose-50 border-rose-300 text-rose-900',
    },
    keyDifferenceRu: 'Tener = у меня есть вещь (предмет). Добавление маленького слова "que" полностью меняет смысл на долг: мне необходимо что-то сделать.',
    trapRu: 'Tengo un libro (есть книга) vs Tengo que leer (нужно читать).',
  },
  {
    id: 'tenerque-vs-querer',
    name: 'Tener que + infinitivo vs Querer + infinitivo',
    c1: {
      id: 'tener_que',
      title: 'Надо / Должен (обязанность)',
      exampleEs: 'Tengo que trabajar.',
      exampleRu: 'Мне нужно работать (обязанность).',
      formula: 'tener que + инфинитив',
      color: 'bg-rose-50 border-rose-300 text-rose-900',
    },
    c2: {
      id: 'querer',
      title: 'Хочу (личное желание)',
      exampleEs: 'Quiero trabajar.',
      exampleRu: 'Я хочу работать (моё желание).',
      formula: 'querer + инфинитив',
      color: 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-900',
    },
    keyDifferenceRu: 'Tener que выражает внешнюю необходимость независимо от настроения. Querer выражает искреннее внутреннее желание человека.',
    trapRu: '«No quiero hacer los deberes, pero tengo que hacerlos» (Не хочу делать уроки, но мне нужно их сделать).',
  },
];

interface CompareViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ stats, onUpdateStats }) => {
  const [selectedPairId, setSelectedPairId] = useState<string>('estar-vs-seguir');
  const [isDrillActive, setIsDrillActive] = useState<boolean>(false);

  const currentPair = COMPARISON_PAIRS.find(p => p.id === selectedPairId) || COMPARISON_PAIRS[0];

  const handleStartDrill = () => {
    playClickSound();
    setIsDrillActive(true);
  };

  if (isDrillActive) {
    const drillExercises = getExercisesForComparison(currentPair.c1.id, currentPair.c2.id).slice(0, 15);
    return (
      <QuizView
        title={`Тренировка: ${currentPair.name}`}
        subtitle="Выбирай правильную конструкцию между двумя похожими"
        exercises={drillExercises}
        stats={stats}
        onUpdateStats={onUpdateStats}
        onCompleteQuiz={() => setIsDrillActive(false)}
        onExit={() => setIsDrillActive(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-4 border-amber-300">
        <div className="flex items-center gap-2 bg-amber-400 text-blue-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 w-max">
          <Sparkles className="w-3.5 h-3.5" />
          Режим глубокого сравнения
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">Не путай! Сравнение пар</h2>
        <p className="text-sky-100 text-xs sm:text-sm mt-1 max-w-xl">
          Сравнивай две похожие конструкции бок о бок и закрепи разницу целевой тренировкой.
        </p>
      </div>

      {/* Pair selection buttons */}
      <div className="flex flex-wrap gap-2">
        {COMPARISON_PAIRS.map(pair => (
          <button
            key={pair.id}
            onClick={() => {
              playClickSound();
              setSelectedPairId(pair.id);
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all border-2 flex items-center gap-2 ${
              selectedPairId === pair.id
                ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{pair.name}</span>
          </button>
        ))}
      </div>

      {/* Comparison Detail Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-sky-100 space-y-6">
        <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
          {currentPair.name}
        </h3>

        {/* Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Construction */}
          <div className={`p-5 rounded-2xl border-2 space-y-3 ${currentPair.c1.color}`}>
            <span className="text-[11px] font-black uppercase tracking-wider block opacity-75">Конструкция 1</span>
            <div className="text-xl font-black">{currentPair.c1.title}</div>
            <div className="text-xs font-mono font-bold bg-white/70 p-2 rounded-xl border border-current/20">
              {currentPair.c1.formula}
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between font-bold text-base">
                <span>{currentPair.c1.exampleEs}</span>
                <button
                  onClick={() => speakSpanish(currentPair.c1.exampleEs)}
                  className="p-1 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs font-medium opacity-85">
                {currentPair.c1.exampleRu}
              </div>
            </div>
          </div>

          {/* Right Construction */}
          <div className={`p-5 rounded-2xl border-2 space-y-3 ${currentPair.c2.color}`}>
            <span className="text-[11px] font-black uppercase tracking-wider block opacity-75">Конструкция 2</span>
            <div className="text-xl font-black">{currentPair.c2.title}</div>
            <div className="text-xs font-mono font-bold bg-white/70 p-2 rounded-xl border border-current/20">
              {currentPair.c2.formula}
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between font-bold text-base">
                <span>{currentPair.c2.exampleEs}</span>
                <button
                  onClick={() => speakSpanish(currentPair.c2.exampleEs)}
                  className="p-1 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs font-medium opacity-85">
                {currentPair.c2.exampleRu}
              </div>
            </div>
          </div>
        </div>

        {/* Key Difference & Trap Warning */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 space-y-2">
          <h4 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
            <span>💡 Главное отличие:</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {currentPair.keyDifferenceRu}
          </p>
          <div className="pt-2 text-xs text-rose-800 font-bold border-t border-amber-200">
            ⚠️ Опасная ловушка: {currentPair.trapRu}
          </div>
        </div>

        {/* Drill Launch Button */}
        <div>
          <button
            onClick={handleStartDrill}
            className="w-full py-4 rounded-2xl font-black text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg transition-transform hover:scale-101 active:scale-99 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Потренировать именно эту пару</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
