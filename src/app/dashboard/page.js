'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import UserDashboard from '@/components/UserDashboard';
import AdminDashboard from '@/components/AdminDashboard';

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
      return;
    }

    if (isLoaded && isSignedIn) {
      // Only this email is admin
      const isAdminUser = isUserAdmin(user);
      setIsAdmin(isAdminUser);
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user, router]);

  function isUserAdmin(user) {
    const adminEmail = 'alaminibnefarukayon@gmail.com';
    return user?.emailAddresses[0]?.emailAddress === adminEmail;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect to sign-in
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar isAdmin={isAdmin} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
              </h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.firstName || 'User'}!
              </p>
            </div>
            
            {isAdmin ? <AdminDashboard /> : <UserDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
} 