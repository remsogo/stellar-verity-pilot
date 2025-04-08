
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/UI/ThemeToggle";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { LoginForm, LoginFormValues } from "@/components/Auth/LoginForm";
import { SignupForm, SignupFormValues } from "@/components/Auth/SignupForm";
import { checkAuthSession, loginUser, signupUser } from "@/components/Auth/AuthService";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [checkingSession, setCheckingSession] = useState(true);
  const { refreshProjectSelection } = useSelectedProject();
  
  // Get the redirect path from location state or default to '/projects'
  const from = (location.state as { from?: string })?.from || "/projects";

  useEffect(() => {
    const checkSession = async () => {
      const session = await checkAuthSession();
      if (session) {
        console.log("User already authenticated, redirecting to:", from);
        navigate(from === "/auth" ? "/projects" : from, { replace: true });
      } else {
        console.log("No active session found, showing login form");
      }
      setCheckingSession(false);
    };
    
    checkSession();
  }, [navigate, from]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await loginUser(values);
      
      console.log("Login successful, refreshing project selection");
      await refreshProjectSelection();
      
      // Always redirect to projects after login
      console.log("Redirecting to projects after login");
      navigate("/projects", { replace: true });
    } catch (error) {
      // Error is handled in the login service
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      await signupUser(values);
      setActiveTab("login");
    } catch (error) {
      // Error is handled in the signup service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">TestNexus</h1>
          <p className="text-muted-foreground mt-1">Test management application</p>
        </div>
        
        <Card className="border-none shadow-lg">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
