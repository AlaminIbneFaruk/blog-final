'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { SparklesIcon } from '@heroicons/react/24/outline';

// 📝 CREATE POST FORM COMPONENT
// Form for creating new blog posts with validation and submission handling
// 🔧 CUSTOMIZE: Add more fields, validation rules, and styling as needed
export default function CreatePostForm() {
  // 📊 FORM STATE MANAGEMENT
  // State for form data, loading, and error handling
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatingTags, setGeneratingTags] = useState(false);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // 🔄 FORM INPUT HANDLER
  // Updates form state when inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 🔧 OPTIONAL: Add real-time validation
    // if (name === 'title' && value.length > 200) {
    //   setError('Title cannot exceed 200 characters');
    // } else if (name === 'content' && value.length < 10) {
    //   setError('Content must be at least 10 characters long');
    // } else {
    //   setError('');
    // }
  };

  // 🔧 OPTIONAL: Add auto-save functionality
  // useEffect(() => {
  //   const autoSave = setTimeout(() => {
  //     if (formData.title || formData.content) {
  //       localStorage.setItem('draft', JSON.stringify(formData));
  //     }
  //   }, 2000);
  //   
  //   return () => clearTimeout(autoSave);
  // }, [formData]);

  // 🔧 OPTIONAL: Load draft on component mount
  // useEffect(() => {
  //   const draft = localStorage.getItem('draft');
  //   if (draft) {
  //     setFormData(JSON.parse(draft));
  //   }
  // }, []);

  // 🔧 OPTIONAL: Set default author when user loads
  useEffect(() => {
    if (isLoaded && user && !formData.author) {
      const defaultAuthor = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || '';
      setFormData(prev => ({ ...prev, author: defaultAuthor }));
    }
  }, [isLoaded, user, formData.author]);

  // 🤖 AI TAG GENERATION
  // Generate tags using Gemini AI
  const generateTags = async () => {
    if (!formData.content.trim()) {
      setError('Please add some content first to generate tags');
      return;
    }

    setGeneratingTags(true);
    setError('');

    try {
      const response = await fetch('/api/gemini/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: formData.content })
      });
      
      if (response.ok) {
        const { tags } = await response.json();
        setFormData(prev => ({ 
          ...prev, 
          tags: tags.join(', ') 
        }));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate tags');
      }
    } catch (error) {
      console.error('Error generating tags:', error);
      setError('Failed to generate tags. Please add them manually.');
    } finally {
      setGeneratingTags(false);
    }
  };

  // 📤 FORM SUBMISSION HANDLER
  // Handles form submission and API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🔐 AUTHENTICATION CHECK
      if (!user) {
        throw new Error('You must be signed in to create a post');
      }

      // 🏷️ TAG PROCESSING
      // Convert comma-separated tags to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // 🔧 OPTIONAL: Add tag validation
      // if (tagsArray.length > 10) {
      //   throw new Error('Cannot have more than 10 tags');
      // }

      // 🔧 OPTIONAL: Add content validation
      // if (formData.content.length < 10) {
      //   throw new Error('Content must be at least 10 characters long');
      // }

      // 🔧 OPTIONAL: Add title validation
      // if (formData.title.length > 200) {
      //   throw new Error('Title cannot exceed 200 characters');
      // }

      // 📡 API CALL
      // Send post data to backend
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      const result = await response.json();
      
      // 🔧 OPTIONAL: Clear draft after successful submission
      // localStorage.removeItem('draft');
      
      // 🔧 OPTIONAL: Show success message
      // setSuccess('Post created successfully!');
      
      // 🚀 NAVIGATION
      // Redirect to the new post
      router.push(`/posts/${result._id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while user data is loading
  if (!isLoaded) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading user data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ⚠️ ERROR DISPLAY */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* 🔧 OPTIONAL: Add success message */}
        {/* {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )} */}

        {/* 📋 TITLE FIELD */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title * {/* 🔧 CHANGE: Modify label text */}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={200} // 🔧 CHANGE: Adjust max length
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter post title" // 🔧 CHANGE: Modify placeholder
          />
          {/* 🔧 OPTIONAL: Add character counter */}
          {/* <div className="text-sm text-gray-500 mt-1">
            {formData.title.length}/200 characters
          </div> */}
        </div>

        {/* 👤 AUTHOR FIELD */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author {/* 🔧 CHANGE: Modify label text */}
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            maxLength={100} // 🔧 CHANGE: Adjust max length
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter author name" // 🔧 CHANGE: Modify placeholder
          />
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              Pre-filled with your name: {user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress}
            </p>
          )}
        </div>

        {/* 🏷️ TAGS FIELD */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags {/* 🔧 CHANGE: Modify label text */}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tags separated by commas" // 🔧 CHANGE: Modify placeholder
            />
            {/* 🤖 AI TAG GENERATION BUTTON */}
            <button
              type="button"
              onClick={generateTags}
              disabled={generatingTags || !formData.content.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {generatingTags ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  <span>AI Generate</span>
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Separate tags with commas (e.g., technology, programming, web) or use AI to generate them automatically
          </p>
        </div>

        {/* 📄 CONTENT FIELD */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content * {/* 🔧 CHANGE: Modify label text */}
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10} // 🔧 CHANGE: Adjust default rows
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Write your post content here..." // 🔧 CHANGE: Modify placeholder
          />
          {/* 🔧 OPTIONAL: Add character counter */}
          {/* <div className="text-sm text-gray-500 mt-1">
            {formData.content.length} characters
          </div> */}
        </div>

        {/* 🔧 OPTIONAL: Add preview section */}
        {/* <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Preview</h3>
          <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
            <h2 className="text-xl font-bold mb-2">{formData.title || 'Untitled'}</h2>
            <p className="text-gray-600">{formData.content || 'No content yet...'}</p>
          </div>
        </div> */}

        {/* 🎯 FORM ACTIONS */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel {/* 🔧 CHANGE: Modify button text */}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Post'} {/* 🔧 CHANGE: Modify button text */}
          </button>
        </div>
      </form>
    </div>
  );
} 