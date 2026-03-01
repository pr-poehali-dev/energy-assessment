import Icon from "@/components/ui/icon";
import { ENERGY_TYPES } from "./constants";
import { Stars, EnergyOrb } from "./EnergyBackground";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
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
          onClick={onStart}
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
