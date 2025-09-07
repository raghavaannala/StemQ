import { 
  Calculator, 
  Atom, 
  Dna, 
  PenTool, 
  Globe,
  Beaker,
  BookOpen,
  Microscope,
  Zap,
  TreePine,
  Users,
  History
} from "lucide-react";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  quizzes: Quiz[];
}

export interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  topics: Topic[];
}

export interface GradeData {
  grade: string;
  name: string;
  subjects: Subject[];
}

// Grade 6-8 Content (Middle School)
const grade6to8Content: GradeData = {
  grade: "6-8",
  name: "Middle School",
  subjects: [
    {
      id: "basic-math",
      name: "Basic Mathematics",
      icon: Calculator,
      color: "bg-blue-500",
      description: "Numbers, basic operations, and simple geometry",
      topics: [
        {
          id: "whole-numbers",
          name: "Whole Numbers",
          description: "Addition, subtraction, multiplication, and division",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "whole-numbers-quiz-1",
              title: "Basic Operations",
              points: 30,
              difficulty: 'easy',
              questions: [
                {
                  id: "wn1",
                  question: "What is 25 + 17?",
                  options: ["42", "32", "52"],
                  correct: 0,
                  explanation: "25 + 17 = 42. Add the ones place first: 5 + 7 = 12, then the tens: 2 + 1 = 3, plus 1 from carrying = 4."
                },
                {
                  id: "wn2",
                  question: "What is 8 × 6?",
                  options: ["48", "46", "54"],
                  correct: 0,
                  explanation: "8 × 6 = 48. You can think of it as 8 groups of 6 or 6 groups of 8."
                }
              ]
            }
          ]
        },
        {
          id: "fractions-basics",
          name: "Introduction to Fractions",
          description: "Understanding parts of a whole",
          unlocked: false,
          completed: false,
          quizzes: [
            {
              id: "fractions-quiz-1",
              title: "What is a Fraction?",
              points: 30,
              difficulty: 'easy',
              questions: [
                {
                  id: "f1",
                  question: "Which fraction represents half of a pizza?",
                  options: ["1/2", "1/4", "2/3"],
                  correct: 0,
                  explanation: "1/2 means 1 part out of 2 equal parts, which is exactly half."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "science-basics",
      name: "Science Fundamentals",
      icon: Beaker,
      color: "bg-green-500",
      description: "Basic concepts in life, earth, and physical science",
      topics: [
        {
          id: "living-things",
          name: "Living Things",
          description: "Plants, animals, and their basic needs",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "living-things-quiz-1",
              title: "What Makes Something Alive?",
              points: 30,
              difficulty: 'easy',
              questions: [
                {
                  id: "lt1",
                  question: "What do all living things need to survive?",
                  options: ["Food, water, and air", "Only food", "Only water"],
                  correct: 0,
                  explanation: "All living things need food for energy, water to stay hydrated, and air (oxygen) to breathe."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "english-basics",
      name: "English Grammar",
      icon: PenTool,
      color: "bg-red-500",
      description: "Basic grammar, vocabulary, and writing skills",
      topics: [
        {
          id: "parts-of-speech",
          name: "Parts of Speech",
          description: "Nouns, verbs, adjectives, and more",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "parts-speech-quiz-1",
              title: "Identifying Words",
              points: 30,
              difficulty: 'easy',
              questions: [
                {
                  id: "ps1",
                  question: "In the sentence 'The big dog runs fast', which word is a noun?",
                  options: ["dog", "big", "runs"],
                  correct: 0,
                  explanation: "A noun is a person, place, thing, or idea. 'Dog' is a thing, so it's a noun."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "social-studies",
      name: "Social Studies",
      icon: Globe,
      color: "bg-orange-500",
      description: "Geography, history, and communities",
      topics: [
        {
          id: "our-community",
          name: "Our Community",
          description: "Understanding neighborhoods and communities",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "community-quiz-1",
              title: "Community Helpers",
              points: 30,
              difficulty: 'easy',
              questions: [
                {
                  id: "c1",
                  question: "Who helps keep our community safe?",
                  options: ["Police officers and firefighters", "Only teachers", "Only doctors"],
                  correct: 0,
                  explanation: "Police officers and firefighters work together to keep our communities safe from crime and fires."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Grade 9-10 Content (High School)
const grade9to10Content: GradeData = {
  grade: "9-10",
  name: "High School",
  subjects: [
    {
      id: "algebra-geometry",
      name: "Algebra & Geometry",
      icon: Calculator,
      color: "bg-blue-600",
      description: "Algebraic expressions, equations, and geometric concepts",
      topics: [
        {
          id: "linear-equations",
          name: "Linear Equations",
          description: "Solving equations with one variable",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "linear-eq-quiz-1",
              title: "Solving for X",
              points: 50,
              difficulty: 'medium',
              questions: [
                {
                  id: "le1",
                  question: "Solve for x: 2x + 5 = 13",
                  options: ["x = 4", "x = 6", "x = 9"],
                  correct: 0,
                  explanation: "Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4."
                },
                {
                  id: "le2",
                  question: "What is the slope of the line y = 3x + 2?",
                  options: ["3", "2", "5"],
                  correct: 0,
                  explanation: "In the form y = mx + b, m is the slope. Here, m = 3."
                }
              ]
            }
          ]
        },
        {
          id: "geometry-basics",
          name: "Basic Geometry",
          description: "Angles, triangles, and area calculations",
          unlocked: false,
          completed: false,
          quizzes: [
            {
              id: "geometry-quiz-1",
              title: "Angles and Triangles",
              points: 50,
              difficulty: 'medium',
              questions: [
                {
                  id: "g1",
                  question: "What is the sum of angles in any triangle?",
                  options: ["180°", "90°", "360°"],
                  correct: 0,
                  explanation: "The sum of all three angles in any triangle is always 180 degrees."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "physics-chemistry",
      name: "Physics & Chemistry",
      icon: Atom,
      color: "bg-purple-600",
      description: "Forces, motion, atoms, and chemical reactions",
      topics: [
        {
          id: "forces-motion",
          name: "Forces and Motion",
          description: "Newton's laws and basic physics concepts",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "forces-quiz-1",
              title: "Newton's Laws",
              points: 50,
              difficulty: 'medium',
              questions: [
                {
                  id: "fm1",
                  question: "What happens to an object at rest according to Newton's First Law?",
                  options: ["It stays at rest unless acted upon by a force", "It starts moving", "It accelerates"],
                  correct: 0,
                  explanation: "Newton's First Law states that an object at rest stays at rest unless acted upon by an unbalanced force."
                }
              ]
            }
          ]
        },
        {
          id: "atoms-elements",
          name: "Atoms and Elements",
          description: "Basic atomic structure and periodic table",
          unlocked: false,
          completed: false,
          quizzes: [
            {
              id: "atoms-quiz-1",
              title: "Atomic Structure",
              points: 50,
              difficulty: 'medium',
              questions: [
                {
                  id: "ae1",
                  question: "What are the three main parts of an atom?",
                  options: ["Protons, neutrons, electrons", "Nucleus, shell, core", "Positive, negative, neutral"],
                  correct: 0,
                  explanation: "Atoms consist of protons (positive), neutrons (neutral) in the nucleus, and electrons (negative) orbiting around."
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
      color: "bg-green-600",
      description: "Cell biology, genetics, and life processes",
      topics: [
        {
          id: "cell-structure",
          name: "Cell Structure",
          description: "Parts of a cell and their functions",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "cell-quiz-1",
              title: "Cell Parts",
              points: 50,
              difficulty: 'medium',
              questions: [
                {
                  id: "cs1",
                  question: "What is the control center of a cell?",
                  options: ["Nucleus", "Mitochondria", "Cell membrane"],
                  correct: 0,
                  explanation: "The nucleus controls all cell activities and contains the cell's DNA."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advanced-english",
      name: "Advanced English",
      icon: BookOpen,
      color: "bg-red-600",
      description: "Literature analysis, advanced grammar, and writing",
      topics: [
        {
          id: "literature-analysis",
          name: "Literature Analysis",
          description: "Understanding themes, characters, and literary devices",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "lit-quiz-1",
              title: "Literary Devices",
              points: 50,
              difficulty: 'medium',
              questions: [
                {
                  id: "la1",
                  question: "What is a metaphor?",
                  options: ["A direct comparison without using 'like' or 'as'", "A comparison using 'like' or 'as'", "An exaggeration"],
                  correct: 0,
                  explanation: "A metaphor directly compares two things without using 'like' or 'as', such as 'Time is money.'"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Grade 11-12 Content (Senior High)
const grade11to12Content: GradeData = {
  grade: "11-12",
  name: "Senior High School",
  subjects: [
    {
      id: "advanced-math",
      name: "Advanced Mathematics",
      icon: Calculator,
      color: "bg-blue-700",
      description: "Calculus, statistics, and advanced algebra",
      topics: [
        {
          id: "calculus-intro",
          name: "Introduction to Calculus",
          description: "Limits, derivatives, and basic integration",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "calculus-quiz-1",
              title: "Limits and Derivatives",
              points: 70,
              difficulty: 'hard',
              questions: [
                {
                  id: "ci1",
                  question: "What is the derivative of f(x) = x²?",
                  options: ["2x", "x", "x²"],
                  correct: 0,
                  explanation: "Using the power rule: d/dx(x^n) = nx^(n-1), so d/dx(x²) = 2x^1 = 2x."
                },
                {
                  id: "ci2",
                  question: "What does a derivative represent?",
                  options: ["Rate of change", "Area under curve", "Maximum value"],
                  correct: 0,
                  explanation: "A derivative represents the instantaneous rate of change of a function at any given point."
                }
              ]
            }
          ]
        },
        {
          id: "statistics",
          name: "Statistics & Probability",
          description: "Data analysis, probability distributions, and hypothesis testing",
          unlocked: false,
          completed: false,
          quizzes: [
            {
              id: "stats-quiz-1",
              title: "Probability Basics",
              points: 70,
              difficulty: 'hard',
              questions: [
                {
                  id: "s1",
                  question: "If you flip a fair coin twice, what's the probability of getting two heads?",
                  options: ["1/4", "1/2", "1/3"],
                  correct: 0,
                  explanation: "Each flip has 1/2 probability of heads. For two independent events: (1/2) × (1/2) = 1/4."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advanced-physics",
      name: "Advanced Physics",
      icon: Zap,
      color: "bg-purple-700",
      description: "Electromagnetism, waves, and modern physics",
      topics: [
        {
          id: "electromagnetism",
          name: "Electromagnetism",
          description: "Electric fields, magnetic fields, and electromagnetic waves",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "em-quiz-1",
              title: "Electric Fields",
              points: 70,
              difficulty: 'hard',
              questions: [
                {
                  id: "em1",
                  question: "What is Coulomb's Law used to calculate?",
                  options: ["Force between charged particles", "Magnetic field strength", "Wave frequency"],
                  correct: 0,
                  explanation: "Coulomb's Law calculates the electrostatic force between two charged particles: F = k(q₁q₂)/r²."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advanced-chemistry",
      name: "Advanced Chemistry",
      icon: Microscope,
      color: "bg-green-700",
      description: "Organic chemistry, thermodynamics, and chemical kinetics",
      topics: [
        {
          id: "organic-chemistry",
          name: "Organic Chemistry",
          description: "Carbon compounds, functional groups, and reactions",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "organic-quiz-1",
              title: "Functional Groups",
              points: 70,
              difficulty: 'hard',
              questions: [
                {
                  id: "oc1",
                  question: "What functional group contains a carbon-oxygen double bond?",
                  options: ["Carbonyl (C=O)", "Hydroxyl (-OH)", "Amino (-NH₂)"],
                  correct: 0,
                  explanation: "The carbonyl group (C=O) contains a carbon-oxygen double bond and is found in aldehydes and ketones."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "literature",
      name: "Literature & Composition",
      icon: BookOpen,
      color: "bg-red-700",
      description: "Advanced literary analysis, research, and academic writing",
      topics: [
        {
          id: "critical-analysis",
          name: "Critical Literary Analysis",
          description: "Advanced interpretation and analysis of literature",
          unlocked: true,
          completed: false,
          quizzes: [
            {
              id: "critical-quiz-1",
              title: "Literary Theory",
              points: 70,
              difficulty: 'hard',
              questions: [
                {
                  id: "ca1",
                  question: "What is the main focus of feminist literary criticism?",
                  options: ["Gender roles and women's experiences in literature", "Historical context only", "Author's biography"],
                  correct: 0,
                  explanation: "Feminist literary criticism examines how literature portrays gender roles, women's experiences, and power dynamics."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const gradeContentData: GradeData[] = [
  grade6to8Content,
  grade9to10Content,
  grade11to12Content
];

export const getContentByGrade = (grade: string): GradeData | undefined => {
  return gradeContentData.find(content => content.grade === grade);
};
