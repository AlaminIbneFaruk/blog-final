import connectDB from '../../../lib/mongoose';
import Post from '../../../models/Post';
import { getAuth } from '@clerk/nextjs/server';

// 📡 SINGLE POST API ROUTE
// Handles GET, PUT, DELETE requests for individual posts
export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  console.log(`📡 API Request:`, {
    method,
    url: `/api/posts/${id}`,
    query: req.query,
    body: req.body ? 'Present' : 'N/A',
    timestamp: new Date().toISOString()
  });

  try {
    // 🔌 Connect to database
    await connectDB();
    console.log('✅ Database connected successfully');

    switch (method) {
      case 'GET':
        await getPost(req, res, id);
        break;
      case 'PUT':
        await updatePost(req, res, id);
        break;
      case 'DELETE':
        await deletePost(req, res, id);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
}

// 📖 GET SINGLE POST
async function getPost(req, res, id) {
  console.log('📖 Processing GET request for single post');
  console.log('🔍 Post ID:', id);

  try {
    const post = await Post.findById(id);
    
    if (!post) {
      console.log('❌ Post not found');
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log('✅ Post retrieved successfully');
    res.status(200).json(post);
  } catch (error) {
    console.error('❌ Error retrieving post:', error);
    res.status(500).json({ 
      message: 'Error retrieving post',
      error: error.message 
    });
  }
}

// ✏️ UPDATE POST
async function updatePost(req, res, id) {
  console.log('✏️ Processing PUT request to update post');
  
  try {
    // 🔐 Get authenticated user
    const { userId } = await getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('✅ User authenticated:', userId);

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 🔒 Check if user owns the post
    if (post.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own posts' });
    }

    const { title, description, content, author, tags } = req.body;

    // 📝 Update post data
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        description,
        content,
        author,
        tags,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    console.log('✅ Post updated successfully');
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('❌ Error updating post:', error);
    res.status(500).json({ 
      message: 'Error updating post',
      error: error.message 
    });
  }
}

// 🗑️ DELETE POST
async function deletePost(req, res, id) {
  console.log('🗑️ Processing DELETE request to delete post');
  
  try {
    // 🔐 Get authenticated user
    const { userId } = await getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('✅ User authenticated:', userId);

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 🔒 Check if user owns the post
    if (post.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own posts' });
    }

    await Post.findByIdAndDelete(id);

    console.log('✅ Post deleted successfully');
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    res.status(500).json({ 
      message: 'Error deleting post',
      error: error.message 
    });
  }
} 