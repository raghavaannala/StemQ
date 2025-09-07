import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, FlaskConical, Atom, Zap, Target, AlertTriangle } from "lucide-react";

interface ChemistryMixMatchGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface Compound {
  id: string;
  name: string;
  formula: string;
  elements: string[];
  description: string;
  safetyLevel: 'safe' | 'caution' | 'danger';
  points: number;
  emoji: string;
}

interface Reaction {
  id: string;
  title: string;
  description: string;
  reactants: string[];
  products: string[];
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  points: number;
  safetyTip: string;
}

const compounds: Compound[] = [
  {
    id: "water",
    name: "Water",
    formula: "H₂O",
    elements: ["H", "H", "O"],
    description: "Essential for life, polar molecule",
    safetyLevel: 'safe',
    points: 20,
    emoji: "💧"
  },
  {
    id: "salt",
    name: "Sodium Chloride",
    formula: "NaCl",
    elements: ["Na", "Cl"],
    description: "Common table salt, ionic compound",
    safetyLevel: 'safe',
    points: 25,
    emoji: "🧂"
  },
  {
    id: "co2",
    name: "Carbon Dioxide",
    formula: "CO₂",
    elements: ["C", "O", "O"],
    description: "Greenhouse gas, product of respiration",
    safetyLevel: 'caution',
    points: 30,
    emoji: "🌫️"
  },
  {
    id: "hcl",
    name: "Hydrochloric Acid",
    formula: "HCl",
    elements: ["H", "Cl"],
    description: "Strong acid, found in stomach",
    safetyLevel: 'danger',
    points: 40,
    emoji: "⚠️"
  }
];

const reactions: Reaction[] = [
  {
    id: "neutralization",
    title: "Acid-Base Neutralization",
    description: "Mix hydrochloric acid with sodium hydroxide",
    reactants: ["HCl", "NaOH"],
    products: ["NaCl", "H₂O"],
    question: "What are the products of this neutralization reaction?",
    options: [
      "NaCl + H₂O",
      "Na₂O + HCl",
      "NaH + ClOH",
      "NaCl₂ + H₂"
    ],
    correct: "NaCl + H₂O",
    explanation: "Acid + Base → Salt + Water. HCl + NaOH → NaCl + H₂O",
    points: 80,
    safetyTip: "Always add acid to water, never water to acid!"
  },
  {
    id: "combustion",
    title: "Methane Combustion",
    description: "Burn methane in the presence of oxygen",
    reactants: ["CH₄", "O₂"],
    products: ["CO₂", "H₂O"],
    question: "What type of reaction is methane combustion?",
    options: [
      "Exothermic reaction releasing energy",
      "Endothermic reaction absorbing energy",
      "Decomposition reaction",
      "Synthesis reaction"
    ],
    correct: "Exothermic reaction releasing energy",
    explanation: "Combustion reactions release energy in the form of heat and light, making them exothermic.",
    points: 90,
    safetyTip: "Ensure proper ventilation when working with flammable gases!"
  },
  {
    id: "precipitation",
    title: "Silver Chloride Precipitation",
    description: "Mix silver nitrate with sodium chloride",
    reactants: ["AgNO₃", "NaCl"],
    products: ["AgCl", "NaNO₃"],
    question: "Why does a white precipitate form?",
    options: [
      "AgCl is insoluble in water",
      "NaNO₃ crystallizes out",
      "The solution becomes acidic",
      "Temperature increases rapidly"
    ],
    correct: "AgCl is insoluble in water",
    explanation: "Silver chloride (AgCl) is insoluble in water and forms a white precipitate when Ag⁺ and Cl⁻ ions combine.",
    points: 100,
    safetyTip: "Silver compounds can stain skin and clothing permanently!"
  },
  {
    id: "decomposition",
    title: "Water Electrolysis",
    description: "Decompose water using electrical energy",
    reactants: ["H₂O"],
    products: ["H₂", "O₂"],
    question: "What is the ratio of hydrogen to oxygen gas produced?",
    options: [
      "2:1 (H₂:O₂)",
      "1:2 (H₂:O₂)",
      "1:1 (H₂:O₂)",
      "3:1 (H₂:O₂)"
    ],
    correct: "2:1 (H₂:O₂)",
    explanation: "From 2H₂O → 2H₂ + O₂, we get 2 molecules of hydrogen for every 1 molecule of oxygen.",
    points: 85,
    safetyTip: "Hydrogen gas is highly flammable - avoid sparks and flames!"
  },
  {
    id: "synthesis",
    title: "Ammonia Synthesis",
    description: "Combine nitrogen and hydrogen to form ammonia",
    reactants: ["N₂", "H₂"],
    products: ["NH₃"],
    question: "This reaction is important for producing:",
    options: [
      "Fertilizers for agriculture",
      "Cleaning products only",
      "Pharmaceutical drugs",
      "Plastic materials"
    ],
    correct: "Fertilizers for agriculture",
    explanation: "The Haber process produces ammonia, which is essential for making nitrogen-based fertilizers that feed billions of people.",
    points: 95,
    safetyTip: "High pressure reactions require specialized equipment and safety protocols!"
  }
];

export default function ChemistryMixMatchGame({ onScoreUpdate, onProgressUpdate }: ChemistryMixMatchGameProps) {
  const { toast } = useToast();
  const [currentReaction, setCurrentReaction] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [labLevel, setLabLevel] = useState(1);
  const [discoveredCompounds, setDiscoveredCompounds] = useState<string[]>([]);
  const [showSafety, setShowSafety] = useState(true);

  useEffect(() => {
    const progress = (currentReaction / reactions.length) * 100;
    onProgressUpdate(progress);
  }, [currentReaction, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const reaction = reactions[currentReaction];
    const isCorrect = selectedAnswer === reaction.correct;

    if (isCorrect) {
      const streakBonus = streak * 15;
      const points = reaction.points + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setLabLevel(prev => prev + 1);
      
      // Add discovered compounds
      const newCompounds = reaction.products.filter(p => !discoveredCompounds.includes(p));
      setDiscoveredCompounds(prev => [...prev, ...newCompounds]);
      
      toast({
        title: "Reaction Successful! ⚗️",
        description: `+${points} points! New compounds discovered!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Reaction Failed! ❌",
        description: "Check your understanding and try again!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextReaction = () => {
    if (currentReaction + 1 >= reactions.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Lab Complete! 🏆",
        description: `All reactions mastered! Final score: ${score}`,
      });
    } else {
      setCurrentReaction(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
      setShowSafety(true);
    }
  };

  const handleRestart = () => {
    setCurrentReaction(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer('');
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    setLabLevel(1);
    setDiscoveredCompounds([]);
    setShowSafety(true);
    onProgressUpdate(0);
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'safe': return 'bg-green-500';
      case 'caution': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">💥</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Lab Accident!</h3>
        <p className="text-gray-600 mb-6">Too many failed reactions. Lab access revoked for safety!</p>
        <Button onClick={handleRestart} size="lg">
          <FlaskConical className="h-5 w-5 mr-2" />
          Restart Lab Session
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Master Chemist!</h3>
        <p className="text-gray-600 mb-4">You've mastered all chemical reactions and earned your lab certification!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-purple-500 text-white px-4 py-2">
            <FlaskConical className="h-4 w-4 mr-2" />
            Level {labLevel}
          </Badge>
          <Badge className="bg-blue-500 text-white px-4 py-2">
            <Atom className="h-4 w-4 mr-2" />
            {discoveredCompounds.length} Compounds
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <FlaskConical className="h-5 w-5 mr-2" />
          New Lab Session
        </Button>
      </div>
    );
  }

  const reaction = reactions[currentReaction];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Lab Status */}
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
            <p className="text-sm font-medium text-blue-800">Level {labLevel}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 text-center">
            <Atom className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-800">{discoveredCompounds.length} Compounds</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4 text-center">
            <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-purple-800">Reaction {currentReaction + 1}/{reactions.length}</p>
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
          Lab Progress: {Math.round((currentReaction / reactions.length) * 100)}%
        </Badge>
      </div>

      {/* Safety Warning */}
      {showSafety && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-orange-800">Safety First!</h3>
            </div>
            <p className="text-orange-700 mb-4">{reaction.safetyTip}</p>
            <Button onClick={() => setShowSafety(false)} variant="outline" size="sm">
              I Understand - Proceed Safely
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reaction Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">⚗️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{reaction.title}</h2>
        <p className="text-gray-600 mb-2">{reaction.description}</p>
        <Badge className="bg-indigo-600 text-white">
          {reaction.points} Lab Points
        </Badge>
      </div>

      {/* Chemical Equation */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chemical Equation</h3>
            <div className="flex items-center justify-center space-x-4 text-2xl font-mono">
              <span className="text-blue-600">{reaction.reactants.join(" + ")}</span>
              <span className="text-gray-500">→</span>
              <span className="text-green-600">{reaction.products.join(" + ")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {reaction.question}
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {reaction.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 text-left justify-start ${
                  showExplanation
                    ? option === reaction.correct
                      ? "bg-green-500 text-white"
                      : selectedAnswer === option
                      ? "bg-red-500 text-white"
                      : ""
                    : ""
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={showExplanation || showSafety}
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
                {reaction.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discovered Compounds */}
      {discoveredCompounds.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Discovered Compounds:</h4>
            <div className="flex flex-wrap gap-2">
              {discoveredCompounds.map((compound, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {compound}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {!showSafety && (
        <div className="flex justify-center space-x-4">
          {!showExplanation ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              size="lg"
              className="px-8 bg-indigo-600 hover:bg-indigo-700"
            >
              <FlaskConical className="h-4 w-4 mr-2" />
              Mix Chemicals
            </Button>
          ) : (
            <Button onClick={handleNextReaction} size="lg" className="px-8">
              {currentReaction + 1 >= reactions.length ? "Complete Lab!" : "Next Reaction"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
