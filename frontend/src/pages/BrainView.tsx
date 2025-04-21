import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { NoteCard } from "../components/NoteCard";
import { Sidebar } from "../components/Sidebar";
import { AddContentModal } from "../components/AddContentModal";

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
  const [ownerName, setOwnerName] = useState<string>("Unknown User");
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
        
        setContents(data.contents || []);
        setIsOwner(data.userId === user?.userId);
        
        // Simple direct assignment of owner name
        setOwnerName(data.ownerName || "Unknown User");
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
      <div className="flex">
        {isOwner && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        )}
        <main className={`flex-1 p-8 ${isOwner && isSidebarCollapsed ? "ml-16" : ""}`}>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {isOwner ? "My Brain" : `${ownerName}'s Brain`}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {filteredContents.length} items {activeFilter !== "all" && `• ${activeFilter} filter active`}
                </p>
              </div>
              
              {isOwner && (
                <button
                  onClick={() => setIsAddContentOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm transition-colors"
                >
                  Add Content
                </button>
              )}
            </div>
          </div>
          
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
                  isOwner ? (newData) => handleContentEdit(content.id, newData) : undefined
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
      {isOwner && isAddContentOpen && (
        <AddContentModal
          onClose={() => setIsAddContentOpen(false)}
          onContentAdded={handleContentAdded}
        />
      )}
    </div>
  );
}