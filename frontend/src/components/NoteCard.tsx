import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Share2, Trash2, FileText, Twitter, Youtube } from "lucide-react";

interface NoteCardProps {
  title: string;
  content?: string;
  type: "document" | "tweet" | "video";
  tags: string[];
  date: string;
}

export function NoteCard({ title, content, type, tags, date }: NoteCardProps) {
  const Icon = {
    document: FileText,
    tweet: Twitter,
    video: Youtube,
  }[type];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-gray-500" />
            {title}
          </div>
        </CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {content && <p className="text-sm text-gray-500 mt-2">{content}</p>}
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-4">Added on {date}</div>
      </CardContent>
    </Card>
  );
}
