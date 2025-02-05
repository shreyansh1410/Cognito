import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 animate-gradient-xy"></div>
      </div>

      {/* Translucent header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white bg-opacity-70 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Second Brain</h1>
          <Link to="/auth">
            <Button
              variant="outline"
              className="bg-white bg-opacity-50 hover:bg-opacity-100 transition-all duration-300"
            >
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Organize Your Thoughts
          </motion.h2>
          <motion.p
            className="text-xl text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Capture, organize, and retrieve your ideas effortlessly
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Start Your Journey
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Feature sliders */}
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
              >
                <Card className="bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonial slider */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                quote:
                  "Second Brain has revolutionized how I manage my ideas and projects.",
              },
              {
                name: "Sarah Lee",
                quote:
                  "I can finally keep track of all my research in one place. It's a game-changer!",
              },
              {
                name: "Mike Chen",
                quote:
                  "The connections I've discovered between my notes have led to amazing insights.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 * (index + 6) }}
              >
                <Card className="bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-300">
                  <CardContent className="p-6">
                    <p className="italic mb-4">"{testimonial.quote}"</p>
                    <p className="font-semibold">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Second Brain</h3>
              <p>Empowering your ideas, one note at a time.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/auth" className="hover:text-gray-300">
                    Get Started
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-300">
                  Twitter
                </a>
                <a href="#" className="hover:text-gray-300">
                  Facebook
                </a>
                <a href="#" className="hover:text-gray-300">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 Second Brain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
