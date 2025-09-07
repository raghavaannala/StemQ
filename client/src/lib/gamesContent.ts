import { 
  Calculator, 
  Beaker, 
  PenTool, 
  Globe,
  Atom,
  Dna,
  BookOpen,
  Microscope,
  Zap,
  Brain,
  Gamepad2,
  Target,
  Puzzle,
  FlaskConical,
  Sword,
  Telescope,
  Users,
  Trophy
} from "lucide-react";

export interface Game {
  id: string;
  title: string;
  description: string;
  subject: string;
  icon: any;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  points: number;
  features: string[];
  gameType: 'puzzle' | 'simulation' | 'quiz' | 'strategy' | 'adventure';
}

export interface GradeGames {
  grade: string;
  name: string;
  style: string;
  games: Game[];
}

// Middle School (Grades 6-8) Games
const grade6to8Games: GradeGames = {
  grade: "6-8",
  name: "Middle School Games",
  style: "Cartoonish, colorful, lots of hints and rewards (badges, stars)",
  games: [
    {
      id: "math-puzzle-adventure",
      title: "Math Puzzle Adventure",
      description: "Help our hero cross magical levels by solving simple arithmetic and geometry puzzles. Collect treasures and unlock new worlds!",
      subject: "Basic Math",
      icon: Calculator,
      color: "bg-blue-500",
      difficulty: 'easy',
      estimatedTime: "15-20 min",
      points: 50,
      features: ["Colorful animations", "Character progression", "Hint system", "Star rewards"],
      gameType: 'adventure'
    },
    {
      id: "science-lab-simulation",
      title: "Science Lab Simulation",
      description: "Become a young scientist! Mix colors, build simple circuits, and discover food chains through fun drag-and-drop experiments.",
      subject: "Science Fundamentals",
      icon: Beaker,
      color: "bg-green-500",
      difficulty: 'easy',
      estimatedTime: "20-25 min",
      points: 60,
      features: ["Virtual experiments", "Drag & drop interface", "Safe simulations", "Discovery badges"],
      gameType: 'simulation'
    },
    {
      id: "grammar-quest",
      title: "Grammar Quest",
      description: "Embark on a word adventure! Match words, fill blanks, and build sentences to help characters complete their magical journey.",
      subject: "English Grammar",
      icon: PenTool,
      color: "bg-red-500",
      difficulty: 'easy',
      estimatedTime: "10-15 min",
      points: 40,
      features: ["Word matching", "Sentence building", "Grammar tips", "Progress tracking"],
      gameType: 'puzzle'
    },
    {
      id: "history-quiz-maze",
      title: "History & Social Studies Quiz Maze",
      description: "Navigate through time! Answer questions about history and social studies to unlock new parts of an exciting maze adventure.",
      subject: "Social Studies",
      icon: Globe,
      color: "bg-orange-500",
      difficulty: 'easy',
      estimatedTime: "15-20 min",
      points: 45,
      features: ["Interactive maze", "Historical facts", "Progressive unlocking", "Achievement system"],
      gameType: 'quiz'
    }
  ]
};

// High School (Grades 9-10) Games
const grade9to10Games: GradeGames = {
  grade: "9-10",
  name: "High School Games",
  style: "Slightly more realistic, with scenarios connecting to real-world problems",
  games: [
    {
      id: "equation-battle",
      title: "Equation Battle",
      description: "Power up your mathematical warrior! Solve algebraic equations and geometric problems to defeat challenges and unlock new battle arenas.",
      subject: "Algebra & Geometry",
      icon: Sword,
      color: "bg-blue-600",
      difficulty: 'medium',
      estimatedTime: "20-30 min",
      points: 80,
      features: ["Battle mechanics", "Equation solving", "Character upgrades", "Arena progression"],
      gameType: 'strategy'
    },
    {
      id: "physics-simulation",
      title: "Physics Simulation Game",
      description: "Experiment with real physics! Adjust variables in projectile motion, build circuits, and balance forces to see immediate effects.",
      subject: "Physics & Chemistry",
      icon: Atom,
      color: "bg-purple-600",
      difficulty: 'medium',
      estimatedTime: "25-35 min",
      points: 90,
      features: ["Variable manipulation", "Real-time physics", "Experiment design", "Data analysis"],
      gameType: 'simulation'
    },
    {
      id: "chemistry-mix-match",
      title: "Chemistry Mix & Match",
      description: "Master the virtual lab! Safely mix chemicals, form compounds, and unlock achievements while learning molecular structures.",
      subject: "Physics & Chemistry",
      icon: FlaskConical,
      color: "bg-green-600",
      difficulty: 'medium',
      estimatedTime: "20-25 min",
      points: 75,
      features: ["Safe chemical mixing", "Compound formation", "Molecular visualization", "Lab achievements"],
      gameType: 'simulation'
    },
    {
      id: "biology-explorer",
      title: "Biology Explorer",
      description: "Explore the world of life! Label human anatomy, identify plant cells, and understand ecosystems through interactive exploration.",
      subject: "Biology",
      icon: Dna,
      color: "bg-teal-600",
      difficulty: 'medium',
      estimatedTime: "20-30 min",
      points: 85,
      features: ["Anatomy labeling", "Cell identification", "Ecosystem mapping", "Interactive diagrams"],
      gameType: 'quiz'
    },
    {
      id: "story-builder",
      title: "Story Builder",
      description: "Craft compelling narratives! Build stories by choosing correct grammar and vocabulary at each stage, creating your literary masterpiece.",
      subject: "Advanced English",
      icon: BookOpen,
      color: "bg-red-600",
      difficulty: 'medium',
      estimatedTime: "25-30 min",
      points: 70,
      features: ["Story creation", "Grammar choices", "Vocabulary building", "Creative writing"],
      gameType: 'adventure'
    }
  ]
};

// Senior High (Grades 11-12) Games
const grade11to12Games: GradeGames = {
  grade: "11-12",
  name: "Senior High Games",
  style: "More professional, futuristic, problem-solving oriented",
  games: [
    {
      id: "math-strategy-game",
      title: "Math Strategy Game",
      description: "Crack the code to success! Solve complex calculus and probability problems to unlock higher missions and break into secure systems.",
      subject: "Advanced Mathematics",
      icon: Brain,
      color: "bg-blue-700",
      difficulty: 'hard',
      estimatedTime: "30-45 min",
      points: 120,
      features: ["Complex problem solving", "Mission progression", "Code breaking", "Strategic thinking"],
      gameType: 'strategy'
    },
    {
      id: "virtual-research-lab",
      title: "Virtual Research Lab",
      description: "Conduct cutting-edge research! Design and test hypotheses in genetics and organic chemistry through advanced virtual experiments.",
      subject: "Advanced Sciences",
      icon: Microscope,
      color: "bg-purple-700",
      difficulty: 'hard',
      estimatedTime: "35-50 min",
      points: 140,
      features: ["Hypothesis testing", "Advanced experiments", "Data collection", "Research methodology"],
      gameType: 'simulation'
    },
    {
      id: "case-study-challenges",
      title: "Case Study Challenges",
      description: "Solve real-world problems! Analyze climate change data, design bridges using physics, and tackle complex engineering challenges.",
      subject: "Advanced Sciences",
      icon: Target,
      color: "bg-green-700",
      difficulty: 'hard',
      estimatedTime: "40-60 min",
      points: 150,
      features: ["Real-world scenarios", "Data analysis", "Engineering design", "Problem solving"],
      gameType: 'strategy'
    },
    {
      id: "literature-debate-simulator",
      title: "Literature Debate Simulator",
      description: "Engage in intellectual discourse! Navigate literary debates and comprehension challenges through sophisticated dialogue trees.",
      subject: "Literature & Composition",
      icon: Users,
      color: "bg-red-700",
      difficulty: 'hard',
      estimatedTime: "25-40 min",
      points: 110,
      features: ["Literary analysis", "Debate mechanics", "Critical thinking", "Dialogue trees"],
      gameType: 'quiz'
    },
    {
      id: "career-simulation",
      title: "Career Simulation Game",
      description: "Explore your future! Take on career missions as an engineer, scientist, or doctor by solving STEM challenges linked to real professions.",
      subject: "Research Methods",
      icon: Trophy,
      color: "bg-indigo-700",
      difficulty: 'hard',
      estimatedTime: "45-60 min",
      points: 160,
      features: ["Career exploration", "Professional challenges", "STEM applications", "Future planning"],
      gameType: 'adventure'
    }
  ]
};

export const gradeGamesData: GradeGames[] = [
  grade6to8Games,
  grade9to10Games,
  grade11to12Games
];

export const getGamesByGrade = (grade: string): GradeGames | undefined => {
  return gradeGamesData.find(games => games.grade === grade);
};

export const getGameById = (grade: string, gameId: string): Game | undefined => {
  const gradeGames = getGamesByGrade(grade);
  return gradeGames?.games.find(game => game.id === gameId);
};
