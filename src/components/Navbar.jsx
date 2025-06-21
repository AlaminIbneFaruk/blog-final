'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900">Blog</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/posts"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/posts')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Posts
            </Link>
            
            {/* Show Create Post and Dashboard links only for authenticated users */}
            {isSignedIn && (
              <>
                <Link
                  href="/create-post"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/create-post')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Create Post
                </Link>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* Authentication Section */}
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <div className="flex items-center space-x-3">
                  {/* User Profile */}
                  <div className="flex items-center space-x-2">
                    {user?.imageUrl && (
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName || 'User'}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm text-gray-700">
                      {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                    </span>
                  </div>
                  
                  {/* Sign Out Button */}
                  <SignOutButton>
                    <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                /* Sign In/Sign Up Buttons */
                <div className="flex items-center space-x-2">
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 