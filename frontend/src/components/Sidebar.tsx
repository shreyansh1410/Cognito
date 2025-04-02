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
} from "lucide-react";

const navigation = [
  { name: "All", type: "all", icon: Brain },
  { name: "Tweets", type: "tweet", icon: Twitter },
  { name: "Videos", type: "video", icon: Youtube },
  { name: "Documents", type: "document", icon: FileText },
  { name: "Links", type: "link", icon: Link2 },
  { name: "Tags", type: "tags", icon: Hash },
  {name: "Images", type: "image", icon: Image}
];

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  activeFilter: string;
  onFilterChange: (type: string) => void;
};

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  activeFilter,
  onFilterChange,
}: SidebarProps) {
  return (
    <div
      className={`flex flex-col border-r bg-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <div
          className={`flex items-center gap-2 ${isCollapsed ? "hidden" : ""}`}
        >
          <Brain className="h-8 w-8 text-indigo-600" />
          <a href="/" className="text-xl font-bold hover:text-indigo-700 transition-colors">Cognito</a>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md hover:bg-gray-100"
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
              activeFilter === item.type
                ? "bg-gray-100 text-indigo-600"
                : "text-gray-700"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.name}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
