'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  UsersIcon, 
  EyeIcon, 
  HeartIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [adminStats, setAdminStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalViews: 0,
    totalLikes: 0,
    pendingPosts: 0,
    recentPosts: [],
    recentUsers: [],
    systemAlerts: []
  });

  useEffect(() => {
    // Fetch admin stats from API
    const fetchAdminStats = async () => {
      try {
        // This would be replaced with actual API call
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        
        // Mock data for now
        setAdminStats({
          totalPosts: 156,
          totalUsers: 89,
          totalViews: 45678,
          totalLikes: 2345,
          pendingPosts: 3,
          recentPosts: [
            { id: 1, title: 'Getting Started with Next.js', author: 'John Doe', status: 'published', views: 1234, date: '2024-01-15' },
            { id: 2, title: 'React Best Practices', author: 'Jane Smith', status: 'draft', views: 0, date: '2024-01-14' },
            { id: 3, title: 'MongoDB Integration Guide', author: 'Mike Johnson', status: 'published', views: 856, date: '2024-01-13' },
          ],
          recentUsers: [
            { id: 1, name: 'Alice Brown', email: 'alice@example.com', joined: '2024-01-15', posts: 2 },
            { id: 2, name: 'Bob Wilson', email: 'bob@example.com', joined: '2024-01-14', posts: 0 },
            { id: 3, name: 'Carol Davis', email: 'carol@example.com', joined: '2024-01-13', posts: 1 },
          ],
          systemAlerts: [
            { type: 'warning', message: '3 posts pending approval', icon: ExclamationTriangleIcon },
            { type: 'success', message: 'System running smoothly', icon: CheckCircleIcon },
            { type: 'info', message: 'Backup completed successfully', icon: CheckCircleIcon },
          ]
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchAdminStats();
  }, []);

  const stats = [
    {
      name: 'Total Posts',
      value: adminStats.totalPosts,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Users',
      value: adminStats.totalUsers,
      icon: UsersIcon,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Total Views',
      value: adminStats.totalViews.toLocaleString(),
      icon: EyeIcon,
      color: 'bg-purple-500',
      change: '+23%',
      changeType: 'positive'
    },
    {
      name: 'Total Likes',
      value: adminStats.totalLikes.toLocaleString(),
      icon: HeartIcon,
      color: 'bg-red-500',
      change: '+8%',
      changeType: 'positive'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p className="text-blue-100">Manage your blog platform and monitor activity</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">System Status</p>
            <p className="text-lg font-semibold">🟢 Online</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
        <div className="space-y-3">
          {adminStats.systemAlerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{alert.message}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Posts and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="space-y-4">
            {adminStats.recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{post.title}</p>
                  <p className="text-xs text-gray-500">by {post.author} • {post.views} views</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="space-y-4">
            {adminStats.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{user.posts} posts</span>
                  <span className="text-xs text-gray-500">{user.joined}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Create Post</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <UsersIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Manage Users</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <ChartBarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Analytics</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors">
            <ExclamationTriangleIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Pending Posts</p>
            {adminStats.pendingPosts > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {adminStats.pendingPosts}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 