import React, { useState, useRef } from "react";
import { Send, Loader2, Bot, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { aiService, Message } from "@/services/aiService";
import ReactMarkdown from "react-markdown";

interface AISearchBarProps {
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export function AISearchBar({ 
  placeholder = "Ask Cognito AI...", 
  className = "",
  compact = false
}: AISearchBarProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    setShowResults(true);
    
    // Add user message
    const userMessage: Message = { role: "user", content: query };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Get API key and settings from localStorage
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const useDirectApi = localStorage.getItem("use_direct_api") === "true";
      
      // Use the AI service to get a response
      const response = await aiService.sendMessage(query, messages, {
        useDirectApi,
        apiKey
      });
      
      // Add assistant message
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response.response 
      }]);
      
      // Clear input
      setQuery("");
    } catch (error) {
      console.error("AI Search Error:", error);
      // Add error message
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error while processing your request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowResults(false);
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      {showResults && (
        <Card className="absolute z-50 w-full mt-2 shadow-lg max-h-[500px] overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2">
                <Bot size={16} />
                <span className="font-medium">AI Results</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={clearChat}
              >
                <X size={14} />
              </Button>
            </div>
            <ScrollArea className={compact ? "h-[300px]" : "h-[400px]"}>
              <div className="p-3 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-gray-100"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="flex gap-2 items-start">
                      <div className={`mt-1 p-1 rounded-full ${
                        message.role === "assistant" 
                          ? "bg-black text-white" 
                          : "bg-gray-200"
                      }`}>
                        {message.role === "assistant" ? (
                          <Bot size={12} />
                        ) : (
                          <span className="text-xs px-1">You</span>
                        )}
                      </div>
                      <div className="flex-1">
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
