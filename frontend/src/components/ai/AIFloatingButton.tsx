import React, { useState } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AISearchBar } from "./AISearchBar";
import { motion, AnimatePresence } from "framer-motion";

interface AIFloatingButtonProps {
  position?: "bottom-right" | "bottom-left";
}

export function AIFloatingButton({ position = "bottom-right" }: AIFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`fixed ${positionClasses[position]} z-50 rounded-full h-12 w-12 shadow-lg ${
          isOpen ? "bg-gray-700" : "bg-black"
        } text-white hover:bg-gray-800`}
      >
        {isOpen ? <X size={20} /> : <Bot size={20} />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed ${
              position === "bottom-right" ? "bottom-20 right-4" : "bottom-20 left-4"
            } z-50`}
          >
            <Card className="w-80 sm:w-96 shadow-xl border border-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Bot size={16} className="mr-2" />
                    <h3 className="font-medium">Ask Cognito AI</h3>
                  </div>
                </div>
                <AISearchBar compact={true} />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
