import Link from 'next/link';

export default function PostCard({ post }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{formatDate(post.createdAt)}</span>
          {post.tags && post.tags.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <span>{post.tags.join(', ')}</span>
            </>
          )}
        </div>
        
        <Link href={`/posts/${post._id}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {truncateText(post.content)}
        </p>
        
        <div className="flex items-center justify-between">
          <Link
            href={`/posts/${post._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Read more →
          </Link>
          
          {post.author && (
            <span className="text-sm text-gray-500">
              By {post.author}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 