// Multilingual content system for STEM Quest
export interface Translation {
  [key: string]: string | Translation;
}

export interface LanguageContent {
  ui: {
    // Navigation
    home: string;
    subjects: string;
    quiz: string;
    progress: string;
    achievements: string;
    settings: string;
    
    // Common actions
    start: string;
    continue: string;
    back: string;
    next: string;
    submit: string;
    cancel: string;
    retake: string;
    exit: string;
    
    // Quiz related
    quizTitle: string;
    question: string;
    questions: string;
    answer: string;
    answers: string;
    correct: string;
    incorrect: string;
    explanation: string;
    timeRemaining: string;
    points: string;
    score: string;
    accuracy: string;
    completed: string;
    inProgress: string;
    locked: string;
    
    // Progress and stats
    totalPoints: string;
    topicsCompleted: string;
    quizzesCompleted: string;
    currentLevel: string;
    currentStreak: string;
    achievements: string;
    recentActivity: string;
    
    // Gamification
    level: string;
    streak: string;
    bonus: string;
    perfectScore: string;
    speedBonus: string;
    streakBonus: string;
    
    // Feedback messages
    quizCompleted: string;
    greatJob: string;
    tryAgain: string;
    keepGoing: string;
    excellent: string;
    goodWork: string;
    
    // Subjects
    mathematics: string;
    physics: string;
    chemistry: string;
    biology: string;
    
    // Topics
    algebraBasics: string;
    geometryBasics: string;
    motionBasics: string;
    periodicTable: string;
    cellBiology: string;
    
    // Difficulty levels
    easy: string;
    medium: string;
    hard: string;
    
    // Time units
    minutes: string;
    seconds: string;
    hours: string;
    days: string;
    
    // Common phrases
    welcomeBack: string;
    chooseSubject: string;
    selectTopic: string;
    startQuiz: string;
    viewProgress: string;
    takePracticeQuiz: string;
    reviewProgress: string;
    viewLeaderboard: string;
    
    // Error messages
    quizNotFound: string;
    networkError: string;
    tryAgainLater: string;
    
    // Success messages
    achievementUnlocked: string;
    levelUp: string;
    newRecord: string;
  };
  
  subjects: {
    [subjectId: string]: {
      name: string;
      description: string;
      topics: {
        [topicId: string]: {
          name: string;
          description: string;
        };
      };
    };
  };
  
  quizzes: {
    [quizId: string]: {
      title: string;
      description: string;
      questions: {
        [questionId: string]: {
          question: string;
          options: string[];
          explanation: string;
        };
      };
    };
  };
}

export const translations: Record<string, LanguageContent> = {
  en: {
    ui: {
      // Navigation
      home: "Home",
      subjects: "Subjects",
      quiz: "Quiz",
      progress: "Progress",
      achievements: "Achievements",
      settings: "Settings",
      
      // Common actions
      start: "Start",
      continue: "Continue",
      back: "Back",
      next: "Next",
      submit: "Submit",
      cancel: "Cancel",
      retake: "Retake",
      exit: "Exit",
      
      // Quiz related
      quizTitle: "Quiz",
      question: "Question",
      questions: "Questions",
      answer: "Answer",
      answers: "Answers",
      correct: "Correct",
      incorrect: "Incorrect",
      explanation: "Explanation",
      timeRemaining: "Time Remaining",
      points: "Points",
      score: "Score",
      accuracy: "Accuracy",
      completed: "Completed",
      inProgress: "In Progress",
      locked: "Locked",
      
      // Progress and stats
      totalPoints: "Total Points",
      topicsCompleted: "Topics Completed",
      quizzesCompleted: "Quizzes Completed",
      currentLevel: "Current Level",
      currentStreak: "Current Streak",
      achievements: "Achievements",
      recentActivity: "Recent Activity",
      
      // Gamification
      level: "Level",
      streak: "Streak",
      bonus: "Bonus",
      perfectScore: "Perfect Score",
      speedBonus: "Speed Bonus",
      streakBonus: "Streak Bonus",
      
      // Feedback messages
      quizCompleted: "Quiz Completed!",
      greatJob: "Great job!",
      tryAgain: "Try again!",
      keepGoing: "Keep going!",
      excellent: "Excellent!",
      goodWork: "Good work!",
      
      // Subjects
      mathematics: "Mathematics",
      physics: "Physics",
      chemistry: "Chemistry",
      biology: "Biology",
      
      // Topics
      algebraBasics: "Algebra Basics",
      geometryBasics: "Geometry Basics",
      motionBasics: "Motion Basics",
      periodicTable: "Periodic Table",
      cellBiology: "Cell Biology",
      
      // Difficulty levels
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      
      // Time units
      minutes: "minutes",
      seconds: "seconds",
      hours: "hours",
      days: "days",
      
      // Common phrases
      welcomeBack: "Welcome back, Explorer!",
      chooseSubject: "Choose a Subject",
      selectTopic: "Select a Topic",
      startQuiz: "Start Quiz",
      viewProgress: "View Progress",
      takePracticeQuiz: "Take Practice Quiz",
      reviewProgress: "Review Progress",
      viewLeaderboard: "View Leaderboard",
      
      // Error messages
      quizNotFound: "Quiz not found",
      networkError: "Network error",
      tryAgainLater: "Please try again later",
      
      // Success messages
      achievementUnlocked: "Achievement Unlocked!",
      levelUp: "Level Up!",
      newRecord: "New Record!",
    },
    
    subjects: {
      math: {
        name: "Mathematics",
        description: "Algebra, Geometry, and Number Theory",
        topics: {
          "algebra-basics": {
            name: "Algebra Basics",
            description: "Learn basic algebraic operations and equations"
          },
          "geometry-basics": {
            name: "Geometry Fundamentals",
            description: "Shapes, angles, and geometric calculations"
          }
        }
      },
      physics: {
        name: "Physics",
        description: "Motion, Energy, and Forces",
        topics: {
          "motion-basics": {
            name: "Motion Basics",
            description: "Understanding velocity, acceleration, and displacement"
          }
        }
      },
      chemistry: {
        name: "Chemistry",
        description: "Elements, Compounds, and Reactions",
        topics: {
          "periodic-table": {
            name: "Periodic Table",
            description: "Elements and their properties"
          }
        }
      },
      biology: {
        name: "Biology",
        description: "Life Sciences and Ecosystems",
        topics: {
          "cell-biology": {
            name: "Cell Biology",
            description: "Structure and function of cells"
          }
        }
      }
    },
    
    quizzes: {
      "algebra-quiz-1": {
        title: "Basic Operations",
        description: "Test your knowledge of basic algebraic operations",
        questions: {
          "q1": {
            question: "What is 2 + 2 × 2?",
            options: ["6", "8", "4", "10"],
            explanation: "Order of operations: multiplication first (2×2=4), then addition (2+4=6)"
          },
          "q2": {
            question: "Solve for x: x + 5 = 10",
            options: ["5", "3", "15", "2"],
            explanation: "Subtract 5 from both sides: x + 5 - 5 = 10 - 5, so x = 5"
          }
        }
      }
    }
  },
  
  hi: {
    ui: {
      // Navigation
      home: "होम",
      subjects: "विषय",
      quiz: "क्विज़",
      progress: "प्रगति",
      achievements: "उपलब्धियां",
      settings: "सेटिंग्स",
      
      // Common actions
      start: "शुरू करें",
      continue: "जारी रखें",
      back: "वापस",
      next: "अगला",
      submit: "जमा करें",
      cancel: "रद्द करें",
      retake: "फिर से करें",
      exit: "बाहर निकलें",
      
      // Quiz related
      quizTitle: "क्विज़",
      question: "प्रश्न",
      questions: "प्रश्न",
      answer: "उत्तर",
      answers: "उत्तर",
      correct: "सही",
      incorrect: "गलत",
      explanation: "व्याख्या",
      timeRemaining: "शेष समय",
      points: "अंक",
      score: "स्कोर",
      accuracy: "सटीकता",
      completed: "पूर्ण",
      inProgress: "प्रगति में",
      locked: "बंद",
      
      // Progress and stats
      totalPoints: "कुल अंक",
      topicsCompleted: "पूर्ण विषय",
      quizzesCompleted: "पूर्ण क्विज़",
      currentLevel: "वर्तमान स्तर",
      currentStreak: "वर्तमान श्रृंखला",
      achievements: "उपलब्धियां",
      recentActivity: "हाल की गतिविधि",
      
      // Gamification
      level: "स्तर",
      streak: "श्रृंखला",
      bonus: "बोनस",
      perfectScore: "पूर्ण स्कोर",
      speedBonus: "गति बोनस",
      streakBonus: "श्रृंखला बोनस",
      
      // Feedback messages
      quizCompleted: "क्विज़ पूर्ण!",
      greatJob: "बहुत बढ़िया!",
      tryAgain: "फिर से कोशिश करें!",
      keepGoing: "जारी रखें!",
      excellent: "उत्कृष्ट!",
      goodWork: "अच्छा काम!",
      
      // Subjects
      mathematics: "गणित",
      physics: "भौतिकी",
      chemistry: "रसायन विज्ञान",
      biology: "जीव विज्ञान",
      
      // Topics
      algebraBasics: "बीजगणित मूल बातें",
      geometryBasics: "ज्यामिति मूल बातें",
      motionBasics: "गति मूल बातें",
      periodicTable: "आवर्त सारणी",
      cellBiology: "कोशिका जीव विज्ञान",
      
      // Difficulty levels
      easy: "आसान",
      medium: "मध्यम",
      hard: "कठिन",
      
      // Time units
      minutes: "मिनट",
      seconds: "सेकंड",
      hours: "घंटे",
      days: "दिन",
      
      // Common phrases
      welcomeBack: "वापसी पर स्वागत है, खोजकर्ता!",
      chooseSubject: "एक विषय चुनें",
      selectTopic: "एक विषय चुनें",
      startQuiz: "क्विज़ शुरू करें",
      viewProgress: "प्रगति देखें",
      takePracticeQuiz: "अभ्यास क्विज़ लें",
      reviewProgress: "प्रगति की समीक्षा करें",
      viewLeaderboard: "लीडरबोर्ड देखें",
      
      // Error messages
      quizNotFound: "क्विज़ नहीं मिला",
      networkError: "नेटवर्क त्रुटि",
      tryAgainLater: "कृपया बाद में कोशिश करें",
      
      // Success messages
      achievementUnlocked: "उपलब्धि अनलॉक!",
      levelUp: "स्तर बढ़ा!",
      newRecord: "नया रिकॉर्ड!",
    },
    
    subjects: {
      math: {
        name: "गणित",
        description: "बीजगणित, ज्यामिति और संख्या सिद्धांत",
        topics: {
          "algebra-basics": {
            name: "बीजगणित मूल बातें",
            description: "बुनियादी बीजगणितीय संक्रियाएं और समीकरण सीखें"
          },
          "geometry-basics": {
            name: "ज्यामिति मूल बातें",
            description: "आकार, कोण और ज्यामितीय गणनाएं"
          }
        }
      },
      physics: {
        name: "भौतिकी",
        description: "गति, ऊर्जा और बल",
        topics: {
          "motion-basics": {
            name: "गति मूल बातें",
            description: "वेग, त्वरण और विस्थापन की समझ"
          }
        }
      },
      chemistry: {
        name: "रसायन विज्ञान",
        description: "तत्व, यौगिक और अभिक्रियाएं",
        topics: {
          "periodic-table": {
            name: "आवर्त सारणी",
            description: "तत्व और उनके गुण"
          }
        }
      },
      biology: {
        name: "जीव विज्ञान",
        description: "जीवन विज्ञान और पारिस्थितिकी तंत्र",
        topics: {
          "cell-biology": {
            name: "कोशिका जीव विज्ञान",
            description: "कोशिकाओं की संरचना और कार्य"
          }
        }
      }
    },
    
    quizzes: {
      "algebra-quiz-1": {
        title: "बुनियादी संक्रियाएं",
        description: "बुनियादी बीजगणितीय संक्रियाओं के अपने ज्ञान का परीक्षण करें",
        questions: {
          "q1": {
            question: "2 + 2 × 2 क्या है?",
            options: ["6", "8", "4", "10"],
            explanation: "संक्रिया का क्रम: पहले गुणा (2×2=4), फिर जोड़ (2+4=6)"
          },
          "q2": {
            question: "x के लिए हल करें: x + 5 = 10",
            options: ["5", "3", "15", "2"],
            explanation: "दोनों तरफ से 5 घटाएं: x + 5 - 5 = 10 - 5, इसलिए x = 5"
          }
        }
      }
    }
  },
  
  te: {
    ui: {
      // Navigation
      home: "హోమ్",
      subjects: "విషయాలు",
      quiz: "క్విజ్",
      progress: "పురోగతి",
      achievements: "సాధనలు",
      settings: "సెట్టింగులు",
      
      // Common actions
      start: "ప్రారంభించండి",
      continue: "కొనసాగించండి",
      back: "వెనుకకు",
      next: "తదుపరి",
      submit: "సమర్పించండి",
      cancel: "రద్దు చేయండి",
      retake: "మళ్లీ చేయండి",
      exit: "నిష్క్రమించండి",
      
      // Quiz related
      quizTitle: "క్విజ్",
      question: "ప్రశ్న",
      questions: "ప్రశ్నలు",
      answer: "సమాధానం",
      answers: "సమాధానాలు",
      correct: "సరైనది",
      incorrect: "తప్పు",
      explanation: "వివరణ",
      timeRemaining: "మిగిలిన సమయం",
      points: "పాయింట్లు",
      score: "స్కోర్",
      accuracy: "ఖచ్చితత్వం",
      completed: "పూర్తయింది",
      inProgress: "పురోగతిలో",
      locked: "లాక్ చేయబడింది",
      
      // Progress and stats
      totalPoints: "మొత్తం పాయింట్లు",
      topicsCompleted: "పూర్తయిన విషయాలు",
      quizzesCompleted: "పూర్తయిన క్విజ్లు",
      currentLevel: "ప్రస్తుత స్థాయి",
      currentStreak: "ప్రస్తుత స్ట్రీక్",
      achievements: "సాధనలు",
      recentActivity: "ఇటీవలి కార్యకలాపం",
      
      // Gamification
      level: "స్థాయి",
      streak: "స్ట్రీక్",
      bonus: "బోనస్",
      perfectScore: "పర్ఫెక్ట్ స్కోర్",
      speedBonus: "వేగ బోనస్",
      streakBonus: "స్ట్రీక్ బోనస్",
      
      // Feedback messages
      quizCompleted: "క్విజ్ పూర్తయింది!",
      greatJob: "చాలా బాగుంది!",
      tryAgain: "మళ్లీ ప్రయత్నించండి!",
      keepGoing: "కొనసాగించండి!",
      excellent: "అద్భుతం!",
      goodWork: "మంచి పని!",
      
      // Subjects
      mathematics: "గణితం",
      physics: "భౌతిక శాస్త్రం",
      chemistry: "రసాయన శాస్త్రం",
      biology: "జీవ శాస్త్రం",
      
      // Topics
      algebraBasics: "బీజగణిత ప్రాథమికాలు",
      geometryBasics: "జ్యామితి ప్రాథమికాలు",
      motionBasics: "చలన ప్రాథమికాలు",
      periodicTable: "ఆవర్తన పట్టిక",
      cellBiology: "కణ జీవశాస్త్రం",
      
      // Difficulty levels
      easy: "సులభం",
      medium: "మధ్యస్థం",
      hard: "కష్టం",
      
      // Time units
      minutes: "నిమిషాలు",
      seconds: "సెకన్లు",
      hours: "గంటలు",
      days: "రోజులు",
      
      // Common phrases
      welcomeBack: "తిరిగి స్వాగతం, అన్వేషకుడా!",
      chooseSubject: "ఒక విషయాన్ని ఎంచుకోండి",
      selectTopic: "ఒక విషయాన్ని ఎంచుకోండి",
      startQuiz: "క్విజ్ ప్రారంభించండి",
      viewProgress: "పురోగతిని చూడండి",
      takePracticeQuiz: "ప్రాక్టీస్ క్విజ్ చేయండి",
      reviewProgress: "పురోగతిని సమీక్షించండి",
      viewLeaderboard: "లీడర్ బోర్డ్ చూడండి",
      
      // Error messages
      quizNotFound: "క్విజ్ కనుగొనబడలేదు",
      networkError: "నెట్‌వర్క్ లోపం",
      tryAgainLater: "దయచేసి తర్వాత ప్రయత్నించండి",
      
      // Success messages
      achievementUnlocked: "సాధన అన్‌లాక్!",
      levelUp: "స్థాయి పెరిగింది!",
      newRecord: "కొత్త రికార్డ్!",
    },
    
    subjects: {
      math: {
        name: "గణితం",
        description: "బీజగణితం, జ్యామితి మరియు సంఖ్య సిద్ధాంతం",
        topics: {
          "algebra-basics": {
            name: "బీజగణిత ప్రాథమికాలు",
            description: "ప్రాథమిక బీజగణిత కార్యకలాపాలు మరియు సమీకరణాలను నేర్చుకోండి"
          },
          "geometry-basics": {
            name: "జ్యామితి ప్రాథమికాలు",
            description: "ఆకారాలు, కోణాలు మరియు జ్యామితీయ గణనలు"
          }
        }
      },
      physics: {
        name: "భౌతిక శాస్త్రం",
        description: "చలనం, శక్తి మరియు బలాలు",
        topics: {
          "motion-basics": {
            name: "చలన ప్రాథమికాలు",
            description: "వేగం, త్వరణం మరియు స్థానభ్రంశం అర్థం చేసుకోవడం"
          }
        }
      },
      chemistry: {
        name: "రసాయన శాస్త్రం",
        description: "మూలకాలు, సమ్మేళనాలు మరియు ప్రతిచర్యలు",
        topics: {
          "periodic-table": {
            name: "ఆవర్తన పట్టిక",
            description: "మూలకాలు మరియు వాటి లక్షణాలు"
          }
        }
      },
      biology: {
        name: "జీవ శాస్త్రం",
        description: "జీవ శాస్త్రం మరియు పర్యావరణ వ్యవస్థలు",
        topics: {
          "cell-biology": {
            name: "కణ జీవశాస్త్రం",
            description: "కణాల నిర్మాణం మరియు పనితీరు"
          }
        }
      }
    },
    
    quizzes: {
      "algebra-quiz-1": {
        title: "ప్రాథమిక కార్యకలాపాలు",
        description: "ప్రాథమిక బీజగణిత కార్యకలాపాల గురించి మీ జ్ఞానాన్ని పరీక్షించండి",
        questions: {
          "q1": {
            question: "2 + 2 × 2 ఎంత?",
            options: ["6", "8", "4", "10"],
            explanation: "కార్యకలాపాల క్రమం: మొదట గుణకారం (2×2=4), తర్వాత కూడిక (2+4=6)"
          },
          "q2": {
            question: "x కోసం పరిష్కరించండి: x + 5 = 10",
            options: ["5", "3", "15", "2"],
            explanation: "రెండు వైపుల నుండి 5 తీసివేయండి: x + 5 - 5 = 10 - 5, కాబట్టి x = 5"
          }
        }
      }
    }
  }
};

// Translation utility functions
export const getTranslation = (language: string, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language] || translations.en;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

export const getAvailableLanguages = (): string[] => {
  return Object.keys(translations);
};

export const getLanguageName = (code: string): string => {
  const names: Record<string, string> = {
    en: "English",
    hi: "हिंदी",
    te: "తెలుగు"
  };
  return names[code] || code;
};
