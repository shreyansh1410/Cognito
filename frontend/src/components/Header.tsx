import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Button } from "./ui/button";
import { Share2, Plus, LogOut } from "lucide-react";
import { ShareModal } from "./ShareModal";
import { useState } from "react";
import { fetchShareLink } from "../services/api";

interface HeaderProps {
  openAddContentModal: () => void;
  showControls?: boolean;
}

export function Header({
  openAddContentModal,
  showControls = true,
}: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");

  const handleShareBrain = async () => {
    try {
      const link = await fetchShareLink();
      setShareLink(link);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error generating share link:", error);
      alert("Unable to generate share link. Please try again later.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const firstName = localStorage.getItem("firstName") || user?.firstName;

  return (
    <>
      <header className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">All Notes</h1>
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleShareBrain}
              >
                <Share2 className="h-4 w-4" />
                Share Brain
              </Button>
              <Button className="gap-2" onClick={openAddContentModal}>
                <Plus className="h-4 w-4" />
                Add Content
              </Button>
              <Button variant="ghost" className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout {firstName}
              </Button>
            </div>
          )}
        </div>
      </header>
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shareLink={shareLink}
      />
    </>
  );
}
