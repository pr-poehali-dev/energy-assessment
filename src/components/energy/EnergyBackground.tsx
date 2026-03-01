export function Stars() {
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

export function EnergyOrb({ color, size = 300 }: { color: string; size?: number }) {
  return (
    <div
      className="rounded-full opacity-10 blur-3xl animate-pulse-glow absolute pointer-events-none"
      style={{ width: size, height: size, background: color }}
    />
  );
}
