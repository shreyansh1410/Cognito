import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareLink,
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Brain</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mb-4">
          Share this link to allow others to view your brain:
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <Button onClick={handleCopyLink} variant="outline">
            Copy Link
          </Button>
        </div>
        <Button onClick={onClose} variant="secondary" className="mt-4 w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
