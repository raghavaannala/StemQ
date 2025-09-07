import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, Zap } from "lucide-react";

interface MathPuzzleGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface Question {
  question: string;
  options: number[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    question: "Help the hero collect apples! If there are 3 trees with 4 apples each, how many apples total?",
    options: [12, 10, 14],
    correct: 12,
    explanation: "3 trees × 4 apples = 12 apples total!"
  },
  {
    question: "The hero needs to cross a bridge. If the bridge is 25 meters long and he walks 15 meters, how much further?",
    options: [10, 15, 5],
    correct: 10,
    explanation: "25 - 15 = 10 meters left to go!"
  },
  {
    question: "Magic crystals! If you have 8 crystals and find 6 more, then give away 5, how many do you have?",
    options: [9, 11, 7],
    correct: 9,
    explanation: "8 + 6 - 5 = 9 crystals remaining!"
  },
  {
    question: "The treasure chest needs a code! What is 7 × 3?",
    options: [21, 18, 24],
    correct: 21,
    explanation: "7 × 3 = 21. The treasure chest opens!"
  },
  {
    question: "Final challenge! If a dragon has 4 legs and there are 3 dragons, how many legs total?",
    options: [12, 10, 14],
    correct: 12,
    explanation: "4 legs × 3 dragons = 12 legs total!"
  }
];

export default function MathPuzzleGame({ onScoreUpdate, onProgressUpdate }: MathPuzzleGameProps) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const progress = (currentQuestion / questions.length) * 100;
    onProgressUpdate(progress);
  }, [currentQuestion, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const handleAnswerSelect = (answer: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;

    if (isCorrect) {
      const points = 10 + (streak * 2); // Bonus points for streak
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      toast({
        title: "Correct! ⭐",
        description: `+${points} points! Great job!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Not quite right 💔",
        description: "Don't worry, keep trying!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 >= questions.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Adventure Complete! 🎉",
        description: `Final score: ${score} points!`,
      });
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    onProgressUpdate(0);
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">😢</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Game Over</h3>
        <p className="text-gray-600 mb-6">Don't give up! Try again to help the hero complete the adventure.</p>
        <Button onClick={handleRestart} size="lg">
          <Zap className="h-5 w-5 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Adventure Complete!</h3>
        <p className="text-gray-600 mb-4">The hero successfully completed the quest!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-blue-500 text-white px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Hero Status
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <Zap className="h-5 w-5 mr-2" />
          Play Again
        </Button>
      </div>
    );
  }

  const question = questions[currentQuestion];

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
            <Badge className="bg-orange-500 text-white">
              <Zap className="h-4 w-4 mr-1" />
              {streak} Streak
            </Badge>
          )}
        </div>
        <Badge variant="outline">
          Question {currentQuestion + 1} of {questions.length}
        </Badge>
      </div>

      {/* Hero Character */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🧙‍♂️</div>
        <p className="text-sm text-gray-600">Help the hero solve this puzzle!</p>
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {question.question}
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 text-left justify-start ${
                  showExplanation
                    ? option === question.correct
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
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                {question.explanation}
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
            disabled={selectedAnswer === null}
            size="lg"
            className="px-8"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} size="lg" className="px-8">
            {currentQuestion + 1 >= questions.length ? "Complete Adventure!" : "Next Challenge"}
          </Button>
        )}
      </div>
    </div>
  );
}
