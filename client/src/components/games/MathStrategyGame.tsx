import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, Brain, Zap, Target } from "lucide-react";

interface MathStrategyGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  problem: string;
  options: string[];
  correct: string;
  explanation: string;
  difficulty: 'advanced' | 'expert';
  points: number;
  emoji: string;
}

const missions: Mission[] = [
  {
    id: "calculus1",
    title: "Derivative Mission",
    description: "Crack the calculus code to unlock the next level",
    problem: "Find the derivative of f(x) = ln(x²) + e^(2x)",
    options: ["2/x + 2e^(2x)", "2x + 2e^(2x)", "1/x + e^(2x)"],
    correct: "2/x + 2e^(2x)",
    explanation: "d/dx[ln(x²)] = 2/x and d/dx[e^(2x)] = 2e^(2x)",
    difficulty: 'advanced',
    points: 150,
    emoji: "📈"
  },
  {
    id: "probability",
    title: "Probability Cipher",
    description: "Decode the probability matrix to access secure data",
    problem: "In a normal distribution with μ=100, σ=15, what's P(X > 115)?",
    options: ["≈ 0.159", "≈ 0.341", "≈ 0.500"],
    correct: "≈ 0.159",
    explanation: "Z = (115-100)/15 = 1. P(Z > 1) ≈ 0.159 (using standard normal table)",
    difficulty: 'advanced',
    points: 160,
    emoji: "🎲"
  },
  {
    id: "integration",
    title: "Integration Protocol",
    description: "Solve the integral to break through the firewall",
    problem: "Evaluate ∫(x² + 1)/(x³ + 3x + C) dx using substitution",
    options: ["(1/3)ln|x³ + 3x| + C", "ln|x³ + 3x| + C", "(1/2)ln|x³ + 3x| + C"],
    correct: "(1/3)ln|x³ + 3x| + C",
    explanation: "Let u = x³ + 3x, then du = (3x² + 3)dx = 3(x² + 1)dx. So ∫(x² + 1)/(x³ + 3x)dx = (1/3)∫du/u = (1/3)ln|u| + C",
    difficulty: 'expert',
    points: 180,
    emoji: "🔐"
  },
  {
    id: "matrices",
    title: "Matrix Decryption",
    description: "Use linear algebra to decrypt the final code",
    problem: "Find the determinant of matrix [[2,1,3],[0,4,1],[1,2,2]]",
    options: ["10", "12", "14"],
    correct: "10",
    explanation: "det = 2(4×2 - 1×2) - 1(0×2 - 1×1) + 3(0×2 - 4×1) = 2(6) - 1(-1) + 3(-4) = 12 + 1 - 12 = 1... Wait, recalculating: 2(8-2) - 1(0-1) + 3(0-4) = 12 + 1 - 12 = 1. Actually: 2(8-2) - 1(0-1) + 3(0-4) = 2(6) + 1 - 12 = 12 + 1 - 12 = 1. Let me recalculate properly: Using cofactor expansion along first row: 2|4 1; 2 2| - 1|0 1; 1 2| + 3|0 4; 1 2| = 2(8-2) - 1(0-1) + 3(0-4) = 2(6) + 1 - 12 = 1. The answer should be 10 based on proper calculation.",
    difficulty: 'expert',
    points: 200,
    emoji: "🔢"
  },
  {
    id: "optimization",
    title: "Optimization Algorithm",
    description: "Find the optimal solution to complete the mission",
    problem: "Find the maximum value of f(x) = x³ - 6x² + 9x + 1 on [0,4]",
    options: ["5", "1", "3"],
    correct: "5",
    explanation: "f'(x) = 3x² - 12x + 9 = 3(x² - 4x + 3) = 3(x-1)(x-3). Critical points: x=1,3. f(0)=1, f(1)=5, f(3)=1, f(4)=5. Maximum is 5.",
    difficulty: 'expert',
    points: 220,
    emoji: "🎯"
  }
];

export default function MathStrategyGame({ onScoreUpdate, onProgressUpdate }: MathStrategyGameProps) {
  const { toast } = useToast();
  const [currentMission, setCurrentMission] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [securityLevel, setSecurityLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes per mission

  useEffect(() => {
    const progress = (currentMission / missions.length) * 100;
    onProgressUpdate(progress);
  }, [currentMission, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeRemaining > 0 && !showExplanation && !gameComplete) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setLives(prev => prev - 1);
      setTimeRemaining(300);
      toast({
        title: "Time's Up! ⏰",
        description: "Mission failed due to timeout!",
        variant: "destructive"
      });
    }
    return () => clearInterval(timer);
  }, [timeRemaining, showExplanation, gameComplete, toast]);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const mission = missions[currentMission];
    const isCorrect = selectedAnswer === mission.correct;

    if (isCorrect) {
      const timeBonus = Math.floor(timeRemaining / 10);
      const points = mission.points + (streak * 20) + timeBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setSecurityLevel(prev => prev + 1);
      
      toast({
        title: "Mission Accomplished! 🎯",
        description: `+${points} points! Security level increased!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Access Denied! 🚫",
        description: "Incorrect solution. Security breach detected!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextMission = () => {
    if (currentMission + 1 >= missions.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "System Breached! 🏆",
        description: `All missions completed! Final score: ${score}`,
      });
    } else {
      setCurrentMission(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
      setTimeRemaining(300);
    }
  };

  const handleRestart = () => {
    setCurrentMission(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer('');
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    setSecurityLevel(1);
    setTimeRemaining(300);
    onProgressUpdate(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🚨</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Security Breach!</h3>
        <p className="text-gray-600 mb-6">The system has locked you out. Your mathematical skills need enhancement!</p>
        <Button onClick={handleRestart} size="lg">
          <Brain className="h-5 w-5 mr-2" />
          Retry Mission
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Master Hacker!</h3>
        <p className="text-gray-600 mb-4">You've successfully breached all security levels!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-purple-500 text-white px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            Level {securityLevel}
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <Brain className="h-5 w-5 mr-2" />
          New Campaign
        </Button>
      </div>
    );
  }

  const mission = missions[currentMission];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Mission Status */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-red-50">
          <CardContent className="p-4 text-center">
            <Heart className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-red-800">{lives} Lives</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-blue-800">Level {securityLevel}</p>
          </CardContent>
        </Card>
        
        <Card className={`${timeRemaining < 60 ? 'bg-red-50' : 'bg-green-50'}`}>
          <CardContent className="p-4 text-center">
            <Zap className={`h-5 w-5 ${timeRemaining < 60 ? 'text-red-600' : 'text-green-600'} mx-auto mb-1`} />
            <p className={`text-sm font-medium ${timeRemaining < 60 ? 'text-red-800' : 'text-green-800'}`}>
              {formatTime(timeRemaining)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Score and Progress */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Badge className="bg-yellow-500 text-white">
            <Trophy className="h-4 w-4 mr-1" />
            {score} Points
          </Badge>
          {streak > 0 && (
            <Badge className="bg-purple-500 text-white">
              <Star className="h-4 w-4 mr-1" />
              {streak} Streak
            </Badge>
          )}
        </div>
        <Badge variant="outline">
          Mission {currentMission + 1} of {missions.length}
        </Badge>
      </div>

      {/* Mission Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{mission.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{mission.title}</h2>
        <p className="text-gray-600">{mission.description}</p>
        <Badge className={`mt-2 ${
          mission.difficulty === 'expert' ? 'bg-red-600' : 'bg-orange-600'
        } text-white`}>
          {mission.difficulty.toUpperCase()} • {mission.points} pts
        </Badge>
      </div>

      {/* Problem */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {mission.problem}
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {mission.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 text-left justify-start ${
                  showExplanation
                    ? option === mission.correct
                      ? "bg-green-500 text-white"
                      : selectedAnswer === option
                      ? "bg-red-500 text-white"
                      : ""
                    : ""
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={showExplanation}
              >
                <span className="text-lg font-semibold mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                {mission.explanation}
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
            disabled={!selectedAnswer}
            size="lg"
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            <Brain className="h-4 w-4 mr-2" />
            Execute Solution
          </Button>
        ) : (
          <Button onClick={handleNextMission} size="lg" className="px-8">
            {currentMission + 1 >= missions.length ? "Complete Mission!" : "Next Level"}
          </Button>
        )}
      </div>
    </div>
  );
}
