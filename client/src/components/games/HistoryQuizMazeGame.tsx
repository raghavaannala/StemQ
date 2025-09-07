import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, MapPin, Compass, Crown } from "lucide-react";

interface HistoryQuizMazeGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface MazeRoom {
  id: string;
  title: string;
  description: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  emoji: string;
  treasure?: string;
}

const mazeRooms: MazeRoom[] = [
  {
    id: "entrance",
    title: "Castle Entrance",
    description: "Welcome to the Medieval History Maze! Answer correctly to proceed.",
    question: "In medieval times, what was a knight's main job?",
    options: ["Farming", "Protecting the lord and land", "Building castles", "Teaching children"],
    correct: "Protecting the lord and land",
    explanation: "Knights were warriors who served lords and protected their lands in exchange for land and shelter!",
    emoji: "🏰"
  },
  {
    id: "armory",
    title: "The Royal Armory",
    description: "You've found the castle's weapon storage!",
    question: "What was the most important weapon for a medieval knight?",
    options: ["Bow and arrow", "Sword", "Spear", "Catapult"],
    correct: "Sword",
    explanation: "The sword was a knight's most prized weapon, often passed down through generations!",
    emoji: "⚔️",
    treasure: "Ancient Sword"
  },
  {
    id: "throne",
    title: "The Throne Room",
    description: "You stand before the king's throne!",
    question: "What system organized medieval society with kings, lords, and peasants?",
    options: ["Democracy", "Feudalism", "Republic", "Empire"],
    correct: "Feudalism",
    explanation: "Feudalism was like a pyramid: kings at top, then lords, knights, and peasants at bottom!",
    emoji: "👑",
    treasure: "Royal Crown"
  },
  {
    id: "library",
    title: "The Ancient Library",
    description: "Scrolls and books fill this mysterious room.",
    question: "Who could read and write in medieval times?",
    options: ["Everyone", "Only kings", "Mostly monks and nobles", "Only women"],
    correct: "Mostly monks and nobles",
    explanation: "Most people couldn't read! Monks in monasteries and wealthy nobles were the main educated people.",
    emoji: "📚",
    treasure: "Ancient Scroll"
  },
  {
    id: "treasure",
    title: "The Treasure Chamber",
    description: "You've reached the final treasure room!",
    question: "What ended the medieval period in Europe?",
    options: ["The Renaissance", "World War I", "The Ice Age", "The Space Age"],
    correct: "The Renaissance",
    explanation: "The Renaissance brought new ideas, art, and learning that moved Europe beyond medieval times!",
    emoji: "💎",
    treasure: "Golden Treasure"
  }
];

export default function HistoryQuizMazeGame({ onScoreUpdate, onProgressUpdate }: HistoryQuizMazeGameProps) {
  const { toast } = useToast();
  const [currentRoom, setCurrentRoom] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [treasuresFound, setTreasuresFound] = useState<string[]>([]);
  const [visitedRooms, setVisitedRooms] = useState<string[]>([]);

  useEffect(() => {
    const progress = (currentRoom / mazeRooms.length) * 100;
    onProgressUpdate(progress);
  }, [currentRoom, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    const room = mazeRooms[currentRoom];
    if (room && !visitedRooms.includes(room.id)) {
      setVisitedRooms(prev => [...prev, room.id]);
    }
  }, [currentRoom, visitedRooms]);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const room = mazeRooms[currentRoom];
    const isCorrect = selectedAnswer === room.correct;

    if (isCorrect) {
      const points = 25 + (streak * 5);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      
      if (room.treasure) {
        setTreasuresFound(prev => [...prev, room.treasure!]);
        toast({
          title: "Treasure Found! 💎",
          description: `+${points} points! You found: ${room.treasure}`,
        });
      } else {
        toast({
          title: "Correct! 🏰",
          description: `+${points} points! You may proceed through the maze!`,
        });
      }
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Wrong path! 🚫",
        description: "The maze blocks your way. Try again!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextRoom = () => {
    if (currentRoom + 1 >= mazeRooms.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Maze Conquered! 🎉",
        description: `You're now a History Explorer with ${score} points!`,
      });
    } else {
      setCurrentRoom(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentRoom(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer('');
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    setTreasuresFound([]);
    setVisitedRooms([]);
    onProgressUpdate(0);
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏰</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Lost in the Maze!</h3>
        <p className="text-gray-600 mb-6">The medieval maze has defeated you, but every explorer learns from their journey!</p>
        <Button onClick={handleRestart} size="lg">
          <Compass className="h-5 w-5 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">History Explorer!</h3>
        <p className="text-gray-600 mb-4">You've conquered the Medieval History Maze!</p>
        
        {/* Treasures Display */}
        {treasuresFound.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Treasures Collected:</h4>
            <div className="flex justify-center flex-wrap gap-2">
              {treasuresFound.map((treasure, index) => (
                <Badge key={index} className="bg-yellow-500 text-white px-3 py-1">
                  💎 {treasure}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-green-500 text-white px-4 py-2">
            <Crown className="h-4 w-4 mr-2" />
            History Master
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <Compass className="h-5 w-5 mr-2" />
          Explore Again
        </Button>
      </div>
    );
  }

  const room = mazeRooms[currentRoom];

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
          <MapPin className="h-4 w-4 mr-1" />
          Room {currentRoom + 1} of {mazeRooms.length}
        </Badge>
      </div>

      {/* Maze Progress */}
      <div className="mb-6">
        <div className="flex justify-center space-x-2">
          {mazeRooms.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index < currentRoom
                  ? "bg-green-500 text-white"
                  : index === currentRoom
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index < currentRoom ? "✓" : index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Treasures Found */}
      {treasuresFound.length > 0 && (
        <div className="mb-6">
          <Card className="bg-yellow-50">
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">Treasures Found:</h4>
              <div className="flex flex-wrap gap-2">
                {treasuresFound.map((treasure, index) => (
                  <Badge key={index} className="bg-yellow-500 text-white">
                    💎 {treasure}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Current Room */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{room.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{room.title}</h2>
        <p className="text-gray-600">{room.description}</p>
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {room.question}
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {room.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 text-left justify-start ${
                  showExplanation
                    ? option === room.correct
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
                {room.explanation}
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
            className="px-8"
          >
            <Compass className="h-4 w-4 mr-2" />
            Enter Room
          </Button>
        ) : (
          <Button onClick={handleNextRoom} size="lg" className="px-8">
            <MapPin className="h-4 w-4 mr-2" />
            {currentRoom + 1 >= mazeRooms.length ? "Claim Victory!" : "Next Room"}
          </Button>
        )}
      </div>
    </div>
  );
}
