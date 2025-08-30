// components/Header.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { Search, User } from "../icons/icons";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { showToast } from "../lib/toasts";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { userData, backendURL, setUserData, setIsLoggedIn }: any =
    useContext(AppContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendURL + "/logout");
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "An unexpected error occurred",
        "error"
      );
    }
  };

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:text-purple-300 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <h2 className="text-2xl font-bold text-white">
            Welcome, {userData ? userData.name : "Developer"}
          </h2>
        </div>

        <div className="flex items-center space-x-4 relative">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          {/* <button className="relative p-2 text-white hover:text-purple-300 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button> */}

          {/* User Avatar with Dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
            >
              {userData ? userData.name[0].toUpperCase() : "D"}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-sm rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  onClick={() =>
                    alert("This is a demo dashboard built by Akshay Joshy.")
                  }
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                >
                  <User className="w-4 h-4" />
                  {userData ? userData.name : "Developer"}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
