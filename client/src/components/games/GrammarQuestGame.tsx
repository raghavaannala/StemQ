import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, BookOpen } from "lucide-react";

interface GrammarQuestGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface Challenge {
  type: 'word-match' | 'fill-blank' | 'sentence-build';
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

const challenges: Challenge[] = [
  {
    type: 'word-match',
    question: "Which word is a NOUN in this sentence: 'The brave knight rides quickly'?",
    options: ['brave', 'knight', 'quickly'],
    correct: 'knight',
    explanation: "A noun is a person, place, thing, or idea. 'Knight' is a person!"
  },
  {
    type: 'fill-blank',
    question: "Fill in the blank: 'The cat _____ on the mat.'",
    options: ['sits', 'sit', 'sitting'],
    correct: 'sits',
    explanation: "'Sits' is correct because 'cat' is singular, so we use the singular verb form."
  },
  {
    type: 'word-match',
    question: "Which word describes HOW something is done (adverb): 'She sings beautifully'?",
    options: ['She', 'sings', 'beautifully'],
    correct: 'beautifully',
    explanation: "Adverbs describe how actions are done. 'Beautifully' tells us HOW she sings!"
  },
  {
    type: 'sentence-build',
    question: "Put these words in the correct order to make a sentence:",
    options: ['dog', 'The', 'barks', 'loudly'],
    correct: 'The dog barks loudly',
    explanation: "Sentences follow the pattern: Article + Noun + Verb + Adverb"
  },
  {
    type: 'fill-blank',
    question: "Choose the correct word: 'I have _____ apples than you.'",
    options: ['more', 'most', 'much'],
    correct: 'more',
    explanation: "'More' is used when comparing two things. 'Most' is for three or more!"
  }
];

export default function GrammarQuestGame({ onScoreUpdate, onProgressUpdate }: GrammarQuestGameProps) {
  const { toast } = useToast();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);

  useEffect(() => {
    const progress = (currentChallenge / challenges.length) * 100;
    onProgressUpdate(progress);
  }, [currentChallenge, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    const challenge = challenges[currentChallenge];
    if (challenge?.type === 'sentence-build') {
      setSentenceWords([]);
    }
  }, [currentChallenge]);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    const challenge = challenges[currentChallenge];
    
    if (challenge.type === 'sentence-build') {
      setSentenceWords(prev => [...prev, answer]);
      setSelectedAnswer(sentenceWords.concat(answer).join(' '));
    } else {
      setSelectedAnswer(answer);
    }
  };

  const handleWordRemove = (index: number) => {
    if (showExplanation) return;
    const newWords = sentenceWords.filter((_, i) => i !== index);
    setSentenceWords(newWords);
    setSelectedAnswer(newWords.join(' '));
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer.trim()) return;

    const challenge = challenges[currentChallenge];
    const isCorrect = selectedAnswer.toLowerCase().trim() === challenge.correct.toLowerCase().trim();

    if (isCorrect) {
      const points = 15 + (streak * 3);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      toast({
        title: "Excellent! 📚",
        description: `+${points} points! You're mastering grammar!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Not quite right 📖",
        description: "Keep learning! Grammar takes practice.",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextChallenge = () => {
    if (currentChallenge + 1 >= challenges.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Grammar Quest Complete! 🎉",
        description: `You're now a Grammar Hero with ${score} points!`,
      });
    } else {
      setCurrentChallenge(prev => prev + 1);
      setSelectedAnswer('');
      setSentenceWords([]);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentChallenge(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer('');
    setSentenceWords([]);
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    onProgressUpdate(0);
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Keep Learning!</h3>
        <p className="text-gray-600 mb-6">Grammar is tricky, but practice makes perfect!</p>
        <Button onClick={handleRestart} size="lg">
          <BookOpen className="h-5 w-5 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Grammar Hero!</h3>
        <p className="text-gray-600 mb-4">You've mastered the Grammar Quest!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-green-500 text-white px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Grammar Master
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <BookOpen className="h-5 w-5 mr-2" />
          Play Again
        </Button>
      </div>
    );
  }

  const challenge = challenges[currentChallenge];

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
              <Star className="h-4 w-4 mr-1" />
              {streak} Streak
            </Badge>
          )}
        </div>
        <Badge variant="outline">
          Challenge {currentChallenge + 1} of {challenges.length}
        </Badge>
      </div>

      {/* Character */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📖</div>
        <p className="text-sm text-gray-600">Help complete the Grammar Quest!</p>
      </div>

      {/* Challenge */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {challenge.question}
          </h3>
          
          {challenge.type === 'sentence-build' ? (
            <div className="space-y-4">
              {/* Sentence Building Area */}
              <div className="min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500 mb-2">Your sentence:</p>
                <div className="flex flex-wrap gap-2">
                  {sentenceWords.map((word, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                      onClick={() => handleWordRemove(index)}
                    >
                      {word} ×
                    </Badge>
                  ))}
                  {sentenceWords.length === 0 && (
                    <span className="text-gray-400 italic">Click words below to build your sentence</span>
                  )}
                </div>
              </div>
              
              {/* Available Words */}
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.filter(word => !sentenceWords.includes(word)).map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="p-4 text-left justify-start"
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showExplanation}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {challenge.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`p-4 text-left justify-start ${
                    showExplanation
                      ? option === challenge.correct
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
          )}

          {showExplanation && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                {challenge.explanation}
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
            disabled={!selectedAnswer.trim()}
            size="lg"
            className="px-8"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextChallenge} size="lg" className="px-8">
            {currentChallenge + 1 >= challenges.length ? "Complete Quest!" : "Next Challenge"}
          </Button>
        )}
      </div>
    </div>
  );
}
