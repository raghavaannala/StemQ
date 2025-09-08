import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, signOut } from "@/lib/auth";
import { 
  ArrowLeft,
  Play,
  Clock,
  Trophy,
  Star,
  Gamepad2,
  Target,
  Users,
  Zap,
  LogOut,
  User
} from "lucide-react";
import { getGamesByGrade, type GradeGames, type Game } from "@/lib/gamesContent";

interface GamesProps {
  grade: string;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800", 
  hard: "bg-red-100 text-red-800"
};

const gameTypeIcons = {
  puzzle: Target,
  simulation: Zap,
  quiz: Users,
  strategy: Trophy,
  adventure: Star
};

export default function Games({ grade }: GamesProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [gradeGames, setGradeGames] = useState<GradeGames | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Load grade-specific games
    const games = getGamesByGrade(grade);
    if (games) {
      setGradeGames(games);
    }

    // Load authenticated user data
    const user = getCurrentUser();
    if (user) {
      setUserData(user);
    }
  }, [grade]);

  const handleGameStart = (game: Game) => {
    toast({
      title: `Starting ${game.title}!`,
      description: `Get ready for ${game.estimatedTime} of fun learning!`,
    });

    // Navigate to game (for now, we'll show a placeholder)
    setLocation(`/game/${grade}/${game.id}`);
  };

  const handleBackToDashboard = () => {
    setLocation(`/dashboard/${grade}`);
  };

  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    signOut();
  };

  if (!gradeGames) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <Gamepad2 className="h-8 w-8 text-blue-600" />
                <span>{gradeGames.name}</span>
              </h1>
              <p className="text-gray-600 mt-1 flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{gradeGames.style}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Grade {grade}
            </Badge>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradeGames.games.map((game) => {
            const IconComponent = game.icon;
            const GameTypeIcon = gameTypeIcons[game.gameType];
            
            return (
              <Card 
                key={game.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                onClick={() => handleGameStart(game)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${game.color} text-white group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={difficultyColors[game.difficulty]}>
                        {game.difficulty}
                      </Badge>
                      <div className="flex items-center text-gray-500">
                        <GameTypeIcon className="h-4 w-4 mr-1" />
                        <span className="text-xs capitalize">{game.gameType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl mb-2">{game.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mb-3">
                    {game.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{game.estimatedTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{game.points} pts</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Subject Badge */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {game.subject}
                      </Badge>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Game Features:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {game.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Play Button */}
                    <Button 
                      className="w-full group-hover:bg-blue-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGameStart(game);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play Game
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Game Stats */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Game Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="text-2xl font-bold text-blue-600">{gradeGames.games.length}</h3>
              <p className="text-gray-600">Total Games</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-600">
                {gradeGames.games.reduce((acc, game) => acc + game.points, 0)}
              </h3>
              <p className="text-gray-600">Total Points Available</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-600">
                {new Set(gradeGames.games.map(game => game.subject)).size}
              </h3>
              <p className="text-gray-600">Subjects Covered</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-orange-600">
                {new Set(gradeGames.games.map(game => game.gameType)).size}
              </h3>
              <p className="text-gray-600">Game Types</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">More Games Coming Soon!</h3>
          <p className="text-gray-600 mb-4">
            We're constantly adding new interactive games to make learning even more fun and engaging.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary">Multiplayer Mode</Badge>
            <Badge variant="secondary">AR/VR Games</Badge>
            <Badge variant="secondary">Custom Challenges</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
