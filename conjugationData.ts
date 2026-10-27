export interface VerbConjugation {
  verb: string;
  translationRu: string;
  forms: {
    yo: string;
    tu: string;
    el: string;
    nosotros: string;
    vosotros: string;
    ellos: string;
  };
  notesRu: string;
}

export const VERB_CONJUGATIONS: Record<string, VerbConjugation> = {
  estar: {
    verb: 'estar',
    translationRu: 'находиться / быть в процессе',
    forms: {
      yo: 'estoy',
      tu: 'estás',
      el: 'está',
      nosotros: 'estamos',
      vosotros: 'estáis',
      ellos: 'están',
    },
    notesRu: 'Обратите внимание на ударения (á) во всех лицах, кроме yo и nosotros: estás, está, estáis, están.',
  },
  seguir: {
    verb: 'seguir',
    translationRu: 'продолжать / следовать',
    forms: {
      yo: 'sigo',
      tu: 'sigues',
      el: 'sigue',
      nosotros: 'seguimos',
      vosotros: 'seguís',
      ellos: 'siguen',
    },
    notesRu: 'В корне e меняется на i во всех лицах кроме nosotros (seguimos) и vosotros (seguís). В yo пишется sigo (без u).',
  },
  llevar: {
    verb: 'llevar',
    translationRu: 'носить / длиться по времени',
    forms: {
      yo: 'llevo',
      tu: 'llevas',
      el: 'lleva',
      nosotros: 'llevamos',
      vosotros: 'lleváis',
      ellos: 'llevan',
    },
    notesRu: 'Правильный глагол 1 спряжения (-ar). Спрягается строго по правилам.',
  },
  ir: {
    verb: 'ir',
    translationRu: 'идти / постепенно развиваться',
    forms: {
      yo: 'voy',
      tu: 'vas',
      el: 'va',
      nosotros: 'vamos',
      vosotros: 'vais',
      ellos: 'van',
    },
    notesRu: 'Полностью неправильный глагол. Формы нужно просто выучить наизусть: voy, vas, va, vamos, vais, van.',
  },
  tener: {
    verb: 'tener',
    translationRu: 'иметь / иметь необходимость (tener que)',
    forms: {
      yo: 'tengo',
      tu: 'tienes',
      el: 'tiene',
      nosotros: 'tenemos',
      vosotros: 'tenéis',
      ellos: 'tienen',
    },
    notesRu: 'Особая форма yo: tengo. В tú, él, ellos корень e меняется на ie (tienes, tiene, tienen). В nosotros и vosotros: tenemos, tenéis.',
  },
  querer: {
    verb: 'querer',
    translationRu: 'хотеть',
    forms: {
      yo: 'quiero',
      tu: 'quieres',
      el: 'quiere',
      nosotros: 'queremos',
      vosotros: 'queréis',
      ellos: 'quieren',
    },
    notesRu: 'Чередование e → ie во всех лицах кроме nosotros (queremos) и vosotros (queréis).',
  },
};

export interface GerundItem {
  infinitive: string;
  gerund: string;
  translationRu: string;
  isIrregular: boolean;
  ruleRu: string;
}

export const COMMON_GERUNDS: GerundItem[] = [
  { infinitive: 'hablar', gerund: 'hablando', translationRu: 'говоря / разговаривая', isIrregular: false, ruleRu: '1 спряжение (-ar) → -ando' },
  { infinitive: 'comer', gerund: 'comiendo', translationRu: 'кушая / обедая', isIrregular: false, ruleRu: '2 спряжение (-er) → -iendo' },
  { infinitive: 'vivir', gerund: 'viviendo', translationRu: 'живя', isIrregular: false, ruleRu: '3 спряжение (-ir) → -iendo' },
  { infinitive: 'estudiar', gerund: 'estudiando', translationRu: 'учась / занимаясь', isIrregular: false, ruleRu: '1 спряжение (-ar) → -ando' },
  { infinitive: 'trabajar', gerund: 'trabajando', translationRu: 'работая', isIrregular: false, ruleRu: '1 спряжение (-ar) → -ando' },
  { infinitive: 'leer', gerund: 'leyendo', translationRu: 'читая', isIrregular: true, ruleRu: 'Гласная между iendo меняется на y: le-iendo → leyendo' },
  { infinitive: 'dormir', gerund: 'durmiendo', translationRu: 'спя', isIrregular: true, ruleRu: 'Чередование в корне o → u перед -iendo: durmiendo' },
  { infinitive: 'escribir', gerund: 'escribiendo', translationRu: 'пиша / создавая текст', isIrregular: false, ruleRu: '3 спряжение (-ir) → -iendo' },
  { infinitive: 'jugar', gerund: 'jugando', translationRu: 'играя', isIrregular: false, ruleRu: '1 спряжение (-ar) → -ando' },
  { infinitive: 'hacer', gerund: 'haciendo', translationRu: 'делая', isIrregular: false, ruleRu: '2 спряжение (-er) → -iendo' },
  { infinitive: 'aprender', gerund: 'aprendiendo', translationRu: 'учась / осваивая', isIrregular: false, ruleRu: '2 спряжение (-er) → -iendo' },
  { infinitive: 'cocinar', gerund: 'cocinando', translationRu: 'готовя еду', isIrregular: false, ruleRu: '1 спряжение (-ar) → -ando' },
  { infinitive: 'comprar', gerund: 'comprando', translationRu: 'покупая', isIrregular: false, ruleRu: '1 спряжение (-ar) → -ando' },
  { infinitive: 'esperar', gerund: 'esperando', translationRu: 'ожидая', isIrregular: false, ruleRu: '1 спряжение (-ar) → -ando' },
  { infinitive: 'pedir', gerund: 'pidiendo', translationRu: 'прося / заказывая', isIrregular: true, ruleRu: 'Чередование e → i: pidiendo' },
  { infinitive: 'decir', gerund: 'diciendo', translationRu: 'говоря / произнося', isIrregular: true, ruleRu: 'Чередование e → i: diciendo' },
];

export interface ConjugationQuestion {
  id: string;
  verb: string;
  pronoun: string;
  pronounRu: string;
  contextSentenceRu: string;
  contextSentenceEs: string;
  correctForm: string;
  options: string[];
  explanation: string;
}

export const CONJUGATION_DRILL_QUESTIONS: ConjugationQuestion[] = [
  {
    id: 'conj-1',
    verb: 'estar',
    pronoun: 'nosotros',
    pronounRu: 'мы',
    contextSentenceRu: 'Мы сейчас готовим ужин.',
    contextSentenceEs: 'Nosotros ___ preparando la cena.',
    correctForm: 'estamos',
    options: ['estamos', 'estoy', 'están', 'estáis'],
    explanation: 'Для местоимения «nosotros» (мы) форма глагола estar — «estamos».',
  },
  {
    id: 'conj-2',
    verb: 'seguir',
    pronoun: 'yo',
    pronounRu: 'я',
    contextSentenceRu: 'Я продолжаю учиться.',
    contextSentenceEs: 'Yo ___ estudiando español.',
    correctForm: 'sigo',
    options: ['sigo', 'sigues', 'sego', 'sigue'],
    explanation: 'Глагол seguir в 1-м лице единственного числа (yo) имеет форму «sigo» (буква u выпадает, e меняется на i).',
  },
  {
    id: 'conj-3',
    verb: 'llevar',
    pronoun: 'tú',
    pronounRu: 'ты',
    contextSentenceRu: 'Ты уже два часа читаешь книгу.',
    contextSentenceEs: 'Tú ___ dos horas leyendo el libro.',
    correctForm: 'llevas',
    options: ['llevas', 'llevo', 'lleva', 'lleváis'],
    explanation: 'Для местоимения «tú» (ты) форма глагола llevar — «llevas».',
  },
  {
    id: 'conj-4',
    verb: 'ir',
    pronoun: 'ellos',
    pronounRu: 'они',
    contextSentenceRu: 'Они постепенно понимают правила.',
    contextSentenceEs: 'Ellos ___ entendiendo las reglas.',
    correctForm: 'van',
    options: ['van', 'vamos', 'vais', 'va'],
    explanation: 'Для местоимения «ellos» (они) форма глагола ir — «van».',
  },
  {
    id: 'conj-5',
    verb: 'querer',
    pronoun: 'tú',
    pronounRu: 'ты',
    contextSentenceRu: 'Ты хочешь пойти гулять в парк?',
    contextSentenceEs: '¿___ ir al parque a pasear?',
    correctForm: 'quieres',
    options: ['quieres', 'quiero', 'quiere', 'quereis'],
    explanation: 'Для местоимения «tú» глагол querer меняет e на ie: «quieres».',
  },
  {
    id: 'conj-6',
    verb: 'tener',
    pronoun: 'nosotros',
    pronounRu: 'мы',
    contextSentenceRu: 'Нам нужно купить продукты.',
    contextSentenceEs: 'Nosotros ___ que comprar comida.',
    correctForm: 'tenemos',
    options: ['tenemos', 'tienen', 'tenéis', 'tengo'],
    explanation: 'Для формы «nosotros» (мы) глагол tener не меняет корень: «tenemos».',
  },
  {
    id: 'conj-7',
    verb: 'estar',
    pronoun: 'vosotros',
    pronounRu: 'вы (друзья)',
    contextSentenceRu: 'Вы сейчас смотрите футбол?',
    contextSentenceEs: '¿Vosotros ___ viendo el fútbol?',
    correctForm: 'estáis',
    options: ['estáis', 'están', 'estamos', 'estás'],
    explanation: 'Для местоимения «vosotros» форма глагола estar — «estáis» с графическим ударением.',
  },
  {
    id: 'conj-8',
    verb: 'seguir',
    pronoun: 'ella',
    pronounRu: 'она',
    contextSentenceRu: 'Она всё ещё спит.',
    contextSentenceEs: 'Ella ___ durmiendo en su cama.',
    correctForm: 'sigue',
    options: ['sigue', 'sigo', 'siguen', 'sigues'],
    explanation: 'Для 3-го лица ед. числа (ella) форма глагола seguir — «sigue».',
  },
  {
    id: 'conj-9',
    verb: 'llevar',
    pronoun: 'nosotros',
    pronounRu: 'мы',
    contextSentenceRu: 'Мы живём в Мадриде уже год.',
    contextSentenceEs: 'Nosotros ___ un año viviendo en Madrid.',
    correctForm: 'llevamos',
    options: ['llevamos', 'llevo', 'llevan', 'lleva'],
    explanation: 'Для местоимения «nosotros» глагол llevar имеет правильную форму «llevamos».',
  },
  {
    id: 'conj-10',
    verb: 'ir',
    pronoun: 'yo',
    pronounRu: 'я',
    contextSentenceRu: 'Я потихоньку улучшаю свой испанский.',
    contextSentenceEs: 'Yo ___ mejorando mi español poco a poco.',
    correctForm: 'voy',
    options: ['voy', 'vas', 'va', 'vamos'],
    explanation: 'В 1-м лице ед. числа (yo) форма глагола ir — «voy».',
  },
  {
    id: 'conj-11',
    verb: 'tener',
    pronoun: 'yo',
    pronounRu: 'я',
    contextSentenceRu: 'У меня есть важный вопрос.',
    contextSentenceEs: 'Yo ___ una pregunta importante.',
    correctForm: 'tengo',
    options: ['tengo', 'tiene', 'tienes', 'tenemos'],
    explanation: 'Глагол tener в форме «yo» имеет особое окончание: «tengo».',
  },
  {
    id: 'conj-12',
    verb: 'querer',
    pronoun: 'ellos',
    pronounRu: 'они',
    contextSentenceRu: 'Они хотят выпить чашку чая.',
    contextSentenceEs: 'Ellos ___ beber una taza de té.',
    correctForm: 'quieren',
    options: ['quieren', 'quiere', 'queremos', 'quiero'],
    explanation: 'Для формы «ellos» (они) правильная форма глагола querer — «quieren».',
  },
  {
    id: 'conj-13',
    verb: 'estar',
    pronoun: 'ellos',
    pronounRu: 'они',
    contextSentenceRu: 'Они сейчас работают в офисе.',
    contextSentenceEs: 'Ellos ___ trabajando en la oficina.',
    correctForm: 'están',
    options: ['están', 'estamos', 'está', 'estáis'],
    explanation: 'Для «ellos» (они) форма глагола estar — «están» (с ударением á).',
  },
  {
    id: 'conj-14',
    verb: 'seguir',
    pronoun: 'tú',
    pronounRu: 'ты',
    contextSentenceRu: 'Ты продолжаешь ждать автобус?',
    contextSentenceEs: '¿Tú ___ esperando el autobús?',
    correctForm: 'sigues',
    options: ['sigues', 'sigo', 'sigue', 'seguís'],
    explanation: 'Для «tú» форма глагола seguir — «sigues».',
  },
  {
    id: 'conj-15',
    verb: 'tener',
    pronoun: 'tú',
    pronounRu: 'ты',
    contextSentenceRu: 'Тебе нужно убрать в комнате.',
    contextSentenceEs: 'Tú ___ que limpiar la habitación.',
    correctForm: 'tienes',
    options: ['tienes', 'tengo', 'tiene', 'tenéis'],
    explanation: 'Для «tú» форма глагола tener — «tienes» (чередование e → ie).',
  },
  {
    id: 'conj-16',
    verb: 'ir',
    pronoun: 'nosotros',
    pronounRu: 'мы',
    contextSentenceRu: 'Мы потихоньку привыкаем к новому расписанию.',
    contextSentenceEs: 'Nosotros ___ acostumbrándonos poco a poco.',
    correctForm: 'vamos',
    options: ['vamos', 'van', 'vais', 'voy'],
    explanation: 'Для формы «nosotros» (мы) глагол ir имеет форму «vamos».',
  },
];
