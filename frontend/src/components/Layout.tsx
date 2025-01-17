import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AddContentModal } from "./AddContentModal";

export function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-18"
        }`}
      >
        <Header openAddContentModal={() => setIsAddContentModalOpen(true)} />
        <div className="p-6">
          <Outlet context={{ setRefresh, refresh, activeFilter }} />
        </div>
      </main>
      {isAddContentModalOpen && (
        <AddContentModal
          onClose={() => setIsAddContentModalOpen(false)}
          onContentAdded={() => {
            setRefresh((prev) => prev + 1);
            setIsAddContentModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
