import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Button } from "./ui/button";
import { Share2, Plus, UserCircle, Menu } from "lucide-react";
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
  onSidebarMenuClick?: () => void;
}

export function Header({
  openAddContentModal,
  showControls = true,
  onSidebarMenuClick,
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
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-20 sm:px-2">
        {onSidebarMenuClick && (
          <button
            className="sm:hidden p-2 mr-2 rounded-md hover:bg-gray-100"
            onClick={onSidebarMenuClick}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <h1 className="text-xl font-bold truncate flex-1">{getPageTitle()}</h1>
        {showControls && (
          <div className="flex items-center gap-2 ml-2">
            <Button
              variant="outline"
              size="icon"
              className="sm:hidden"
              onClick={handleShareBrain}
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="sm:hidden"
              onClick={openAddContentModal}
              aria-label="Add note"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:inline-flex w-36"
              onClick={handleShareBrain}
              aria-label="Share"
            >
              <Share2 className="h-5 w-5 mx-2" />
              <span className="hidden md:inline w-full">Share Brain</span>
            </Button>
            <Button
              className="hidden sm:inline-flex"
              onClick={openAddContentModal}
              aria-label="Add Content"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">Add Content</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="User menu">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleProfileClick}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </header>
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shareLink={shareLink}
      />
    </>
  );
}
