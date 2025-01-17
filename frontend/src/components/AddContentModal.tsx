import React, { useState, useRef } from "react";
import axios from "axios";
import {
  validateContentType,
  getErrorMessage,
} from "../utils/ContentValidation";
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
import { createContent, uploadFile } from "../services/api";

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
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setLink("");
    setFile(null);
    setError(""); // Clear any existing errors
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const fileType = selectedFile.type.split("/")[0];
    if (
      (type === "image" && !fileType.startsWith("image")) ||
      (type === "video" && !fileType.startsWith("video")) ||
      (type === "audio" && !fileType.startsWith("audio"))
    ) {
      setError(`Invalid file type for ${type} content`);
      return;
    }

    setFile(selectedFile);
    setLink(""); // Clear link when file is selected
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!type || !title) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate content type if a link is provided
    if (link && !validateContentType(type, link)) {
      setError(getErrorMessage(type));
      return;
    }

    // Validate that either a link or file is provided
    if (!link && !file) {
      setError("Please provide either a link or upload a file");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedUrl = link;

      // If there's a file, upload it first
      if (file) {
        const uploadResponse = await uploadFile(file, (progress) => {
          setUploadProgress(progress);
        });
        uploadedUrl = uploadResponse.url;
      }

      // Create content with the link or uploaded file URL
      await createContent({
        type,
        title,
        link: uploadedUrl,
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
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
              <Select value={type} onValueChange={handleTypeChange}>
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
            {/* Content Input (File or URL) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Content</Label>
              <div className="col-span-3 space-y-2">
                {(type === "image" || type === "video" || type === "audio") && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept={
                        type === "image"
                          ? "image/*"
                          : type === "video"
                          ? "video/*"
                          : "audio/*"
                      }
                      onChange={handleFileChange}
                      className="w-full"
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                    <div className="text-sm text-gray-500 text-center">or</div>
                  </div>
                )}
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={
                    type
                      ? `Enter ${type} URL`
                      : "Please select a content type first"
                  }
                  disabled={!type}
                  className="w-full"
                />
              </div>
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
