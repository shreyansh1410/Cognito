import { useState, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AddContentModal } from "./AddContentModal";

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false); // New state for mobile sidebar
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
        isMobileOpen={isSidebarOpenMobile}
        setIsMobileOpen={setIsSidebarOpenMobile}
      />
      {isSidebarOpenMobile && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 sm:hidden"
          onClick={() => setIsSidebarOpenMobile(false)}
        />
      )}
      <main
        className={`flex-1 overflow-auto transition-all duration-300 relative
          sm:ml-0
          ${isSidebarCollapsed ? 'sm:ml-16' : 'sm:ml-16'}
        `}
      >
        <Header
          openAddContentModal={() => setIsAddContentModalOpen(true)}
          onSidebarMenuClick={() => setIsSidebarOpenMobile(true)}
        />
        <div className="p-6 sm:p-2">
          {children || (
            <Outlet context={{ setRefresh, refresh, activeFilter }} />
          )}
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
