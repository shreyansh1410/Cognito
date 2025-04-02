import { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIContextType {
  chatHistory: Message[];
  addMessage: (message: Message) => void;
  clearHistory: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setChatHistory(prev => [...prev, message]);
  };

  const clearHistory = () => {
    setChatHistory([]);
  };

  const value = {
    chatHistory,
    addMessage,
    clearHistory
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}
