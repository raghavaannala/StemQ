import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAudioFeedback } from "@/lib/audio";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Star, 
  Trophy, 
  CheckCircle, 
  XCircle,
  Zap,
  Target,
  Brain,
  Award,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

// Types
interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit?: number; // in seconds
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  questions: Question[];
  totalPoints: number;
  timeLimit?: number; // total time in minutes
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  pointsEarned: number;
  accuracy: number;
  answers: AnswerResult[];
}

interface AnswerResult {
  questionId: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
}

// Sample quiz data (in a real app, this would come from an API or database)
const sampleQuizzes: Quiz[] = [
  {
    id: "algebra-quiz-1",
    title: "Basic Operations",
    description: "Test your knowledge of basic algebraic operations",
    subject: "Mathematics",
    topic: "Algebra Basics",
    totalPoints: 100,
    timeLimit: 10,
    questions: [
      {
        id: "q1",
        question: "What is 2 + 2 × 2?",
        options: ["6", "8", "4", "10"],
        correct: 0,
        explanation: "Order of operations: multiplication first (2×2=4), then addition (2+4=6)",
        difficulty: "easy",
        points: 20,
        timeLimit: 30
      },
      {
        id: "q2",
        question: "Solve for x: x + 5 = 10",
        options: ["5", "3", "15", "2"],
        correct: 0,
        explanation: "Subtract 5 from both sides: x + 5 - 5 = 10 - 5, so x = 5",
        difficulty: "easy",
        points: 20,
        timeLimit: 45
      },
      {
        id: "q3",
        question: "What is 3x + 2 = 14?",
        options: ["4", "6", "5", "3"],
        correct: 0,
        explanation: "Subtract 2: 3x = 12, then divide by 3: x = 4",
        difficulty: "medium",
        points: 30,
        timeLimit: 60
      },
      {
        id: "q4",
        question: "Simplify: 2(x + 3) = ?",
        options: ["2x + 6", "2x + 3", "x + 6", "2x + 5"],
        correct: 0,
        explanation: "Distribute 2: 2 × x + 2 × 3 = 2x + 6",
        difficulty: "medium",
        points: 30,
        timeLimit: 60
      },
      {
        id: "q5",
        question: "If y = 2x + 1 and x = 3, what is y?",
        options: ["7", "6", "5", "8"],
        correct: 0,
        explanation: "Substitute x = 3: y = 2(3) + 1 = 6 + 1 = 7",
        difficulty: "hard",
        points: 40,
        timeLimit: 90
      }
    ]
  },
  {
    id: "physics-quiz-1",
    title: "Motion Basics",
    description: "Understanding velocity, acceleration, and displacement",
    subject: "Physics",
    topic: "Motion Basics",
    totalPoints: 100,
    timeLimit: 8,
    questions: [
      {
        id: "p1",
        question: "What is the formula for speed?",
        options: ["Distance/Time", "Time/Distance", "Distance × Time", "Distance + Time"],
        correct: 0,
        explanation: "Speed is distance traveled divided by time taken",
        difficulty: "easy",
        points: 25,
        timeLimit: 30
      },
      {
        id: "p2",
        question: "Unit of acceleration is?",
        options: ["m/s²", "m/s", "m", "s/m"],
        correct: 0,
        explanation: "Acceleration is change in velocity over time, so m/s per second = m/s²",
        difficulty: "medium",
        points: 25,
        timeLimit: 45
      },
      {
        id: "p3",
        question: "A car travels 100m in 10s. What is its speed?",
        options: ["10 m/s", "100 m/s", "1 m/s", "110 m/s"],
        correct: 0,
        explanation: "Speed = Distance/Time = 100m/10s = 10 m/s",
        difficulty: "medium",
        points: 25,
        timeLimit: 60
      },
      {
        id: "p4",
        question: "What is the acceleration due to gravity on Earth?",
        options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "9.1 m/s²"],
        correct: 0,
        explanation: "Standard acceleration due to gravity on Earth is approximately 9.8 m/s²",
        difficulty: "hard",
        points: 25,
        timeLimit: 60
      }
    ]
  }
];

// Gamification constants
const GAMIFICATION = {
  STREAK_BONUS: 10, // Extra points for maintaining streaks
  PERFECT_SCORE_BONUS: 50, // Bonus for 100% accuracy
  SPEED_BONUS: 5, // Bonus for quick answers
  LEVEL_THRESHOLDS: [100, 250, 500, 1000, 2000, 5000], // Points needed for each level
  ACHIEVEMENTS: {
    FIRST_QUIZ: "first_quiz",
    PERFECT_SCORE: "perfect_score",
    SPEED_DEMON: "speed_demon",
    STREAK_MASTER: "streak_master",
    KNOWLEDGE_SEEKER: "knowledge_seeker"
  }
};

interface QuizProps {
  grade?: string;
  subjectId?: string;
  topicId?: string;
  quizId?: string;
}

export default function Quiz({ grade: propGrade, subjectId: propSubjectId, topicId: propTopicId, quizId: propQuizId }: QuizProps = {}) {
  const params = useParams();
  const [location, setLocation] = useLocation();
  
  // Use props or fallback to params
  const grade = propGrade || params.grade;
  const subjectId = propSubjectId || params.subject;
  const topicId = propTopicId || params.topic;
  const quizId = propQuizId || params.quizId;
  const { toast } = useToast();
  const { playCorrect, playIncorrect, playLevelUp, playAchievement, playStreak, playComplete } = useAudioFeedback();
  
  // State management
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Load quiz data
  useEffect(() => {
    const foundQuiz = sampleQuizzes.find(q => q.id === quizId);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      setTimeRemaining(foundQuiz.timeLimit ? foundQuiz.timeLimit * 60 : 0);
    } else {
      toast({
        title: "Quiz Not Found",
        description: "The requested quiz could not be found.",
        variant: "destructive"
      });
      setLocation("/");
    }
  }, [quizId, setLocation, toast]);

  // Timer effects
  useEffect(() => {
    if (!quizStarted || isPaused || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, isPaused, quizCompleted]);

  useEffect(() => {
    if (!quizStarted || isPaused || quizCompleted || !quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion.timeLimit) return;

    setQuestionTimeRemaining(currentQuestion.timeLimit);
    setQuestionStartTime(new Date());

    const timer = setInterval(() => {
      setQuestionTimeRemaining(prev => {
        if (prev <= 1) {
          handleQuestionTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizStarted, isPaused, quizCompleted, quiz]);

  // Functions
  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(new Date());
    setQuestionStartTime(new Date());
    toast({
      title: "Quiz Started!",
      description: "Good luck! Answer each question carefully.",
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || quizCompleted) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !quiz || !questionStartTime) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const timeSpent = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    // Calculate points with gamification bonuses
    let points = isCorrect ? currentQuestion.points : 0;
    
    // Speed bonus (if answered quickly)
    if (timeSpent < (currentQuestion.timeLimit || 60) / 2) {
      points += GAMIFICATION.SPEED_BONUS;
    }
    
    // Streak bonus
    if (isCorrect) {
      setStreak(prev => prev + 1);
      if (streak >= 3) {
        points += GAMIFICATION.STREAK_BONUS;
      }
    } else {
      setStreak(0);
    }

    const answerResult: AnswerResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.correct,
      isCorrect,
      timeSpent,
      points
    };

    setAnswers(prev => [...prev, answerResult]);
    setTotalPoints(prev => prev + points);
    setShowResult(true);

    // Show feedback with audio
    if (isCorrect) {
      playCorrect();
      if (streak >= 3) {
        playStreak();
      }
      toast({
        title: "Correct! 🎉",
        description: `+${points} points${streak >= 3 ? ` (Streak bonus!)` : ''}`,
      });
    } else {
      playIncorrect();
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestion.options[currentQuestion.correct]}`,
        variant: "destructive"
      });
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuestionStartTime(new Date());
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!quiz || !startTime) return;

    const totalTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    // Perfect score bonus
    let finalPoints = totalPoints;
    if (accuracy === 100) {
      finalPoints += GAMIFICATION.PERFECT_SCORE_BONUS;
    }

    const result: QuizResult = {
      score: accuracy,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent: totalTime,
      pointsEarned: finalPoints,
      accuracy,
      answers
    };

    setQuizCompleted(true);
    
    // Save result to localStorage
    const savedResults = JSON.parse(localStorage.getItem('quiz_results') || '[]');
    savedResults.push({
      ...result,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      topic: quiz.topic,
      completedAt: new Date().toISOString()
    });
    localStorage.setItem('quiz_results', JSON.stringify(savedResults));

    // Update user progress
    const userProgress = JSON.parse(localStorage.getItem('stemquest_user_progress') || '{}');
    const newProgress = {
      ...userProgress,
      totalPoints: (userProgress.totalPoints || 0) + finalPoints,
      completedQuizzes: (userProgress.completedQuizzes || 0) + 1,
      level: Math.floor(((userProgress.totalPoints || 0) + finalPoints) / 100) + 1,
      lastActivity: new Date().toISOString()
    };
    localStorage.setItem('stemquest_user_progress', JSON.stringify(newProgress));

    // Show completion toast with audio
    playComplete();
    if (accuracy === 100) {
      playAchievement();
    }
    toast({
      title: "Quiz Completed! 🏆",
      description: `You scored ${accuracy}% and earned ${finalPoints} points!`,
    });
  };

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      // Auto-submit with no answer
      submitAnswer();
    }
    completeQuiz();
  };

  const handleQuestionTimeUp = () => {
    if (selectedAnswer === null) {
      submitAnswer();
    }
  };

  const pauseQuiz = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Quiz Resumed" : "Quiz Paused",
      description: isPaused ? "Continue when ready!" : "Quiz is paused. Click to resume.",
    });
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizStarted(false);
    setQuizCompleted(false);
    setAnswers([]);
    setTotalPoints(0);
    setStreak(0);
    setTimeRemaining(quiz?.timeLimit ? quiz.timeLimit * 60 : 0);
    setIsPaused(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading quiz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
                <p className="text-sm text-gray-500">{quiz.subject} • {quiz.topic}</p>
              </div>
            </div>
            
            {quizStarted && !quizCompleted && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{totalPoints} pts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{streak} streak</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pauseQuiz}
                  className="flex items-center space-x-2"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!quizStarted ? (
          // Quiz Introduction
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                  <CardDescription className="text-lg">{quiz.description}</CardDescription>
                </div>
                <Badge className={getDifficultyColor('medium')}>
                  {quiz.questions.length} Questions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Time Limit</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">Total Points</p>
                  <p className="text-2xl font-bold text-green-600">{quiz.totalPoints}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium">Questions</p>
                  <p className="text-2xl font-bold text-purple-600">{quiz.questions.length}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Quiz Instructions:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Read each question carefully before answering</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Some questions have time limits for extra points</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Build streaks for bonus points</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span>Perfect scores earn extra rewards</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={startQuiz} size="lg" className="flex-1">
                  <Play className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")} size="lg">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : quizCompleted ? (
          // Quiz Results
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Quiz Completed! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {answers.filter(a => a.isCorrect).length}/{quiz.questions.length}
                </h2>
                <p className="text-xl text-gray-600">
                  {Math.round((answers.filter(a => a.isCorrect).length / quiz.questions.length) * 100)}% Accuracy
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Points Earned</p>
                  <p className="text-2xl font-bold text-blue-600">{totalPoints}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">Time Spent</p>
                  <p className="text-2xl font-bold text-green-600">
                    {startTime ? formatTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000)) : '0:00'}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium">Max Streak</p>
                  <p className="text-2xl font-bold text-purple-600">{streak}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Question Review:</h3>
                {answers.map((answer, index) => {
                  const question = quiz.questions.find(q => q.id === answer.questionId);
                  return (
                    <div key={answer.questionId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Question {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          {answer.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium">{answer.points} pts</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{question?.question}</p>
                      <div className="text-sm space-y-1">
                        <p>Your answer: <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {question?.options[answer.selectedAnswer]}
                        </span></p>
                        {!answer.isCorrect && (
                          <p>Correct answer: <span className="text-green-600">
                            {question?.options[answer.correctAnswer]}
                          </span></p>
                        )}
                        {question?.explanation && (
                          <p className="text-gray-500 italic">{question.explanation}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={restartQuiz} size="lg" className="flex-1">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Retake Quiz
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")} size="lg" className="flex-1">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Quiz Questions
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </span>
                  <div className="flex items-center space-x-4 text-sm">
                    {quiz.timeLimit && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(timeRemaining)}</span>
                      </div>
                    )}
                    {currentQuestion.timeLimit && (
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>{formatTime(questionTimeRemaining)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Progress 
                  value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} 
                  className="h-2"
                />
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                    {currentQuestion.difficulty.toUpperCase()}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{currentQuestion.points} pts</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`h-auto p-4 text-left justify-start ${
                        showResult 
                          ? index === currentQuestion.correct 
                            ? "bg-green-100 border-green-500 text-green-800" 
                            : selectedAnswer === index && !currentQuestion.correct
                            ? "bg-red-100 border-red-500 text-red-800"
                            : "bg-gray-50"
                          : selectedAnswer === index
                          ? "bg-blue-100 border-blue-500 text-blue-800"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          showResult 
                            ? index === currentQuestion.correct 
                              ? "bg-green-500 text-white" 
                              : selectedAnswer === index && !currentQuestion.correct
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 text-gray-600"
                            : selectedAnswer === index
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </Button>
                  ))}
                </div>

                {showResult && currentQuestion.explanation && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                    <p className="text-blue-800">{currentQuestion.explanation}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/")}
                    disabled={showResult}
                  >
                    Exit Quiz
                  </Button>
                  <Button
                    onClick={showResult ? nextQuestion : submitAnswer}
                    disabled={selectedAnswer === null && !showResult}
                    className="flex items-center space-x-2"
                  >
                    {showResult ? (
                      <>
                        <span>{currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      'Submit Answer'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
