import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Clipboard, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check for note context on component mount
  useEffect(() => {
    const noteContext = localStorage.getItem("ai_note_context");
    if (noteContext) {
      try {
        const parsedContext = JSON.parse(noteContext);
        const contextPrompt = `I want to ask about this note: "${parsedContext.title}"${
          parsedContext.content ? `\n\nContent: ${parsedContext.content}` : ""
        }${parsedContext.link ? `\n\nLink: ${parsedContext.link}` : ""}${
          parsedContext.tags.length > 0 ? `\n\nTags: ${parsedContext.tags.join(", ")}` : ""
        }`;
        setInput(contextPrompt);
        
        // Clear the context after using it
        localStorage.removeItem("ai_note_context");
      } catch (error) {
        console.error("Error parsing note context:", error);
      }
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const callGeminiAPI = async (prompt: string, history: Message[]) => {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      throw new Error("Gemini API key not found. Please add it in the AI settings.");
    }

    // Format the conversation history for Gemini API
    const formattedHistory = history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Add the current prompt
    formattedHistory.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    // Make the API call to Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: formattedHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get response from Gemini API");
    }

    const data = await response.json();
    
    // Extract the response text from Gemini API
    if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const useDirectApi = localStorage.getItem("use_direct_api") === "true";
      let aiResponse;

      if (useDirectApi) {
        aiResponse = await callGeminiAPI(input, messages);
      } else {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        
        const response = await fetch(`${BACKEND_URL}/api/v1/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            message: input,
            history: messages,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Backend API error:", errorText);
          throw new Error(`Failed to get response from AI: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        aiResponse = data.response;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from AI. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      description: "Copied to clipboard",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500">
              <Bot size={48} className="mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Ask Cognito AI</h3>
              <p className="max-w-md">
                Ask questions about your notes, links, and content. The AI will use the context from your saved items to provide relevant answers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <Card
                  key={index}
                  className={`${
                    message.role === "assistant"
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <CardContent className="p-4 relative">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1.5 rounded-md ${message.role === "assistant" ? "bg-black text-white" : "bg-gray-200"}`}>
                        {message.role === "assistant" ? (
                          <Bot size={16} />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-gray-900"
                          onClick={() => copyToClipboard(message.content, index)}
                        >
                          {copiedIndex === index ? (
                            <Check size={16} />
                          ) : (
                            <Clipboard size={16} />
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Cognito AI..."
              className="min-h-[60px] resize-none pr-12 py-3"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Cognito AI uses your content to provide contextual answers. Responses may not always be accurate.
        </p>
      </div>
    </div>
  );
}
