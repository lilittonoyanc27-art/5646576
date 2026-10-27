import React, { useState, useEffect, useRef } from 'react';
import { Exercise, ExerciseOption, UserStats } from './types';
import { Volume2, CheckCircle, XCircle, ArrowRight, HelpCircle, Eye, EyeOff, RotateCcw, BookOpen, Sparkles } from 'lucide-react';
import { speakSpanish, playSuccessSound, playErrorSound, playClickSound } from './soundUtils';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  title: string;
  subtitle?: string;
  exercises: Exercise[];
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onCompleteQuiz: (score: number, total: number) => void;
  onExit: () => void;
  levelNumber?: number;
}

export const QuizView: React.FC<QuizViewProps> = ({
  title,
  subtitle,
  exercises: initialExercises,
  stats,
  onUpdateStats,
  onCompleteQuiz,
  onExit,
  levelNumber,
}) => {
  const [exerciseQueue, setExerciseQueue] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<ExerciseOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ExerciseOption | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHintTranslation, setShowHintTranslation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [initialTotalCount, setInitialTotalCount] = useState<number>(0);
  const [revealedTranslations, setRevealedTranslations] = useState<Record<string, boolean>>({});

  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const explanationRef = useRef<HTMLDivElement | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  // Initialize and shuffle exercises ONCE when the component mounts or levelNumber/title changes
  useEffect(() => {
    if (initialExercises && initialExercises.length > 0 && !isInitializedRef.current) {
      isInitializedRef.current = true;
      const randomized = [...initialExercises].sort(() => 0.5 - Math.random());
      setExerciseQueue(randomized);
      setInitialTotalCount(randomized.length);
      setCurrentIndex(0);
      setScore(0);
      setQuizFinished(false);
      setIsSubmitted(false);
      setSelectedOption(null);

      // Initialize first question options
      const first = randomized[0];
      if (first) {
        setShuffledOptions([...first.options].sort(() => 0.5 - Math.random()));
      }
    }
  }, [initialExercises]);

  // When currentIndex advances, prepare next question options
  useEffect(() => {
    if (exerciseQueue.length > 0 && currentIndex < exerciseQueue.length) {
      const current = exerciseQueue[currentIndex];
      if (current) {
        setShuffledOptions([...current.options].sort(() => 0.5 - Math.random()));
        setIsSubmitted(false);
        setSelectedOption(null);
        setShowHintTranslation(false);
        setRevealedTranslations({});
      }
    }
  }, [currentIndex]);

  const currentExercise = exerciseQueue[currentIndex];

  const toggleOptionTranslation = (text: string) => {
    setRevealedTranslations(prev => ({
      ...prev,
      [text]: !prev[text],
    }));
  };

  // When user clicks an option: show explanation immediately, DO NOT advance!
  const handleSelectOption = (option: ExerciseOption) => {
    // If already submitted, ignore clicks on options so user can read explanation
    if (isSubmitted) {
      return;
    }

    playClickSound();
    setSelectedOption(option);
    setIsSubmitted(true);

    const isCorrect = option.isCorrect;

    // Safe stats update
    const updatedStats: UserStats = {
      ...stats,
      completedExercisesCount: (stats.completedExercisesCount || 0) + 1,
      correctAnswersCount: (stats.correctAnswersCount || 0) + (isCorrect ? 1 : 0),
      xp: (stats.xp || 0) + (isCorrect ? 10 : 0),
      failedExerciseIds: stats.failedExerciseIds || [],
      resolvedMistakeIds: stats.resolvedMistakeIds || [],
      constructionMastery: { ...(stats.constructionMastery || {}) } as any,
    };

    const target = currentExercise.targetConstruction;
    if (!updatedStats.constructionMastery[target]) {
      updatedStats.constructionMastery[target] = { correct: 0, total: 0 };
    }
    updatedStats.constructionMastery[target].total = (updatedStats.constructionMastery[target].total || 0) + 1;

    if (isCorrect) {
      playSuccessSound();
      setScore(prev => prev + 1);
      updatedStats.constructionMastery[target].correct = (updatedStats.constructionMastery[target].correct || 0) + 1;

      // Mark resolved if was in mistake bank
      if (
        updatedStats.failedExerciseIds.includes(currentExercise.id) &&
        !updatedStats.resolvedMistakeIds.includes(currentExercise.id)
      ) {
        updatedStats.resolvedMistakeIds = [...updatedStats.resolvedMistakeIds, currentExercise.id];
      }
    } else {
      playErrorSound();
      // Record into mistake bank
      if (!updatedStats.failedExerciseIds.includes(currentExercise.id)) {
        updatedStats.failedExerciseIds = [...updatedStats.failedExerciseIds, currentExercise.id];
      }

      // Reinforcement question insertion
      const failedConstruction = currentExercise.targetConstruction;
      const reinforcer = initialExercises.find(
        ex => ex.targetConstruction === failedConstruction && ex.id !== currentExercise.id
      );
      if (reinforcer) {
        setExerciseQueue(prev => {
          const nextQueue = [...prev];
          const insertPos = Math.min(currentIndex + 3, nextQueue.length);
          nextQueue.splice(insertPos, 0, reinforcer);
          return nextQueue;
        });
      }
    }

    onUpdateStats(updatedStats);

    // Smoothly scroll down so user immediately sees the thorough explanation and next button
    setTimeout(() => {
      explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  };

  // Reset current question so learner can try picking again
  const handleResetCurrentQuestion = () => {
    playClickSound();
    setIsSubmitted(false);
    setSelectedOption(null);
    setShowHintTranslation(false);
  };

  // Advance to next question only when clicking the explicit "Далее" button
  const handleNextQuestion = () => {
    playClickSound();
    if (currentIndex + 1 < exerciseQueue.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Quiz Finished!
      setQuizFinished(true);
      if (score >= Math.floor(initialTotalCount * 0.7)) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
      onCompleteQuiz(score, initialTotalCount);
    }
  };

  const handleRestart = () => {
    playClickSound();
    const randomized = [...initialExercises].sort(() => 0.5 - Math.random());
    setExerciseQueue(randomized);
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
    setIsSubmitted(false);
    setSelectedOption(null);
    const first = randomized[0];
    if (first) {
      setShuffledOptions([...first.options].sort(() => 0.5 - Math.random()));
    }
  };

  if (!currentExercise && !quizFinished) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-slate-500 font-bold">
        Загрузка упражнений...
      </div>
    );
  }

  // Completion screen
  if (quizFinished) {
    const percentage = Math.round((score / Math.max(initialTotalCount, 1)) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-amber-300 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-lg">
            {stars >= 2 ? '🏆' : '📚'}
          </div>

          <div>
            <h2 className="text-2xl font-black text-blue-950">
              {stars >= 2 ? 'Превосходный результат!' : 'Блок завершён!'}
            </h2>
            <p className="text-slate-600 font-medium text-sm mt-1">
              {title}
            </p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(starNum => (
              <span
                key={starNum}
                className={`text-3xl ${
                  starNum <= stars ? 'text-amber-400 animate-bounce' : 'text-slate-200'
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Score Counter */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 flex justify-around items-center">
            <div>
              <span className="text-xs text-slate-500 block font-bold uppercase">Правильно</span>
              <span className="text-2xl font-black text-emerald-600">{score} / {initialTotalCount}</span>
            </div>
            <div className="h-8 w-px bg-sky-200"></div>
            <div>
              <span className="text-xs text-slate-500 block font-bold uppercase">Точность</span>
              <span className="text-2xl font-black text-blue-900">{percentage}%</span>
            </div>
            <div className="h-8 w-px bg-sky-200"></div>
            <div>
              <span className="text-xs text-slate-500 block font-bold uppercase">Опыт (XP)</span>
              <span className="text-2xl font-black text-amber-500">+{score * 10}</span>
            </div>
          </div>

          {/* Summary Feedback */}
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {percentage >= 80
              ? 'Ты отлично различаешь конструкции настоящего времени! Продолжай в том же духе!'
              : 'Хорошая тренировка! Ты всегда можешь пройти уровень заново или заглянуть в раздел «Не путай!». Все уровни открыты!'}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 transition-colors border border-slate-300 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Пройти заново</span>
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer"
            >
              К списку уровней
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / exerciseQueue.length) * 100);
  const correctOption = currentExercise.options.find(o => o.isCorrect);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              className="text-slate-600 hover:text-blue-900 flex items-center gap-1 transition-colors py-1.5 px-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200 shadow-xs cursor-pointer"
            >
              ← К уровням
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                handleRestart();
              }}
              className="text-slate-600 hover:text-amber-800 flex items-center gap-1 transition-colors py-1.5 px-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200 shadow-xs cursor-pointer text-xs"
              title="Сбросить текущий тест и начать сначала"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Сброс теста</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black shadow-xs">
              Вопрос {currentIndex + 1} из {exerciseQueue.length}
            </span>
            <span className="text-amber-600 font-extrabold bg-amber-100 px-2.5 py-1 rounded-full">
              ★ {score}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-400 via-sky-500 to-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-3 border-sky-100 space-y-6">
        {/* Situation / Context if present */}
        {currentExercise.contextRu && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3.5 rounded-r-2xl text-xs sm:text-sm text-amber-900 font-medium">
            <span className="font-bold block text-amber-950 mb-0.5">Ситуация:</span>
            {currentExercise.contextRu}
          </div>
        )}

        {/* Error to fix if present */}
        {currentExercise.errorInQuestionEs && (
          <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-2xl text-center space-y-1">
            <span className="text-xs font-black text-rose-700 uppercase tracking-wider block">
              Найди ошибку в предложении:
            </span>
            <div className="text-lg font-mono font-bold text-rose-900 line-through">
              {currentExercise.errorInQuestionEs}
            </div>
          </div>
        )}

        {/* Main Prompt */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black text-sky-700 uppercase tracking-wider">
              Переведи на испанский (нажми вариант для ответа):
            </span>
            <button
              onClick={() => setShowHintTranslation(!showHintTranslation)}
              className="text-xs text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Показать подсказку"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHintTranslation ? 'Скрыть подсказку' : 'Подсказка'}</span>
            </button>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {currentExercise.promptRu}
          </h3>
          {showHintTranslation && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
              💡 Обрати внимание на оттенок: действие происходит сейчас, продолжается или это долг/желание?
            </p>
          )}
        </div>

        {/* 4 Options */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          {shuffledOptions.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isThisCorrect = opt.isCorrect;

            let buttonStyle = 'bg-slate-50 hover:bg-sky-50 border-2 border-slate-200 text-slate-800 hover:border-amber-400';

            if (isSubmitted) {
              if (isThisCorrect) {
                // Correct answer always shines in bold green!
                buttonStyle = 'bg-emerald-50 border-3 border-emerald-500 text-emerald-950 shadow-md ring-3 ring-emerald-200';
              } else if (isSelected && !isThisCorrect) {
                // Chosen wrong answer shines in red!
                buttonStyle = 'bg-rose-50 border-3 border-rose-500 text-rose-950 shadow-md ring-3 ring-rose-200';
              } else {
                buttonStyle = 'bg-slate-50/50 border-2 border-slate-200 text-slate-400 opacity-40';
              }
            }

            const letter = ['A', 'B', 'C', 'D'][idx];

            return (
              <div
                key={opt.textEs}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 rounded-2xl transition-all ${
                  isSubmitted ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]'
                } flex items-center justify-between gap-3 ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs ${
                    isSubmitted && isThisCorrect
                      ? 'bg-emerald-600 text-white'
                      : isSubmitted && isSelected && !isThisCorrect
                      ? 'bg-rose-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-600'
                  }`}>
                    {letter}
                  </span>
                  <div>
                    <div className="font-extrabold text-base sm:text-lg leading-snug">
                      {opt.textEs}
                    </div>
                    {/* Clickable translation toggle on demand */}
                    {revealedTranslations[opt.textEs] && (
                      <div className="text-xs text-slate-500 font-medium mt-1">
                        🇷🇺 {currentExercise.correctTranslationRu}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Pronunciation Speaker Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakSpanish(opt.textEs);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer"
                    title="Слушать произношение"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Russian Translation reveal toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOptionTranslation(opt.textEs);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-white transition-colors cursor-pointer"
                    title="Показать русский перевод этой фразы"
                  >
                    {revealedTranslations[opt.textEs] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  {isSubmitted && isThisCorrect && (
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isThisCorrect && (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAILED EXPLANATION FOR EVERY QUESTION (BOTH CORRECT AND INCORRECT) */}
        {isSubmitted && (
          <div
            ref={explanationRef}
            className={`p-5 sm:p-6 rounded-3xl border-3 space-y-4 animate-fadeIn shadow-md ${
              selectedOption?.isCorrect
                ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/95 border-rose-300 text-rose-950'
            }`}
          >
            {/* Header banner of feedback */}
            <div className="flex items-start gap-3">
              {selectedOption?.isCorrect ? (
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h4 className="font-black text-base sm:text-lg">
                  {selectedOption?.isCorrect
                    ? '✅ Правильно! Отличная работа!'
                    : '❌ Неверно. Давай подробно разберём правило:'}
                </h4>
                <p className="text-xs sm:text-sm font-semibold opacity-90 mt-0.5">
                  {selectedOption?.isCorrect
                    ? 'Прочитай объяснение грамматики и нажми «Далее →»'
                    : 'Внимательно прочитай разбор ниже, чтобы запомнить разницу:'}
                </p>
              </div>
            </div>

            {/* Answer Comparison Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* What was chosen (if wrong) */}
              {!selectedOption?.isCorrect && (
                <div className="bg-rose-100/70 border border-rose-300 p-3 rounded-2xl">
                  <span className="text-[11px] font-black uppercase text-rose-700 tracking-wider block mb-1">
                    ❌ Твой выбор (неверно):
                  </span>
                  <div className="font-extrabold text-sm text-rose-950 line-through">
                    {selectedOption?.textEs}
                  </div>
                </div>
              )}

              {/* Correct answer */}
              <div className={`border p-3 rounded-2xl ${
                selectedOption?.isCorrect ? 'bg-emerald-100/70 border-emerald-300 sm:col-span-2' : 'bg-emerald-100/80 border-emerald-300'
              }`}>
                <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider block mb-1">
                  ✅ Правильный ответ:
                </span>
                <div className="font-extrabold text-sm sm:text-base text-emerald-950 flex items-center justify-between gap-1">
                  <span>{correctOption?.textEs}</span>
                  {correctOption && (
                    <button
                      onClick={() => speakSpanish(correctOption.textEs)}
                      className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
                      title="Послушать правильный ответ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-xs text-emerald-800 font-medium mt-1">
                  Перевод: {currentExercise.correctTranslationRu}
                </div>
              </div>
            </div>

            {/* Detailed Russian Rule Explanation (ALWAYS PRESENT FOR ALL QUESTIONS) */}
            <div className="bg-white/95 p-4 rounded-2xl border border-slate-200 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-900">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Подробное объяснение правила:</span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-800">
                {currentExercise.errorExplanation}
              </p>
            </div>

            {/* Extra reinforcing example */}
            {currentExercise.extraExample && (
              <div className="bg-white/95 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 shadow-xs">
                <span className="font-black text-amber-800 uppercase tracking-wider text-[11px] block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Пример для лучшего запоминания:
                </span>
                <div className="font-black text-slate-900 text-sm sm:text-base flex items-center justify-between gap-2">
                  <span>{currentExercise.extraExample.es}</span>
                  <button
                    onClick={() => speakSpanish(currentExercise.extraExample.es)}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
                    title="Слушать произношение"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-slate-600 font-medium">{currentExercise.extraExample.ru}</div>
              </div>
            )}

            {/* Action buttons inside the explanation card */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {!selectedOption?.isCorrect && (
                <button
                  type="button"
                  onClick={handleResetCurrentQuestion}
                  className="py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  title="Сбросить выбранный ответ и попробовать ещё раз"
                >
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  <span>Попробовать снова (Сброс)</span>
                </button>
              )}

              <button
                ref={nextButtonRef}
                onClick={handleNextQuestion}
                className="flex-1 py-4 px-6 rounded-2xl font-black text-base shadow-xl transition-all flex items-center justify-center gap-2 transform hover:scale-101 active:scale-99 cursor-pointer bg-gradient-to-r from-blue-600 via-sky-600 to-amber-500 hover:from-blue-700 hover:to-sky-700 text-white ring-2 ring-amber-300"
              >
                <span>
                  {currentIndex + 1 < exerciseQueue.length
                    ? 'Далее'
                    : 'Завершить и посмотреть результат'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* When not submitted, simple instruction hint */}
        {!isSubmitted && (
          <div className="text-center text-xs text-slate-500 font-semibold py-1">
            👆 Нажми на любой вариант выше — сразу появится разбор правила и кнопка «Далее»
          </div>
        )}
      </div>
    </div>
  );
};
