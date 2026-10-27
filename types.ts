export type GrammarConstruction =
  | 'estar_gerundio'
  | 'seguir_gerundio'
  | 'llevar_gerundio'
  | 'ir_gerundio'
  | 'tener'
  | 'tener_que'
  | 'querer';

export type Category =
  | 'family'
  | 'school'
  | 'work'
  | 'sports'
  | 'friends'
  | 'food'
  | 'routine'
  | 'phone';

export interface ExerciseOption {
  textEs: string;
  isCorrect: boolean;
  construction?: GrammarConstruction;
  distractorReasonRu?: string;
}

export interface Exercise {
  id: string;
  levels: number[]; // Can belong to Level 1..10 and/or blitz/final
  category: Category;
  type:
    | 'recognition'
    | 'construction'
    | 'conjugation'
    | 'tener_vs_querer'
    | 'gerund_four'
    | 'find_error'
    | 'situation'
    | 'translation'
    | 'mixed'
    | 'final_test';
  promptRu: string;
  contextRu?: string; // For situation level or phone calls
  errorInQuestionEs?: string; // For "find error" exercises
  options: ExerciseOption[];
  targetConstruction: GrammarConstruction;
  correctTranslationRu: string;
  errorExplanation: string; // Detailed educational explanation
  comparisonsRu?: string; // Difference between correct & popular wrong choice
  extraExample: {
    es: string;
    ru: string;
  };
  tags: string[];
}

export interface ConjugationRow {
  pronoun: string;
  ru: string;
  form: string;
}

export interface TheoryItem {
  id: GrammarConstruction;
  nameEs: string;
  titleRu: string;
  formula: string;
  meaningRu: string;
  whenToUse: string[];
  conjugation: ConjugationRow[];
  gerundRules?: { rule: string; examples: string }[];
  examples: { es: string; ru: string; highlight?: string }[];
  distinction: {
    vsId: GrammarConstruction;
    title: string;
    comparisonRu: string;
    exampleEs: string;
    exampleRu: string;
  }[];
  typicalMistakes: {
    wrongEs: string;
    rightEs: string;
    whyRu: string;
  }[];
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  icon: string;
  shortTag: string;
}

export interface WordOrderPuzzle {
  id: string;
  ru: string;
  targetWordsEs: string[];
  construction: GrammarConstruction;
  explanation: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  lastStudiedDate: string;
  completedExercisesCount: number;
  correctAnswersCount: number;
  levelScores: Record<number, { stars: number; highScore: number; completed: boolean }>;
  failedExerciseIds: string[];
  resolvedMistakeIds: string[];
  constructionMastery: Record<GrammarConstruction, { correct: number; total: number }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: (stats: UserStats) => boolean;
}
