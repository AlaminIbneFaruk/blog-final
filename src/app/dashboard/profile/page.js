'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { 
  UserIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  CameraIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    bio: user?.publicMetadata?.bio || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would typically update the user profile via Clerk API
      // await user.update({
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   publicMetadata: { bio: formData.bio }
      // });
      
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar isAdmin={false} />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="mt-2 text-gray-600">
                Manage your account settings and profile information
              </p>
            </div>

            <div className="bg-white rounded-lg shadow">
              {/* Profile Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {user?.imageUrl && (
                        <Image
                          src={user.imageUrl}
                          alt={user.fullName || 'User'}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      )}
                      <button className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        <CameraIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user?.fullName || 'User Profile'}
                      </h2>
                      <p className="text-gray-600">
                        Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <UserIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{user?.firstName || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <UserIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{user?.lastName || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {user?.emailAddresses[0]?.emailAddress || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Sign In
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">
                            {user?.publicMetadata?.bio || 'No bio provided'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Actions */}
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                <div className="space-y-4">
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">Change Password</h4>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </button>
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </button>
                  <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    <h4 className="font-medium text-red-900">Delete Account</h4>
                    <p className="text-sm text-red-600">Permanently delete your account and data</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 