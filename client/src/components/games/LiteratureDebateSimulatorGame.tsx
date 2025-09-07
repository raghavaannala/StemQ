import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trophy, Heart, Users, BookOpen, MessageSquare, Brain, Scroll } from "lucide-react";

interface LiteratureDebateSimulatorGameProps {
  onScoreUpdate: (score: number) => void;
  onProgressUpdate: (progress: number) => void;
}

interface DebateScenario {
  id: string;
  title: string;
  work: string;
  author: string;
  context: string;
  debateQuestion: string;
  position: 'for' | 'against';
  arguments: {
    text: string;
    literaryDevice: string;
    strength: 'strong' | 'moderate' | 'weak';
    explanation: string;
  }[];
  counterArgument: string;
  response: string;
  points: number;
  theme: string;
}

const debateScenarios: DebateScenario[] = [
  {
    id: "hamlet_madness",
    title: "Hamlet's Madness Debate",
    work: "Hamlet",
    author: "William Shakespeare",
    context: "Throughout the play, Hamlet exhibits erratic behavior after encountering his father's ghost.",
    debateQuestion: "Is Hamlet truly mad, or is he feigning madness as part of his revenge plan?",
    position: 'for',
    arguments: [
      {
        text: "Hamlet's 'antic disposition' is a calculated strategy he announces to Horatio, showing premeditation.",
        literaryDevice: "Dramatic irony and soliloquy",
        strength: 'strong',
        explanation: "This demonstrates Hamlet's rational planning and use of madness as a tool rather than genuine mental illness."
      },
      {
        text: "His behavior changes dramatically when he's alone versus in public, suggesting conscious control.",
        literaryDevice: "Characterization through contrast",
        strength: 'strong',
        explanation: "The stark difference in his private soliloquies versus public interactions shows deliberate performance."
      },
      {
        text: "Hamlet speaks in riddles and puns, but his wordplay is too clever for someone truly insane.",
        literaryDevice: "Verbal irony and wit",
        strength: 'moderate',
        explanation: "His linguistic sophistication suggests underlying rationality, though this could be debated."
      }
    ],
    counterArgument: "But Hamlet's violence toward Ophelia and his mother seems genuinely uncontrolled and emotionally driven.",
    response: "While Hamlet's emotions are real, his actions remain strategically focused on his revenge mission, suggesting method behind the madness.",
    points: 120,
    theme: "Appearance vs Reality"
  },
  {
    id: "gatsby_american_dream",
    title: "Gatsby and the American Dream",
    work: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    context: "Jay Gatsby pursues wealth and status to win back Daisy, representing the pursuit of the American Dream.",
    debateQuestion: "Does Gatsby represent the corruption of the American Dream or its tragic nobility?",
    position: 'against',
    arguments: [
      {
        text: "Gatsby's wealth comes from illegal activities, showing the moral corruption underlying his dream.",
        literaryDevice: "Symbolism and moral allegory",
        strength: 'strong',
        explanation: "The criminal source of his wealth directly contradicts the honest work ethic traditionally associated with the American Dream."
      },
      {
        text: "His obsession with recreating the past with Daisy shows he misunderstands the forward-looking nature of the American Dream.",
        literaryDevice: "Motif and theme",
        strength: 'strong',
        explanation: "The famous line 'So we beat on, boats against the current, borne back ceaselessly into the past' emphasizes this backward focus."
      },
      {
        text: "Gatsby's parties are hollow spectacles designed to attract Daisy, not genuine celebrations of success.",
        literaryDevice: "Symbolism and irony",
        strength: 'moderate',
        explanation: "The emptiness of his parties reflects the superficiality of his version of the American Dream."
      }
    ],
    counterArgument: "Gatsby's unwavering hope and dedication to his dream, despite obstacles, embodies the noble spirit of American optimism.",
    response: "While Gatsby's hope is admirable, his methods and backward-looking focus represent a fundamental corruption of the Dream's principles.",
    points: 130,
    theme: "The American Dream"
  },
  {
    id: "mockingbird_heroism",
    title: "Atticus Finch as Moral Hero",
    work: "To Kill a Mockingbird",
    author: "Harper Lee",
    context: "Atticus Finch defends Tom Robinson, a Black man falsely accused of rape, in 1930s Alabama.",
    debateQuestion: "Is Atticus Finch a true moral hero or a product of his time with limited understanding?",
    position: 'for',
    arguments: [
      {
        text: "Atticus risks his reputation and safety to defend Tom Robinson when no one else would.",
        literaryDevice: "Character foil and moral courage",
        strength: 'strong',
        explanation: "His willingness to stand alone against societal pressure demonstrates genuine moral heroism."
      },
      {
        text: "He teaches his children to see people as individuals rather than stereotypes, promoting empathy and understanding.",
        literaryDevice: "Theme and character development",
        strength: 'strong',
        explanation: "His lesson about walking in someone else's shoes represents progressive thinking for his era."
      },
      {
        text: "Atticus treats everyone with respect regardless of their social status or race, as seen with Mrs. Dubose and Calpurnia.",
        literaryDevice: "Characterization through action",
        strength: 'moderate',
        explanation: "His consistent respectful treatment of all people demonstrates his moral principles in action."
      }
    ],
    counterArgument: "Modern critics argue that Atticus represents white paternalism and doesn't challenge the fundamental racist system.",
    response: "While Atticus may not be perfect by today's standards, his actions were genuinely heroic within the context of his time and place.",
    points: 125,
    theme: "Moral Courage"
  },
  {
    id: "1984_winston_hero",
    title: "Winston Smith's Heroism",
    work: "1984",
    author: "George Orwell",
    context: "Winston Smith rebels against the totalitarian Party but ultimately breaks under torture.",
    debateQuestion: "Is Winston Smith a tragic hero or simply a failed rebel?",
    position: 'against',
    arguments: [
      {
        text: "Winston's rebellion is largely internal and intellectual rather than taking meaningful action against the Party.",
        literaryDevice: "Internal conflict and characterization",
        strength: 'strong',
        explanation: "True heroism requires action, not just thought. Winston's rebellion remains mostly in his mind."
      },
      {
        text: "He betrays Julia and abandons his principles when faced with his worst fear in Room 101.",
        literaryDevice: "Climax and character revelation",
        strength: 'strong',
        explanation: "His ultimate betrayal of love and principle shows he lacks the steadfastness required of a tragic hero."
      },
      {
        text: "Winston's final acceptance and love of Big Brother represents complete spiritual defeat, not tragic nobility.",
        literaryDevice: "Irony and theme",
        strength: 'moderate',
        explanation: "Unlike traditional tragic heroes who maintain dignity in defeat, Winston is completely broken and transformed."
      }
    ],
    counterArgument: "Winston's attempt to maintain his humanity and individual thought in an impossible system shows heroic resistance.",
    response: "While Winston's resistance has value, his complete capitulation prevents him from achieving the dignity necessary for tragic heroism.",
    points: 135,
    theme: "Individual vs Society"
  },
  {
    id: "pride_prejudice_marriage",
    title: "Marriage in Pride and Prejudice",
    work: "Pride and Prejudice",
    author: "Jane Austen",
    context: "The novel presents various marriages with different motivations and outcomes.",
    debateQuestion: "Does Austen advocate for marriage based on love or practical considerations?",
    position: 'for',
    arguments: [
      {
        text: "Elizabeth and Darcy's marriage combines love, respect, and compatible values, representing Austen's ideal.",
        literaryDevice: "Character development and theme",
        strength: 'strong',
        explanation: "Their relationship evolves from misunderstanding to mutual respect and love, suggesting this is the preferred model."
      },
      {
        text: "The unhappy marriages (Lydia/Wickham, Charlotte/Collins) are based on passion or practicality alone, showing their inadequacy.",
        literaryDevice: "Contrast and foil characters",
        strength: 'strong',
        explanation: "These marriages serve as negative examples, highlighting what Elizabeth and Darcy's relationship has that others lack."
      },
      {
        text: "Elizabeth rejects Mr. Collins and initially Darcy, showing she won't marry without love despite social pressure.",
        literaryDevice: "Character agency and theme",
        strength: 'moderate',
        explanation: "Her refusals demonstrate that love is essential, though this could be seen as privileged position."
      }
    ],
    counterArgument: "Charlotte Lucas's practical marriage to Mr. Collins is presented sympathetically, suggesting Austen understands economic necessity.",
    response: "While Austen shows sympathy for Charlotte's situation, Elizabeth's path is clearly presented as the superior choice when possible.",
    points: 115,
    theme: "Love and Marriage"
  }
];

export default function LiteratureDebateSimulatorGame({ onScoreUpdate, onProgressUpdate }: LiteratureDebateSimulatorGameProps) {
  const { toast } = useToast();
  const [currentDebate, setCurrentDebate] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedArgument, setSelectedArgument] = useState<number>(-1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [debaterLevel, setDebaterLevel] = useState(1);
  const [masteredThemes, setMasteredThemes] = useState<string[]>([]);
  const [showCounter, setShowCounter] = useState(false);

  useEffect(() => {
    const progress = (currentDebate / debateScenarios.length) * 100;
    onProgressUpdate(progress);
  }, [currentDebate, onProgressUpdate]);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const handleArgumentSelect = (argumentIndex: number) => {
    if (showExplanation) return;
    setSelectedArgument(argumentIndex);
  };

  const handleSubmitArgument = () => {
    if (selectedArgument === -1) return;

    const debate = debateScenarios[currentDebate];
    const argument = debate.arguments[selectedArgument];
    const isStrong = argument.strength === 'strong';

    if (isStrong) {
      const strengthBonus = argument.strength === 'strong' ? 30 : argument.strength === 'moderate' ? 15 : 0;
      const streakBonus = streak * 15;
      const points = debate.points + strengthBonus + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setDebaterLevel(prev => prev + 1);
      
      // Add mastered theme
      if (!masteredThemes.includes(debate.theme)) {
        setMasteredThemes(prev => [...prev, debate.theme]);
      }
      
      toast({
        title: "Compelling Argument! 🎭",
        description: `+${points} points! Your literary analysis is excellent!`,
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      toast({
        title: "Weak Argument! ❌",
        description: "Your argument needs stronger textual evidence!",
        variant: "destructive"
      });
    }

    setShowExplanation(true);
    setShowCounter(true);
  };

  const handleNextDebate = () => {
    if (currentDebate + 1 >= debateScenarios.length) {
      setGameComplete(true);
      onProgressUpdate(100);
      toast({
        title: "Master Debater! 🏆",
        description: `All debates won! Final score: ${score}`,
      });
    } else {
      setCurrentDebate(prev => prev + 1);
      setSelectedArgument(-1);
      setShowExplanation(false);
      setShowCounter(false);
    }
  };

  const handleRestart = () => {
    setCurrentDebate(0);
    setScore(0);
    setLives(3);
    setSelectedArgument(-1);
    setShowExplanation(false);
    setGameComplete(false);
    setStreak(0);
    setDebaterLevel(1);
    setMasteredThemes([]);
    setShowCounter(false);
    onProgressUpdate(0);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (lives <= 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Debate Lost!</h3>
        <p className="text-gray-600 mb-6">Your arguments were not persuasive enough. Study more literary analysis techniques!</p>
        <Button onClick={handleRestart} size="lg">
          <BookOpen className="h-5 w-5 mr-2" />
          New Debate Tournament
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Master Debater!</h3>
        <p className="text-gray-600 mb-4">You've mastered literary analysis and debate across multiple themes and works!</p>
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            {score} Points
          </Badge>
          <Badge className="bg-purple-500 text-white px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            Level {debaterLevel}
          </Badge>
          <Badge className="bg-blue-500 text-white px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            {masteredThemes.length} Themes
          </Badge>
        </div>
        <Button onClick={handleRestart} size="lg">
          <BookOpen className="h-5 w-5 mr-2" />
          New Tournament
        </Button>
      </div>
    );
  }

  const debate = debateScenarios[currentDebate];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Debater Status */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-red-50">
          <CardContent className="p-4 text-center">
            <Heart className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-red-800">{lives} Lives</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-blue-800">Level {debaterLevel}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 text-center">
            <Brain className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-800">{masteredThemes.length} Themes</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4 text-center">
            <Scroll className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-purple-800">Debate {currentDebate + 1}/{debateScenarios.length}</p>
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
          Tournament: {Math.round((currentDebate / debateScenarios.length) * 100)}%
        </Badge>
      </div>

      {/* Literary Work Context */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">{debate.work} by {debate.author}</h3>
          </div>
          <p className="text-gray-700 mb-4">{debate.context}</p>
          <Badge className="bg-indigo-600 text-white">
            Theme: {debate.theme}
          </Badge>
        </CardContent>
      </Card>

      {/* Debate Question */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">🎭</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{debate.title}</h2>
        <p className="text-gray-600 mb-4">{debate.debateQuestion}</p>
        <Badge className={`${debate.position === 'for' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          Arguing {debate.position === 'for' ? 'FOR' : 'AGAINST'}
        </Badge>
      </div>

      {/* Argument Selection */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Choose your strongest argument:
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {debate.arguments.map((argument, index) => (
              <Button
                key={index}
                variant={selectedArgument === index ? "default" : "outline"}
                className={`p-4 text-left justify-start h-auto ${
                  showExplanation
                    ? argument.strength === 'strong'
                      ? "bg-green-500 text-white"
                      : selectedArgument === index
                      ? "bg-red-500 text-white"
                      : ""
                    : ""
                }`}
                onClick={() => handleArgumentSelect(index)}
                disabled={showExplanation}
              >
                <div className="w-full">
                  <div className="flex items-start">
                    <span className="text-lg font-semibold mr-3 mt-1">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed mb-2">{argument.text}</p>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {argument.literaryDevice}
                        </Badge>
                        <Badge className={`${getStrengthColor(argument.strength)} text-white text-xs`}>
                          {argument.strength}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {showExplanation && selectedArgument !== -1 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                {debate.arguments[selectedArgument].explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Counter-argument and Response */}
      {showCounter && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Opposition's Counter-argument:</h4>
                <p className="text-red-700">{debate.counterArgument}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Your Response:</h4>
                <p className="text-blue-700">{debate.response}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mastered Themes */}
      {masteredThemes.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Literary Themes Mastered:</h4>
            <div className="flex flex-wrap gap-2">
              {masteredThemes.map((theme, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {theme}
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
            onClick={handleSubmitArgument}
            disabled={selectedArgument === -1}
            size="lg"
            className="px-8 bg-indigo-600 hover:bg-indigo-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Present Argument
          </Button>
        ) : (
          <Button onClick={handleNextDebate} size="lg" className="px-8">
            {currentDebate + 1 >= debateScenarios.length ? "Win Tournament!" : "Next Debate"}
          </Button>
        )}
      </div>
    </div>
  );
}
