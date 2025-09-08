import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Shield, 
  GraduationCap, 
  BookOpen, 
  School,
  Brain,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface GradeOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  ageRange: string;
}

const gradeOptions: GradeOption[] = [
  {
    id: "6-8",
    name: "Middle School",
    description: "Grades 6-8 • Foundation building with interactive learning",
    icon: School,
    color: "bg-green-500",
    ageRange: "11-14 years"
  },
  {
    id: "9-10",
    name: "High School",
    description: "Grades 9-10 • Intermediate concepts with practical applications",
    icon: BookOpen,
    color: "bg-blue-500",
    ageRange: "14-16 years"
  },
  {
    id: "11-12",
    name: "Senior High",
    description: "Grades 11-12 • Advanced preparation for higher education",
    icon: GraduationCap,
    color: "bg-purple-500",
    ageRange: "16-18 years"
  }
];

export default function SignIn() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'phone' | 'otp' | 'grade'>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP sending (replace with actual API call)
    setTimeout(() => {
      setOtpSent(true);
      setStep('otp');
      setIsLoading(false);
      
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to +91 ${phoneNumber}`,
      });
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate OTP verification (replace with actual API call)
    setTimeout(() => {
      setIsLoading(false);
      setStep('grade');
      
      toast({
        title: "Phone Verified!",
        description: "Now select your grade level to continue.",
      });
    }, 1000);
  };

  const handleGradeSelection = (gradeId: string) => {
    setSelectedGrade(gradeId);
  };

  const handleCompleteSignIn = () => {
    if (!selectedGrade) {
      toast({
        title: "Grade Required",
        description: "Please select your grade level to continue.",
        variant: "destructive"
      });
      return;
    }

    // Store user authentication and grade data
    const userData = {
      phoneNumber,
      grade: selectedGrade,
      isAuthenticated: true,
      signInDate: new Date().toISOString(),
      accessLevel: selectedGrade // Restrict access to only this grade
    };

    localStorage.setItem('stemquest_user', JSON.stringify(userData));
    localStorage.setItem('stemquest_auth', JSON.stringify({
      isAuthenticated: true,
      phoneNumber,
      grade: selectedGrade,
      loginTime: new Date().toISOString()
    }));

    const gradeName = gradeOptions.find(g => g.id === selectedGrade)?.name;
    
    toast({
      title: "Welcome to STEM Quest!",
      description: `Successfully signed in for ${gradeName}`,
    });

    // Redirect to the specific grade dashboard
    setLocation(`/dashboard/${selectedGrade}`);
  };

  const handleResendOTP = () => {
    setOtp("");
    handleSendOTP();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <div className="inline-flex items-center space-x-4 
            bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
            text-white px-8 py-4 rounded-full 
            text-2xl font-extrabold shadow-2xl mb-6">
            <Brain className="h-8 w-8" />
            <span>STEM Quest</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sign In to Continue
          </h1>
          <p className="text-gray-600">
            Secure access with phone verification
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'phone' ? 'bg-blue-600 text-white' : 
              step === 'otp' || step === 'grade' ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {step === 'otp' || step === 'grade' ? <CheckCircle className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
            </div>
            <div className={`w-12 h-1 ${step === 'otp' || step === 'grade' ? 'bg-green-500' : 'bg-gray-300'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'otp' ? 'bg-blue-600 text-white' : 
              step === 'grade' ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {step === 'grade' ? <CheckCircle className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
            </div>
            <div className={`w-12 h-1 ${step === 'grade' ? 'bg-green-500' : 'bg-gray-300'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 'grade' ? 'bg-blue-600 text-white' : 'bg-gray-300'
            }`}>
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Phone Number Step */}
        {step === 'phone' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Enter Phone Number</span>
              </CardTitle>
              <CardDescription>
                We'll send you a verification code to confirm your identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                    <span className="text-sm text-gray-600">+91</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    className="rounded-l-none"
                    maxLength={10}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSendOTP}
                disabled={isLoading || phoneNumber.length !== 10}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send OTP"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Verify OTP</span>
              </CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to +91 {phoneNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={handleResendOTP}
                className="w-full"
              >
                Resend OTP
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Grade Selection Step */}
        {step === 'grade' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Select Your Grade</span>
              </CardTitle>
              <CardDescription>
                Choose your current grade level for personalized learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {gradeOptions.map((grade) => {
                  const IconComponent = grade.icon;
                  const isSelected = selectedGrade === grade.id;
                  
                  return (
                    <div
                      key={grade.id}
                      className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleGradeSelection(grade.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${grade.color} text-white`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{grade.name}</h3>
                          <p className="text-sm text-gray-600">{grade.description}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {grade.ageRange}
                          </Badge>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Button 
                onClick={handleCompleteSignIn}
                disabled={!selectedGrade}
                className="w-full mt-6"
              >
                Complete Sign In
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
