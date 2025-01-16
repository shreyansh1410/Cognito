import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
  | "audio";

// Editable type (for editing - matches backend)
type EditableContentType = "video" | "image" | "article" | "audio";

interface EditContentDialogProps {
  id: string;
  initialData: {
    title: string;
    type: ContentType;
    link: string;
    tags: string[];
  };
  onEdit: (newData: {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Only allow submission if type is a valid EditableContentType
    if (isEditableContentType(formData.type)) {
      onEdit({
        ...formData,
        type: formData.type,
        tags: processedTags,
      });
      setIsOpen(false);
    }
  };

  // Type guard to check if a type is an EditableContentType
  const isEditableContentType = (
    type: ContentType
  ): type is EditableContentType => {
    return ["video", "image", "article", "audio"].includes(type);
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
      <DialogContent className="sm:max-w-[425px]">
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
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
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
