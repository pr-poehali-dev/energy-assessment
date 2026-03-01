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
import { ENERGY_TYPES } from "./constants";
import { Stars, EnergyOrb } from "./EnergyBackground";

interface ResultScreenProps {
  physicalScore: number;
  psychicScore: number;
  egregorScore: number;
  onRestart: () => void;
}

export default function ResultScreen({
  physicalScore,
  psychicScore,
  egregorScore,
  onRestart,
}: ResultScreenProps) {
  const totalScore = physicalScore + psychicScore + egregorScore;
  const maxTotal = 3000;
  const totalPercent = Math.round((totalScore / maxTotal) * 100);

  const getStatus = (score: number) => {
    const pct = (score / 1000) * 100;
    if (pct >= 70) return { label: "Высокий", color: "hsl(140, 60%, 55%)" };
    if (pct >= 40) return { label: "Средний", color: "hsl(45, 85%, 62%)" };
    return { label: "Низкий", color: "hsl(0, 70%, 60%)" };
  };

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

  const scores: Record<string, number> = {
    physical: physicalScore,
    psychic: psychicScore,
    egregor: egregorScore,
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
            const score = scores[e.id];
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
              onClick={onRestart}
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
