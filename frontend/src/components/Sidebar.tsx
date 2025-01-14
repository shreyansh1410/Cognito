import { Link } from "react-router-dom";
import {
  Brain,
  Twitter,
  Youtube,
  FileText,
  Link2,
  Hash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "Tweets", href: "/tweets", icon: Twitter },
  { name: "Videos", href: "/videos", icon: Youtube },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Links", href: "/links", icon: Link2 },
  { name: "Tags", href: "/tags", icon: Hash },
];

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
};

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
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
          <span className="text-xl font-bold">Cognito</span>
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
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
