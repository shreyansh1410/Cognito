import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Button } from "./ui/button";
import { Share2, Plus, UserCircle } from "lucide-react";
import { ShareModal } from "./ShareModal";
import { useState } from "react";
import { fetchShareLink } from "../services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface HeaderProps {
  openAddContentModal: () => void;
  showControls?: boolean;
}

export function Header({
  openAddContentModal,
  showControls = true,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/profile":
        return "Profile";
      default:
        return "All Notes";
    }
  };

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

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <>
      <header className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={handleProfileClick}>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
