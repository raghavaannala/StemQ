import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, BookOpen, PenTool, Lightbulb, Target, Scroll } from "lucide-react";

interface StoryBuilderGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface StorySegment {
  id: string;
  title: string;
  context: string;
  prompt: string;
  choices: {
    text: string;
    grammarFocus: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  points: number;
  storyType: 'adventure' | 'mystery' | 'romance' | 'sci-fi';
}

const storySegments: StorySegment[] = [
  {
    id: "opening",
    title: "Story Opening",
    context: "You're beginning an adventure story about a young explorer.",
    prompt: "Choose the best opening sentence that uses proper narrative voice:",
    choices: [
      {
        text: "I had always dreamed of discovering ancient treasures, and today my adventure would finally begin.",
        grammarFocus: "First person narrative, past perfect tense",
        isCorrect: true,
        explanation: "This uses first person effectively with proper past perfect tense to establish backstory."
      },
      {
        text: "You will discover ancient treasures and your adventure will begin today.",
        grammarFocus: "Second person, future tense",
        isCorrect: false,
        explanation: "Second person is unusual for narrative fiction and creates distance from the character."
      },
      {
        text: "Ancient treasures was discovered and adventures begins today.",
        grammarFocus: "Subject-verb disagreement",
        isCorrect: false,
        explanation: "Subject-verb disagreement: 'treasures were discovered' and 'adventure begins' would be correct."
      }
    ],
    points: 80,
    storyType: 'adventure'
  },
  {
    id: "character_development",
    title: "Character Description",
    context: "Your protagonist meets a mysterious guide. Develop this character effectively.",
    prompt: "Which description best uses vivid imagery and proper grammar?",
    choices: [
      {
        text: "The old man, whose weathered hands told stories of countless adventures, smiled knowingly at me.",
        grammarFocus: "Relative clause, participial phrase",
        isCorrect: true,
        explanation: "Uses a relative clause effectively and creates vivid imagery with 'weathered hands told stories.'"
      },
      {
        text: "The old man who's hands was weathered smiled at me knowingly.",
        grammarFocus: "Contraction error, subject-verb disagreement",
        isCorrect: false,
        explanation: "'Who's' means 'who is' - should be 'whose.' Also 'hands were weathered' for proper agreement."
      },
      {
        text: "An old man smiled. His hands were weathered. He looked knowing.",
        grammarFocus: "Simple sentences, lack of sophistication",
        isCorrect: false,
        explanation: "While grammatically correct, these choppy sentences lack the sophistication expected in narrative writing."
      }
    ],
    points: 90,
    storyType: 'adventure'
  },
  {
    id: "dialogue",
    title: "Dialogue Writing",
    context: "Your character is having a crucial conversation with the guide about the treasure.",
    prompt: "Choose the dialogue that follows proper punctuation and formatting:",
    choices: [
      {
        text: "\"The treasure you seek,\" he whispered, \"lies beyond the mountains where few dare to venture.\"",
        grammarFocus: "Interrupted dialogue, proper punctuation",
        isCorrect: true,
        explanation: "Correctly punctuates interrupted dialogue with commas and maintains lowercase after the interruption."
      },
      {
        text: "\"The treasure you seek\" He whispered \"Lies beyond the mountains where few dare to venture.\"",
        grammarFocus: "Missing punctuation in dialogue",
        isCorrect: false,
        explanation: "Missing commas around the dialogue tag and incorrect capitalization of 'Lies.'"
      },
      {
        text: "\"The treasure you seek,\" He whispered, \"Lies beyond the mountains where few dare to venture.\"",
        grammarFocus: "Capitalization error",
        isCorrect: false,
        explanation: "'He' should be lowercase, and 'Lies' should be lowercase as it continues the sentence."
      }
    ],
    points: 85,
    storyType: 'adventure'
  },
  {
    id: "conflict",
    title: "Building Tension",
    context: "Your hero faces a dangerous obstacle. Create suspense with proper sentence structure.",
    prompt: "Which passage best builds tension using varied sentence structure?",
    choices: [
      {
        text: "The bridge creaked ominously. Each step forward brought new sounds of protest from the ancient wood. Would it hold? I had to find out.",
        grammarFocus: "Varied sentence lengths, rhetorical question",
        isCorrect: true,
        explanation: "Uses varied sentence lengths effectively - long, medium, short, fragment - to build tension."
      },
      {
        text: "The bridge creaked ominously and each step forward brought new sounds of protest from the ancient wood and I wondered if it would hold.",
        grammarFocus: "Run-on sentence",
        isCorrect: false,
        explanation: "This run-on sentence lacks the punch needed for building tension. Needs proper punctuation breaks."
      },
      {
        text: "The bridge creaked. I stepped forward. It made sounds. I wondered about it.",
        grammarFocus: "Choppy, simple sentences",
        isCorrect: false,
        explanation: "These choppy sentences don't build tension effectively and lack descriptive detail."
      }
    ],
    points: 95,
    storyType: 'adventure'
  },
  {
    id: "climax",
    title: "Story Climax",
    context: "The moment of truth arrives. Your character must make a crucial decision.",
    prompt: "Choose the climax that uses strong active voice and precise vocabulary:",
    choices: [
      {
        text: "I seized the ancient artifact, feeling its power surge through my veins as the temple began to collapse around me.",
        grammarFocus: "Active voice, participial phrase, vivid verbs",
        isCorrect: true,
        explanation: "Uses active voice ('I seized') and vivid verbs ('surge,' 'collapse') with effective participial phrase."
      },
      {
        text: "The ancient artifact was seized by me, and power was felt surging through my veins while the temple was collapsing.",
        grammarFocus: "Passive voice overuse",
        isCorrect: false,
        explanation: "Overuses passive voice, making the action less immediate and engaging."
      },
      {
        text: "I got the old thing and felt stuff happening while the building fell down around me.",
        grammarFocus: "Vague vocabulary, informal tone",
        isCorrect: false,
        explanation: "Uses vague, informal language ('got,' 'old thing,' 'stuff') inappropriate for narrative writing."
      }
    ],
    points: 100,
    storyType: 'adventure'
  },
  {
    id: "resolution",
    title: "Story Conclusion",
    context: "Wrap up your adventure story with a satisfying conclusion.",
    prompt: "Which ending provides proper closure while maintaining narrative consistency?",
    choices: [
      {
        text: "As I emerged from the temple, artifact in hand, I realized that the greatest treasure had been the courage I'd discovered within myself.",
        grammarFocus: "Complex sentence, metaphorical language, past perfect",
        isCorrect: true,
        explanation: "Provides thematic closure with sophisticated sentence structure and maintains past tense consistency."
      },
      {
        text: "I come out of the temple with the artifact and I think the real treasure is courage and stuff like that.",
        grammarFocus: "Tense inconsistency, informal language",
        isCorrect: false,
        explanation: "Switches to present tense inconsistently and uses informal language inappropriate for the narrative."
      },
      {
        text: "The temple was exited by me, the artifact was held, and courage was the real treasure that was discovered.",
        grammarFocus: "Passive voice overuse",
        isCorrect: false,
        explanation: "Overuses passive voice, making the conclusion feel distant and less impactful."
      }
    ],
    points: 90,
    storyType: 'adventure'
  }
];

export default function StoryBuilderGame({ onScoreUpdate, onProgressUpdate }: StoryBuilderGameProps) {
  const { toast } = useToast();
  const [currentSegment, setCurrentSegment] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedChoice, setSelectedChoice] = useState<number>(-1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [authorLevel, setAuthorLevel] = useState(1);
  const [storyProgress, setStoryProgress] = useState<string[]>([]);
  const [writingSkills, setWritingSkills] = useState<string[]>([]);

  useEffect(() => {
    const progress = (currentSegment / storySegments.length) * 100;
    onProgressUpdate(progress);
  }, [currentSegment, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const handleChoiceSelect = (choiceIndex: number) => {
    if (showExplanation) return;
    setSelectedChoice(choiceIndex);
  };

  const handleSubmitChoice = () => {
    if (selectedChoice === -1) return;

    const segment = storySegments[currentSegment];
    const choice = segment.choices[selectedChoice];
    const isCorrect = choice.isCorrect;

    if (isCorrect) {
      const streakBonus = streak * 10;
      const points = segment.points + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setAuthorLevel(prev => prev + 1);
      
      // Add to story progress
      setStoryProgress(prev => [...prev, choice.text]);
      
      // Add writing skill
      if (!writingSkills.includes(choice.grammarFocus)) {
        setWritingSkills(prev => [...prev, choice.grammarFocus]);
      }
      
      toast({
        title: "Excellent Writing! ✍️",
        description: `+${points} points! Your story develops beautifully!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Revision Needed! ❌",
        description: "Consider the grammar and style feedback!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
  };

  const handleNextSegment = () => {
    if (currentSegment + 1 >= storySegments.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Story Complete! 🏆",
        description: `Your masterpiece is finished! Final score: ${score}`,
      });
    } else {
      setCurrentSegment(prev => prev + 1);
      setSelectedChoice(-1);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentSegment(0);
    setScore(0);
    setLives(3);
    setSelectedChoice(-1);
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    setAuthorLevel(1);
    setStoryProgress([]);
    setWritingSkills([]);
    onProgressUpdate(0);
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Writer's Block!</h3>
        <p className="text-gray-600 mb-6">Your story needs more revision. Study grammar and style techniques!</p>
        <Button onClick={handleRestart} size="lg">
          <BookOpen className="h-5 w-5 mr-2" />
          Start New Story
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Published Author!</h3>
        <p className="text-gray-600 mb-4">You've crafted a compelling story with excellent grammar and style!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-purple-500 text-white px-4 py-2">
            <BookOpen className="h-4 w-4 mr-2" />
            Level {authorLevel}
          </Badge>
          <Badge className="bg-blue-500 text-white px-4 py-2">
            <PenTool className="h-4 w-4 mr-2" />
            {writingSkills.length} Skills
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <BookOpen className="h-5 w-5 mr-2" />
          Write New Story
        </Button>
      </div>
    );
  }

  const segment = storySegments[currentSegment];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Author Status */}
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
            <p className="text-sm font-medium text-blue-800">Level {authorLevel}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 text-center">
            <PenTool className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-800">{writingSkills.length} Skills</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4 text-center">
            <Scroll className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-purple-800">Chapter {currentSegment + 1}/{storySegments.length}</p>
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
          Story Progress: {Math.round((currentSegment / storySegments.length) * 100)}%
        </Badge>
      </div>

      {/* Story Context */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Writing Context</h3>
          </div>
          <p className="text-gray-700 mb-4">{segment.context}</p>
          <Badge className="bg-indigo-600 text-white">
            {segment.points} Writing Points
          </Badge>
        </CardContent>
      </Card>

      {/* Current Story Progress */}
      {storyProgress.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Story So Far:</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              {storyProgress.map((sentence, index) => (
                <p key={index} className="text-gray-800 mb-2 italic">
                  {sentence}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Writing Challenge */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">📖</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{segment.title}</h2>
        <p className="text-gray-600 mb-4">{segment.prompt}</p>
      </div>

      {/* Writing Choices */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {segment.choices.map((choice, index) => (
              <Button
                key={index}
                variant={selectedChoice === index ? "default" : "outline"}
                className={`p-4 text-left justify-start h-auto ${
                  showExplanation
                    ? choice.isCorrect
                      ? "bg-green-500 text-white"
                      : selectedChoice === index
                      ? "bg-red-500 text-white"
                      : ""
                    : ""
                }`}
                onClick={() => handleChoiceSelect(index)}
                disabled={showExplanation}
              >
                <div className="w-full">
                  <div className="flex items-start">
                    <span className="text-lg font-semibold mr-3 mt-1">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed mb-2">"{choice.text}"</p>
                      <Badge variant="outline" className="text-xs">
                        Focus: {choice.grammarFocus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {showExplanation && selectedChoice !== -1 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                {segment.choices[selectedChoice].explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Writing Skills */}
      {writingSkills.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Writing Skills Mastered:</h4>
            <div className="flex flex-wrap gap-2">
              {writingSkills.map((skill, index) => (
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
            onClick={handleSubmitChoice}
            disabled={selectedChoice === -1}
            size="lg"
            className="px-8 bg-indigo-600 hover:bg-indigo-700"
          >
            <PenTool className="h-4 w-4 mr-2" />
            Add to Story
          </Button>
        ) : (
          <Button onClick={handleNextSegment} size="lg" className="px-8">
            {currentSegment + 1 >= storySegments.length ? "Publish Story!" : "Next Chapter"}
          </Button>
        )}
      </div>
    </div>
  );
}
