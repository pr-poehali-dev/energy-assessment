import { useState, useEffect } from "react";
import { Stage, EnergyLevel, Answer, QUESTIONS, MAX_PER_QUESTION } from "@/components/energy/constants";
import IntroScreen from "@/components/energy/IntroScreen";
import QuizScreen from "@/components/energy/QuizScreen";
import ResultScreen from "@/components/energy/ResultScreen";

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

  const handleRestart = () => {
    setStage("intro");
    setCurrentQ(0);
    setAnswers([]);
    setSelectedLevel(null);
    setSelectedPercent(null);
  };

  if (stage === "intro") {
    return <IntroScreen onStart={() => setStage("quiz")} />;
  }

  if (stage === "quiz") {
    return (
      <QuizScreen
        currentQ={currentQ}
        selectedLevel={selectedLevel}
        selectedPercent={selectedPercent}
        onLevelSelect={handleLevelSelect}
        onPercentSelect={setSelectedPercent}
        onNext={handleNext}
      />
    );
  }

  return (
    <ResultScreen
      physicalScore={calcEnergy("physical")}
      psychicScore={calcEnergy("psychic")}
      egregorScore={calcEnergy("egregor")}
      onRestart={handleRestart}
    />
  );
}
