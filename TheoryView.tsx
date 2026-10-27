import React, { useState } from 'react';
import { THEORY_ITEMS, COMPARISON_SUMMARY } from './theoryData';
import { GrammarConstruction } from './types';
import { Volume2, CheckCircle2, XCircle, Sparkles, BookOpen, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { speakSpanish, playClickSound } from './soundUtils';

export const TheoryView: React.FC = () => {
  const [selectedConstruction, setSelectedConstruction] = useState<GrammarConstruction>('estar_gerundio');
  const [showTranslations, setShowTranslations] = useState<boolean>(true);

  const constructionKeys: GrammarConstruction[] = [
    'estar_gerundio',
    'seguir_gerundio',
    'llevar_gerundio',
    'ir_gerundio',
    'tener',
    'tener_que',
    'querer',
  ];

  const currentTheory = THEORY_ITEMS[selectedConstruction];

  const handleSelectConstruction = (id: GrammarConstruction) => {
    playClickSound();
    setSelectedConstruction(id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-amber-500 rounded-3xl p-6 md:p-8 text-white shadow-xl border-4 border-amber-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400 text-blue-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Простая грамматика A1–A2
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              7 ключевых конструкций настоящего времени
            </h2>
            <p className="text-sky-100 text-sm md:text-base mt-1 max-w-2xl">
              Разбираем простыми словами: что означает каждая конструкция, как спрягаются глаголы и как перестать их путать при переводе с русского.
            </p>
          </div>
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className="self-start md:self-auto flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/30 transition-colors shadow-sm"
          >
            {showTranslations ? <EyeOff className="w-4 h-4 text-amber-300" /> : <Eye className="w-4 h-4 text-amber-300" />}
            <span>{showTranslations ? 'Скрыть переводы' : 'Показать переводы'}</span>
          </button>
        </div>
      </div>

      {/* Visual Cheat Sheet Matrix */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-sky-100">
        <div className="flex items-center gap-2 mb-4 text-blue-900 font-extrabold text-lg">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <span>Быстрая шпаргалка: почувствуй разницу в одном взгляде</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMPARISON_SUMMARY.map(item => (
            <div
              key={item.category}
              onClick={() => handleSelectConstruction(item.category as GrammarConstruction)}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                selectedConstruction === item.category
                  ? 'border-amber-400 bg-amber-50/70 shadow-md ring-2 ring-amber-300'
                  : 'border-slate-200 bg-slate-50/70 hover:border-sky-300 hover:bg-sky-50/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-md ${item.badge}`}>
                    {item.es}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakSpanish(item.es);
                    }}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded-md transition-colors"
                    title="Слушать произношение"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="font-bold text-sm text-slate-900 leading-snug">
                  {item.ru}
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                {item.meaning}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Construction Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {constructionKeys.map(key => {
          const item = THEORY_ITEMS[key];
          const isSelected = selectedConstruction === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectConstruction(key)}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all border-2 flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102 ring-2 ring-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50'
              }`}
            >
              <span>{item.nameEs}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isSelected ? 'bg-amber-300 text-blue-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {item.shortTag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Lesson Card for the Selected Construction */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border-2 border-sky-100 space-y-8">
        {/* Title and Meaning */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-blue-900">{currentTheory.nameEs}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${currentTheory.color.badge}`}>
                {currentTheory.shortTag}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-700 mt-1">
              Значение: {currentTheory.meaningRu}
            </h3>
          </div>
          <div className="bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Формула:</span>
            <span className="font-extrabold text-blue-800 text-base">{currentTheory.formula}</span>
          </div>
        </div>

        {/* When to Use */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            Когда используется в речи:
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {currentTheory.whenToUse.map((reason, idx) => (
              <li key={idx} className="bg-sky-50/60 border border-sky-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Conjugation Table of 1st Verb in Presente */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
              Как спрягается первый глагол в Presente de Indicativo:
            </h4>
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              Настоящее время (кто делает)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {currentTheory.conjugation.map(row => (
              <div key={row.pronoun} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 text-center hover:border-amber-400 transition-colors">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  {row.pronoun} ({row.ru})
                </span>
                <span className="text-lg font-black text-blue-900 mt-1 block">
                  {row.form}
                </span>
                <button
                  onClick={() => speakSpanish(row.form)}
                  className="mt-1 text-slate-400 hover:text-blue-600 transition-colors inline-block"
                  title="Прослушать форму"
                >
                  <Volume2 className="w-3.5 h-3.5 mx-auto" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Gerund Formation Rules if applicable */}
        {currentTheory.gerundRules && (
          <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-5">
            <h4 className="font-extrabold text-amber-900 text-sm sm:text-base mb-2">
              💡 Памятка по образованию герундия (Gerundio):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              {currentTheory.gerundRules.map((rule, idx) => (
                <div key={idx} className="bg-white/90 p-3 rounded-xl border border-amber-200">
                  <div className="font-bold text-slate-900">{rule.rule}</div>
                  <div className="text-amber-800 font-semibold mt-1 font-mono text-xs">{rule.examples}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8-10 Authentic Examples with Audio & Translation */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              Примеры предложений (нажми на динамик, чтобы послушать):
            </h4>
            <span className="text-xs font-bold text-blue-600">
              {currentTheory.examples.length} примеров
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentTheory.examples.map((ex, idx) => (
              <div
                key={idx}
                className="group p-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/60 hover:bg-white hover:border-sky-300 transition-all flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
                    <span>{ex.es}</span>
                  </div>
                  {showTranslations && (
                    <div className="text-xs sm:text-sm text-slate-600 font-medium">
                      {ex.ru}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => speakSpanish(ex.es)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-amber-400 hover:text-blue-950 transition-colors shadow-xs shrink-0"
                  title="Прослушать произношение"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison with Confusing Constructions ("Не путай!") */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
            Чем отличается от похожих конструкций:
          </h4>
          <div className="space-y-3">
            {currentTheory.distinction.map((dist, idx) => (
              <div key={idx} className="bg-sky-50/50 border-2 border-sky-200 rounded-2xl p-4 space-y-2">
                <div className="font-extrabold text-blue-950 text-sm sm:text-base flex items-center gap-2">
                  <span>{dist.title}</span>
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {dist.comparisonRu}
                </p>
                <div className="bg-white p-3 rounded-xl border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold">
                  <span className="text-blue-900 font-bold">{dist.exampleEs}</span>
                  <span className="text-slate-500">{dist.exampleRu}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typical Mistakes & How to Avoid */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            Типичные ошибки учеников и как их избежать:
          </h4>
          <div className="space-y-3">
            {currentTheory.typicalMistakes.map((mistake, idx) => (
              <div key={idx} className="bg-rose-50/60 border-2 border-rose-200 rounded-2xl p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs sm:text-sm">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="line-through">{mistake.wrongEs}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{mistake.rightEs}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="text-rose-900 font-bold">Почему так: </strong>
                  {mistake.whyRu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
