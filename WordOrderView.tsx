import React, { useState } from 'react';
import { WORD_ORDER_PUZZLES } from './wordOrderData';
import { WordOrderPuzzle, UserStats } from './types';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { speakSpanish, playSuccessSound, playErrorSound, playClickSound } from './soundUtils';
import confetti from 'canvas-confetti';

interface WordOrderViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const WordOrderView: React.FC<WordOrderViewProps> = ({ stats, onUpdateStats }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentPuzzle: WordOrderPuzzle = WORD_ORDER_PUZZLES[currentIndex % WORD_ORDER_PUZZLES.length];

  // Word pool available to pick
  const [availableWords, setAvailableWords] = useState<{ id: string; text: string }[]>(() => {
    return [...currentPuzzle.targetWordsEs]
      .map((w, idx) => ({ id: `${w}-${idx}`, text: w }))
      .sort(() => 0.5 - Math.random());
  });

  // Words picked into the assembled sentence
  const [selectedWords, setSelectedWords] = useState<{ id: string; text: string }[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const resetPuzzle = (puzzle: WordOrderPuzzle) => {
    setSelectedWords([]);
    setIsSubmitted(false);
    setIsCorrect(false);
    setAvailableWords(
      [...puzzle.targetWordsEs]
        .map((w, idx) => ({ id: `${w}-${idx}`, text: w }))
        .sort(() => 0.5 - Math.random())
    );
  };

  const handlePickWord = (wordObj: { id: string; text: string }) => {
    if (isSubmitted) return;
    playClickSound();
    setAvailableWords(prev => prev.filter(w => w.id !== wordObj.id));
    setSelectedWords(prev => [...prev, wordObj]);
  };

  const handleRemoveWord = (wordObj: { id: string; text: string }) => {
    if (isSubmitted) return;
    playClickSound();
    setSelectedWords(prev => prev.filter(w => w.id !== wordObj.id));
    setAvailableWords(prev => [...prev, wordObj]);
  };

  const handleCheck = () => {
    if (selectedWords.length === 0 || isSubmitted) return;

    const assembledString = selectedWords.map(w => w.text).join(' ');
    const targetString = currentPuzzle.targetWordsEs.join(' ');
    const correct = assembledString === targetString;

    setIsSubmitted(true);
    setIsCorrect(correct);

    const updated = { ...stats };
    updated.completedExercisesCount += 1;

    if (correct) {
      playSuccessSound();
      updated.correctAnswersCount += 1;
      updated.xp += 15;
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } else {
      playErrorSound();
    }

    onUpdateStats(updated);
  };

  const handleNext = () => {
    playClickSound();
    const nextIdx = (currentIndex + 1) % WORD_ORDER_PUZZLES.length;
    setCurrentIndex(nextIdx);
    resetPuzzle(WORD_ORDER_PUZZLES[nextIdx]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-amber-500 rounded-3xl p-6 text-white shadow-xl border-4 border-amber-300">
        <div className="flex items-center gap-2 bg-amber-400 text-blue-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 w-max">
          <Sparkles className="w-3.5 h-3.5" />
          Интерактивный конструктор
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">Составь испанское предложение</h2>
        <p className="text-sky-100 text-xs sm:text-sm mt-1">
          Нажимай на слова в правильном порядке. Без ручного ввода текста!
        </p>
      </div>

      {/* Main Game Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-sky-100 space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Предложение {currentIndex + 1} из {WORD_ORDER_PUZZLES.length}</span>
          <button
            onClick={() => resetPuzzle(currentPuzzle)}
            className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить</span>
          </button>
        </div>

        {/* Russian prompt */}
        <div className="bg-sky-50 p-4 sm:p-5 rounded-2xl border-2 border-sky-200">
          <span className="text-[11px] font-black uppercase text-sky-700 tracking-wider block mb-1">
            Русская фраза:
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            {currentPuzzle.ru}
          </h3>
        </div>

        {/* Assembled Sentence Box (Drop Zone) */}
        <div className="min-h-24 p-4 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/40 flex flex-wrap items-center gap-2">
          {selectedWords.length === 0 ? (
            <span className="text-slate-400 font-semibold text-sm italic mx-auto">
              Нажимай на слова ниже, чтобы собрать перевод...
            </span>
          ) : (
            selectedWords.map(word => (
              <button
                key={word.id}
                onClick={() => handleRemoveWord(word)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-black text-base sm:text-lg shadow-md hover:bg-rose-500 transition-colors transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                title="Нажми, чтобы вернуть слово назад"
              >
                {word.text}
              </button>
            ))
          )}
        </div>

        {/* Available Word Bank */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
            Банк слов (нажимай по порядку):
          </span>
          <div className="flex flex-wrap gap-2.5 min-h-16">
            {availableWords.map(word => (
              <button
                key={word.id}
                onClick={() => handlePickWord(word)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 border-2 border-slate-300 hover:border-amber-400 font-extrabold text-base sm:text-lg shadow-sm transition-all transform hover:scale-103 active:scale-97 cursor-pointer"
              >
                {word.text}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback block */}
        {isSubmitted && (
          <div className={`p-5 rounded-2xl border-2 space-y-2 ${
            isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="flex items-center gap-2 font-black text-base sm:text-lg">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Отлично! Предложение собрано верно!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Порядок слов не совсем точен.</span>
                </>
              )}
            </div>

            <div className="text-sm font-semibold flex items-center justify-between">
              <span>Правильный вариант: <strong>{currentPuzzle.targetWordsEs.join(' ')}</strong></span>
              <button
                onClick={() => speakSpanish(currentPuzzle.targetWordsEs.join(' '))}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600"
                title="Слушать"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium pt-1">
              {currentPuzzle.explanation}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div>
          {!isSubmitted ? (
            <button
              onClick={handleCheck}
              disabled={selectedWords.length === 0}
              className={`w-full py-3.5 rounded-2xl font-black text-base shadow-lg transition-all ${
                selectedWords.length > 0
                  ? 'bg-amber-500 hover:bg-amber-600 text-blue-950 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Проверить фразу
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl font-black text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Следующая фраза</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
