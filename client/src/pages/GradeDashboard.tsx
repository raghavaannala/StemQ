import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, signOut } from "@/lib/auth";
import { 
  Trophy, 
  Star, 
  Clock, 
  Target, 
  BookOpen, 
  Award,
  ArrowLeft,
  Play,
  Lock,
  CheckCircle,
  Gamepad2,
  LogOut,
  User
} from "lucide-react";
import { getContentByGrade, type GradeData, type Subject } from "@/lib/gradeContent";

interface GradeDashboardProps {
  grade: string;
}

export default function GradeDashboard({ grade }: GradeDashboardProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [gradeData, setGradeData] = useState<GradeData | null>(null);
  const [userProgress, setUserProgress] = useState<any>({});
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Load grade-specific content
    const content = getContentByGrade(grade);
    if (content) {
      setGradeData(content);
    }

    // Load authenticated user data
    const user = getCurrentUser();
    if (user) {
      setUserData(user);
    }

    // Load user progress for this grade
    const progressKey = `stemquest_progress_${grade}`;
    const storedProgress = localStorage.getItem(progressKey);
    if (storedProgress) {
      setUserProgress(JSON.parse(storedProgress));
    } else {
      // Initialize progress
      const initialProgress = {
        totalPoints: 0,
        level: 1,
        completedTopics: [],
        completedQuizzes: [],
        streak: 0,
        lastActivity: null
      };
      setUserProgress(initialProgress);
      localStorage.setItem(progressKey, JSON.stringify(initialProgress));
    }
  }, [grade]);

  const handleSubjectClick = (subject: Subject) => {
    setLocation(`/dashboard/${grade}/subject/${subject.id}`);
  };

  const handleQuizStart = (subjectId: string, topicId: string, quizId: string) => {
    setLocation(`/quiz/${grade}/${subjectId}/${topicId}/${quizId}`);
  };

  const handleGamesClick = () => {
    setLocation(`/games/${grade}`);
  };

  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    signOut();
  };

  const calculateProgress = (subject: Subject) => {
    const totalTopics = subject.topics.length;
    const completedTopics = subject.topics.filter(topic => 
      userProgress.completedTopics?.includes(topic.id)
    ).length;
    return totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
  };

  const getNextLevel = (points: number) => {
    return Math.floor(points / 100) + 1;
  };

  const getPointsToNextLevel = (points: number) => {
    const currentLevel = getNextLevel(points);
    return (currentLevel * 100) - points;
  };

  if (!gradeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning dashboard...</p>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {gradeData.name} Dashboard
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Welcome back, {userData?.phoneNumber ? `+91 ${userData.phoneNumber}` : 'Student'}!</span>
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

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{userProgress.totalPoints || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{getNextLevel(userProgress.totalPoints || 0)}</span>
              </div>
              <Progress 
                value={((userProgress.totalPoints || 0) % 100)} 
                className="mt-2" 
              />
              <p className="text-xs text-gray-500 mt-1">
                {getPointsToNextLevel(userProgress.totalPoints || 0)} points to next level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{userProgress.completedTopics?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Learning Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">{userProgress.streak || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">days in a row</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-pointer hover:shadow-lg transition-all duration-300" onClick={handleGamesClick}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Gamepad2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Interactive Games</h3>
                  <p className="text-blue-100">Play educational games designed for your grade level</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white cursor-pointer hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Study Materials</h3>
                  <p className="text-green-100">Access notes, guides, and reference materials</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradeData.subjects.map((subject) => {
            const IconComponent = subject.icon;
            const progress = calculateProgress(subject);
            const availableTopics = subject.topics.filter(topic => topic.unlocked).length;
            const completedTopics = subject.topics.filter(topic => 
              userProgress.completedTopics?.includes(topic.id)
            ).length;

            return (
              <Card 
                key={subject.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                onClick={() => handleSubjectClick(subject)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${subject.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant={progress > 0 ? "default" : "secondary"}>
                      {Math.round(progress)}% Complete
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{subject.name}</CardTitle>
                  <CardDescription>{subject.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={progress} className="h-2" />
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{completedTopics}/{availableTopics} topics completed</span>
                      <span>{subject.topics.reduce((acc, topic) => acc + topic.quizzes.length, 0)} quizzes</span>
                    </div>

                    {/* Quick access to first available quiz */}
                    {subject.topics.some(topic => topic.unlocked && !userProgress.completedTopics?.includes(topic.id)) && (
                      <div className="pt-2 border-t">
                        {(() => {
                          const nextTopic = subject.topics.find(topic => 
                            topic.unlocked && !userProgress.completedTopics?.includes(topic.id)
                          );
                          if (nextTopic && nextTopic.quizzes.length > 0) {
                            const nextQuiz = nextTopic.quizzes[0];
                            return (
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuizStart(subject.id, nextTopic.id, nextQuiz.id);
                                }}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Start: {nextQuiz.title}
                              </Button>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Continue Learning</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gradeData.subjects.map((subject) => {
                const nextTopic = subject.topics.find(topic => 
                  topic.unlocked && !userProgress.completedTopics?.includes(topic.id)
                );
                
                if (!nextTopic) return null;

                const IconComponent = subject.icon;
                
                return (
                  <Card key={`continue-${subject.id}`} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${subject.color} text-white`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{nextTopic.name}</h4>
                          <p className="text-sm text-gray-600">{subject.name}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSubjectClick(subject)}
                        >
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
