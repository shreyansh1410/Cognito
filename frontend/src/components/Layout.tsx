import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AddContentModal } from "./AddContentModal";

export function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-18"
        }`}
      >
        <Header openAddContentModal={() => setIsAddContentModalOpen(true)} />
        <div className="p-6">
          <Outlet context={{ setRefresh }} />
        </div>
      </main>
      {isAddContentModalOpen && (
        <AddContentModal
          onClose={() => setIsAddContentModalOpen(false)}
          onContentAdded={() => {
            setRefresh((prev) => prev + 1); // Update refresh counter
            setIsAddContentModalOpen(false); // Close modal after successful add
          }}
        />
      )}
    </div>
  );
}
