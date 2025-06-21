import { create } from 'zustand';

const useStore = create((set) => ({
  posts: [],
  loading: false,
  error: null,
  
  setPosts: (posts) => set({ posts }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addPost: (post) => set((state) => ({ 
    posts: [post, ...state.posts] 
  })),
  
  updatePost: (id, updatedPost) => set((state) => ({
    posts: state.posts.map(post => 
      post._id === id ? { ...post, ...updatedPost } : post
    )
  })),
  
  deletePost: (id) => set((state) => ({
    posts: state.posts.filter(post => post._id !== id)
  })),
  
  clearError: () => set({ error: null }),
}));

export default useStore; 