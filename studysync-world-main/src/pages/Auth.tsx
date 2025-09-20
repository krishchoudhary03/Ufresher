import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Heart, ArrowLeft } from 'lucide-react';
import { profilePics } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/lib/types';

interface AuthProps {
  onBack: () => void;
  onAuthSuccess: (user: User) => void;
}

const Auth = ({ onBack, onAuthSuccess }: AuthProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTab, setSelectedTab] = useState('login');
  const { toast } = useToast();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    adminCode: ''
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '' as 'junior' | 'mentor',
    age: '',
    college: '',
    stream: '',
    profilePic: profilePics[0]
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(loginForm.email, loginForm.password, loginForm.adminCode);
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
        // The user will be set by the auth context, so we don't need to call onAuthSuccess here
        // The routing will handle the redirect
      } else {
        toast({
          title: "Login failed",
          description: result.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        toast({
          title: "Redirecting...",
          description: "Please complete sign in with Google",
        });
        // The redirect will happen automatically
      } else {
        toast({
          title: "Error",
          description: result.error || "Google login failed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Google login failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.role) {
      toast({
        title: "Please select a role",
        description: "Choose whether you're a Junior or Mentor",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role,
        age: parseInt(registerForm.age),
        college: registerForm.college,
        stream: registerForm.stream,
        profilePic: registerForm.profilePic
      });
      
      if (result.success) {
        toast({
          title: "Welcome to U-fresher!",
          description: "Account created successfully",
        });
        // The user will be set by the auth context
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-bold gradient-text flex items-center justify-center gap-2">
            U-fresher <Heart className="h-8 w-8 text-accent" />
          </h1>
          <p className="text-muted-foreground">Join your college community today</p>
        </div>

        {/* Auth Tabs */}
        <Card className="glass-card">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminCode">Admin Code (Optional)</Label>
                    <Input
                      id="adminCode"
                      type="password"
                      placeholder="Enter admin code for admin access"
                      value={loginForm.adminCode}
                      onChange={(e) => setLoginForm({...loginForm, adminCode: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use "Createrkkrishavya" for admin access
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-cosmic" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    Google Sign In
                  </Button>

                  <div className="text-center space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      Create Account
                    </Badge>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Sign up for a new account or use existing credentials</p>
                    </div>
                  </div>
                </form>
              </CardContent>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join the U-fresher community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="18"
                        value={registerForm.age}
                        onChange={(e) => setRegisterForm({...registerForm, age: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={registerForm.role} onValueChange={(value: 'junior' | 'mentor') => setRegisterForm({...registerForm, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior (Student)</SelectItem>
                        <SelectItem value="mentor">Mentor (Senior/Alumni)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="college">College</Label>
                      <Input
                        id="college"
                        placeholder="Your college"
                        value={registerForm.college}
                        onChange={(e) => setRegisterForm({...registerForm, college: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stream">Stream</Label>
                      <Input
                        id="stream"
                        placeholder="Computer Science"
                        value={registerForm.stream}
                        onChange={(e) => setRegisterForm({...registerForm, stream: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {profilePics.map((pic, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`w-12 h-12 rounded-full border-2 overflow-hidden ${
                            registerForm.profilePic === pic ? 'border-primary' : 'border-muted'
                          }`}
                          onClick={() => setRegisterForm({...registerForm, profilePic: pic})}
                        >
                          <img src={pic} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-cosmic" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;