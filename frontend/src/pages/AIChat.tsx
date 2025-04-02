import React, { useState } from "react";
import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AIChat() {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [useDirectApi, setUseDirectApi] = useState(
    localStorage.getItem("use_direct_api") === "true"
  );

  const saveSettings = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    localStorage.setItem("use_direct_api", String(useDirectApi));
    setShowSettings(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cognito AI Assistant</h1>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Cognito AI</DialogTitle>
                <DialogDescription>
                  Cognito AI uses your saved content to provide contextually relevant answers to your questions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <h4 className="font-medium">How it works:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ask questions about your saved notes, links, and videos</li>
                  <li>The AI searches through your content for relevant information</li>
                  <li>Responses are generated based on your personal knowledge base</li>
                  <li>Sources are cited when information from your content is used</li>
                </ul>
                <p className="text-sm text-gray-500">
                  Note: AI responses may not always be accurate. Always verify important information.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border border-gray-200 h-[calc(100vh-12rem)]">
        <AIChatInterface />
      </Card>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Settings</DialogTitle>
            <DialogDescription>
              Configure how the AI assistant works with your content.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="connection" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="connection" className="space-y-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="use-direct" className="text-sm font-medium">
                  API Connection
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="use-direct"
                    checked={useDirectApi}
                    onChange={(e) => setUseDirectApi(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="use-direct" className="text-sm">
                    Use direct Gemini API (no backend required)
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Enable this if you want to use the Gemini API directly without a backend.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="api-key" className="text-sm font-medium">
                  Gemini API Key
                </label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Required if using direct API. Get your API key from{" "}
                  <a
                    href="https://ai.google.dev/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="preferences" className="space-y-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Content Sources</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Notes", "Links", "Videos", "Documents"].map((source) => (
                    <div key={source} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`source-${source.toLowerCase()}`}
                        defaultChecked
                        className="rounded border-gray-300"
                      />
                      <label
                        htmlFor={`source-${source.toLowerCase()}`}
                        className="text-sm"
                      >
                        {source}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={saveSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
