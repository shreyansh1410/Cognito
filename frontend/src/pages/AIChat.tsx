import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function AIChat() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cognito AI Assistant</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>About Cognito AI</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
    </div>
  );
}
