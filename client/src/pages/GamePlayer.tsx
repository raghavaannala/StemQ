import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Clock, Target } from "lucide-react";
import { getGamesByGrade } from "@/lib/gamesContent";

// Import actual game components
import MathPuzzleGame from "@/components/games/MathPuzzleGame";
import GrammarQuestGame from "@/components/games/GrammarQuestGame";
import ScienceLabGame from "@/components/games/ScienceLabGame";
import HistoryQuizMazeGame from "@/components/games/HistoryQuizMazeGame";
import CaseStudyChallengesGame from "@/components/games/CaseStudyChallengesGame";
import LiteratureDebateSimulatorGame from "@/components/games/LiteratureDebateSimulatorGame";
import CareerSimulationGame from "@/components/games/CareerSimulationGame";

export default function GamePlayer() {
  const params = useParams();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  const grade = params.grade as string;
  const gameId = params.gameId as string;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Find the game data
  const gradeGamesData = getGamesByGrade(grade);
  const games = gradeGamesData?.games || [];
  const game = games.find(g => g.id === gameId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && gameStarted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameStarted]);

  // Save progress to localStorage
  useEffect(() => {
    if (gameStarted) {
      const gameProgress = {
        gameId,
        grade,
        score,
        progress,
        timeElapsed,
        lastPlayed: new Date().toISOString()
      };
      localStorage.setItem(`game_${grade}_${gameId}`, JSON.stringify(gameProgress));
    }
  }, [score, progress, timeElapsed, gameId, grade, gameStarted]);

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(`game_${grade}_${gameId}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.progress < 100) { // Only load if game wasn't completed
        setScore(data.score || 0);
        setProgress(data.progress || 0);
        setTimeElapsed(data.timeElapsed || 0);
      }
    }
  }, [grade, gameId]);

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Game Not Found</h1>
          <Button onClick={() => navigate(`/games/${grade}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
        </div>
      </div>
    );
  }

  const handlePlay = () => {
    setIsPlaying(true);
    setGameStarted(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setScore(0);
    setProgress(0);
    setTimeElapsed(0);
    setGameStarted(false);
    localStorage.removeItem(`game_${grade}_${gameId}`);
    toast({
      title: "Game Restarted",
      description: "Your progress has been reset. Good luck!",
    });
  };

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
  };

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
    if (newProgress >= 100) {
      setIsPlaying(false);
      // Update user's overall progress
      const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      if (!userProgress.gamesCompleted) {
        userProgress.gamesCompleted = [];
      }
      if (!userProgress.gamesCompleted.includes(`${grade}_${gameId}`)) {
        userProgress.gamesCompleted.push(`${grade}_${gameId}`);
        userProgress.totalScore = (userProgress.totalScore || 0) + score;
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderGameComponent = () => {
    if (!game) return null;

    const gameProps = {
      onScoreUpdate: handleScoreUpdate,
      onProgressUpdate: handleProgressUpdate,
    };

    // Middle School Games (6-8)
    if (grade === "6-8") {
      switch (gameId) {
        case "1":
          return <GrammarQuestGame {...gameProps} />;
        case "2":
          return <ScienceLabGame {...gameProps} />;
        case "3":
          return <HistoryQuizMazeGame {...gameProps} />;
        case "4":
          return <MathPuzzleGame {...gameProps} />;
        default:
          return (
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Game Coming Soon!</h3>
              <p className="text-gray-600 mb-6">This game is still under development. Check back soon!</p>
              <Button onClick={() => navigate(`/games/${grade}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Button>
            </div>
          );
      }
    }

    // High School Games (9-10)
    if (grade === "9-10") {
      switch (gameId) {
        case "1":
          return <MathPuzzleGame {...gameProps} />;
        case "2":
          return <ScienceLabGame {...gameProps} />;
        case "3":
          return <HistoryQuizMazeGame {...gameProps} />;
        case "4":
          return <GrammarQuestGame {...gameProps} />;
        default:
          return (
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Game Coming Soon!</h3>
              <p className="text-gray-600 mb-6">This game is still under development. Check back soon!</p>
              <Button onClick={() => navigate(`/games/${grade}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Button>
            </div>
          );
      }
    }

    // Senior High Games (11-12)
    if (grade === "11-12") {
      switch (gameId) {
        case "1":
          return <MathPuzzleGame {...gameProps} />;
        case "2":
          return <ScienceLabGame {...gameProps} />;
        case "3":
          return <CaseStudyChallengesGame {...gameProps} />;
        case "4":
          return <LiteratureDebateSimulatorGame {...gameProps} />;
        case "5":
          return <CareerSimulationGame {...gameProps} />;
        default:
          return (
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Game Coming Soon!</h3>
              <p className="text-gray-600 mb-6">This game is still under development. Check back soon!</p>
              <Button onClick={() => navigate(`/games/${grade}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Button>
            </div>
          );
      }
    }

    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-bold text-gray-700 mb-4">Game Coming Soon!</h3>
        <p className="text-gray-600 mb-6">This game is still under development. Check back soon!</p>
        <Button onClick={() => navigate(`/games/${grade}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/games/${grade}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
          
          <div className="flex items-center space-x-4">
            {gameStarted && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isPlaying ? handlePause : handlePlay}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestart}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Game Stats */}
        {gameStarted && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-xl font-bold">{score}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="text-xl font-bold">{formatTime(timeElapsed)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-sm font-medium">{Math.round(progress)}%</p>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Area */}
        <Card className="min-h-[600px]">
          <CardContent className="p-0">
            {renderGameComponent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
