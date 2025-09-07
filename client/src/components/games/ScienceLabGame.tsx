import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, TestTube, Beaker, Zap } from "lucide-react";

interface ScienceLabGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface Experiment {
  id: string;
  title: string;
  description: string;
  materials: string[];
  steps: ExperimentStep[];
  safetyTip: string;
}

interface ExperimentStep {
  instruction: string;
  options: string[];
  correct: string;
  explanation: string;
  visual: string;
}

const experiments: Experiment[] = [
  {
    id: "density",
    title: "Density Tower",
    description: "Create a colorful tower by layering liquids of different densities!",
    materials: ["Honey", "Dish soap", "Water", "Oil"],
    steps: [
      {
        instruction: "Which liquid should go at the bottom of our density tower?",
        options: ["Water", "Honey", "Oil", "Dish soap"],
        correct: "Honey",
        explanation: "Honey is the densest liquid, so it sinks to the bottom!",
        visual: "🍯"
      },
      {
        instruction: "What comes next after honey?",
        options: ["Oil", "Water", "Dish soap"],
        correct: "Dish soap",
        explanation: "Dish soap is denser than water and oil, so it goes second!",
        visual: "🧼"
      },
      {
        instruction: "Which liquid should be third in our tower?",
        options: ["Oil", "Water"],
        correct: "Water",
        explanation: "Water is denser than oil, so it floats on top of soap but below oil!",
        visual: "💧"
      }
    ],
    safetyTip: "Always wash hands after handling materials!"
  },
  {
    id: "volcano",
    title: "Baking Soda Volcano",
    description: "Create an erupting volcano using safe household chemicals!",
    materials: ["Baking soda", "Vinegar", "Food coloring", "Dish soap"],
    steps: [
      {
        instruction: "What should we add first to make our volcano base?",
        options: ["Vinegar", "Baking soda", "Food coloring"],
        correct: "Baking soda",
        explanation: "Baking soda is our base - it reacts with acid to create bubbles!",
        visual: "🏔️"
      },
      {
        instruction: "What makes the volcano 'erupt' when added to baking soda?",
        options: ["Water", "Vinegar", "Soap"],
        correct: "Vinegar",
        explanation: "Vinegar is acidic! When it meets baking soda (a base), they react and create CO2 gas!",
        visual: "🌋"
      },
      {
        instruction: "What can we add to make more bubbles and foam?",
        options: ["Salt", "Dish soap", "Sugar"],
        correct: "Dish soap",
        explanation: "Dish soap helps trap the CO2 gas, making more foam and bubbles!",
        visual: "🫧"
      }
    ],
    safetyTip: "Do this experiment outside or in a sink - it can be messy!"
  }
];

export default function ScienceLabGame({ onScoreUpdate, onProgressUpdate }: ScienceLabGameProps) {
  const { toast } = useToast();
  const [currentExperiment, setCurrentExperiment] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completedMaterials, setCompletedMaterials] = useState<string[]>([]);

  const totalSteps = experiments.reduce((sum, exp) => sum + exp.steps.length, 0);
  const currentStepGlobal = experiments.slice(0, currentExperiment).reduce((sum, exp) => sum + exp.steps.length, 0) + currentStep;

  useEffect(() => {
    const progress = (currentStepGlobal / totalSteps) * 100;
    onProgressUpdate(progress);
  }, [currentStepGlobal, totalSteps, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const experiment = experiments[currentExperiment];
    const step = experiment.steps[currentStep];
    const isCorrect = selectedAnswer === step.correct;

    if (isCorrect) {
      const points = 20 + (streak * 5);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCompletedMaterials(prev => [...prev, step.correct]);
      toast({
        title: "Great Science! 🧪",
        description: `+${points} points! You're a natural scientist!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Oops! Try again 🔬",
        description: "Science is about learning from mistakes!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextStep = () => {
    const experiment = experiments[currentExperiment];
    
    if (currentStep + 1 >= experiment.steps.length) {
      // Experiment complete
      if (currentExperiment + 1 >= experiments.length) {
        // All experiments complete
        setGameComplete(true);
        onProgressUpdate(100);
        toast({
          title: "Science Lab Complete! 🎉",
          description: `You're now a Junior Scientist with ${score} points!`,
        });
      } else {
        // Move to next experiment
        setCurrentExperiment(prev => prev + 1);
        setCurrentStep(0);
        setCompletedMaterials([]);
        toast({
          title: "Experiment Complete! 🧪",
          description: "Ready for the next science adventure?",
        });
      }
    } else {
      // Next step in current experiment
      setCurrentStep(prev => prev + 1);
    }
    
    setSelectedAnswer('');
    setShowExplanation(false);
  };

  const handleRestart = () => {
    setCurrentExperiment(0);
    setCurrentStep(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer('');
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    setCompletedMaterials([]);
    onProgressUpdate(0);
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🔬</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Keep Experimenting!</h3>
        <p className="text-gray-600 mb-6">Every scientist makes mistakes - that's how we learn!</p>
        <Button onClick={handleRestart} size="lg">
          <TestTube className="h-5 w-5 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Junior Scientist!</h3>
        <p className="text-gray-600 mb-4">You've mastered the Science Lab!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-green-500 text-white px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Science Master
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <TestTube className="h-5 w-5 mr-2" />
          New Experiments
        </Button>
      </div>
    );
  }

  const experiment = experiments[currentExperiment];
  const step = experiment.steps[currentStep];

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
              <Zap className="h-4 w-4 mr-1" />
              {streak} Streak
            </Badge>
          )}
        </div>
        <Badge variant="outline">
          Step {currentStepGlobal + 1} of {totalSteps}
        </Badge>
      </div>

      {/* Current Experiment Info */}
      <Card className="mb-6 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <TestTube className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-bold text-blue-800">{experiment.title}</h2>
          </div>
          <p className="text-blue-700 text-sm mb-3">{experiment.description}</p>
          
          {/* Materials */}
          <div className="mb-3">
            <p className="text-sm font-medium text-blue-800 mb-2">Materials:</p>
            <div className="flex flex-wrap gap-2">
              {experiment.materials.map((material, index) => (
                <Badge
                  key={index}
                  className={`${
                    completedMaterials.includes(material)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {material}
                </Badge>
              ))}
            </div>
          </div>

          {/* Safety Tip */}
          <div className="bg-yellow-100 p-2 rounded-lg">
            <p className="text-yellow-800 text-xs">
              <strong>Safety:</strong> {experiment.safetyTip}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Experiment Visual */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{step.visual}</div>
        <p className="text-sm text-gray-600">Step {currentStep + 1} of {experiment.steps.length}</p>
      </div>

      {/* Current Step */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {step.instruction}
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {step.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 text-left justify-start ${
                  showExplanation
                    ? option === step.correct
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
                {step.explanation}
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
            <TestTube className="h-4 w-4 mr-2" />
            Test Hypothesis
          </Button>
        ) : (
          <Button onClick={handleNextStep} size="lg" className="px-8">
            <TestTube className="h-4 w-4 mr-2" />
            {currentStep + 1 >= experiment.steps.length
              ? currentExperiment + 1 >= experiments.length
                ? "Complete Lab!"
                : "Next Experiment"
              : "Next Step"}
          </Button>
        )}
      </div>
    </div>
  );
}
