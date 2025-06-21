import Link from 'next/link';

export default function PostDetails({ post }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link href="/posts" className="text-blue-600 hover:text-blue-800 transition-colors">
                  ← Back to Posts
                </Link>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{formatDate(post.createdAt)}</span>
                {post.author && (
                  <>
                    <span className="mx-2">•</span>
                    <span>By {post.author}</span>
                  </>
                )}
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {post.content}
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Link
                  href="/posts"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  ← Back to Posts
                </Link>
                
                <Link
                  href="/create-post"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create New Post
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 