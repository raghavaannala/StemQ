import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, Microscope, FlaskConical, Atom, BookOpen, Zap } from "lucide-react";

interface VirtualResearchLabGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface Experiment {
  id: string;
  title: string;
  field: string;
  description: string;
  hypothesis: string;
  procedure: string[];
  variables: {
    name: string;
    type: 'independent' | 'dependent' | 'controlled';
    options: string[];
  }[];
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  points: number;
  emoji: string;
}

const experiments: Experiment[] = [
  {
    id: "dna_extraction",
    title: "DNA Extraction Protocol",
    field: "Molecular Biology",
    description: "Extract and analyze DNA from plant cells using standard laboratory techniques",
    hypothesis: "Plant cells contain extractable DNA that can be visualized using ethanol precipitation",
    procedure: [
      "Crush plant tissue to break cell walls",
      "Add salt solution to break down proteins",
      "Add detergent to dissolve cell membranes",
      "Filter mixture to remove debris",
      "Add cold ethanol to precipitate DNA"
    ],
    variables: [
      {
        name: "Temperature",
        type: 'controlled',
        options: ["4°C", "25°C", "37°C"]
      },
      {
        name: "Salt concentration",
        type: 'independent',
        options: ["0.5M", "1.0M", "1.5M"]
      },
      {
        name: "DNA yield",
        type: 'dependent',
        options: ["Low", "Medium", "High"]
      }
    ],
    question: "What is the primary function of the salt solution in DNA extraction?",
    options: [
      "To break down cell walls",
      "To denature proteins and neutralize charges",
      "To dissolve the cell membrane",
      "To precipitate the DNA"
    ],
    correct: "To denature proteins and neutralize charges",
    explanation: "Salt solution helps denature proteins that are bound to DNA and neutralizes the negative charges on DNA, making extraction more efficient.",
    points: 180,
    emoji: "🧬"
  },
  {
    id: "enzyme_kinetics",
    title: "Enzyme Kinetics Study",
    field: "Biochemistry",
    description: "Investigate the effect of substrate concentration on enzyme activity using catalase",
    hypothesis: "Enzyme activity increases with substrate concentration until saturation point",
    procedure: [
      "Prepare enzyme solution (catalase)",
      "Prepare substrate solutions (H₂O₂) at different concentrations",
      "Mix enzyme with substrate and measure O₂ production",
      "Record reaction rates at each concentration",
      "Plot Michaelis-Menten curve"
    ],
    variables: [
      {
        name: "Substrate concentration",
        type: 'independent',
        options: ["0.1M", "0.5M", "1.0M"]
      },
      {
        name: "Reaction rate",
        type: 'dependent',
        options: ["Slow", "Medium", "Fast"]
      },
      {
        name: "Temperature",
        type: 'controlled',
        options: ["25°C", "37°C", "45°C"]
      }
    ],
    question: "At what point does increasing substrate concentration no longer increase reaction rate?",
    options: [
      "When substrate is depleted",
      "When enzyme becomes saturated (Vmax)",
      "When temperature is too high",
      "When pH becomes acidic"
    ],
    correct: "When enzyme becomes saturated (Vmax)",
    explanation: "At Vmax, all enzyme active sites are occupied, so further increases in substrate concentration don't increase the reaction rate.",
    points: 200,
    emoji: "⚗️"
  },
  {
    id: "spectrophotometry",
    title: "Protein Quantification",
    field: "Analytical Chemistry",
    description: "Use spectrophotometry to determine protein concentration using Bradford assay",
    hypothesis: "Protein concentration correlates linearly with absorbance at 595nm in Bradford assay",
    procedure: [
      "Prepare protein standards of known concentrations",
      "Add Bradford reagent to samples and standards",
      "Incubate for 5 minutes at room temperature",
      "Measure absorbance at 595nm",
      "Create standard curve and calculate unknown concentrations"
    ],
    variables: [
      {
        name: "Protein concentration",
        type: 'independent',
        options: ["0.1 mg/mL", "0.5 mg/mL", "1.0 mg/mL"]
      },
      {
        name: "Absorbance at 595nm",
        type: 'dependent',
        options: ["0.2", "0.6", "1.0"]
      },
      {
        name: "Incubation time",
        type: 'controlled',
        options: ["2 min", "5 min", "10 min"]
      }
    ],
    question: "Why is a standard curve necessary in spectrophotometric analysis?",
    options: [
      "To calibrate the spectrophotometer",
      "To establish relationship between absorbance and concentration",
      "To check for contamination",
      "To measure background absorbance"
    ],
    correct: "To establish relationship between absorbance and concentration",
    explanation: "A standard curve with known concentrations allows us to determine unknown concentrations by comparing their absorbance values.",
    points: 190,
    emoji: "📊"
  },
  {
    id: "chromatography",
    title: "Amino Acid Separation",
    field: "Analytical Chemistry",
    description: "Separate and identify amino acids using thin-layer chromatography (TLC)",
    hypothesis: "Different amino acids will migrate at different rates based on their polarity",
    procedure: [
      "Prepare TLC plate with silica gel",
      "Apply amino acid samples to starting line",
      "Place plate in developing chamber with mobile phase",
      "Allow solvent to migrate up the plate",
      "Visualize spots using ninhydrin spray"
    ],
    variables: [
      {
        name: "Mobile phase polarity",
        type: 'independent',
        options: ["Low", "Medium", "High"]
      },
      {
        name: "Rf value",
        type: 'dependent',
        options: ["0.2", "0.5", "0.8"]
      },
      {
        name: "Temperature",
        type: 'controlled',
        options: ["20°C", "25°C", "30°C"]
      }
    ],
    question: "What does the Rf value represent in chromatography?",
    options: [
      "The rate of flow of the mobile phase",
      "The ratio of distances traveled by compound and solvent front",
      "The retention factor of the stationary phase",
      "The relative fluorescence of the compound"
    ],
    correct: "The ratio of distances traveled by compound and solvent front",
    explanation: "Rf = distance traveled by compound / distance traveled by solvent front. It's a characteristic value for each compound under specific conditions.",
    points: 170,
    emoji: "🎨"
  },
  {
    id: "pcr_analysis",
    title: "PCR Amplification",
    field: "Molecular Biology",
    description: "Amplify specific DNA sequences using Polymerase Chain Reaction (PCR)",
    hypothesis: "PCR can exponentially amplify target DNA sequences through repeated thermal cycling",
    procedure: [
      "Design specific primers for target sequence",
      "Prepare PCR reaction mix with DNA template, primers, dNTPs, and Taq polymerase",
      "Program thermal cycler: denaturation (95°C), annealing (55°C), extension (72°C)",
      "Run 30-35 cycles of amplification",
      "Analyze products using gel electrophoresis"
    ],
    variables: [
      {
        name: "Annealing temperature",
        type: 'independent',
        options: ["50°C", "55°C", "60°C"]
      },
      {
        name: "Amplification efficiency",
        type: 'dependent',
        options: ["Low", "Optimal", "High"]
      },
      {
        name: "Cycle number",
        type: 'controlled',
        options: ["25", "30", "35"]
      }
    ],
    question: "What happens during the annealing step of PCR?",
    options: [
      "DNA strands separate",
      "Primers bind to complementary sequences",
      "DNA polymerase extends the primers",
      "Products are denatured"
    ],
    correct: "Primers bind to complementary sequences",
    explanation: "During annealing, the temperature is lowered to allow primers to bind (anneal) to their complementary sequences on the template DNA.",
    points: 210,
    emoji: "🔬"
  }
];

export default function VirtualResearchLabGame({ onScoreUpdate, onProgressUpdate }: VirtualResearchLabGameProps) {
  const { toast } = useToast();
  const [currentExperiment, setCurrentExperiment] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [researchLevel, setResearchLevel] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [showProcedure, setShowProcedure] = useState(true);

  useEffect(() => {
    const progress = (currentExperiment / experiments.length) * 100;
    onProgressUpdate(progress);
  }, [currentExperiment, onProgressUpdate]);

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
    const isCorrect = selectedAnswer === experiment.correct;

    if (isCorrect) {
      const streakBonus = streak * 25;
      const points = experiment.points + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setResearchLevel(prev => prev + 1);
      
      toast({
        title: "Experiment Successful! 🧪",
        description: `+${points} points! Research level increased!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Experiment Failed! ❌",
        description: "Hypothesis not supported. Review your methodology!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextExperiment = () => {
    if (currentExperiment + 1 >= experiments.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Research Complete! 🏆",
        description: `All experiments completed! Final score: ${score}`,
      });
    } else {
      setCurrentExperiment(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
      setCurrentStep(0);
      setShowProcedure(true);
    }
  };

  const handleRestart = () => {
    setCurrentExperiment(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer('');
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    setResearchLevel(1);
    setCurrentStep(0);
    setShowProcedure(true);
    onProgressUpdate(0);
  };

  const handleNextStep = () => {
    const experiment = experiments[currentExperiment];
    if (currentStep < experiment.procedure.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowProcedure(false);
    }
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🚫</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Research Terminated!</h3>
        <p className="text-gray-600 mb-6">Too many failed experiments. Your research grant has been revoked!</p>
        <Button onClick={handleRestart} size="lg">
          <Microscope className="h-5 w-5 mr-2" />
          New Research Project
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Research Breakthrough!</h3>
        <p className="text-gray-600 mb-4">You've successfully completed all experiments and made significant scientific discoveries!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-purple-500 text-white px-4 py-2">
            <Microscope className="h-4 w-4 mr-2" />
            Level {researchLevel}
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <Microscope className="h-5 w-5 mr-2" />
          New Research Campaign
        </Button>
      </div>
    );
  }

  const experiment = experiments[currentExperiment];

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
            <Microscope className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-blue-800">Level {researchLevel}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 text-center">
            <FlaskConical className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-800">{experiment.field}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4 text-center">
            <Atom className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-purple-800">Exp {currentExperiment + 1}/{experiments.length}</p>
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
          Research Progress: {Math.round((currentExperiment / experiments.length) * 100)}%
        </Badge>
      </div>

      {/* Experiment Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{experiment.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{experiment.title}</h2>
        <p className="text-gray-600 mb-2">{experiment.description}</p>
        <Badge className="bg-indigo-600 text-white">
          {experiment.points} Research Points
        </Badge>
      </div>

      {/* Hypothesis */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Hypothesis</h3>
          </div>
          <p className="text-gray-700 italic">{experiment.hypothesis}</p>
        </CardContent>
      </Card>

      {/* Procedure or Question */}
      {showProcedure ? (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Experimental Procedure</h3>
              </div>
              <Badge variant="outline">
                Step {currentStep + 1} of {experiment.procedure.length}
              </Badge>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800 font-medium">
                {experiment.procedure[currentStep]}
              </p>
            </div>

            {/* Variables */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {experiment.variables.map((variable, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {variable.name}
                  </p>
                  <Badge 
                    className={`text-xs ${
                      variable.type === 'independent' ? 'bg-blue-500' :
                      variable.type === 'dependent' ? 'bg-red-500' : 'bg-gray-500'
                    } text-white`}
                  >
                    {variable.type}
                  </Badge>
                </div>
              ))}
            </div>

            <Button onClick={handleNextStep} className="w-full">
              {currentStep < experiment.procedure.length - 1 ? "Next Step" : "Begin Analysis"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Analysis Question
            </h3>
            <p className="text-gray-700 mb-6">{experiment.question}</p>
            
            <div className="grid grid-cols-1 gap-3">
              {experiment.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`p-4 text-left justify-start ${
                    showExplanation
                      ? option === experiment.correct
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
                  {experiment.explanation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {!showProcedure && (
        <div className="flex justify-center space-x-4">
          {!showExplanation ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              size="lg"
              className="px-8 bg-indigo-600 hover:bg-indigo-700"
            >
              <FlaskConical className="h-4 w-4 mr-2" />
              Submit Analysis
            </Button>
          ) : (
            <Button onClick={handleNextExperiment} size="lg" className="px-8">
              {currentExperiment + 1 >= experiments.length ? "Complete Research!" : "Next Experiment"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
