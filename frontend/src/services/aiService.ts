// AI Service for handling API calls to the AI backend
import { toast } from "@/hooks/use-toast";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface AIResponse {
  response: string;
  sources?: {
    title: string;
    url?: string;
    content?: string;
    type: "note" | "link" | "video" | "other";
  }[];
}

// For direct API calls to Gemini without a backend
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export const aiService = {
  // Method to send a message to the backend AI endpoint
  async sendMessageToBackend(message: string, history: Message[]): Promise<AIResponse> {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  // Method to send a message directly to Gemini API (fallback if no backend)
  async sendMessageToGemini(
    message: string, 
    history: Message[], 
    apiKey: string
  ): Promise<AIResponse> {
    try {
      // Format messages for Gemini API
      const formattedMessages = history.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));
      
      // Add the current message
      formattedMessages.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response from Gemini");
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a response.";

      return {
        response: aiResponse,
        sources: [], // Gemini doesn't provide sources directly
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  },

  // Unified method that tries backend first, falls back to direct Gemini API if configured
  async sendMessage(
    message: string, 
    history: Message[], 
    options: { 
      useDirectApi?: boolean; 
      apiKey?: string;
    } = {}
  ): Promise<AIResponse> {
    try {
      // If direct API is enabled and API key is provided, use Gemini directly
      if (options.useDirectApi && options.apiKey) {
        return await this.sendMessageToGemini(message, history, options.apiKey);
      }
      
      // Otherwise use backend
      return await this.sendMessageToBackend(message, history);
    } catch (error) {
      console.error("AI Service Error:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
      });
      throw error;
    }
  }
};
