import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, Atom, Zap, Settings } from "lucide-react";

interface PhysicsSimulationGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface Simulation {
  id: string;
  title: string;
  description: string;
  question: string;
  variables: Variable[];
  correctAnswer: number;
  explanation: string;
  emoji: string;
}

interface Variable {
  name: string;
  symbol: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
}

const simulations: Simulation[] = [
  {
    id: "projectile",
    title: "Projectile Motion",
    description: "Calculate the range of a projectile launched at an angle",
    question: "A ball is launched at 45° with initial velocity 20 m/s. What's the range? (g = 10 m/s²)",
    variables: [
      { name: "Initial Velocity", symbol: "v₀", value: 20, unit: "m/s", min: 10, max: 30, step: 1 },
      { name: "Launch Angle", symbol: "θ", value: 45, unit: "°", min: 15, max: 75, step: 5 },
      { name: "Gravity", symbol: "g", value: 10, unit: "m/s²", min: 9.8, max: 10.2, step: 0.1 }
    ],
    correctAnswer: 40,
    explanation: "Range = v₀²sin(2θ)/g = 20²×sin(90°)/10 = 400×1/10 = 40m",
    emoji: "🏀"
  },
  {
    id: "circuit",
    title: "Ohm's Law Circuit",
    description: "Calculate current in a simple circuit",
    question: "Find the current when voltage is 12V and resistance is 4Ω",
    variables: [
      { name: "Voltage", symbol: "V", value: 12, unit: "V", min: 6, max: 24, step: 1 },
      { name: "Resistance", symbol: "R", value: 4, unit: "Ω", min: 2, max: 10, step: 1 }
    ],
    correctAnswer: 3,
    explanation: "Current I = V/R = 12V/4Ω = 3A",
    emoji: "⚡"
  },
  {
    id: "pendulum",
    title: "Simple Pendulum",
    description: "Calculate the period of a pendulum",
    question: "Find the period of a 1m pendulum (g = 10 m/s²)",
    variables: [
      { name: "Length", symbol: "L", value: 1, unit: "m", min: 0.5, max: 2, step: 0.1 },
      { name: "Gravity", symbol: "g", value: 10, unit: "m/s²", min: 9.8, max: 10.2, step: 0.1 }
    ],
    correctAnswer: 2,
    explanation: "Period T = 2π√(L/g) = 2π√(1/10) ≈ 2π×0.316 ≈ 2s",
    emoji: "⏰"
  },
  {
    id: "waves",
    title: "Wave Speed",
    description: "Calculate wave speed using frequency and wavelength",
    question: "Find wave speed when frequency is 5 Hz and wavelength is 2m",
    variables: [
      { name: "Frequency", symbol: "f", value: 5, unit: "Hz", min: 1, max: 10, step: 1 },
      { name: "Wavelength", symbol: "λ", value: 2, unit: "m", min: 1, max: 5, step: 0.5 }
    ],
    correctAnswer: 10,
    explanation: "Wave speed v = fλ = 5 Hz × 2m = 10 m/s",
    emoji: "🌊"
  }
];

export default function PhysicsSimulationGame({ onScoreUpdate, onProgressUpdate }: PhysicsSimulationGameProps) {
  const { toast } = useToast();
  const [currentSim, setCurrentSim] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const progress = (currentSim / simulations.length) * 100;
    onProgressUpdate(progress);
  }, [currentSim, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    const sim = simulations[currentSim];
    if (sim) {
      setVariables([...sim.variables]);
    }
  }, [currentSim]);

  const handleVariableChange = (index: number, newValue: number) => {
    if (showExplanation) return;
    const newVariables = [...variables];
    newVariables[index].value = newValue;
    setVariables(newVariables);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const sim = simulations[currentSim];
    const answer = parseFloat(userAnswer);
    const tolerance = Math.abs(sim.correctAnswer * 0.1); // 10% tolerance
    const isCorrect = Math.abs(answer - sim.correctAnswer) <= tolerance;

    if (isCorrect) {
      const points = 100 + (streak * 15);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      toast({
        title: "Excellent Physics! 🔬",
        description: `+${points} points! Your calculation is correct!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Not quite right ⚗️",
        description: "Check your physics formulas and try again!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextSimulation = () => {
    if (currentSim + 1 >= simulations.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Physics Master! 🎉",
        description: `You've mastered all simulations with ${score} points!`,
      });
    } else {
      setCurrentSim(prev => prev + 1);
      setUserAnswer('');
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentSim(0);
    setScore(0);
    setLives(3);
    setUserAnswer('');
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    onProgressUpdate(0);
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">⚗️</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Experiment Failed!</h3>
        <p className="text-gray-600 mb-6">Physics requires precision. Review your formulas and try again!</p>
        <Button onClick={handleRestart} size="lg">
          <Atom className="h-5 w-5 mr-2" />
          Retry Experiments
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Physics Master!</h3>
        <p className="text-gray-600 mb-4">You've mastered all physics simulations!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-blue-500 text-white px-4 py-2">
            <Atom className="h-4 w-4 mr-2" />
            Physicist
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <Atom className="h-5 w-5 mr-2" />
          New Experiments
        </Button>
      </div>
    );
  }

  const sim = simulations[currentSim];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Game Status */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Badge className="bg-red-500 text-white">
            <Heart className="h-4 w-4 mr-1" />
            {lives} Lives
          </Badge>
          <Badge className="bg-yellow-500 text-white">
            <Trophy className="h-4 w-4 mr-1" />
            {score} Points
          </Badge>
          {streak > 0 && (
            <Badge className="bg-purple-500 text-white">
              <Zap className="h-4 w-4 mr-1" />
              {streak} Streak
            </Badge>
          )}
        </div>
        <Badge variant="outline">
          Simulation {currentSim + 1} of {simulations.length}
        </Badge>
      </div>

      {/* Simulation Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{sim.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{sim.title}</h2>
        <p className="text-gray-600">{sim.description}</p>
      </div>

      {/* Variables Control Panel */}
      <Card className="mb-6 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-800">Simulation Variables</h3>
          </div>
          
          <div className="space-y-4">
            {variables.map((variable, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-blue-700">
                    {variable.name} ({variable.symbol})
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="range"
                      min={variable.min}
                      max={variable.max}
                      step={variable.step}
                      value={variable.value}
                      onChange={(e) => handleVariableChange(index, parseFloat(e.target.value))}
                      className="flex-1"
                      disabled={showExplanation}
                    />
                    <span className="text-sm font-mono bg-white px-2 py-1 rounded border min-w-[80px] text-center">
                      {variable.value} {variable.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {sim.question}
          </h3>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Your Answer:</label>
            <input
              type="number"
              step="0.1"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your calculated result"
              disabled={showExplanation}
            />
          </div>

          {showExplanation && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                <strong>Correct Answer:</strong> {sim.correctAnswer}
              </p>
              <p className="text-green-700 mt-2">
                {sim.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {!showExplanation ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={!userAnswer.trim()}
            size="lg"
            className="px-8"
          >
            <Atom className="h-4 w-4 mr-2" />
            Run Simulation
          </Button>
        ) : (
          <Button onClick={handleNextSimulation} size="lg" className="px-8">
            {currentSim + 1 >= simulations.length ? "Complete Lab!" : "Next Simulation"}
          </Button>
        )}
      </div>
    </div>
  );
}
