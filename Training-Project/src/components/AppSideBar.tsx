import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Home, Users, FileText, Mail, Settings, X, User } from "lucide-react";
import Header from "./Header";

const AppSideBar = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar state
  const { userData }: any = useContext(AppContext);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "#" },
    { icon: Users, label: "Users", href: "#" },
    { icon: FileText, label: "Documents", href: "#" },
    { icon: Mail, label: "Messages", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Mobile overlay */}
      {isOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-64px)] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        {/* Close button for mobile */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:hidden"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
          <p className="text-sm text-gray-600 mt-1">Main Menu</p>
        </div>

        {/* Menu Items */}
        <nav className="mt-4 mb-12">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 group"
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5 group-hover:text-blue-600 transition-colors duration-200" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-4 relative group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col truncate">
              <p className="text-black font-medium truncate">
                {userData ? userData.email : "developer@example.com"}
              </p>
              <p className="text-gray-500 text-sm">Administrator</p>
              {/* Tooltip */}
              <div className="absolute left-0 bottom-full mb-1 hidden w-max max-w-xs rounded-md bg-gray-800 text-white text-sm px-2 py-1 shadow-lg whitespace-nowrap group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {userData ? userData.email : "developer@example.com"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 pt-16 lg:pt-16 ${
          isOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Your dashboard content */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {userData ? userData.name : "Developer"}
          </h2>
          <p className="text-gray-600 mb-8">
            Here's what's happening with your dashboard today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppSideBar;
