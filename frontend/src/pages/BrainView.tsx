import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Header } from "../components/Header";
import { NoteCard } from "../components/NoteCard";
import { Sidebar } from "../components/Sidebar";
import { AddContentModal } from "../components/AddContentModal";
import { EditContentDialog } from "../components/EditContentDialog";

interface Content {
  id: string;
  title: string;
  type: "document" | "tweet" | "video" | "image" | "article" | "audio" | "link";
  link: string;
  tags: string[];
  createdAt?: string;
}

export function BrainView() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { shareLink } = useParams();
  const { user } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBrainContents = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/brain/${shareLink}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch brain contents");
        }
        const data = await response.json();

        setContents(data.contents);
        setIsOwner(data.userId === user?.userId);
      } catch (error) {
        console.error("Error fetching brain contents:", error);
      } finally {
        setLoading(false);
      }
    };

    if (shareLink) {
      fetchBrainContents();
    }
  }, [shareLink, user?.userId, BACKEND_URL]);

  const handleContentAdded = async () => {
    // Refresh contents after adding new content
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/brain/${shareLink}`);
      if (!response.ok) {
        throw new Error("Failed to fetch updated brain contents");
      }
      const data = await response.json();
      setContents(data.contents);
    } catch (error) {
      console.error("Error refreshing contents:", error);
    }
  };

  const handleContentEdit = async (
    contentId: string,
    newData: Partial<Content>
  ) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/content/${contentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update content");
      }

      // Update local state
      setContents((prevContents) =>
        prevContents.map((content) =>
          content.id === contentId ? { ...content, ...newData } : content
        )
      );
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const handleContentDelete = async (contentId: string) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/content/${contentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete content");
      }

      // Update local state
      setContents((prevContents) =>
        prevContents.filter((content) => content.id !== contentId)
      );
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const filteredContents = contents.filter((content) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "tags") return content.tags.length > 0;
    return content.type === activeFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        openAddContentModal={() => setIsAddContentOpen(true)}
        showControls={isOwner}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Main Content */}
        <main
          className={`flex-1 p-8 ${isSidebarCollapsed ? "ml-16" : "ml-16"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContents.map((content) => (
              <NoteCard
                key={content.id}
                id={content.id}
                title={content.title}
                type={content.type}
                link={content.link}
                tags={content.tags}
                date={
                  content.createdAt
                    ? new Date(content.createdAt).toLocaleDateString()
                    : new Date().toLocaleDateString()
                }
                onEdit={
                  isOwner
                    ? (newData) => handleContentEdit(content.id, newData)
                    : undefined
                }
                onDelete={
                  isOwner ? () => handleContentDelete(content.id) : undefined
                }
              />
            ))}
          </div>
          {filteredContents.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No content available
            </div>
          )}
        </main>
      </div>

      {/* Add Content Modal */}
      {isOwner && isAddContentOpen && (
        <AddContentModal
          onClose={() => setIsAddContentOpen(false)}
          onContentAdded={handleContentAdded}
        />
      )}
    </div>
  );
}
