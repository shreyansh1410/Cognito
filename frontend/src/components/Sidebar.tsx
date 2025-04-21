import {
  Brain,
  Twitter,
  Youtube,
  FileText,
  Link2,
  Hash,
  ChevronLeft,
  ChevronRight,
  Image,
  X as CloseIcon
} from "lucide-react";

const navigation = [
  { name: "All", type: "all", icon: Brain },
  { name: "Tweets", type: "tweet", icon: Twitter },
  { name: "Videos", type: "video", icon: Youtube },
  { name: "Documents", type: "document", icon: FileText },
  { name: "Links", type: "link", icon: Link2 },
  { name: "Tags", type: "tags", icon: Hash },
  { name: "Images", type: "image", icon: Image }
];

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  activeFilter: string;
  onFilterChange: (type: string) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
};

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  activeFilter,
  onFilterChange,
  isMobileOpen = false,
  setIsMobileOpen
}: SidebarProps) {
  // Desktop: always visible, collapsible. Mobile: overlay drawer.
  return (
    <>
      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity sm:hidden ${isMobileOpen ? "block" : "hidden"}`}
        style={{ pointerEvents: isMobileOpen ? "auto" : "none" }}
        onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
      />
      <aside
        className={`
          z-50 bg-white border-r flex flex-col transition-all duration-300
          ${isCollapsed ? "w-16" : "w-64"}
          h-full
          fixed top-0 left-0
          sm:static sm:translate-x-0 sm:h-auto
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
          sm:flex
        `}
        style={{ minWidth: isCollapsed ? 64 : 256 }}
      >
        {/* Mobile Close Button */}
        <div className="sm:hidden flex justify-end p-2">
          {setIsMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <CloseIcon />
            </button>
          )}
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${isCollapsed ? "hidden" : ""}`}>
            <Brain className="h-8 w-8 text-indigo-600" />
            <a href="/" className="text-xl font-bold hover:text-indigo-700 transition-colors">Cognito</a>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-100 hidden sm:block"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
        <nav className="flex-1 px-2 py-4">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => onFilterChange(item.type)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md w-full hover:bg-gray-100 ${
                activeFilter === item.type ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
              } ${isCollapsed ? "justify-center" : ""}`}
              style={{ minHeight: 40 }}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
