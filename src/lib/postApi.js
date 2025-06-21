const API_BASE_URL = '/api';

export const postApi = {
  // Get all posts
  async getAllPosts() {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get a single post by ID
  async getPostById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Create a new post
  async createPost(postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update a post
  async updatePost(id, postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete a post
  async deletePost(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Get posts by tag
  async getPostsByTag(tag) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?tag=${encodeURIComponent(tag)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts by tag');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
      throw error;
    }
  },

  // Search posts
  async searchPosts(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?search=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search posts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }
}; 