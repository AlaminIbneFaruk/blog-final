# Blog Application

A modern, full-stack blog application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- 📝 Create, read, update, and delete blog posts
- 🔐 User authentication with Clerk
- 🏷️ Tag-based categorization
- 🔍 Search functionality
- 📱 Responsive design
- ⚡ Fast and optimized performance
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time state management with Zustand

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **State Management**: Zustand
- **Styling**: Tailwind CSS

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout with navigation
│   ├── page.js            # Home page
│   ├── posts/             # Posts pages
│   │   ├── page.js        # Posts listing
│   │   └── [id]/          # Dynamic post pages
│   │       └── page.js
│   └── create-post/       # Create post page
│       └── page.js
├── components/            # React components
│   ├── Navbar.jsx         # Navigation component
│   ├── PostCard.jsx       # Post preview card
│   ├── CreatePostForm.jsx # Post creation form
│   └── PostDetails.jsx    # Full post view
├── lib/                   # Utility libraries
│   ├── mongoose.js        # Database connection
│   ├── store.js           # Zustand store
│   └── postApi.js         # API utilities
├── models/                # Database models
│   └── Post.js            # Post schema
└── pages/api/             # API routes
    ├── posts/             # Posts API
    │   ├── index.js       # GET/POST /api/posts
    │   └── [id].js        # GET/PUT/DELETE /api/posts/[id]
    └── gemini/            # Gemini API integration
        └── tags.js        # Tag generation
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Clerk account for authentication
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-final
```

2. Install dependencies:
```bash
npm install
```

3. Set up Clerk Authentication:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Create a new application
   - Copy your Publishable Key and Secret Key

4. Create a `.env.local` file in the root directory:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Optional: Gemini API for tag generation
GEMINI_API_KEY=your_gemini_api_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Setup

### Clerk Configuration

1. **Create Clerk Application**:
   - Visit [Clerk Dashboard](https://dashboard.clerk.com)
   - Click "Add Application"
   - Choose "Next.js" as your framework
   - Follow the setup wizard

2. **Configure Environment Variables**:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

3. **Customize Authentication** (Optional):
   - Go to Clerk Dashboard → User & Authentication
   - Configure sign-in methods (Email, Google, GitHub, etc.)
   - Customize appearance and branding
   - Set up email templates

4. **Configure Redirect URLs**:
   - Add your domain to allowed origins
   - Set up redirect URLs for production

### Authentication Features

- **Sign In/Sign Up**: Modal-based authentication
- **User Profile**: Display user name and avatar
- **Protected Routes**: Create post requires authentication
- **User Context**: Access user data throughout the app

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts (with optional search and tag filters)
- `POST /api/posts` - Create a new post (requires authentication)
- `GET /api/posts/[id]` - Get a specific post
- `PUT /api/posts/[id]` - Update a post (requires authentication)
- `DELETE /api/posts/[id]` - Delete a post (requires authentication)

### Tags
- `POST /api/gemini/tags` - Generate tags for content (placeholder for Gemini API)

## Usage

### Authentication
1. Click "Sign In" in the navigation bar
2. Choose your preferred sign-in method
3. Complete the authentication process
4. You'll now see your profile and can create posts

### Creating a Post
1. Sign in to your account
2. Navigate to `/create-post`
3. Fill in the title, content, author, and tags
4. Click "Create Post" to save

### Viewing Posts
- Home page shows recent posts
- `/posts` shows all posts in a grid layout
- Click on any post to view full details

### Features
- **Search**: Use the search functionality to find posts by title, content, or author
- **Tags**: Filter posts by tags
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Authentication**: Secure post creation and management

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/blog-app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `MONGODB_URI` - Your production MongoDB connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Comments system
- [ ] Rich text editor
- [ ] Image uploads
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Email notifications
- [ ] Social sharing
- [ ] User roles and permissions
- [ ] Post drafts and scheduling
