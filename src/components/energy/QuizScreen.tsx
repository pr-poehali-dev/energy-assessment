import { ENERGY_TYPES, QUESTIONS, BAD_OPTIONS, GOOD_OPTIONS, EnergyLevel, Answer } from "./constants";
import { Stars, EnergyOrb } from "./EnergyBackground";

interface QuizScreenProps {
  currentQ: number;
  selectedLevel: EnergyLevel | null;
  selectedPercent: number | null;
  onLevelSelect: (level: EnergyLevel) => void;
  onPercentSelect: (value: number) => void;
  onNext: () => void;
}

export default function QuizScreen({
  currentQ,
  selectedLevel,
  selectedPercent,
  onLevelSelect,
  onPercentSelect,
  onNext,
}: QuizScreenProps) {
  const qType = ENERGY_TYPES.find((e) => e.id === QUESTIONS[currentQ]?.energyType)!;
  const progressPercent = Math.round((currentQ / QUESTIONS.length) * 100);
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
                onClick={() => onLevelSelect(lvl)}
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
                  onClick={() => onPercentSelect(opt.value)}
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
          onClick={onNext}
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
