'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { 
  Cog6ToothIcon, 
  SparklesIcon, 
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function AISettingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [aiStatus, setAiStatus] = useState({
    geminiEnabled: false,
    apiKeyConfigured: false,
    lastTested: null
  });
  const [testContent, setTestContent] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user is admin (only alaminibnefarukayon@gmail.com)
      const isUserAdmin = user.primaryEmailAddress?.emailAddress === 'alaminibnefarukayon@gmail.com';
      setIsAdmin(isUserAdmin);
      
      if (!isUserAdmin) {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    // Check AI status on component mount
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      // This would typically check your backend for AI configuration
      // For now, we'll simulate the check
      setAiStatus({
        geminiEnabled: true,
        apiKeyConfigured: !!process.env.GEMINI_API_KEY,
        lastTested: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error checking AI status:', error);
    }
  };

  const testAITagGeneration = async () => {
    if (!testContent.trim()) {
      setTestResult({ success: false, message: 'Please enter some content to test' });
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/gemini/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: testContent }),
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult({
          success: true,
          message: 'AI tag generation successful!',
          tags: data.tags
        });
      } else {
        setTestResult({
          success: false,
          message: data.message || 'Failed to generate tags'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error testing AI: ' + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Settings</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Manage AI features and API configurations for your blog
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Status Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">AI Status</h2>
                <button
                  onClick={checkAIStatus}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-4">
                {/* Gemini Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <SparklesIcon className="h-5 w-5 text-purple-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Gemini AI</h3>
                      <p className="text-sm text-gray-500">Tag generation service</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {aiStatus.geminiEnabled ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      aiStatus.geminiEnabled ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {aiStatus.geminiEnabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* API Key Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <KeyIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">API Key</h3>
                      <p className="text-sm text-gray-500">Gemini API configuration</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {aiStatus.apiKeyConfigured ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      aiStatus.apiKeyConfigured ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {aiStatus.apiKeyConfigured ? 'Configured' : 'Missing'}
                    </span>
                  </div>
                </div>

                {/* Last Tested */}
                {aiStatus.lastTested && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Last Tested</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(aiStatus.lastTested).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Test Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Test AI Features</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Content
                  </label>
                  <textarea
                    value={testContent}
                    onChange={(e) => setTestContent(e.target.value)}
                    placeholder="Enter blog post content to test tag generation..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <button
                  onClick={testAITagGeneration}
                  disabled={isLoading || !testContent.trim()}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4" />
                      <span>Test Tag Generation</span>
                    </>
                  )}
                </button>

                {/* Test Results */}
                {testResult && (
                  <div className={`p-4 rounded-lg ${
                    testResult.success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {testResult.success ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${
                          testResult.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {testResult.message}
                        </p>
                        {testResult.tags && (
                          <div className="mt-2">
                            <p className="text-sm text-green-700 mb-1">Generated tags:</p>
                            <div className="flex flex-wrap gap-1">
                              {testResult.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <InformationCircleIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Setup Instructions</h2>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Get your Gemini API key from{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Google AI Studio
                </a>
              </li>
              <li>
                Add the API key to your environment variables:
                <code className="block bg-gray-100 p-2 rounded mt-1 font-mono text-sm">
                  GEMINI_API_KEY=your_api_key_here
                </code>
              </li>
              <li>
                Restart your development server to apply the changes
              </li>
              <li>
                Test the AI features using the test panel above
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 