import express from "express";
import { Request, Response } from "../../index";
import axios from "axios";
import { userMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Helper: Detect tweet URL in message
function extractTweetUrl(text: string): string | null {
  const regex = /(https?:\/\/twitter\.com\/[A-Za-z0-9_]+\/status\/[0-9]+)/;
  const match = text.match(regex);
  return match ? match[1] : null;
}

// Helper: Fetch tweet content using Twitter oEmbed (no auth, gets HTML)
async function fetchTweetContent(tweetUrl: string): Promise<string | null> {
  try {
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}`;
    const response = await axios.get(oembedUrl);
    // Extract the tweet text from the HTML (simple regex, not perfect but works for most)
    const html = response.data.html;
    const textMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    if (textMatch) {
      // Remove any HTML tags inside the <p>
      const text = textMatch[1].replace(/<[^>]+>/g, '');
      return text;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch tweet content:', err.message);
    return null;
  }
}

router.post("/chat", userMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured on the server" });
    }

    let tweetContext = '';
    const tweetUrl = extractTweetUrl(message);
    if (tweetUrl) {
      const tweetText = await fetchTweetContent(tweetUrl);
      if (tweetText) {
        tweetContext = `\n\n[Referenced Tweet]\n${tweetText}\n`;
      }
    }

    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    formattedHistory.push({
      role: "user",
      parts: [{ text: tweetContext ? (message + tweetContext) : message }]
    });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
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
      },
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if (response.data.candidates && response.data.candidates[0]?.content?.parts?.length > 0) {
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      
      return res.status(200).json({
        response: aiResponse,
        sources: []
      });
    } else {
      return res.status(500).json({ error: "Invalid response format from Gemini API" });
    }
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      
      return res.status(error.response.status).json({ 
        error: "Failed to get response from AI",
        details: error.response.data?.error?.message || error.message || "Unknown error"
      });
    } else if (error.request) {
      console.error("No response received:", error.request);
      return res.status(500).json({ 
        error: "No response received from AI service",
        details: error.message || "Unknown error"
      });
    } else {
      return res.status(500).json({ 
        error: "Error setting up AI request",
        details: error.message || "Unknown error"
      });
    }
  }
});

export default router;
