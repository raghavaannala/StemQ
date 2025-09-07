import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, Briefcase, DollarSign, TrendingUp, Users, Clock, Target } from "lucide-react";

interface CareerSimulationGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface CareerScenario {
  id: string;
  title: string;
  career: string;
  industry: string;
  context: string;
  challenge: string;
  options: {
    text: string;
    outcome: 'excellent' | 'good' | 'poor';
    explanation: string;
    skillsUsed: string[];
    impact: string;
  }[];
  points: number;
  salaryImpact: number;
  experienceGained: string[];
}

const careerScenarios: CareerScenario[] = [
  {
    id: "software_engineer_deadline",
    title: "Critical Software Release",
    career: "Software Engineer",
    industry: "Technology",
    context: "You're leading a team developing a mobile app with a hard deadline for a major client presentation.",
    challenge: "Two days before the deadline, you discover a critical security vulnerability that could take 3 days to fix properly. What's your approach?",
    options: [
      {
        text: "Implement a quick patch and schedule proper fix for next version, ensuring we meet the deadline.",
        outcome: 'good',
        explanation: "Balances immediate needs with long-term security, showing practical project management skills.",
        skillsUsed: ["Risk Management", "Project Planning", "Communication"],
        impact: "Client satisfied, security addressed responsibly"
      },
      {
        text: "Request deadline extension and fix the vulnerability properly, explaining security risks to stakeholders.",
        outcome: 'excellent',
        explanation: "Demonstrates integrity and technical leadership by prioritizing security and educating stakeholders.",
        skillsUsed: ["Technical Leadership", "Risk Assessment", "Stakeholder Management"],
        impact: "Long-term client trust, secure product"
      },
      {
        text: "Deploy as planned and fix the issue in a later update without mentioning it to avoid panic.",
        outcome: 'poor',
        explanation: "Compromises security and trust, violating professional ethics and potentially legal requirements.",
        skillsUsed: ["Time Management"],
        impact: "Potential security breach, damaged reputation"
      }
    ],
    points: 150,
    salaryImpact: 15000,
    experienceGained: ["Security Protocols", "Crisis Management", "Client Relations"]
  },
  {
    id: "doctor_diagnosis",
    title: "Complex Medical Diagnosis",
    career: "Medical Doctor",
    industry: "Healthcare",
    context: "A patient presents with symptoms that could indicate multiple conditions, from minor to life-threatening.",
    challenge: "Initial tests are inconclusive. The patient is anxious and wants immediate answers. How do you proceed?",
    options: [
      {
        text: "Order comprehensive tests and explain to patient why thorough diagnosis is essential for proper treatment.",
        outcome: 'excellent',
        explanation: "Prioritizes patient safety while maintaining clear communication and managing expectations.",
        skillsUsed: ["Diagnostic Reasoning", "Patient Communication", "Medical Ethics"],
        impact: "Accurate diagnosis, patient trust maintained"
      },
      {
        text: "Provide preliminary diagnosis based on most likely condition and start treatment while monitoring.",
        outcome: 'good',
        explanation: "Reasonable approach but carries some risk if initial assessment is incorrect.",
        skillsUsed: ["Clinical Judgment", "Risk Assessment"],
        impact: "Faster treatment, some diagnostic uncertainty"
      },
      {
        text: "Reassure patient it's likely minor and prescribe general treatment to ease their anxiety.",
        outcome: 'poor',
        explanation: "Fails to properly investigate symptoms and could miss serious conditions.",
        skillsUsed: ["Bedside Manner"],
        impact: "Potential misdiagnosis, patient safety compromised"
      }
    ],
    points: 180,
    salaryImpact: 25000,
    experienceGained: ["Differential Diagnosis", "Patient Care", "Medical Decision Making"]
  },
  {
    id: "teacher_classroom_management",
    title: "Classroom Disruption Challenge",
    career: "High School Teacher",
    industry: "Education",
    context: "You're teaching an advanced chemistry class when a student consistently disrupts lessons, affecting other students' learning.",
    challenge: "The student is clearly intelligent but seems bored and acts out. Traditional discipline hasn't worked. What's your strategy?",
    options: [
      {
        text: "Have a private conversation to understand the student's needs and offer advanced projects or mentoring role.",
        outcome: 'excellent',
        explanation: "Addresses root cause and turns disruptive energy into positive leadership and engagement.",
        skillsUsed: ["Student Psychology", "Differentiated Instruction", "Mentoring"],
        impact: "Student engagement improved, class dynamics better"
      },
      {
        text: "Implement a behavior contract with clear consequences and rewards, involving parents if necessary.",
        outcome: 'good',
        explanation: "Structured approach that sets clear boundaries while providing support system.",
        skillsUsed: ["Classroom Management", "Parent Communication", "Behavioral Psychology"],
        impact: "Behavior modification, consistent expectations"
      },
      {
        text: "Remove the student from class and recommend transfer to a different section or school.",
        outcome: 'poor',
        explanation: "Gives up on the student and misses opportunity to address underlying issues.",
        skillsUsed: ["Administrative Procedures"],
        impact: "Problem transferred, student potential wasted"
      }
    ],
    points: 120,
    salaryImpact: 8000,
    experienceGained: ["Classroom Management", "Student Engagement", "Educational Psychology"]
  },
  {
    id: "business_analyst_strategy",
    title: "Market Analysis Crisis",
    career: "Business Analyst",
    industry: "Finance",
    context: "Your company is considering a major investment in a new market. Your analysis suggests high risk, but executives are enthusiastic.",
    challenge: "The CEO wants to proceed despite your risk assessment. How do you handle this situation professionally?",
    options: [
      {
        text: "Present detailed risk mitigation strategies and alternative approaches that could reduce exposure while pursuing opportunity.",
        outcome: 'excellent',
        explanation: "Provides constructive solutions while maintaining professional integrity and adding value.",
        skillsUsed: ["Strategic Analysis", "Risk Management", "Executive Communication"],
        impact: "Informed decision-making, professional credibility enhanced"
      },
      {
        text: "Document your concerns formally and request the decision be made with full awareness of identified risks.",
        outcome: 'good',
        explanation: "Maintains professional responsibility while respecting executive authority.",
        skillsUsed: ["Risk Documentation", "Professional Ethics", "Corporate Governance"],
        impact: "Clear accountability, professional duty fulfilled"
      },
      {
        text: "Agree with the executives to maintain good relationships and hope the investment works out.",
        outcome: 'poor',
        explanation: "Compromises professional integrity and fails to provide value as an analyst.",
        skillsUsed: ["People Pleasing"],
        impact: "Professional credibility damaged, potential financial losses"
      }
    ],
    points: 140,
    salaryImpact: 12000,
    experienceGained: ["Strategic Planning", "Risk Analysis", "Executive Relations"]
  },
  {
    id: "environmental_scientist_policy",
    title: "Environmental Impact Assessment",
    career: "Environmental Scientist",
    industry: "Environmental Services",
    context: "You're assessing environmental impact for a proposed development that would create jobs but harm local ecosystem.",
    challenge: "Community is divided - some want jobs, others want environmental protection. Your report will heavily influence the decision.",
    options: [
      {
        text: "Provide objective scientific assessment with multiple scenarios showing different development approaches and their impacts.",
        outcome: 'excellent',
        explanation: "Maintains scientific integrity while providing practical options for stakeholders to consider.",
        skillsUsed: ["Scientific Analysis", "Environmental Assessment", "Stakeholder Communication"],
        impact: "Informed community decision, scientific credibility maintained"
      },
      {
        text: "Recommend conditional approval with strict environmental monitoring and mitigation requirements.",
        outcome: 'good',
        explanation: "Attempts to balance economic and environmental concerns with protective measures.",
        skillsUsed: ["Environmental Planning", "Regulatory Compliance", "Compromise Building"],
        impact: "Balanced approach, some environmental protection"
      },
      {
        text: "Recommend against development to protect the ecosystem, regardless of economic considerations.",
        outcome: 'poor',
        explanation: "While environmentally sound, fails to consider broader community needs and economic realities.",
        skillsUsed: ["Environmental Protection"],
        impact: "Environmental protection but community division"
      }
    ],
    points: 160,
    salaryImpact: 18000,
    experienceGained: ["Environmental Policy", "Community Engagement", "Impact Assessment"]
  }
];

export default function CareerSimulationGame({ onScoreUpdate, onProgressUpdate }: CareerSimulationGameProps) {
  const { toast } = useToast();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [careerLevel, setCareerLevel] = useState(1);
  const [totalSalary, setTotalSalary] = useState(50000);
  const [skillsAcquired, setSkillsAcquired] = useState<string[]>([]);
  const [experiencePoints, setExperiencePoints] = useState(0);

  useEffect(() => {
    const progress = (currentScenario / careerScenarios.length) * 100;
    onProgressUpdate(progress);
  }, [currentScenario, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const handleOptionSelect = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmitDecision = () => {
    if (selectedOption === -1) return;

    const scenario = careerScenarios[currentScenario];
    const option = scenario.options[selectedOption];
    const isExcellent = option.outcome === 'excellent';
    const isGood = option.outcome === 'good';

    if (isExcellent || isGood) {
      const basePoints = scenario.points;
      const outcomeBonus = isExcellent ? 50 : isGood ? 25 : 0;
      const levelBonus = careerLevel * 10;
      const points = basePoints + outcomeBonus + levelBonus;
      
      setScore(prev => prev + points);
      setCareerLevel(prev => prev + 1);
      setExperiencePoints(prev => prev + (isExcellent ? 30 : 20));
      
      // Update salary based on performance
      const salaryIncrease = isExcellent ? scenario.salaryImpact : scenario.salaryImpact * 0.6;
      setTotalSalary(prev => prev + salaryIncrease);
      
      // Add new skills
      const newSkills = option.skillsUsed.filter(skill => !skillsAcquired.includes(skill));
      setSkillsAcquired(prev => [...prev, ...newSkills]);
      
      toast({
        title: isExcellent ? "Excellent Decision! 🌟" : "Good Decision! ✅",
        description: `+${points} points! ${isExcellent ? "Outstanding" : "Solid"} professional judgment!`,
      });
    } else {
      setLives(prev => prev - 1);
      toast({
        title: "Poor Decision! ❌",
        description: "This choice could harm your professional reputation!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextScenario = () => {
    if (currentScenario + 1 >= careerScenarios.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Career Mastery Achieved! 🏆",
        description: `Professional journey complete! Final score: ${score}`,
      });
    } else {
      setCurrentScenario(prev => prev + 1);
      setSelectedOption(-1);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setScore(0);
    setLives(3);
    setSelectedOption(-1);
    setShowExplanation(false);
    setGameComplete(false);
    setCareerLevel(1);
    setTotalSalary(50000);
    setSkillsAcquired([]);
    setExperiencePoints(0);
    onProgressUpdate(0);
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">💼</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Career Setback!</h3>
        <p className="text-gray-600 mb-6">Poor professional decisions have impacted your career growth. Learn from these experiences!</p>
        <Button onClick={handleRestart} size="lg">
          <Briefcase className="h-5 w-5 mr-2" />
          Start New Career Path
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Career Success!</h3>
        <p className="text-gray-600 mb-4">You've demonstrated excellent professional judgment across multiple career scenarios!</p>
        <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-green-500 text-white px-4 py-2">
            <DollarSign className="h-4 w-4 mr-2" />
            ${totalSalary.toLocaleString()}
          </Badge>
          <Badge className="bg-blue-500 text-white px-4 py-2">
            <TrendingUp className="h-4 w-4 mr-2" />
            Level {careerLevel}
          </Badge>
          <Badge className="bg-purple-500 text-white px-4 py-2">
            <Target className="h-4 w-4 mr-2" />
            {skillsAcquired.length} Skills
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <Briefcase className="h-5 w-5 mr-2" />
          New Career Journey
        </Button>
      </div>
    );
  }

  const scenario = careerScenarios[currentScenario];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Career Status Dashboard */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-red-50">
          <CardContent className="p-4 text-center">
            <Heart className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-red-800">{lives} Lives</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-blue-800">Level {careerLevel}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-800">${Math.round(totalSalary/1000)}k</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-purple-800">Scenario {currentScenario + 1}/{careerScenarios.length}</p>
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
          <Badge className="bg-indigo-500 text-white">
            <Target className="h-4 w-4 mr-1" />
            {experiencePoints} XP
          </Badge>
        </div>
        <Badge variant="outline">
          Career Progress: {Math.round((currentScenario / careerScenarios.length) * 100)}%
        </Badge>
      </div>

      {/* Career Context */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">{scenario.career}</h3>
            <Badge variant="outline" className="ml-2">
              {scenario.industry}
            </Badge>
          </div>
          <p className="text-gray-700">{scenario.context}</p>
        </CardContent>
      </Card>

      {/* Professional Challenge */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">💼</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{scenario.title}</h2>
        <p className="text-gray-600 mb-4">{scenario.challenge}</p>
      </div>

      {/* Decision Options */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            How do you handle this professional situation?
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {scenario.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedOption === index ? "default" : "outline"}
                className={`p-4 text-left justify-start h-auto ${
                  showExplanation
                    ? option.outcome === 'excellent'
                      ? "bg-green-500 text-white"
                      : option.outcome === 'good'
                      ? "bg-yellow-500 text-white"
                      : selectedOption === index
                      ? "bg-red-500 text-white"
                      : ""
                    : ""
                }`}
                onClick={() => handleOptionSelect(index)}
                disabled={showExplanation}
              >
                <div className="w-full">
                  <div className="flex items-start">
                    <span className="text-lg font-semibold mr-3 mt-1">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed mb-2">{option.text}</p>
                      <div className="flex flex-wrap gap-2">
                        {option.skillsUsed.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        <Badge className={`${getOutcomeColor(option.outcome)} text-white text-xs`}>
                          {option.outcome}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {showExplanation && selectedOption !== -1 && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Professional Analysis:</h4>
                <p className="text-blue-700">{scenario.options[selectedOption].explanation}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Impact:</h4>
                <p className="text-green-700">{scenario.options[selectedOption].impact}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Acquired */}
      {skillsAcquired.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Professional Skills Acquired:</h4>
            <div className="flex flex-wrap gap-2">
              {skillsAcquired.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
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
            onClick={handleSubmitDecision}
            disabled={selectedOption === -1}
            size="lg"
            className="px-8 bg-indigo-600 hover:bg-indigo-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Make Decision
          </Button>
        ) : (
          <Button onClick={handleNextScenario} size="lg" className="px-8">
            {currentScenario + 1 >= careerScenarios.length ? "Complete Career!" : "Next Challenge"}
          </Button>
        )}
      </div>
    </div>
  );
}
