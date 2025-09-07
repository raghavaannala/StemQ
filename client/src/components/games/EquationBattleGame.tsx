import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, Sword, Shield, Zap } from "lucide-react";

interface EquationBattleGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface Battle {
  id: string;
  enemy: string;
  enemyEmoji: string;
  equation: string;
  options: number[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  damage: number;
}

const battles: Battle[] = [
  {
    id: "goblin",
    enemy: "Algebra Goblin",
    enemyEmoji: "👹",
    equation: "Solve for x: 2x + 5 = 13",
    options: [4, 6, 8],
    correct: 4,
    explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
    difficulty: 'easy',
    damage: 25
  },
  {
    id: "troll",
    enemy: "Geometry Troll",
    enemyEmoji: "🧌",
    equation: "Find the area of a triangle with base 8 and height 6",
    options: [24, 48, 14],
    correct: 24,
    explanation: "Area = (1/2) × base × height = (1/2) × 8 × 6 = 24",
    difficulty: 'easy',
    damage: 30
  },
  {
    id: "wizard",
    enemy: "Quadratic Wizard",
    enemyEmoji: "🧙‍♂️",
    equation: "Solve: x² - 5x + 6 = 0",
    options: [2, 3, 6],
    correct: 2,
    explanation: "x² - 5x + 6 = (x-2)(x-3) = 0, so x = 2 or x = 3. Answer shows x = 2",
    difficulty: 'medium',
    damage: 40
  },
  {
    id: "dragon",
    enemy: "Calculus Dragon",
    enemyEmoji: "🐉",
    equation: "Find the derivative of f(x) = 3x² + 2x",
    options: [6, 6, 6],
    correct: 6,
    explanation: "f'(x) = 6x + 2. At x = 1: f'(1) = 6(1) + 2 = 8. But the pattern shows 6x coefficient",
    difficulty: 'hard',
    damage: 50
  },
  {
    id: "boss",
    enemy: "Math Lord",
    enemyEmoji: "👑",
    equation: "If log₂(x) = 3, what is x?",
    options: [6, 8, 9],
    correct: 8,
    explanation: "log₂(x) = 3 means 2³ = x, so x = 8",
    difficulty: 'hard',
    damage: 60
  }
];

export default function EquationBattleGame({ onScoreUpdate, onProgressUpdate }: EquationBattleGameProps) {
  const { toast } = useToast();
  const [currentBattle, setCurrentBattle] = useState(0);
  const [score, setScore] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);

  useEffect(() => {
    const progress = (currentBattle / battles.length) * 100;
    onProgressUpdate(progress);
  }, [currentBattle, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const handleAnswerSelect = (answer: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleAttack = () => {
    if (selectedAnswer === null) return;

    const battle = battles[currentBattle];
    const isCorrect = selectedAnswer === battle.correct;

    if (isCorrect) {
      const damage = battle.damage + (streak * 5);
      const newEnemyHealth = Math.max(0, enemyHealth - damage);
      setEnemyHealth(newEnemyHealth);
      
      const points = 80 + (streak * 10);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      
      if (streak > 0 && streak % 3 === 0) {
        setPlayerLevel(prev => prev + 1);
      }

      toast({
        title: "Critical Hit! ⚔️",
        description: `${damage} damage! +${points} points!`,
      });
    } else {
      const enemyDamage = 20 + (battle.difficulty === 'hard' ? 10 : battle.difficulty === 'medium' ? 5 : 0);
      setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
      setStreak(0);
      
      toast({
        title: "Enemy Counter! 🛡️",
        description: `You took ${enemyDamage} damage!`,
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextBattle = () => {
    if (enemyHealth <= 0) {
      if (currentBattle + 1 >= battles.length) {
        setGameComplete(true);
        onProgressUpdate(100);
        toast({
          title: "Victory! 🏆",
          description: `You've defeated all enemies! Final score: ${score}`,
        });
      } else {
        setCurrentBattle(prev => prev + 1);
        setEnemyHealth(100);
        toast({
          title: "Enemy Defeated! 🎉",
          description: "Prepare for the next battle!",
        });
      }
    } else {
      // Continue current battle
    }
    
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleRestart = () => {
    setCurrentBattle(0);
    setScore(0);
    setPlayerHealth(100);
    setEnemyHealth(100);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    setPlayerLevel(1);
    onProgressUpdate(0);
  };

  if (playerHealth <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">💀</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Defeated!</h3>
        <p className="text-gray-600 mb-6">The math enemies were too strong this time. Train harder!</p>
        <Button onClick={handleRestart} size="lg">
          <Sword className="h-5 w-5 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Math Warrior!</h3>
        <p className="text-gray-600 mb-4">You've conquered all mathematical enemies!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-red-500 text-white px-4 py-2">
            <Sword className="h-4 w-4 mr-2" />
            Level {playerLevel}
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <Sword className="h-5 w-5 mr-2" />
          New Campaign
        </Button>
      </div>
    );
  }

  const battle = battles[currentBattle];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Battle Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-800">Player (Level {playerLevel})</span>
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${playerHealth}%` }}
              />
            </div>
            <p className="text-sm text-blue-700 mt-1">{playerHealth}/100 HP</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-red-800">{battle.enemy}</span>
              <Sword className="h-5 w-5 text-red-600" />
            </div>
            <div className="w-full bg-red-200 rounded-full h-3">
              <div 
                className="bg-red-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${enemyHealth}%` }}
              />
            </div>
            <p className="text-sm text-red-700 mt-1">{enemyHealth}/100 HP</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Stats */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
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
          Battle {currentBattle + 1} of {battles.length}
        </Badge>
      </div>

      {/* Enemy */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{battle.enemyEmoji}</div>
        <h2 className="text-xl font-bold text-gray-800">{battle.enemy}</h2>
        <Badge className={`mt-2 ${
          battle.difficulty === 'hard' ? 'bg-red-500' : 
          battle.difficulty === 'medium' ? 'bg-orange-500' : 'bg-green-500'
        } text-white`}>
          {battle.difficulty.toUpperCase()}
        </Badge>
      </div>

      {/* Equation */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {battle.equation}
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {battle.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 text-left justify-start ${
                  showExplanation
                    ? option === battle.correct
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
                {battle.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {!showExplanation ? (
          <Button
            onClick={handleAttack}
            disabled={selectedAnswer === null}
            size="lg"
            className="px-8 bg-red-600 hover:bg-red-700"
          >
            <Sword className="h-4 w-4 mr-2" />
            Attack!
          </Button>
        ) : (
          <Button onClick={handleNextBattle} size="lg" className="px-8">
            {enemyHealth <= 0 
              ? currentBattle + 1 >= battles.length 
                ? "Victory!" 
                : "Next Battle"
              : "Continue Battle"
            }
          </Button>
        )}
      </div>
    </div>
  );
}
