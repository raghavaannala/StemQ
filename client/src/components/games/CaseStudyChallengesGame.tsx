import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, Target, BarChart3, Globe, Zap, Brain } from "lucide-react";

interface CaseStudyChallengesGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface CaseStudy {
  id: string;
  title: string;
  field: 'climate' | 'engineering' | 'medicine' | 'economics' | 'technology';
  scenario: string;
  background: string;
  data: string[];
  challenge: string;
  options: string[];
  correct: string;
  explanation: string;
  realWorldImpact: string;
  points: number;
  difficulty: 'advanced' | 'expert';
}

const caseStudies: CaseStudy[] = [
  {
    id: "climate_change",
    title: "Arctic Ice Melting Analysis",
    field: 'climate',
    scenario: "You're a climate scientist analyzing Arctic sea ice data from the past 40 years.",
    background: "Arctic sea ice extent has been declining at an average rate of 13% per decade since 1979. This affects global weather patterns, ocean currents, and ecosystems.",
    data: [
      "1979 average: 7.2 million km²",
      "2000 average: 6.5 million km²", 
      "2020 average: 4.9 million km²",
      "Current trend: -13% per decade"
    ],
    challenge: "Based on this data trend, what is the most critical immediate action needed?",
    options: [
      "Implement aggressive carbon emission reduction policies globally",
      "Focus solely on adapting to the changes",
      "Increase Arctic research funding only",
      "Wait for more data before taking action"
    ],
    correct: "Implement aggressive carbon emission reduction policies globally",
    explanation: "The data shows accelerating ice loss. Immediate emission reductions are critical as Arctic ice loss creates feedback loops that accelerate warming.",
    realWorldImpact: "Arctic ice loss contributes to sea level rise affecting 630 million people in coastal areas worldwide.",
    points: 150,
    difficulty: 'expert'
  },
  {
    id: "bridge_engineering",
    title: "Suspension Bridge Design Challenge",
    field: 'engineering',
    scenario: "Design a suspension bridge to span a 2km river crossing with high wind conditions.",
    background: "The bridge must handle 50,000 vehicles daily, withstand 200 km/h winds, and account for thermal expansion in temperatures from -30°C to +40°C.",
    data: [
      "Span length: 2000m",
      "Daily traffic: 50,000 vehicles",
      "Max wind speed: 200 km/h",
      "Temperature range: -30°C to +40°C",
      "Steel expansion: 12×10⁻⁶ /°C"
    ],
    challenge: "What is the most critical design consideration for this bridge?",
    options: [
      "Aerodynamic stability to prevent wind-induced oscillations",
      "Maximum load capacity for traffic",
      "Aesthetic appearance and cost minimization",
      "Construction timeline optimization"
    ],
    correct: "Aerodynamic stability to prevent wind-induced oscillations",
    explanation: "At 200 km/h winds, aerodynamic instability could cause catastrophic oscillations like the Tacoma Narrows Bridge collapse. This is the primary safety concern.",
    realWorldImpact: "Proper aerodynamic design prevents bridge failures that could cost hundreds of lives and billions in economic damage.",
    points: 160,
    difficulty: 'expert'
  },
  {
    id: "pandemic_response",
    title: "Epidemic Modeling and Response",
    field: 'medicine',
    scenario: "You're advising public health policy during a new infectious disease outbreak.",
    background: "A novel respiratory virus has emerged with R₀ = 2.5, case fatality rate of 1.2%, and 14-day incubation period.",
    data: [
      "Basic reproduction number (R₀): 2.5",
      "Case fatality rate: 1.2%",
      "Incubation period: 14 days",
      "Current cases: 10,000",
      "Hospital capacity: 5,000 beds"
    ],
    challenge: "What intervention strategy would be most effective in the first 30 days?",
    options: [
      "Implement immediate lockdown and contact tracing",
      "Focus only on protecting high-risk populations",
      "Wait for vaccine development before acting",
      "Rely solely on hospital capacity expansion"
    ],
    correct: "Implement immediate lockdown and contact tracing",
    explanation: "With R₀ = 2.5, exponential growth will quickly overwhelm hospital capacity. Early intervention is crucial to flatten the curve and buy time for other measures.",
    realWorldImpact: "Early intervention can reduce peak infections by 80% and prevent healthcare system collapse, saving thousands of lives.",
    points: 170,
    difficulty: 'expert'
  },
  {
    id: "economic_crisis",
    title: "Financial Market Stability Analysis",
    field: 'economics',
    scenario: "Analyze the economic impact of a major financial institution's potential collapse.",
    background: "A major bank with $500B in assets is facing liquidity crisis. It has interconnections with 200+ other financial institutions globally.",
    data: [
      "Bank assets: $500 billion",
      "Connected institutions: 200+",
      "Potential job losses: 50,000 direct, 200,000 indirect",
      "GDP impact: -2.5% if collapse occurs",
      "Bailout cost: $150 billion"
    ],
    challenge: "What is the most economically sound approach?",
    options: [
      "Structured bailout with strict regulatory oversight",
      "Allow natural market forces and bankruptcy",
      "Partial nationalization of the institution",
      "Emergency merger with a competitor"
    ],
    correct: "Structured bailout with strict regulatory oversight",
    explanation: "The systemic risk ($500B + interconnections) far exceeds bailout costs. Structured bailout prevents contagion while ensuring accountability and reform.",
    realWorldImpact: "Preventing systemic collapse protects millions of jobs and prevents global recession, as seen in 2008 financial crisis responses.",
    points: 140,
    difficulty: 'advanced'
  },
  {
    id: "ai_ethics",
    title: "AI Algorithm Bias Detection",
    field: 'technology',
    scenario: "You're evaluating an AI hiring algorithm used by major corporations for potential bias.",
    background: "The algorithm screens 100,000 resumes monthly. Recent analysis shows disparate outcomes across demographic groups despite similar qualifications.",
    data: [
      "Total resumes processed: 100,000/month",
      "Male candidates advanced: 65%",
      "Female candidates advanced: 35%",
      "Qualification scores similar across groups",
      "Algorithm trained on 10 years historical data"
    ],
    challenge: "What is the most appropriate immediate action?",
    options: [
      "Suspend the algorithm and implement bias auditing protocols",
      "Adjust the algorithm to ensure equal outcomes",
      "Continue using but add human oversight",
      "Retrain with more diverse historical data"
    ],
    correct: "Suspend the algorithm and implement bias auditing protocols",
    explanation: "The disparate impact despite similar qualifications indicates systemic bias. Immediate suspension prevents further discrimination while proper auditing identifies root causes.",
    realWorldImpact: "Biased AI systems can perpetuate discrimination affecting millions of job seekers and violate civil rights laws, requiring immediate corrective action.",
    points: 155,
    difficulty: 'expert'
  }
];

export default function CaseStudyChallengesGame({ onScoreUpdate, onProgressUpdate }: CaseStudyChallengesGameProps) {
  const { toast } = useToast();
  const [currentCase, setCurrentCase] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [expertLevel, setExpertLevel] = useState(1);
  const [solvedFields, setSolvedFields] = useState<string[]>([]);
  const [showImpact, setShowImpact] = useState(false);

  useEffect(() => {
    const progress = (currentCase / caseStudies.length) * 100;
    onProgressUpdate(progress);
  }, [currentCase, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const caseStudy = caseStudies[currentCase];
    const isCorrect = selectedAnswer === caseStudy.correct;

    if (isCorrect) {
      const difficultyBonus = caseStudy.difficulty === 'expert' ? 50 : 25;
      const streakBonus = streak * 20;
      const points = caseStudy.points + difficultyBonus + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setExpertLevel(prev => prev + 1);
      
      // Add solved field
      if (!solvedFields.includes(caseStudy.field)) {
        setSolvedFields(prev => [...prev, caseStudy.field]);
      }
      
      toast({
        title: "Case Solved! 🎯",
        description: `+${points} points! Expert analysis completed!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Analysis Incomplete! ❌",
        description: "Review the data and consider alternative approaches!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
    setShowImpact(true);
  };

  const handleNextCase = () => {
    if (currentCase + 1 >= caseStudies.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Expert Consultant! 🏆",
        description: `All cases solved! Final score: ${score}`,
      });
    } else {
      setCurrentCase(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
      setShowImpact(false);
    }
  };

  const handleRestart = () => {
    setCurrentCase(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer('');
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    setExpertLevel(1);
    setSolvedFields([]);
    setShowImpact(false);
    onProgressUpdate(0);
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'climate': return <Globe className="h-4 w-4" />;
      case 'engineering': return <Zap className="h-4 w-4" />;
      case 'medicine': return <Heart className="h-4 w-4" />;
      case 'economics': return <BarChart3 className="h-4 w-4" />;
      case 'technology': return <Brain className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getFieldColor = (field: string) => {
    switch (field) {
      case 'climate': return 'bg-green-500';
      case 'engineering': return 'bg-blue-500';
      case 'medicine': return 'bg-red-500';
      case 'economics': return 'bg-yellow-500';
      case 'technology': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Analysis Failed!</h3>
        <p className="text-gray-600 mb-6">Your consulting contract has been terminated. More expertise needed!</p>
        <Button onClick={handleRestart} size="lg">
          <Target className="h-5 w-5 mr-2" />
          New Consultation
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Expert Consultant!</h3>
        <p className="text-gray-600 mb-4">You've successfully solved complex real-world challenges across multiple fields!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-purple-500 text-white px-4 py-2">
            <Target className="h-4 w-4 mr-2" />
            Level {expertLevel}
          </Badge>
          <Badge className="bg-blue-500 text-white px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            {solvedFields.length} Fields
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <Target className="h-5 w-5 mr-2" />
          New Case Portfolio
        </Button>
      </div>
    );
  }

  const caseStudy = caseStudies[currentCase];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Consultant Status */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-red-50">
          <CardContent className="p-4 text-center">
            <Heart className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-red-800">{lives} Lives</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-blue-800">Level {expertLevel}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 text-center">
            <Brain className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-800">{solvedFields.length} Fields</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-purple-800">Case {currentCase + 1}/{caseStudies.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Score and Progress */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
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
          Portfolio: {Math.round((currentCase / caseStudies.length) * 100)}%
        </Badge>
      </div>

      {/* Case Study Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">🎯</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{caseStudy.title}</h2>
        <div className="flex justify-center space-x-2 mb-4">
          <Badge className={`${getFieldColor(caseStudy.field)} text-white`}>
            {getFieldIcon(caseStudy.field)}
            <span className="ml-1 capitalize">{caseStudy.field}</span>
          </Badge>
          <Badge className={`${caseStudy.difficulty === 'expert' ? 'bg-red-600' : 'bg-orange-600'} text-white`}>
            {caseStudy.difficulty.toUpperCase()}
          </Badge>
          <Badge className="bg-indigo-600 text-white">
            {caseStudy.points} Points
          </Badge>
        </div>
      </div>

      {/* Scenario */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Scenario</h3>
          <p className="text-gray-700 mb-4">{caseStudy.scenario}</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Background</h4>
            <p className="text-blue-700 text-sm">{caseStudy.background}</p>
          </div>
        </CardContent>
      </Card>

      {/* Data Analysis */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Data Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {caseStudy.data.map((dataPoint, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-mono text-gray-800">{dataPoint}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Challenge Question */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {caseStudy.challenge}
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {caseStudy.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 text-left justify-start ${
                  showExplanation
                    ? option === caseStudy.correct
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
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Expert Analysis</h4>
                <p className="text-green-700">{caseStudy.explanation}</p>
              </div>
              {showImpact && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Real-World Impact</h4>
                  <p className="text-blue-700">{caseStudy.realWorldImpact}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solved Fields */}
      {solvedFields.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Expertise Areas:</h4>
            <div className="flex flex-wrap gap-2">
              {solvedFields.map((field, index) => (
                <Badge key={index} className={`${getFieldColor(field)} text-white text-xs`}>
                  {getFieldIcon(field)}
                  <span className="ml-1 capitalize">{field}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {!showExplanation ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            size="lg"
            className="px-8 bg-indigo-600 hover:bg-indigo-700"
          >
            <Target className="h-4 w-4 mr-2" />
            Submit Analysis
          </Button>
        ) : (
          <Button onClick={handleNextCase} size="lg" className="px-8">
            {currentCase + 1 >= caseStudies.length ? "Complete Portfolio!" : "Next Case"}
          </Button>
        )}
      </div>
    </div>
  );
}
