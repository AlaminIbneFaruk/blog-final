'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  EyeIcon, 
  HeartIcon, 
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function UserDashboard() {
  const { user } = useUser();
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Fetch user stats from API
    const fetchUserStats = async () => {
      try {
        // This would be replaced with actual API call
        // const response = await fetch('/api/user/stats');
        // const data = await response.json();
        
        // Mock data for now
        setUserStats({
          totalPosts: 5,
          totalViews: 1247,
          totalLikes: 89,
          recentActivity: [
            { type: 'post_created', title: 'My First Blog Post', date: '2024-01-15' },
            { type: 'post_viewed', title: 'Getting Started with Next.js', date: '2024-01-14' },
            { type: 'post_liked', title: 'React Best Practices', date: '2024-01-13' },
          ]
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, []);

  const stats = [
    {
      name: 'Total Posts',
      value: userStats.totalPosts,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Views',
      value: userStats.totalViews.toLocaleString(),
      icon: EyeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Total Likes',
      value: userStats.totalLikes,
      icon: HeartIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Member Since',
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
      icon: CalendarIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          {user?.imageUrl && (
            <Image
              src={user.imageUrl}
              alt={user.fullName || 'User'}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName || 'User'}!
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your blog today.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">
                  {user?.fullName || 'Not provided'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">
                  {user?.emailAddresses[0]?.emailAddress || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Last Active</p>
                <p className="font-medium text-gray-900">
                  {user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {userStats.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.type.replace('_', ' ')} • {activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Create New Post</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <UserIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Edit Profile</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <CogIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Settings</p>
          </button>
        </div>
      </div>
    </div>
  );
} 