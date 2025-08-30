import { BarChart, DollarSign, ShoppingCart, TrendingUp, Users } from "../icons/icons";

const DashboardContent: React.FC = () => {
  const statsData = [
    { title: 'Total Revenue', value: '$54,239', change: '+12.5%', positive: true, icon: DollarSign },
    { title: 'Active Users', value: '8,249', change: '+8.2%', positive: true, icon: Users },
    { title: 'Orders', value: '1,429', change: '-3.1%', positive: false, icon: ShoppingCart },
    { title: 'Growth Rate', value: '24.8%', change: '+5.4%', positive: true, icon: TrendingUp },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Created new project', time: '2 minutes ago', avatar: 'JD' },
    { id: 2, user: 'Sarah Wilson', action: 'Updated user profile', time: '15 minutes ago', avatar: 'SW' },
    { id: 3, user: 'Mike Johnson', action: 'Completed task #127', time: '1 hour ago', avatar: 'MJ' },
    { id: 4, user: 'Emma Brown', action: 'Added new team member', time: '3 hours ago', avatar: 'EB' },
  ];

  return (
    <main className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-purple-300 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Revenue Overview</h3>
          <div className="h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <BarChart className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <p className="text-purple-300">Chart visualization would go here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {activity.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{activity.user}</p>
                  <p className="text-purple-300 text-xs">{activity.action}</p>
                  <p className="text-purple-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
              Add User
            </button>
            <button className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105">
              New Project
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105">
              Generate Report
            </button>
            <button className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105">
              View Analytics
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-purple-300">Server Status</span>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-300">Database</span>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-300">API Services</span>
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Warning</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-300">Backup Status</span>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Complete</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default DashboardContent;