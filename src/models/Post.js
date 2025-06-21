import mongoose from 'mongoose';

// 📝 POST MODEL SCHEMA
// This defines the structure of blog posts in the database
// 🔧 CUSTOMIZE: Modify fields, validation rules, and indexes as needed
const PostSchema = new mongoose.Schema({
  // 📋 TITLE FIELD
  // Required field with length validation
  title: {
    type: String,
    required: [true, 'Title is required'], // 🔧 CHANGE: Modify error message
    trim: true, // Removes whitespace
    maxlength: [200, 'Title cannot be more than 200 characters'] // 🔧 CHANGE: Adjust max length
  },
  
  // 📝 DESCRIPTION FIELD
  // Optional field for post summary/excerpt
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'] // 🔧 CHANGE: Adjust max length
  },
  
  // 📄 CONTENT FIELD
  // Required field for the main post content
  content: {
    type: String,
    required: [true, 'Content is required'], // 🔧 CHANGE: Modify error message
    trim: true
    // 🔧 OPTIONAL: Add content validation
    // validate: {
    //   validator: function(content) {
    //     return content.length >= 10; // Minimum 10 characters
    //   },
    //   message: 'Content must be at least 10 characters long'
    // }
  },
  
  // 👤 AUTHOR FIELD
  // Optional field with default value
  author: {
    type: String,
    default: 'Anonymous', // 🔧 CHANGE: Set your default author name
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters'] // 🔧 CHANGE: Adjust max length
  },
  
  // 🔐 USER ID FIELD
  // Links post to the user who created it
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true // Add index for faster queries
  },
  
  // 🏷️ TAGS FIELD
  // Array of strings for categorizing posts
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags) {
        return tags.length <= 10; // 🔧 CHANGE: Adjust maximum number of tags
      },
      message: 'Cannot have more than 10 tags' // 🔧 CHANGE: Modify error message
    }
  },
  
  // 📅 TIMESTAMP FIELDS
  // Automatically managed by timestamps option
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
  
  // 🔧 OPTIONAL: Add more fields as needed
  // Example fields you might want to add:
  // 
  // featured: {
  //   type: Boolean,
  //   default: false
  // },
  // 
  // readTime: {
  //   type: Number,
  //   default: 0
  // },
  // 
  // views: {
  //   type: Number,
  //   default: 0
  // },
  // 
  // likes: {
  //   type: Number,
  //   default: 0
  // },
  // 
  // comments: [{
  //   author: String,
  //   content: String,
  //   createdAt: { type: Date, default: Date.now }
  // }]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// 🔍 SEARCH INDEX
// Enables text search on title, content, and author fields
// 🔧 CUSTOMIZE: Add or remove fields from the text index
PostSchema.index({
  title: 'text',
  content: 'text',
  author: 'text'
});

// 🔧 OPTIONAL: Add compound indexes for better query performance
// Example: Index for sorting by creation date and filtering by tags
// PostSchema.index({ createdAt: -1, tags: 1 });

// 🔄 PRE-SAVE MIDDLEWARE
// Updates the updatedAt field before saving
// 🔧 CUSTOMIZE: Add more pre-save logic here
PostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // 🔧 OPTIONAL: Add automatic read time calculation
  // if (this.isModified('content')) {
  //   const wordsPerMinute = 200;
  //   const wordCount = this.content.split(' ').length;
  //   this.readTime = Math.ceil(wordCount / wordsPerMinute);
  // }
  
  next();
});

// 🔧 OPTIONAL: Add virtual fields
// Example: Virtual field for post URL
// PostSchema.virtual('url').get(function() {
//   return `/posts/${this._id}`;
// });

// 🔧 OPTIONAL: Add instance methods
// Example: Method to increment view count
// PostSchema.methods.incrementViews = function() {
//   this.views += 1;
//   return this.save();
// };

// 🔧 OPTIONAL: Add static methods
// Example: Method to find featured posts
// PostSchema.statics.findFeatured = function() {
//   return this.find({ featured: true }).sort({ createdAt: -1 });
// };

// 📦 EXPORT MODEL
// Prevents model recompilation in development
export default mongoose.models.Post || mongoose.model('Post', PostSchema); 