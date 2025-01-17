import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { EditContentDialog } from "./EditContentDialog";
import { Button } from "./ui/button";
import {
  Share2,
  Trash2,
  FileText,
  Twitter,
  Youtube,
  Image,
  FileAudio,
} from "lucide-react";
import { useEffect } from "react";

interface NoteCardProps {
  id: string;
  title: string;
  content?: string;
  type: "document" | "tweet" | "video" | "image" | "article" | "audio";
  tags: string[];
  date: string;
  link: string;
  onDelete: () => void;
  onEdit: (data: {
    title: string;
    type: "document" | "tweet" | "video" | "image" | "article" | "audio";
    link: string;
    tags: string[];
  }) => void;
}

export function NoteCard({
  id,
  title,
  content,
  type,
  link,
  tags,
  date,
  onDelete,
  onEdit,
}: NoteCardProps) {
  // Load Twitter widget script when needed
  useEffect(() => {
    if (type === "tweet") {
      // Remove existing script if any
      const existingScript = document.getElementById("twitter-widget");
      if (existingScript) {
        existingScript.remove();
      }

      // Create and append new Twitter script
      const script = document.createElement("script");
      script.id = "twitter-widget";
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);

      return () => {
        // Cleanup script on component unmount
        const script = document.getElementById("twitter-widget");
        if (script) {
          script.remove();
        }
      };
    }
  }, [type]);

  const Icon = {
    document: FileText,
    tweet: Twitter,
    video: Youtube,
    image: Image,
    article: FileText,
    audio: FileAudio,
  }[type];

  const handleShare = () => {
    // Implement share functionality
    console.log("Share note:", id);
  };

  const getYouTubeVideoId = (url: string) => {
    const urlParams = new URL(url).searchParams;
    return urlParams.get("v") || url.split("/").pop();
  };

  const formatTweetUrl = (url: string) => {
    // Convert x.com URLs to twitter.com
    return url.replace("x.com", "twitter.com");
  };

  const renderContent = () => {
    switch (type) {
      case "tweet":
        // Extract tweet ID from URL
        link = formatTweetUrl(link);
        const tweetId = link.split("/").pop();
        return (
          <div className="mt-4 min-h-[200px]">
            <div id={`tweet-${tweetId}`}>
              <blockquote className="twitter-tweet">
                <a href={link}></a>
              </blockquote>
            </div>
          </div>
        );

      case "video":
        const videoId = getYouTubeVideoId(link);
        return (
          <div className="mt-4">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="mt-4">
            <img
              src={link}
              alt={title}
              className="max-h-[400px] w-auto rounded-lg object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
        );

      default:
        return (
          <div className="mt-4">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-words"
            >
              {link}
            </a>
            {content && <p className="text-sm text-gray-500 mt-2">{content}</p>}
          </div>
        );
    }
  };

  return (
    <Card className="h-auto">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-gray-500" />
            {title}
          </div>
        </CardTitle>
        <div className="flex gap-1">
          <EditContentDialog
            id={id}
            initialData={{
              title,
              type,
              link,
              tags,
            }}
            onEdit={onEdit}
          />
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button> */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
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
