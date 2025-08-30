import { Home, User, X } from "lucide-react";
import { useContext, useState } from "react";
import { BarChart, Folder, Settings, Users } from "../icons/icons";
import { AppContext } from "../context/AppContext";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBarContent: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const { userData }: any = useContext(AppContext);

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home, active: true },
    { id: "analytics", label: "Analytics", icon: BarChart },
    { id: "users", label: "Users", icon: Users },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 transition-transform duration-700 ease-in-out delay-100
 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-purple-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenuItem(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeMenuItem === item.id
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-purple-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-6 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{userData ? userData.name : "Developer"}</p>
                <p className="text-purple-300 text-sm">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBarContent;
