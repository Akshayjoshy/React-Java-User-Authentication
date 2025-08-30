import React, { useState } from "react";
import DashboardContent from "./DashboardContent";
import Header from "./Header";
import SideBarContent from "./SideBarContent";

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* SideBar Content */}
      <SideBarContent
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Main Content */}
      <div
        className={`${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        } relative z-10 transition-all duration-300`}
      >
        {/* Header with dynamic menu toggle */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Dashboard Content */}
        {/* <DashboardContent /> */}
      </div>
    </div>
  );
};

export default DashboardPage;
