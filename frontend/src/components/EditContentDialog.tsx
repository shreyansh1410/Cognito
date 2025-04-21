import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Display type (for viewing)
type ContentType =
  | "document"
  | "tweet"
  | "video"
  | "image"
  | "article"
  | "audio"
  | "link";

// Editable type (for editing - matches backend)
type EditableContentType =
  | "video"
  | "image"
  | "article"
  | "audio"
  | "tweet"
  | "link";

interface EditContentDialogProps {
  id: string;
  initialData: {
    title: string;
    type: ContentType;
    link: string;
    tags: string[];
  };
  onEdit?: (newData: {
    title: string;
    type: EditableContentType;
    link: string;
    tags: string[];
  }) => void;
}

export function EditContentDialog({
  initialData,
  onEdit,
}: EditContentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    ...initialData,
    // Convert initial type to EditableContentType if needed
    type: initialData.type as EditableContentType,
  });
  const [tagsInput, setTagsInput] = useState(initialData.tags.join(", "));
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const processedTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Only allow submission if type is a valid EditableContentType
    if (isEditableContentType(formData.type)) {
      try {
        if (onEdit) {
          if (file) {
            // If there's a file, use FormData
            const formData: any = new FormData();
            formData.append("file", file);
            formData.append("type", formData.type);
            formData.append("title", formData.title);
            formData.append("tags", JSON.stringify(processedTags));

            const response = await axios.put("/api/content/edit", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const progress = progressEvent.total
                  ? Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                    )
                  : 0;
                setUploadProgress(progress);
              },
            });

            onEdit(response.data.content);
          } else {
            // If using existing link or new link URL
            onEdit({
              ...formData,
              type: formData.type,
              tags: processedTags,
            });
          }
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Error updating content:", error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Clear the link when a file is selected
      setFormData({ ...formData, link: "" });
    }
  };

  // Type guard to check if a type is an EditableContentType
  const isEditableContentType = (
    type: ContentType
  ): type is EditableContentType => {
    return ["video", "image", "article", "audio", "tweet", "link"].includes(
      type
    );
  };

  // Disable edit button if content type isn't editable
  const isEditable = isEditableContentType(initialData.type);

  if (!isEditable) {
    return null; // Don't show edit button for non-editable types
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full sm:max-w-md sm:w-full p-6 sm:p-2 rounded-lg sm:rounded-b-none sm:rounded-t-lg sm:top-0 sm:left-0 sm:fixed sm:h-full sm:overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: EditableContentType) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="tweet">Tweet</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            {(formData.type === "image" ||
              formData.type === "video" ||
              formData.type === "audio") && (
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept={
                    formData.type === "image"
                      ? "image/*"
                      : formData.type === "video"
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
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder={`Enter ${formData.type} URL`}
              disabled={!!file}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
