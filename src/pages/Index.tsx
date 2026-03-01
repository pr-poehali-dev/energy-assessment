import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

type Stage = "intro" | "quiz" | "result";
type EnergyLevel = "bad" | "neutral" | "good";

interface Answer {
  level: EnergyLevel;
  percent: number;
}

const ENERGY_TYPES = [
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

const QUESTIONS: { text: string; energyType: string }[] = [
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

const BAD_OPTIONS = [
  { label: "-20%", value: -20 },
  { label: "-50%", value: -50 },
  { label: "-80%", value: -80 },
  { label: "-100%", value: -100 },
];
const GOOD_OPTIONS = [
  { label: "+20%", value: 20 },
  { label: "+50%", value: 50 },
  { label: "+80%", value: 80 },
  { label: "+100%", value: 100 },
];

const MAX_PER_QUESTION = 250;

function Stars() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: Math.random() * 0.6 + 0.1,
          }}
        />
      ))}
    </div>
  );
}

function EnergyOrb({ color, size = 300 }: { color: string; size?: number }) {
  return (
    <div
      className="rounded-full opacity-10 blur-3xl animate-pulse-glow absolute pointer-events-none"
      style={{ width: size, height: size, background: color }}
    />
  );
}

export default function Index() {
  const [stage, setStage] = useState<Stage>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<EnergyLevel | null>(null);
  const [selectedPercent, setSelectedPercent] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 50);
    return () => clearTimeout(t);
  }, [currentQ, stage]);

  const handleLevelSelect = (level: EnergyLevel) => {
    setSelectedLevel(level);
    if (level === "neutral") setSelectedPercent(0);
    else setSelectedPercent(null);
  };

  const handleNext = () => {
    if (selectedPercent === null) return;
    const newAnswers = [...answers, { level: selectedLevel!, percent: selectedPercent }];
    setAnswers(newAnswers);
    setSelectedLevel(null);
    setSelectedPercent(null);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStage("result");
    }
  };

  const calcEnergy = (typeId: string) => {
    const indices = QUESTIONS.reduce<number[]>((acc, q, i) => {
      if (q.energyType === typeId) acc.push(i);
      return acc;
    }, []);
    let total = 0;
    indices.forEach((i) => {
      if (answers[i]) {
        total += MAX_PER_QUESTION + (MAX_PER_QUESTION * answers[i].percent) / 100;
      }
    });
    return Math.max(0, Math.round(total));
  };

  const physicalScore = calcEnergy("physical");
  const psychicScore = calcEnergy("psychic");
  const egregorScore = calcEnergy("egregor");
  const totalScore = physicalScore + psychicScore + egregorScore;
  const maxTotal = 3000;

  const currentEnergyType = ENERGY_TYPES.find(
    (e) => e.id === QUESTIONS[currentQ]?.energyType
  );

  const progressPercent = Math.round((currentQ / QUESTIONS.length) * 100);

  const radarData = [
    { subject: "Физическая", value: physicalScore, fullMark: 1000 },
    { subject: "Психическая", value: psychicScore, fullMark: 1000 },
    { subject: "Эгрегора", value: egregorScore, fullMark: 1000 },
  ];

  const radialData = [
    { name: "Физическая", value: physicalScore, fill: "hsl(25, 90%, 55%)" },
    { name: "Психическая", value: psychicScore, fill: "hsl(270, 70%, 65%)" },
    { name: "Энергия эгрегора", value: egregorScore, fill: "hsl(185, 80%, 50%)" },
  ];

  // ----------- INTRO -----------
  if (stage === "intro") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden noise-overlay">
        <Stars />
        <EnergyOrb color="hsl(270, 70%, 65%)" size={500} />
        <div className="absolute top-20 right-10 opacity-10">
          <EnergyOrb color="hsl(25, 90%, 55%)" size={300} />
        </div>

        <div className="relative z-10 max-w-3xl w-full text-center animate-fade-in">
          {/* Symbol */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="text-7xl animate-float">⚡</div>
              <div
                className="absolute inset-0 blur-2xl opacity-30 rounded-full"
                style={{ background: "hsl(45, 85%, 62%)" }}
              />
            </div>
          </div>

          <h1 className="font-cormorant text-5xl md:text-7xl font-light text-gold mb-4 leading-none tracking-wide">
            Диагностика
            <br />
            <span className="italic font-medium">Энергии</span>
          </h1>

          <p className="font-montserrat text-sm uppercase tracking-[0.3em] text-muted-foreground mb-12">
            Три источника вашей силы
          </p>

          {/* Energy types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {ENERGY_TYPES.map((e, idx) => (
              <div
                key={e.id}
                className={`mystic-card rounded-2xl p-6 text-left bg-gradient-to-b ${e.bgGrad} border ${e.borderColor} transition-all duration-500`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="text-3xl mb-3">{e.symbol}</div>
                <h3 className="font-cormorant text-xl text-gold mb-2">{e.name}</h3>
                <p className="font-montserrat text-xs text-muted-foreground leading-relaxed">
                  {e.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mystic-card rounded-2xl p-6 mb-10 text-left border border-yellow-600/20">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <h3 className="font-cormorant text-xl text-gold mb-1">Как проходит диагностика</h3>
                <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                  Вам предстоит ответить на <strong className="text-foreground">12 вопросов</strong> — по 4 на каждый
                  вид энергии. Для каждого вопроса выберите уровень (Плохо / Нейтрально / Хорошо)
                  и укажите степень. Максимальный уровень каждой энергии — <strong className="text-foreground">1000 единиц</strong>.
                  В конце получите точную карту своих энергий.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStage("quiz")}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full font-montserrat font-600 text-base uppercase tracking-widest transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, hsl(45,85%,55%), hsl(35,80%,45%))",
              color: "hsl(240, 20%, 5%)",
              boxShadow: "0 0 40px hsl(45 85% 55% / 0.4), 0 4px 20px hsl(45 85% 55% / 0.2)",
            }}
          >
            <span>Начать диагностику</span>
            <Icon name="Sparkles" size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ----------- QUIZ -----------
  if (stage === "quiz") {
    const qType = currentEnergyType!;
    const opts = selectedLevel === "bad" ? BAD_OPTIONS : GOOD_OPTIONS;

    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden noise-overlay">
        <Stars />
        <EnergyOrb color={qType.color} size={400} />

        <div className="relative z-10 max-w-2xl w-full">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-montserrat text-xs text-muted-foreground uppercase tracking-widest">
                Вопрос {currentQ + 1} из {QUESTIONS.length}
              </span>
              <span className="font-montserrat text-xs text-muted-foreground">{progressPercent}%</span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${qType.color}, hsl(45,85%,62%))`,
                }}
              />
            </div>
          </div>

          {/* Energy badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">{qType.symbol}</span>
            <span
              className="font-montserrat text-xs uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                color: qType.color,
                background: `${qType.color}22`,
                border: `1px solid ${qType.color}44`,
              }}
            >
              {qType.name}
            </span>
          </div>

          {/* Question */}
          <div className={`mystic-card rounded-3xl p-8 mb-6 border ${qType.borderColor} animate-scale-in`}>
            <p className="font-cormorant text-2xl md:text-3xl leading-snug text-foreground">
              {QUESTIONS[currentQ].text}
            </p>
          </div>

          {/* Level select */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(["bad", "neutral", "good"] as EnergyLevel[]).map((lvl) => {
              const labels = { bad: "Плохо", neutral: "Нейтрально", good: "Хорошо" };
              const emojis = { bad: "😔", neutral: "😐", good: "✨" };
              const colors = {
                bad: "hsl(0, 60%, 50%)",
                neutral: "hsl(220, 15%, 55%)",
                good: "hsl(140, 60%, 45%)",
              };
              const isActive = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => handleLevelSelect(lvl)}
                  className="mystic-card rounded-2xl py-4 px-3 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 border"
                  style={{
                    borderColor: isActive ? colors[lvl] : "hsl(260 25% 20%)",
                    background: isActive ? `${colors[lvl]}18` : undefined,
                    boxShadow: isActive ? `0 0 20px ${colors[lvl]}30` : undefined,
                  }}
                >
                  <span className="text-2xl">{emojis[lvl]}</span>
                  <span className="font-montserrat text-xs font-500 text-foreground">
                    {labels[lvl]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Percent select */}
          {selectedLevel && selectedLevel !== "neutral" && (
            <div className="grid grid-cols-4 gap-2 mb-6 animate-fade-in">
              {opts.map((opt) => {
                const isActive = selectedPercent === opt.value;
                const isPos = opt.value > 0;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedPercent(opt.value)}
                    className="mystic-card rounded-xl py-3 text-center font-montserrat text-sm font-600 transition-all duration-200 hover:scale-105 border"
                    style={{
                      color: isPos ? "hsl(140, 60%, 55%)" : "hsl(0, 70%, 65%)",
                      borderColor: isActive
                        ? isPos
                          ? "hsl(140, 60%, 45%)"
                          : "hsl(0, 60%, 50%)"
                        : "hsl(260 25% 20%)",
                      background: isActive
                        ? isPos
                          ? "hsl(140, 60%, 45% / 0.15)"
                          : "hsl(0, 60%, 50% / 0.15)"
                        : undefined,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {selectedLevel === "neutral" && (
            <div className="mb-6 rounded-xl px-4 py-3 font-montserrat text-sm text-muted-foreground text-center border border-muted bg-muted/20">
              Нейтральный уровень — 0 изменений
            </div>
          )}

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={selectedPercent === null}
            className="w-full py-4 rounded-2xl font-montserrat text-sm uppercase tracking-widest font-600 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02]"
            style={{
              background:
                selectedPercent !== null
                  ? "linear-gradient(135deg, hsl(45,85%,55%), hsl(35,80%,45%))"
                  : "hsl(260 20% 15%)",
              color: selectedPercent !== null ? "hsl(240, 20%, 5%)" : "hsl(260 20% 40%)",
              boxShadow:
                selectedPercent !== null
                  ? "0 0 30px hsl(45 85% 55% / 0.3)"
                  : undefined,
            }}
          >
            {currentQ < QUESTIONS.length - 1 ? "Следующий вопрос →" : "Получить результат ✨"}
          </button>
        </div>
      </div>
    );
  }

  // ----------- RESULT -----------
  const totalPercent = Math.round((totalScore / maxTotal) * 100);

  const getStatus = (score: number) => {
    const pct = (score / 1000) * 100;
    if (pct >= 70) return { label: "Высокий", color: "hsl(140, 60%, 55%)" };
    if (pct >= 40) return { label: "Средний", color: "hsl(45, 85%, 62%)" };
    return { label: "Низкий", color: "hsl(0, 70%, 60%)" };
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-16 overflow-hidden noise-overlay">
      <Stars />
      <EnergyOrb color="hsl(270,70%,65%)" size={600} />

      <div className="relative z-10 max-w-3xl w-full animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🌟</div>
          <h1 className="font-cormorant text-5xl md:text-6xl font-light text-gold mb-2">
            Ваша карта энергии
          </h1>
          <p className="font-montserrat text-sm text-muted-foreground uppercase tracking-widest">
            Результаты диагностики
          </p>
        </div>

        {/* Total score */}
        <div
          className="mystic-card rounded-3xl p-8 mb-6 text-center border border-yellow-600/30 glow-gold"
          style={{ boxShadow: "0 0 60px hsl(45 85% 55% / 0.12)" }}
        >
          <p className="font-montserrat text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Общий уровень энергии
          </p>
          <div className="font-cormorant text-8xl font-light text-gold mb-1">
            {totalScore}
          </div>
          <p className="font-montserrat text-sm text-muted-foreground">
            из {maxTotal} максимум · {totalPercent}%
          </p>
          {/* Bar */}
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${totalPercent}%`,
                background: "linear-gradient(90deg, hsl(45,85%,40%), hsl(45,85%,65%))",
              }}
            />
          </div>
        </div>

        {/* Radar chart */}
        <div className="mystic-card rounded-3xl p-6 mb-6 border border-muted">
          <h3 className="font-cormorant text-2xl text-gold text-center mb-4">
            Карта энергий
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(260 25% 22%)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(45, 30%, 70%)", fontSize: 11, fontFamily: "Montserrat" }}
              />
              <Radar
                name="Энергия"
                dataKey="value"
                stroke="hsl(45,85%,62%)"
                fill="hsl(45,85%,62%)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Radial bars */}
        <div className="mystic-card rounded-3xl p-6 mb-6 border border-muted">
          <h3 className="font-cormorant text-2xl text-gold text-center mb-6">
            По видам энергии
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              data={radialData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar dataKey="value" maxBarSize={18} background={{ fill: "hsl(260 25% 12%)" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-2">
            {radialData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                <span className="font-montserrat text-xs text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {ENERGY_TYPES.map((e) => {
            const score = e.id === "physical" ? physicalScore : e.id === "psychic" ? psychicScore : egregorScore;
            const status = getStatus(score);
            const pct = Math.round((score / 1000) * 100);
            return (
              <div
                key={e.id}
                className={`mystic-card rounded-2xl p-5 border ${e.borderColor} bg-gradient-to-b ${e.bgGrad}`}
              >
                <div className="text-2xl mb-2">{e.symbol}</div>
                <h4 className="font-cormorant text-lg text-foreground mb-1">{e.name}</h4>
                <div className="font-cormorant text-4xl font-light mb-1" style={{ color: e.color }}>
                  {score}
                </div>
                <p className="font-montserrat text-xs text-muted-foreground mb-3">из 1000 · {pct}%</p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%`, background: e.color }}
                  />
                </div>
                <span
                  className="font-montserrat text-xs px-2 py-0.5 rounded-full"
                  style={{
                    color: status.color,
                    background: `${status.color}22`,
                    border: `1px solid ${status.color}44`,
                  }}
                >
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="font-cormorant text-xl text-muted-foreground italic mb-6">
            Хотите научиться управлять своей энергией и направить её на процветание?
          </p>
          <a
            href="https://t.me/+WBzx-fV2Flo2ZDNi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-full font-montserrat text-sm font-600 uppercase tracking-widest transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, hsl(45,85%,55%), hsl(35,80%,45%))",
              color: "hsl(240, 20%, 5%)",
              boxShadow: "0 0 50px hsl(45 85% 55% / 0.5), 0 8px 30px hsl(45 85% 55% / 0.3)",
            }}
          >
            <span>Управлять Энергией</span>
            <Icon name="Zap" size={18} />
          </a>

          <div className="mt-8">
            <button
              onClick={() => {
                setStage("intro");
                setCurrentQ(0);
                setAnswers([]);
                setSelectedLevel(null);
                setSelectedPercent(null);
              }}
              className="font-montserrat text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Пройти тест заново
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
