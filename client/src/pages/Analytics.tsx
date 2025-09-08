import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Trophy, 
  Clock, 
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";

// Types
interface StudentProgress {
  id: string;
  name: string;
  level: number;
  totalPoints: number;
  completedQuizzes: number;
  currentStreak: number;
  lastActivity: Date;
  subjects: {
    [subjectId: string]: {
      completedTopics: number;
      totalTopics: number;
      averageScore: number;
    };
  };
}

interface QuizAnalytics {
  quizId: string;
  title: string;
  subject: string;
  topic: string;
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  averageTimeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ClassStats {
  totalStudents: number;
  averageLevel: number;
  totalQuizzesCompleted: number;
  averageScore: number;
  mostPopularSubject: string;
  averageStreak: number;
}

interface AnalyticsProps {
  grade?: string;
}

export default function Analytics({ grade }: AnalyticsProps = {}) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - in a real app, this would come from an API
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([
    {
      id: "1",
      name: "Rahul Kumar",
      level: 5,
      totalPoints: 1250,
      completedQuizzes: 12,
      currentStreak: 7,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      subjects: {
        math: { completedTopics: 3, totalTopics: 5, averageScore: 85 },
        physics: { completedTopics: 2, totalTopics: 4, averageScore: 78 },
        chemistry: { completedTopics: 1, totalTopics: 3, averageScore: 92 }
      }
    },
    {
      id: "2",
      name: "Priya Sharma",
      level: 4,
      totalPoints: 980,
      completedQuizzes: 9,
      currentStreak: 3,
      lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      subjects: {
        math: { completedTopics: 2, totalTopics: 5, averageScore: 88 },
        physics: { completedTopics: 3, totalTopics: 4, averageScore: 82 },
        chemistry: { completedTopics: 2, totalTopics: 3, averageScore: 90 }
      }
    },
    {
      id: "3",
      name: "Arjun Singh",
      level: 6,
      totalPoints: 1580,
      completedQuizzes: 15,
      currentStreak: 12,
      lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      subjects: {
        math: { completedTopics: 4, totalTopics: 5, averageScore: 92 },
        physics: { completedTopics: 4, totalTopics: 4, averageScore: 89 },
        chemistry: { completedTopics: 3, totalTopics: 3, averageScore: 95 }
      }
    }
  ]);

  const [quizAnalytics, setQuizAnalytics] = useState<QuizAnalytics[]>([
    {
      quizId: "algebra-quiz-1",
      title: "Basic Operations",
      subject: "Mathematics",
      topic: "Algebra Basics",
      totalAttempts: 45,
      averageScore: 78.5,
      completionRate: 92.3,
      averageTimeSpent: 8.5,
      difficulty: "easy"
    },
    {
      quizId: "physics-quiz-1",
      title: "Motion Basics",
      subject: "Physics",
      topic: "Motion Basics",
      totalAttempts: 38,
      averageScore: 72.1,
      completionRate: 87.2,
      averageTimeSpent: 12.3,
      difficulty: "medium"
    },
    {
      quizId: "chemistry-quiz-1",
      title: "Periodic Table",
      subject: "Chemistry",
      topic: "Periodic Table",
      totalAttempts: 32,
      averageScore: 85.7,
      completionRate: 95.1,
      averageTimeSpent: 10.2,
      difficulty: "medium"
    }
  ]);

  const classStats: ClassStats = {
    totalStudents: studentProgress.length,
    averageLevel: Math.round(studentProgress.reduce((sum, s) => sum + s.level, 0) / studentProgress.length),
    totalQuizzesCompleted: studentProgress.reduce((sum, s) => sum + s.completedQuizzes, 0),
    averageScore: 82.3,
    mostPopularSubject: "Mathematics",
    averageStreak: Math.round(studentProgress.reduce((sum, s) => sum + s.currentStreak, 0) / studentProgress.length)
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Export analytics data
    const data = {
      timestamp: new Date().toISOString(),
      timeRange: selectedTimeRange,
      subject: selectedSubject,
      classStats,
      studentProgress,
      quizAnalytics
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stemquest-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500">Track student progress and learning outcomes</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{classStats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Level</p>
                  <p className="text-2xl font-bold text-gray-900">{classStats.averageLevel}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quizzes Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{classStats.totalQuizzesCompleted}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{classStats.averageScore}%</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Student Progress</TabsTrigger>
            <TabsTrigger value="quizzes">Quiz Analytics</TabsTrigger>
            <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress Overview</CardTitle>
                <CardDescription>
                  Individual student performance and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentProgress.map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-500">Level {student.level} • {student.totalPoints} points</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium">{student.completedQuizzes}</p>
                            <p className="text-gray-500">Quizzes</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{student.currentStreak}</p>
                            <p className="text-gray-500">Streak</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{formatTimeAgo(student.lastActivity)}</p>
                            <p className="text-gray-500">Last active</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(student.subjects).map(([subjectId, stats]) => (
                          <div key={subjectId} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium capitalize">{subjectId}</h4>
                              <Badge variant="secondary">{stats.averageScore}%</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{stats.completedTopics}/{stats.totalTopics}</span>
                              </div>
                              <Progress 
                                value={(stats.completedTopics / stats.totalTopics) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance Analytics</CardTitle>
                <CardDescription>
                  Detailed analysis of quiz completion rates and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizAnalytics.map((quiz) => (
                    <div key={quiz.quizId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                          <p className="text-sm text-gray-500">{quiz.subject} • {quiz.topic}</p>
                        </div>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{quiz.totalAttempts}</p>
                          <p className="text-sm text-gray-600">Total Attempts</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{quiz.averageScore.toFixed(1)}%</p>
                          <p className="text-sm text-gray-600">Average Score</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{quiz.completionRate.toFixed(1)}%</p>
                          <p className="text-sm text-gray-600">Completion Rate</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">{quiz.averageTimeSpent.toFixed(1)}m</p>
                          <p className="text-sm text-gray-600">Avg. Time</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Popularity</CardTitle>
                  <CardDescription>Most accessed subjects by students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Mathematics', 'Physics', 'Chemistry', 'Biology'].map((subject, index) => (
                      <div key={subject} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{subject}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{Math.floor(Math.random() * 50) + 30}%</p>
                          <p className="text-sm text-gray-500">completion</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Learning Trends</CardTitle>
                  <CardDescription>Weekly activity patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monday</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-20 h-2" />
                        <span className="text-sm text-gray-500">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tuesday</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm text-gray-500">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Wednesday</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={90} className="w-20 h-2" />
                        <span className="text-sm text-gray-500">90%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Thursday</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={80} className="w-20 h-2" />
                        <span className="text-sm text-gray-500">80%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Friday</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={70} className="w-20 h-2" />
                        <span className="text-sm text-gray-500">70%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
