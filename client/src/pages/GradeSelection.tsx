import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Users,
  ArrowRight,
  School,
  Brain,
  User
} from "lucide-react";

interface GradeInfo {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  subjects: string[];
  features: string[];
}

const gradeOptions: GradeInfo[] = [
  {
    id: "6-8",
    name: "Middle School (Grades 6-8)",
    description: "Foundation building with interactive learning",
    icon: School,
    color: "bg-green-500",
    subjects: ["Basic Math", "Science Fundamentals", "English Grammar", "Social Studies"],
    features: ["Visual Learning", "Simple Concepts", "Fun Quizzes", "Basic Problem Solving"]
  },
  {
    id: "9-10",
    name: "High School (Grades 9-10)",
    description: "Intermediate concepts with practical applications",
    icon: BookOpen,
    color: "bg-blue-500",
    subjects: ["Algebra & Geometry", "Physics & Chemistry", "Advanced English", "Biology"],
    features: ["Analytical Thinking", "Real-world Problems", "Detailed Explanations", "Progress Tracking"]
  },
  {
    id: "11-12",
    name: "Senior High (Grades 11-12)",
    description: "Advanced preparation for higher education",
    icon: GraduationCap,
    color: "bg-purple-500",
    subjects: ["Advanced Mathematics", "Advanced Sciences", "Literature", "Research Methods"],
    features: ["Complex Problem Solving", "Exam Preparation", "Advanced Analytics", "Career Guidance"]
  }
];

export default function GradeSelection() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);

  const handleGradeSelect = (gradeId: string) => {
    setSelectedGrade(gradeId);
    
    const existingUser = localStorage.getItem('stemquest_user');
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      userData.grade = gradeId;
      localStorage.setItem('stemquest_user', JSON.stringify(userData));
      
      toast({
        title: "Welcome back!",
        description: `Switching to ${gradeOptions.find(g => g.id === gradeId)?.name}`,
      });
      
      setLocation(`/dashboard/${gradeId}`);
    } else {
      setShowUserForm(true);
    }
  };

  const handleQuickStart = (gradeId: string) => {
    const guestData = {
      username: "Guest",
      fullName: "Guest User",
      grade: gradeId,
      isGuest: true,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('stemquest_user', JSON.stringify(guestData));

    toast({
      title: "Quick Start Activated!",
      description: `Starting ${gradeOptions.find(g => g.id === gradeId)?.name} as guest`,
    });

    setLocation(`/dashboard/${gradeId}`);
  };

  const handleUserRegistration = () => {
    if (!selectedGrade) {
      toast({
        title: "Grade Required",
        description: "Please select your grade level first.",
        variant: "destructive"
      });
      return;
    }

    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to continue.",
        variant: "destructive"
      });
      return;
    }

    const userData = {
      username: username.trim(),
      fullName: fullName.trim() || username.trim(),
      grade: selectedGrade,
      isGuest: false,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('stemquest_user', JSON.stringify(userData));

    toast({
      title: "Welcome to STEM Quest!",
      description: `Successfully registered for ${gradeOptions.find(g => g.id === selectedGrade)?.name}`,
    });

    setLocation(`/dashboard/${selectedGrade}`);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Company Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-6 
            bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
            text-white px-14 py-8 rounded-full 
            text-5xl font-extrabold shadow-2xl 
            hover:scale-110 hover:shadow-purple-500/50 
            transform transition-all duration-500">
            
            <Brain className="h-16 w-16 drop-shadow-lg animate-bounce" />
            <span className="tracking-wide drop-shadow-md">STEM Quest</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your grade level to access curriculum designed specifically for your academic needs
          </p>
        </div>

        {/* Grade Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {gradeOptions.map((grade) => {
            const IconComponent = grade.icon;
            const isSelected = selectedGrade === grade.id;
            
            return (
              <Card 
                key={grade.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 shadow-lg transform scale-105' 
                    : 'hover:scale-105'
                }`}
                onClick={() => handleGradeSelect(grade.id)}
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto p-4 rounded-full ${grade.color} text-white mb-4 w-16 h-16 flex items-center justify-center`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{grade.name}</CardTitle>
                  <CardDescription className="text-base">
                    {grade.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Subjects:</h4>
                      <div className="flex flex-wrap gap-1">
                        {grade.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {grade.features.map((feature) => (
                          <li key={feature} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Quick Start Button */}
                    <div className="pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickStart(grade.id);
                        }}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Quick Start
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* User Registration Form */}
        {showUserForm && (
          <Card className="mb-8 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <User className="h-5 w-5" />
                <span>Create Your Account</span>
              </CardTitle>
              <CardDescription className="text-center">
                Selected: {gradeOptions.find(g => g.id === selectedGrade)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name (Optional)</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleUserRegistration}
                  disabled={!username.trim()}
                  className="flex-1"
                >
                  Create Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUserForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
            <p className="text-gray-600">Active Students</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">500+</h3>
            <p className="text-gray-600">Interactive Quizzes</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">50+</h3>
            <p className="text-gray-600">Achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
}
