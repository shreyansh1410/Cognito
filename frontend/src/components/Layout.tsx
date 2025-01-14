import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AddContentModal } from "./AddContentModal";

export function Layout() {
  const isSidebarCollapsed = useSelector(
    (state: RootState) => state.ui.isSidebarCollapsed
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-18"
        }`}
      >
        <Header />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      <AddContentModal />
    </div>
  );
}
