export type Stage = "intro" | "quiz" | "result";
export type EnergyLevel = "bad" | "neutral" | "good";

export interface Answer {
  level: EnergyLevel;
  percent: number;
}

export const ENERGY_TYPES = [
  {
    id: "physical",
    name: "Физическая энергия",
    symbol: "🔥",
    color: "hsl(25, 90%, 55%)",
    glowClass: "glow-physical",
    borderColor: "border-orange-500/40",
    bgGrad: "from-orange-900/30 to-transparent",
    description:
      "Жизненная сила тела — фундамент всего существования. Она питает каждую клетку, даёт выносливость, движение и здоровье. Без неё невозможна ни одна другая форма энергии.",
  },
  {
    id: "psychic",
    name: "Психическая энергия",
    symbol: "🌙",
    color: "hsl(270, 70%, 65%)",
    glowClass: "glow-psychic",
    borderColor: "border-purple-500/40",
    bgGrad: "from-purple-900/30 to-transparent",
    description:
      "Сила разума, эмоций и воли. Она управляет мыслями, чувствами и внутренними состояниями. Высокая психическая энергия — это ясность ума, эмоциональный баланс и сила намерения.",
  },
  {
    id: "egregor",
    name: "Энергия эгрегора",
    symbol: "✨",
    color: "hsl(185, 80%, 50%)",
    glowClass: "glow-egregor",
    borderColor: "border-cyan-500/40",
    bgGrad: "from-cyan-900/30 to-transparent",
    description:
      "Коллективная сила, которую вы получаете от связи с группами, традициями, архетипами и общим полем. Это энергия принадлежности, миссии и потока более высоких сил.",
  },
];

export const QUESTIONS: { text: string; energyType: string }[] = [
  // Physical
  { text: "Как вы оцениваете свой уровень физической активности и бодрости в течение дня?", energyType: "physical" },
  { text: "Насколько качественным и восстанавливающим является ваш сон?", energyType: "physical" },
  { text: "Как вы относитесь к своему питанию и заботе о теле?", energyType: "physical" },
  { text: "Чувствуете ли вы лёгкость и силу в теле при выполнении повседневных задач?", energyType: "physical" },
  // Psychic
  { text: "Насколько ясными и сфокусированными являются ваши мысли большую часть времени?", energyType: "psychic" },
  { text: "Как вы справляетесь со стрессом и эмоциональными нагрузками?", energyType: "psychic" },
  { text: "Ощущаете ли вы внутреннюю мотивацию и силу воли к действиям?", energyType: "psychic" },
  { text: "Насколько стабильным и гармоничным является ваше эмоциональное состояние?", energyType: "psychic" },
  // Egregor
  { text: "Чувствуете ли вы поддержку и связь с людьми, с которыми вас объединяет общее дело?", energyType: "egregor" },
  { text: "Насколько сильно вы ощущаете смысл и миссию в том, что делаете?", energyType: "egregor" },
  { text: "Получаете ли вы вдохновение и «поток» от принадлежности к какой-либо традиции или сообществу?", energyType: "egregor" },
  { text: "Ощущаете ли вы, что высшие силы или коллективное поле помогают вам?", energyType: "egregor" },
];

export const BAD_OPTIONS = [
  { label: "-20%", value: -20 },
  { label: "-50%", value: -50 },
  { label: "-80%", value: -80 },
  { label: "-100%", value: -100 },
];

export const GOOD_OPTIONS = [
  { label: "+20%", value: 20 },
  { label: "+50%", value: 50 },
  { label: "+80%", value: 80 },
  { label: "+100%", value: 100 },
];

export const MAX_PER_QUESTION = 250;
