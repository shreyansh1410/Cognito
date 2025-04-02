import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, Github, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../context/authContext";
import { toast } from "@/hooks/use-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const testimonials = [
    {
      name: "Alex Johnson",
      quote: "Cognito has revolutionized how I manage my ideas and projects.",
      role: "Product Manager"
    },
    {
      name: "Sarah Lee",
      quote: "I can finally keep track of all my research in one place. It's a game-changer!",
      role: "Academic Researcher"
    },
    {
      name: "Mike Chen",
      quote: "The connections I've discovered between my notes have led to amazing insights.",
      role: "Content Creator"
    },
    {
      name: "Emily Rodriguez",
      quote: "As a student, Cognito helps me organize my study materials efficiently.",
      role: "Graduate Student"
    },
    {
      name: "David Kim",
      quote: "The tagging system is brilliant. I can find anything in seconds!",
      role: "Software Engineer"
    }
  ];

  useEffect(() => {
    // Auto-rotate testimonials
    testimonialIntervalRef.current = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (testimonialIntervalRef.current) {
        clearInterval(testimonialIntervalRef.current);
      }
    };
  }, [testimonials.length]);

  const nextTestimonial = () => {
    if (testimonialIntervalRef.current) {
      clearInterval(testimonialIntervalRef.current);
    }
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    testimonialIntervalRef.current = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
  };

  const prevTestimonial = () => {
    if (testimonialIntervalRef.current) {
      clearInterval(testimonialIntervalRef.current);
    }
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
    testimonialIntervalRef.current = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
  };

  const handleAuthSuccess = (data: { token: string; firstName: string; email: string; userId: string; msg?: string }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("firstName", data.firstName);
    localStorage.setItem("email", data.email);
    localStorage.setItem("userId", data.userId);
    login(data.email, data.token, data.firstName, data.userId);
    toast({
      description: data.msg || "Successfully logged in!",
    });
    navigate(`/dashboard`);
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);

      if (!credentialResponse.credential) {
        throw new Error("No credentials received");
      }

      const response = await fetch(`${BACKEND_URL}/api/v1/auth/google-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: credentialResponse.credential }),
        mode: "cors",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(errorText || "Failed to authenticate");
      }

      const data = await response.json();
      handleAuthSuccess(data);
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      toast({
        variant: "destructive",
        description: error.message || "Authentication failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    toast({
      variant: "destructive",
      description: "Google login failed. Please try again.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    try {
      if (isLogin) {
        const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Login failed");
        }

        if (data.token) {
          handleAuthSuccess(data);
        } else {
          throw new Error("No token received");
        }
      } else {
        const response = await fetch(`${BACKEND_URL}/api/v1/user/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, firstName, lastName }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || data.error || "Signup failed");
        }

        if (data.token) {
          handleAuthSuccess(data);
        } else {
          throw new Error("No token received");
        }
      }
    } catch (error: any) {
      console.error("Auth error details:", error);
      toast({
        variant: "destructive",
        description: error.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="fixed inset-0 z-[-1] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),rgba(0,0,0,0.01),transparent)]"></div>
      </div>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold text-black"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Cognito
          </motion.h1>
          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setIsLogin(true);
                setShowAuthModal(true);
              }}
            >
              Sign In
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => {
                setIsLogin(false);
                setShowAuthModal(true);
              }}
            >
              Sign Up
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Your Second Brain
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Capture, organize, and retrieve your ideas effortlessly. Cognito helps you build your personal knowledge base.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
              >
                Get Started for Free
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Capture Ideas",
                description: "Save thoughts, articles, and media in one place",
              },
              {
                title: "Organize Content",
                description:
                  "Tag and categorize your content for easy retrieval",
              },
              {
                title: "Connect Thoughts",
                description: "Discover connections between your ideas",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 * (index + 3) }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <Card className="border border-gray-200 hover:shadow-md transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-black">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Animated Testimonial Carousel */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            What Our Users Say
          </h2>
          <div className="relative max-w-3xl mx-auto px-10">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-black hover:bg-gray-100"
              onClick={prevTestimonial}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="overflow-hidden relative h-64">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Card className="border border-gray-200 shadow-md w-full">
                    <CardContent className="p-8 text-center">
                      <p className="italic mb-6 text-gray-700 text-lg">"{testimonials[currentTestimonial].quote}"</p>
                      <div>
                        <p className="font-semibold text-black text-lg">{testimonials[currentTestimonial].name}</p>
                        <p className="text-gray-500">{testimonials[currentTestimonial].role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-black hover:bg-gray-100"
              onClick={nextTestimonial}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? "w-6 bg-black" : "w-2 bg-gray-300"
                  }`}
                  onClick={() => {
                    if (testimonialIntervalRef.current) {
                      clearInterval(testimonialIntervalRef.current);
                    }
                    setCurrentTestimonial(index);
                    testimonialIntervalRef.current = setInterval(() => {
                      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
                    }, 5000);
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="text-center mb-16">
          <motion.h2
            className="text-3xl font-bold text-black mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Organize Your Thoughts?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => {
                setIsLogin(false);
                setShowAuthModal(true);
              }}
            >
              Start Your Journey
            </Button>
          </motion.div>
        </section>
      </main>

      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
              <p className="text-gray-600"> 2025 Cognito. All rights reserved.</p>
              <a 
                href="https://github.com/shreyansh1410/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <Github size={18} />
                <span>shreyansh1410</span>
              </a>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" className="text-gray-600 hover:text-black hover:bg-transparent">
                Privacy
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-black hover:bg-transparent">
                Terms
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-black hover:bg-transparent">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full border border-gray-200">
                <div className="p-4 flex justify-between items-center border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-black">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAuthModal(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <Tabs value={isLogin ? "login" : "signup"} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                      <TabsTrigger
                        value="login"
                        onClick={() => setIsLogin(true)}
                        disabled={isLoading}
                        className="data-[state=active]:bg-white"
                      >
                        Login
                      </TabsTrigger>
                      <TabsTrigger
                        value="signup"
                        onClick={() => setIsLogin(false)}
                        disabled={isLoading}
                        className="data-[state=active]:bg-white"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="johndoe@email.com"
                              required
                              disabled={isLoading}
                              className="border-gray-300 focus:border-black focus:ring-black"
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password" className="text-gray-700">Password</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              placeholder="********"
                              required
                              disabled={isLoading}
                              minLength={8}
                              className="border-gray-300 focus:border-black focus:ring-black"
                            />
                          </div>
                        </div>
                        <Button
                          className="w-full mt-6 bg-black text-white hover:bg-gray-800"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Please wait..." : "Login"}
                        </Button>
                      </form>
                      <div className="flex flex-col items-center mt-4">
                        <div className="relative w-full my-4">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                          </div>
                        </div>
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleFailure}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="signup">
                      <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              required
                              placeholder="John"
                              disabled={isLoading}
                              className="border-gray-300 focus:border-black focus:ring-black"
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              placeholder="Doe"
                              disabled={isLoading}
                              className="border-gray-300 focus:border-black focus:ring-black"
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="johndoe@email.com"
                              required
                              disabled={isLoading}
                              className="border-gray-300 focus:border-black focus:ring-black"
                            />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password" className="text-gray-700">Password</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              placeholder="********"
                              required
                              disabled={isLoading}
                              minLength={8}
                              className="border-gray-300 focus:border-black focus:ring-black"
                            />
                          </div>
                        </div>
                        <Button
                          className="w-full mt-6 bg-black text-white hover:bg-gray-800"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Please wait..." : "Sign Up"}
                        </Button>
                      </form>
                      <div className="flex flex-col items-center mt-4">
                        <div className="relative w-full my-4">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                          </div>
                        </div>
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleFailure}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
