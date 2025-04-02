import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Message } from "@/services/aiService";

interface AIContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  useDirectApi: boolean;
  setUseDirectApi: (use: boolean) => void;
  chatHistory: Message[];
  addMessage: (message: Message) => void;
  clearHistory: () => void;
  isConfigured: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string>("");
  const [useDirectApi, setUseDirectApi] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("gemini_api_key");
    const storedUseDirectApi = localStorage.getItem("use_direct_api") === "true";
    
    if (storedApiKey) setApiKey(storedApiKey);
    setUseDirectApi(storedUseDirectApi);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("gemini_api_key", apiKey);
    localStorage.setItem("use_direct_api", String(useDirectApi));
  }, [apiKey, useDirectApi]);

  const addMessage = (message: Message) => {
    setChatHistory(prev => [...prev, message]);
  };

  const clearHistory = () => {
    setChatHistory([]);
  };

  // Check if AI is configured properly
  const isConfigured = useDirectApi ? Boolean(apiKey) : true;

  const value = {
    apiKey,
    setApiKey,
    useDirectApi,
    setUseDirectApi,
    chatHistory,
    addMessage,
    clearHistory,
    isConfigured
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
