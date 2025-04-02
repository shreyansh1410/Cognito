import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

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
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate('/auth?tab=signup')}
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
                onClick={() => navigate('/auth?tab=signup')}
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
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: -currentTestimonial * 100 + '%' }}
                transition={{ duration: 0.5 }}
                style={{ width: `${testimonials.length * 100}%` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="w-full px-4"
                    style={{ flex: `0 0 ${100 / testimonials.length}%` }}
                  >
                    <Card className="border-gray-200 bg-white shadow-sm h-full">
                      <CardContent className="p-6 text-center">
                        <p className="text-lg text-gray-700 mb-4 italic">
                          "{testimonial.quote}"
                        </p>
                        <div>
                          <p className="font-semibold text-black">
                            {testimonial.name}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </motion.div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-black hover:bg-gray-100"
              onClick={nextTestimonial}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex justify-center mt-4 gap-1">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentTestimonial === index
                    ? "bg-black"
                    : "bg-gray-300"
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
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold text-black mb-4">
                Powerful Note-Taking
              </h2>
              <p className="text-gray-600 mb-6">
                Capture your thoughts with rich text editing, code snippets, and
                media embeds. Our editor supports markdown, LaTeX, and more.
              </p>
              <ul className="space-y-2">
                {[
                  "Rich text formatting",
                  "Code syntax highlighting",
                  "Image and file attachments",
                  "Web page clipping",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="mr-2 h-5 w-5 text-green-500">✓</div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-gray-100 rounded-lg p-4 h-80 flex items-center justify-center"
            >
              <div className="text-center text-gray-500">
                [Editor Screenshot]
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gray-50 rounded-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-black mb-4">
              Ready to Organize Your Thoughts?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already using Cognito to enhance
              their productivity and creativity.
            </p>
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate('/auth?tab=signup')}
            >
              Start Your Free Account
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Cognito</h3>
              <p className="text-gray-600">
                Your personal knowledge management system.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Tutorials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p> 2025 Cognito. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
