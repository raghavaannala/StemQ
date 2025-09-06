import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  Dna, 
  Trophy, 
  Star, 
  BookOpen, 
  Target,
  Globe,
  User,
  Settings,
  TrendingUp,
  Clock,
  Award,
  Brain,
  Zap,
  Play,
  CheckCircle,
  Lock
} from "lucide-react";

// Types and Interfaces
interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface Topic {
  id: string;
  name: string;
  description: string;
  quizzes: Quiz[];
  unlocked: boolean;
  completed: boolean;
}

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  topics: Topic[];
}

interface UserProgress {
  totalPoints: number;
  completedQuizzes: number;
  currentStreak: number;
  level: number;
  completedTopics: string[];
  completedQuizIds: string[];
  lastActivity: Date | null;
}

interface Activity {
  id: string;
  subject: string;
  topic: string;
  quiz: string;
  score: number;
  points: number;
  timestamp: Date;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  earnedDate?: Date;
  requirement: string;
}

// Sample data with more realistic structure
const subjectsData: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    icon: Calculator,
    color: "bg-blue-500",
    description: "Algebra, Geometry, and Number Theory",
    topics: [
      {
        id: "algebra-basics",
        name: "Algebra Basics",
        description: "Learn basic algebraic operations and equations",
        unlocked: true,
        completed: false,
        quizzes: [
          {
            id: "algebra-quiz-1",
            title: "Basic Operations",
            points: 50,
            difficulty: 'easy',
            questions: [
              {
                id: "q1",
                question: "What is 2 + 2 × 2?",
                options: ["6", "8", "4"],
                correct: 0,
                explanation: "Order of operations: multiplication first, then addition"
              },
              {
                id: "q2",
                question: "Solve for x: x + 5 = 10",
                options: ["5", "3", "15"],
                correct: 0,
                explanation: "Subtract 5 from both sides"
              }
            ]
          }
        ]
      },
      {
        id: "geometry-basics",
        name: "Geometry Fundamentals",
        description: "Shapes, angles, and geometric calculations",
        unlocked: false,
        completed: false,
        quizzes: [
          {
            id: "geometry-quiz-1",
            title: "Basic Shapes",
            points: 50,
            difficulty: 'medium',
            questions: [
              {
                id: "g1",
                question: "What is the sum of angles in a triangle?",
                options: ["180°", "360°", "90°"],
                correct: 0,
                explanation: "The sum of interior angles in any triangle is always 180°"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "physics",
    name: "Physics",
    icon: Atom,
    color: "bg-purple-500",
    description: "Motion, Energy, and Forces",
    topics: [
      {
        id: "motion-basics",
        name: "Motion Basics",
        description: "Understanding velocity, acceleration, and displacement",
        unlocked: true,
        completed: false,
        quizzes: [
          {
            id: "motion-quiz-1",
            title: "Speed and Velocity",
            points: 50,
            difficulty: 'easy',
            questions: [
              {
                id: "p1",
                question: "What is the formula for speed?",
                options: ["Distance/Time", "Time/Distance", "Distance × Time"],
                correct: 0,
                explanation: "Speed is distance traveled divided by time taken"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: FlaskConical,
    color: "bg-green-500",
    description: "Elements, Compounds, and Reactions",
    topics: [
      {
        id: "periodic-table",
        name: "Periodic Table",
        description: "Elements and their properties",
        unlocked: true,
        completed: false,
        quizzes: [
          {
            id: "chemistry-quiz-1",
            title: "Basic Elements",
            points: 50,
            difficulty: 'easy',
            questions: [
              {
                id: "c1",
                question: "What is the chemical symbol for water?",
                options: ["H₂O", "CO₂", "NaCl"],
                correct: 0,
                explanation: "Water is composed of 2 hydrogen atoms and 1 oxygen atom"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "biology",
    name: "Biology",
    icon: Dna,
    color: "bg-orange-500",
    description: "Life Sciences and Ecosystems",
    topics: [
      {
        id: "cell-biology",
        name: "Cell Biology",
        description: "Structure and function of cells",
        unlocked: true,
        completed: false,
        quizzes: [
          {
            id: "biology-quiz-1",
            title: "Cell Structure",
            points: 50,
            difficulty: 'medium',
            questions: [
              {
                id: "b1",
                question: "What is the powerhouse of the cell?",
                options: ["Mitochondria", "Nucleus", "Ribosome"],
                correct: 0,
                explanation: "Mitochondria produce ATP, the cell's energy currency"
              }
            ]
          }
        ]
      }
    ]
  }
];

const achievementsData: Achievement[] = [
  { 
    id: "first-quiz", 
    name: "First Quiz", 
    description: "Complete your first quiz",
    icon: Star, 
    earned: false, 
    requirement: "Complete 1 quiz"
  },
  { 
    id: "math-master", 
    name: "Math Master", 
    description: "Complete all math topics",
    icon: Calculator, 
    earned: false, 
    requirement: "Complete all math topics"
  },
  { 
    id: "biology-expert", 
    name: "Biology Expert", 
    description: "Complete all biology topics",
    icon: Dna, 
    earned: false, 
    requirement: "Complete all biology topics"
  },
  { 
    id: "perfect-score", 
    name: "Perfect Score", 
    description: "Get 100% on any quiz",
    icon: Trophy, 
    earned: false, 
    requirement: "Get 100% on any quiz"
  },
  { 
    id: "speed-learner", 
    name: "Speed Learner", 
    description: "Complete 5 quizzes in one day",
    icon: Zap, 
    earned: false, 
    requirement: "Complete 5 quizzes in one day"
  }
];

// Local storage utilities
const STORAGE_KEYS = {
  USER_PROGRESS: 'stemquest_user_progress',
  ACTIVITIES: 'stemquest_activities',
  ACHIEVEMENTS: 'stemquest_achievements',
  LANGUAGE: 'stemquest_language'
};

const loadFromStorage = (key: string, defaultValue: any): any => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    
    const parsed = JSON.parse(stored);
    
    // Handle activities array - convert timestamp strings back to Date objects
    if (key === STORAGE_KEYS.ACTIVITIES && Array.isArray(parsed)) {
      return parsed.map(activity => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
    }
    
    // Handle user progress - convert lastActivity string back to Date object
    if (key === STORAGE_KEYS.USER_PROGRESS && parsed.lastActivity) {
      return {
        ...parsed,
        lastActivity: new Date(parsed.lastActivity)
      };
    }
    
    // Handle achievements - merge with original data to preserve icon components
    if (key === STORAGE_KEYS.ACHIEVEMENTS && Array.isArray(parsed)) {
      return achievementsData.map(originalAchievement => {
        const storedAchievement = parsed.find(a => a.id === originalAchievement.id);
        return {
          ...originalAchievement,
          earned: storedAchievement?.earned || false,
          earnedDate: storedAchievement?.earnedDate ? new Date(storedAchievement.earnedDate) : undefined
        };
      });
    }
    
    return parsed;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

function Home() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState(() => 
    loadFromStorage(STORAGE_KEYS.LANGUAGE, "en")
  );
  
  const [userProgress, setUserProgress] = useState<UserProgress>(() => 
    loadFromStorage(STORAGE_KEYS.USER_PROGRESS, {
      totalPoints: 0,
      completedQuizzes: 0,
      currentStreak: 0,
      level: 1,
      completedTopics: [],
      completedQuizIds: [],
      lastActivity: null
    })
  );
  
  const [activities, setActivities] = useState<Activity[]>(() => 
    loadFromStorage(STORAGE_KEYS.ACTIVITIES, [])
  );
  
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const stored = loadFromStorage(STORAGE_KEYS.ACHIEVEMENTS, achievementsData);
    // Ensure we always have the original achievement data with proper icons
    return achievementsData.map(originalAchievement => {
      const storedAchievement = stored.find((a: Achievement) => a.id === originalAchievement.id);
      return {
        ...originalAchievement,
        earned: storedAchievement?.earned || false,
        earnedDate: storedAchievement?.earnedDate || undefined
      };
    });
  });

  const [subjects, setSubjects] = useState<Subject[]>(subjectsData);

  // Update subjects based on user progress
  useEffect(() => {
    const updatedSubjects = subjectsData.map(subject => ({
      ...subject,
      topics: subject.topics.map(topic => ({
        ...topic,
        unlocked: topic.id === subject.topics[0].id || 
                 userProgress.completedTopics.includes(subject.topics[subject.topics.indexOf(topic) - 1]?.id),
        completed: userProgress.completedTopics.includes(topic.id)
      }))
    }));
    setSubjects(updatedSubjects);
  }, [userProgress.completedTopics]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER_PROGRESS, userProgress);
  }, [userProgress]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
  }, [activities]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  }, [achievements]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LANGUAGE, selectedLanguage);
  }, [selectedLanguage]);

  // Calculate derived values
  const totalQuizzes = subjects.reduce((sum, subject) => 
    sum + subject.topics.reduce((topicSum, topic) => topicSum + topic.quizzes.length, 0), 0
  );

  const completedTopics = userProgress.completedTopics.length;
  const totalTopics = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);

  // Achievement checking
  const checkAchievements = (newProgress: UserProgress, newActivities: Activity[]) => {
    const newAchievements = [...achievements];
    let hasNewAchievement = false;

    // First Quiz
    if (newProgress.completedQuizzes >= 1 && !newAchievements[0].earned) {
      newAchievements[0] = { ...newAchievements[0], earned: true, earnedDate: new Date() };
      hasNewAchievement = true;
    }

    // Math Master
    const mathTopics = subjects.find(s => s.id === 'math')?.topics.length || 0;
    const completedMathTopics = newProgress.completedTopics.filter(topicId => 
      subjects.find(s => s.id === 'math')?.topics.some(t => t.id === topicId)
    ).length;
    if (completedMathTopics >= mathTopics && !newAchievements[1].earned) {
      newAchievements[1] = { ...newAchievements[1], earned: true, earnedDate: new Date() };
      hasNewAchievement = true;
    }

    // Biology Expert
    const biologyTopics = subjects.find(s => s.id === 'biology')?.topics.length || 0;
    const completedBiologyTopics = newProgress.completedTopics.filter(topicId => 
      subjects.find(s => s.id === 'biology')?.topics.some(t => t.id === topicId)
    ).length;
    if (completedBiologyTopics >= biologyTopics && !newAchievements[2].earned) {
      newAchievements[2] = { ...newAchievements[2], earned: true, earnedDate: new Date() };
      hasNewAchievement = true;
    }

    // Perfect Score
    const hasPerfectScore = newActivities.some(activity => activity.score === 100);
    if (hasPerfectScore && !newAchievements[3].earned) {
      newAchievements[3] = { ...newAchievements[3], earned: true, earnedDate: new Date() };
      hasNewAchievement = true;
    }

    // Speed Learner (5 quizzes in one day)
    const today = new Date().toDateString();
    const todayActivities = newActivities.filter(activity => 
      activity.timestamp.toDateString() === today
    );
    if (todayActivities.length >= 5 && !newAchievements[4].earned) {
      newAchievements[4] = { ...newAchievements[4], earned: true, earnedDate: new Date() };
      hasNewAchievement = true;
    }

    if (hasNewAchievement) {
      setAchievements(newAchievements);
      toast({
        title: "🎉 Achievement Unlocked!",
        description: "Check your achievements panel to see what you've earned!",
      });
    }
  };

  // Functions
  const handleSubjectClick = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      toast({
        title: `${subject.name} Selected`,
        description: `Opening ${subject.name} topics...`,
      });
      // Here you would navigate to the subject page or open a modal
      console.log('Selected subject:', subject);
    }
  };

  const handleQuizStart = (subjectId: string, topicId: string, quizId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    const topic = subject?.topics.find(t => t.id === topicId);
    const quiz = topic?.quizzes.find(q => q.id === quizId);
    
    if (quiz) {
      toast({
        title: "Quiz Starting",
        description: `Starting ${quiz.title}...`,
      });
      // Navigate to the quiz page
      setLocation(`/quiz/${quizId}`);
    } else {
      toast({
        title: "Quiz Not Found",
        description: "The requested quiz could not be found.",
        variant: "destructive"
      });
    }
  };

  const handlePracticeQuiz = () => {
    // Find the first available quiz
    const firstSubject = subjects.find(s => s.topics.some(t => t.unlocked));
    const firstTopic = firstSubject?.topics.find(t => t.unlocked);
    const firstQuiz = firstTopic?.quizzes[0];
    
    if (firstQuiz && firstSubject && firstTopic) {
      handleQuizStart(firstSubject.id, firstTopic.id, firstQuiz.id);
    } else {
      toast({
        title: "No Quizzes Available",
        description: "Complete some topics to unlock quizzes!",
        variant: "destructive"
      });
    }
  };

  const handleReviewProgress = () => {
    setLocation("/analytics");
  };

  const handleLeaderboard = () => {
    toast({
      title: "Leaderboard",
      description: "Leaderboard feature coming soon!",
    });
  };

  const formatTimeAgo = (date: Date | string): string => {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(targetDate.getTime())) {
      return "Unknown time";
    }
    
    const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  // Demo function to simulate quiz completion (for testing)
  const simulateQuizCompletion = () => {
    const subject = subjects[0]; // Math
    const topic = subject.topics[0]; // Algebra Basics
    const quiz = topic.quizzes[0]; // Basic Operations
    
    const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
    const points = Math.floor(score / 100 * quiz.points);
    
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      subject: subject.name,
      topic: topic.name,
      quiz: quiz.title,
      score: score,
      points: points,
      timestamp: new Date()
    };
    
    const newProgress: UserProgress = {
      ...userProgress,
      totalPoints: userProgress.totalPoints + points,
      completedQuizzes: userProgress.completedQuizzes + 1,
      level: Math.floor((userProgress.totalPoints + points) / 100) + 1,
      completedTopics: userProgress.completedTopics.includes(topic.id) 
        ? userProgress.completedTopics 
        : [...userProgress.completedTopics, topic.id],
      completedQuizIds: [...userProgress.completedQuizIds, quiz.id],
      lastActivity: new Date()
    };
    
    setActivities(prev => [newActivity, ...prev]);
    setUserProgress(newProgress);
    checkAchievements(newProgress, [newActivity, ...activities]);
    
    toast({
      title: "🎉 Quiz Completed!",
      description: `You scored ${score}% and earned ${points} points!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">STEM Quest</h1>
                <p className="text-xs text-gray-500">Learn • Explore • Achieve</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="h-4 w-4" />
            <span>Welcome back, Student!</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready for your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">STEM Adventure</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore interactive quizzes, earn points, and unlock achievements as you master STEM subjects.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Points</p>
                  <p className="text-3xl font-bold">{userProgress.totalPoints}</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Topics Completed</p>
                  <p className="text-3xl font-bold">{completedTopics}/{totalTopics}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Achievements</p>
                  <p className="text-3xl font-bold">{achievements.filter(a => a.earned).length}</p>
                </div>
                <Award className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Current Level</p>
                  <p className="text-3xl font-bold">{userProgress.level}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject Cards */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Subjects</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((subject) => {
                const IconComponent = subject.icon;
                const completedTopics = subject.topics.filter(topic => topic.completed).length;
                const totalTopics = subject.topics.length;
                const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
                const totalQuizzes = subject.topics.reduce((sum, topic) => sum + topic.quizzes.length, 0);
                const completedQuizzes = subject.topics
                  .filter(topic => topic.completed)
                  .reduce((sum, topic) => sum + topic.quizzes.length, 0);
                
                return (
                  <Card 
                    key={subject.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => handleSubjectClick(subject.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg ${subject.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {completedQuizzes}/{totalQuizzes} quizzes
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <CardDescription>
                        {subject.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1 group-hover:bg-opacity-90 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              const firstUnlockedTopic = subject.topics.find(t => t.unlocked);
                              if (firstUnlockedTopic && firstUnlockedTopic.quizzes[0]) {
                                handleQuizStart(subject.id, firstUnlockedTopic.id, firstUnlockedTopic.quizzes[0].id);
                              }
                            }}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Quiz
                          </Button>
                          {completedTopics > 0 && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.length > 0 ? (
                  activities
                    .sort((a, b) => {
                      const dateA = typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp;
                      const dateB = typeof b.timestamp === 'string' ? new Date(b.timestamp) : b.timestamp;
                      return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 4)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{activity.subject}</p>
                          <p className="text-xs text-gray-600">{activity.topic}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{activity.score}%</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                    <p className="text-xs">Complete your first quiz to see activity here!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`p-3 rounded-lg text-center cursor-pointer transition-all hover:scale-105 ${
                          achievement.earned 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          toast({
                            title: achievement.earned ? "Achievement Earned!" : "Achievement Locked",
                            description: achievement.earned 
                              ? achievement.description 
                              : `Requirement: ${achievement.requirement}`,
                          });
                        }}
                      >
                        <IconComponent className="h-6 w-6 mx-auto mb-1" />
                        <p className="text-xs font-medium">{achievement.name}</p>
                        {achievement.earned && (
                          <div className="absolute -top-1 -right-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="default" onClick={handlePracticeQuiz}>
                  <Target className="h-4 w-4 mr-2" />
                  Take Practice Quiz
                </Button>
                <Button className="w-full" variant="outline" onClick={handleReviewProgress}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Review Progress
                </Button>
                <Button className="w-full" variant="outline" onClick={handleLeaderboard}>
                  <Trophy className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Button>
                <Button 
                  className="w-full" 
                  variant="secondary" 
                  onClick={simulateQuizCompletion}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Demo Quiz (Test)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
