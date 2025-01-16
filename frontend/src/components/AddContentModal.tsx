import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createContent } from "../services/api";

const contentTypes = ["image", "video", "article", "audio", "tweet"];

const initialTags = [
  "productivity",
  "learning",
  "technology",
  "science",
  "art",
  "music",
];

interface AddContentModalProps {
  onClose: () => void;
  onContentAdded: () => void;
}

export function AddContentModal({
  onClose,
  onContentAdded,
}: AddContentModalProps) {
  const [type, setType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [availableTags, setAvailableTags] = useState(initialTags);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!type || !title || !link) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createContent({
        type,
        title,
        link,
        tags,
      });

      if (onContentAdded) {
        onContentAdded();
      }

      // Reset form
      setType("");
      setTitle("");
      setLink("");
      setTags([]);
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setError(
          err.response.data.error ||
            err.response.data.msg ||
            "Failed to add content"
        );
      } else {
        setError("Failed to add content. Please try again.");
      }
      console.error("Error creating content:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      if (!availableTags.includes(newTag)) {
        setAvailableTags([...availableTags, newTag]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((contentType) => (
                    <SelectItem key={contentType} value={contentType}>
                      {contentType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Link
              </Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <div className="col-span-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newTag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="mt-2">
                  <Label>Available Tags:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setTags([...new Set([...tags, tag])])}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Content"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
