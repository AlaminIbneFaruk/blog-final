import connectDB from '@/lib/mongoose';
import Post from '@/models/Post';
import { getAuth } from '@clerk/nextjs/server';

// 📡 POSTS API ROUTE HANDLER
// Handles GET (fetch all posts) and POST (create new post) requests
// 🔧 CUSTOMIZE: Add authentication, rate limiting, and additional validation
export default async function handler(req, res) {
  console.log('📡 API Request:', {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.method === 'POST' ? 'Present' : 'N/A',
    timestamp: new Date().toISOString()
  });

  // 🔌 DATABASE CONNECTION
  // Connects to MongoDB before processing requests
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return res.status(500).json({ message: 'Database connection failed' });
  }

  // 🔄 REQUEST METHOD ROUTING
  // Routes requests based on HTTP method
  switch (req.method) {
    case 'GET':
      console.log('📋 Processing GET request for posts');
      return getPosts(req, res);
    case 'POST':
      console.log('✏️ Processing POST request to create post');
      return createPost(req, res);
    default:
      console.warn('⚠️ Unsupported method:', req.method);
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// 📋 GET ALL POSTS FUNCTION
// Retrieves posts with optional search and tag filtering
async function getPosts(req, res) {
  try {
    console.log('🔍 Starting posts retrieval...');
    
    // 🔍 QUERY PARAMETERS
    // Extract search and tag parameters from request
    const { search, tag, page = 1, limit = 50 } = req.query;
    let query = {};

    console.log('🔍 Query parameters:', {
      search: search || 'None',
      tag: tag || 'None',
      page: parseInt(page),
      limit: parseInt(limit)
    });

    // 🔍 SEARCH FUNCTIONALITY
    // Search across title, content, and author fields
    if (search) {
      console.log('🔍 Adding search filter for:', search);
      query.$or = [
        { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // 🏷️ TAG FILTERING
    // Filter posts by specific tags
    if (tag) {
      console.log('🏷️ Adding tag filter for:', tag);
      query.tags = { $in: [tag] }; // Posts that contain the specified tag
    }

    // 🔧 OPTIONAL: Add more filtering options
    // Example: Filter by date range, author, etc.
    // if (req.query.author) {
    //   query.author = req.query.author;
    // }
    // 
    // if (req.query.dateFrom && req.query.dateTo) {
    //   query.createdAt = {
    //     $gte: new Date(req.query.dateFrom),
    //     $lte: new Date(req.query.dateTo)
    //   };
    // }

    // 📊 PAGINATION
    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log('📊 Pagination:', { page: parseInt(page), limit: parseInt(limit), skip });

    // 🔍 DATABASE QUERY
    // Fetch posts with filtering, sorting, and pagination
    console.log('🔍 Executing database query:', JSON.stringify(query, null, 2));
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 }) // 🔧 CHANGE: Modify sorting (newest first)
      .skip(skip)
      .limit(parseInt(limit)) // 🔧 CHANGE: Adjust default limit
      .select('-__v'); // Exclude version key

    console.log('✅ Posts retrieved successfully:', {
      count: posts.length,
      query: Object.keys(query).length > 0 ? 'Filtered' : 'All posts'
    });

    // 📊 TOTAL COUNT FOR PAGINATION
    // Get total count for pagination metadata
    const total = await Post.countDocuments(query);
    console.log('📊 Total posts count:', total);

    // 🔧 OPTIONAL: Add response metadata
    // const response = {
    //   posts,
    //   pagination: {
    //     page: parseInt(page),
    //     limit: parseInt(limit),
    //     total,
    //     pages: Math.ceil(total / parseInt(limit))
    //   }
    // };

    console.log('📤 Sending response with', posts.length, 'posts');
    return res.status(200).json(posts);
  } catch (error) {
    console.error('❌ Error fetching posts:', {
      message: error.message,
      stack: error.stack,
      query: req.query
    });
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// ✏️ CREATE POST FUNCTION
// Creates a new blog post
async function createPost(req, res) {
  try {
    console.log('📝 Starting post creation...');
    
    // 🔐 AUTHENTICATION CHECK
    // Verify user is authenticated
    const { userId } = await getAuth(req);
    if (!userId) {
      console.warn('⚠️ Unauthorized post creation attempt');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    console.log('✅ User authenticated:', userId);
    
    // 📝 REQUEST BODY VALIDATION
    // Extract and validate required fields
    const { title, description, content, author, tags } = req.body;

    console.log('📝 Post data received:', {
      title: title ? `${title.substring(0, 50)}...` : 'Missing',
      description: description ? `${description.substring(0, 50)}...` : 'None',
      content: content ? `${content.length} characters` : 'Missing',
      author: author || 'Will use default',
      tags: tags ? `${tags.length} tags` : 'None'
    });

    // ⚠️ VALIDATION CHECKS
    // Ensure required fields are provided
    if (!title || !content) {
      console.warn('⚠️ Validation failed:', {
        title: !title ? 'Missing' : 'Present',
        content: !content ? 'Missing' : 'Present'
      });
      return res.status(400).json({ 
        message: 'Title and content are required',
        // 🔧 OPTIONAL: Add more detailed validation messages
        // errors: {
        //   title: !title ? 'Title is required' : null,
        //   content: !content ? 'Content is required' : null
        // }
      });
    }

    // 🔧 OPTIONAL: Add content length validation
    // if (content.length < 10) {
    //   return res.status(400).json({ 
    //     message: 'Content must be at least 10 characters long' 
    //   });
    // }

    // 🔧 OPTIONAL: Add title length validation
    // if (title.length > 200) {
    //   return res.status(400).json({ 
    //     message: 'Title cannot exceed 200 characters' 
    //   });
    // }

    // 🔧 OPTIONAL: Add tag validation
    // if (tags && tags.length > 10) {
    //   return res.status(400).json({ 
    //     message: 'Cannot have more than 10 tags' 
    //   });
    // }

    // 📝 POST CREATION
    // Create new post with provided data
    const postData = {
      title: title.trim(),
      description: description?.trim() || null,
      content: content.trim(),
      author: author?.trim() || 'Anonymous', // 🔧 CHANGE: Set your default author
      tags: tags || [],
      createdAt: new Date(),
      userId: userId // Store the user ID for future reference
    };

    console.log('📝 Creating post with data:', {
      title: postData.title,
      description: postData.description ? 'Present' : 'None',
      contentLength: postData.content.length,
      author: postData.author,
      tagsCount: postData.tags.length,
      userId: postData.userId
    });

    const post = new Post(postData);

    // 🔧 OPTIONAL: Add pre-save processing
    // Example: Generate slug, calculate read time, etc.
    // post.slug = generateSlug(post.title);
    // post.readTime = calculateReadTime(post.content);

    // 💾 SAVE TO DATABASE
    console.log('💾 Saving post to database...');
    const savedPost = await post.save();
    console.log('✅ Post saved successfully:', {
      id: savedPost._id,
      title: savedPost.title,
      createdAt: savedPost.createdAt,
      userId: savedPost.userId
    });

    // 🔧 OPTIONAL: Add post-save processing
    // Example: Send notifications, update search index, etc.
    // await sendPostNotification(savedPost);
    // await updateSearchIndex(savedPost);

    console.log('📤 Sending success response');
    return res.status(201).json(savedPost);
  } catch (error) {
    console.error('❌ Error creating post:', {
      message: error.message,
      stack: error.stack,
      validationErrors: error.errors,
      body: req.body
    });
    
    // 🔧 OPTIONAL: Add specific error handling
    // if (error.name === 'ValidationError') {
    //   return res.status(400).json({ 
    //     message: 'Validation failed', 
    //     errors: error.errors 
    //   });
    // }
    
    return res.status(500).json({ message: 'Internal Server Error' });
  }
} 