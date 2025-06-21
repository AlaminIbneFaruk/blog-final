'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  HomeIcon, 
  UserIcon, 
  DocumentTextIcon, 
  CogIcon, 
  ChartBarIcon,
  UsersIcon,
  ShieldCheckIcon,
  PlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function DashboardSidebar({ isAdmin }) {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = (path) => {
    return pathname === path;
  };

  const userMenuItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'My Profile',
      href: '/dashboard/profile',
      icon: UserIcon,
    },
    {
      name: 'My Posts',
      href: '/dashboard/my-posts',
      icon: DocumentTextIcon,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: CogIcon,
    },
  ];

  const adminMenuItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'All Posts',
      href: '/dashboard/posts',
      icon: DocumentTextIcon,
    },
    {
      name: 'Create Post',
      href: '/dashboard/create-post',
      icon: PlusIcon,
    },
    {
      name: 'Users',
      href: '/dashboard/users',
      icon: UsersIcon,
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: ChartBarIcon,
    },
    {
      name: 'AI Settings',
      href: '/dashboard/ai-settings',
      icon: SparklesIcon,
    },
    {
      name: 'Admin Settings',
      href: '/dashboard/admin-settings',
      icon: ShieldCheckIcon,
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-8">
          {user?.imageUrl && (
            <Image
              src={user.imageUrl}
              alt={user.fullName || 'User'}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.firstName || 'User'}
            </h2>
            <p className="text-sm text-gray-500">
              {isAdmin ? 'Administrator' : 'User'}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Main Site */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Back to Site</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 