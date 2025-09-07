import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, Dna, Eye, Leaf, Users, Zap } from "lucide-react";

interface BiologyExplorerGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface Exploration {
  id: string;
  title: string;
  category: 'anatomy' | 'cells' | 'ecosystems' | 'genetics';
  description: string;
  image: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  points: number;
  funFact: string;
}

const explorations: Exploration[] = [
  {
    id: "heart_anatomy",
    title: "Human Heart Structure",
    category: 'anatomy',
    description: "Explore the four chambers of the human heart and blood flow",
    image: "❤️",
    question: "Which chamber of the heart pumps oxygenated blood to the body?",
    options: [
      "Left ventricle",
      "Right ventricle", 
      "Left atrium",
      "Right atrium"
    ],
    correct: "Left ventricle",
    explanation: "The left ventricle is the strongest chamber and pumps oxygen-rich blood through the aorta to supply the entire body.",
    points: 75,
    funFact: "Your heart beats about 100,000 times per day, pumping 2,000 gallons of blood!"
  },
  {
    id: "plant_cell",
    title: "Plant Cell Organelles",
    category: 'cells',
    description: "Identify the unique structures found in plant cells",
    image: "🌱",
    question: "Which organelle is responsible for photosynthesis in plant cells?",
    options: [
      "Mitochondria",
      "Chloroplasts",
      "Nucleus",
      "Vacuole"
    ],
    correct: "Chloroplasts",
    explanation: "Chloroplasts contain chlorophyll and are the sites where photosynthesis occurs, converting sunlight into chemical energy.",
    points: 80,
    funFact: "A single leaf can contain over 40 million chloroplasts!"
  },
  {
    id: "food_web",
    title: "Forest Ecosystem Food Web",
    category: 'ecosystems',
    description: "Understand energy flow in a forest ecosystem",
    image: "🌲",
    question: "What happens to energy as it moves up trophic levels?",
    options: [
      "Energy increases at each level",
      "Energy stays the same",
      "Energy decreases by about 90% at each level",
      "Energy doubles at each level"
    ],
    correct: "Energy decreases by about 90% at each level",
    explanation: "Only about 10% of energy is transferred between trophic levels due to metabolic processes and heat loss.",
    points: 85,
    funFact: "This is why there are fewer top predators than herbivores in any ecosystem!"
  },
  {
    id: "dna_structure",
    title: "DNA Double Helix",
    category: 'genetics',
    description: "Explore the structure and base pairing of DNA",
    image: "🧬",
    question: "Which base pairs with Adenine (A) in DNA?",
    options: [
      "Guanine (G)",
      "Cytosine (C)",
      "Thymine (T)",
      "Uracil (U)"
    ],
    correct: "Thymine (T)",
    explanation: "Adenine always pairs with Thymine through two hydrogen bonds, while Guanine pairs with Cytosine through three hydrogen bonds.",
    points: 90,
    funFact: "If you unraveled all the DNA in your body, it would stretch about 10 billion miles!"
  },
  {
    id: "neuron_function",
    title: "Nerve Cell Communication",
    category: 'anatomy',
    description: "Learn how neurons transmit electrical signals",
    image: "🧠",
    question: "What is the gap between two neurons called?",
    options: [
      "Axon",
      "Dendrite",
      "Synapse",
      "Myelin sheath"
    ],
    correct: "Synapse",
    explanation: "The synapse is the junction between neurons where neurotransmitters are released to transmit signals.",
    points: 85,
    funFact: "Your brain has about 86 billion neurons with trillions of synaptic connections!"
  },
  {
    id: "mitosis",
    title: "Cell Division Process",
    category: 'cells',
    description: "Understand the stages of mitotic cell division",
    image: "🔬",
    question: "During which phase do chromosomes align at the cell's equator?",
    options: [
      "Prophase",
      "Metaphase",
      "Anaphase",
      "Telophase"
    ],
    correct: "Metaphase",
    explanation: "During metaphase, chromosomes line up at the metaphase plate (cell's equator) before being separated.",
    points: 80,
    funFact: "Your body produces about 25 million new cells every second through mitosis!"
  }
];

export default function BiologyExplorerGame({ onScoreUpdate, onProgressUpdate }: BiologyExplorerGameProps) {
  const { toast } = useToast();
  const [currentExploration, setCurrentExploration] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [explorerLevel, setExplorerLevel] = useState(1);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [showFunFact, setShowFunFact] = useState(false);

  useEffect(() => {
    const progress = (currentExploration / explorations.length) * 100;
    onProgressUpdate(progress);
  }, [currentExploration, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const exploration = explorations[currentExploration];
    const isCorrect = selectedAnswer === exploration.correct;

    if (isCorrect) {
      const streakBonus = streak * 10;
      const points = exploration.points + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setExplorerLevel(prev => prev + 1);
      
      // Add discovery
      if (!discoveries.includes(exploration.category)) {
        setDiscoveries(prev => [...prev, exploration.category]);
      }
      
      toast({
        title: "Discovery Made! 🔬",
        description: `+${points} points! New biological knowledge unlocked!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Exploration Failed! ❌",
        description: "Study the specimen more carefully!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
    setShowFunFact(true);
  };

  const handleNextExploration = () => {
    if (currentExploration + 1 >= explorations.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Exploration Complete! 🏆",
        description: `All specimens studied! Final score: ${score}`,
      });
    } else {
      setCurrentExploration(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
      setShowFunFact(false);
    }
  };

  const handleRestart = () => {
    setCurrentExploration(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer('');
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    setExplorerLevel(1);
    setDiscoveries([]);
    setShowFunFact(false);
    onProgressUpdate(0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'anatomy': return <Users className="h-4 w-4" />;
      case 'cells': return <Eye className="h-4 w-4" />;
      case 'ecosystems': return <Leaf className="h-4 w-4" />;
      case 'genetics': return <Dna className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anatomy': return 'bg-red-500';
      case 'cells': return 'bg-green-500';
      case 'ecosystems': return 'bg-blue-500';
      case 'genetics': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🔬</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Research Incomplete!</h3>
        <p className="text-gray-600 mb-6">Your exploration ended early. More study is needed!</p>
        <Button onClick={handleRestart} size="lg">
          <Dna className="h-5 w-5 mr-2" />
          Restart Exploration
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Master Biologist!</h3>
        <p className="text-gray-600 mb-4">You've successfully explored all biological specimens and earned your research badge!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-purple-500 text-white px-4 py-2">
            <Dna className="h-4 w-4 mr-2" />
            Level {explorerLevel}
          </Badge>
          <Badge className="bg-blue-500 text-white px-4 py-2">
            <Eye className="h-4 w-4 mr-2" />
            {discoveries.length} Categories
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <Dna className="h-5 w-5 mr-2" />
          New Exploration
        </Button>
      </div>
    );
  }

  const exploration = explorations[currentExploration];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Explorer Status */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-red-50">
          <CardContent className="p-4 text-center">
            <Heart className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-red-800">{lives} Lives</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-4 text-center">
            <Dna className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-blue-800">Level {explorerLevel}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 text-center">
            <Eye className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-800">{discoveries.length} Discoveries</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4 text-center">
            <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-purple-800">Study {currentExploration + 1}/{explorations.length}</p>
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
          Progress: {Math.round((currentExploration / explorations.length) * 100)}%
        </Badge>
      </div>

      {/* Exploration Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{exploration.image}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{exploration.title}</h2>
        <p className="text-gray-600 mb-2">{exploration.description}</p>
        <div className="flex justify-center space-x-2">
          <Badge className={`${getCategoryColor(exploration.category)} text-white`}>
            {getCategoryIcon(exploration.category)}
            <span className="ml-1 capitalize">{exploration.category}</span>
          </Badge>
          <Badge className="bg-indigo-600 text-white">
            {exploration.points} Research Points
          </Badge>
        </div>
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {exploration.question}
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {exploration.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 text-left justify-start ${
                  showExplanation
                    ? option === exploration.correct
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
              <p className="text-green-800 font-medium mb-2">
                {exploration.explanation}
              </p>
              {showFunFact && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Fun Fact:</strong> {exploration.funFact}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discoveries */}
      {discoveries.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Research Areas Explored:</h4>
            <div className="flex flex-wrap gap-2">
              {discoveries.map((category, index) => (
                <Badge key={index} className={`${getCategoryColor(category)} text-white text-xs`}>
                  {getCategoryIcon(category)}
                  <span className="ml-1 capitalize">{category}</span>
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
            <Eye className="h-4 w-4 mr-2" />
            Analyze Specimen
          </Button>
        ) : (
          <Button onClick={handleNextExploration} size="lg" className="px-8">
            {currentExploration + 1 >= explorations.length ? "Complete Research!" : "Next Specimen"}
          </Button>
        )}
      </div>
    </div>
  );
}
