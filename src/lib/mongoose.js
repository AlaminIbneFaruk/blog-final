import mongoose from 'mongoose';

// 🔧 CHANGE REQUIRED: Set your MongoDB connection string
// Replace this with your actual MongoDB URI from your .env.local file
const MONGODB_URI = process.env.MONGODB_URI;

// ⚠️ ERROR HANDLING: This will throw an error if MONGODB_URI is not set
// Make sure to add MONGODB_URI to your .env.local file
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

console.log('🔧 MongoDB URI found:', MONGODB_URI ? '✅ Set' : '❌ Not set');

// 🔄 CONNECTION CACHING: Prevents multiple connections in development
// No changes needed here - this is for performance optimization
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
  console.log('🔄 Initializing MongoDB connection cache');
}

// 🔌 DATABASE CONNECTION FUNCTION
// This function handles connecting to MongoDB with caching
async function connectDB() {
  console.log('🔌 Attempting to connect to MongoDB...');
  
  // If already connected, return existing connection
  if (cached.conn) {
    console.log('✅ Using existing MongoDB connection');
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    console.log('🔄 Creating new MongoDB connection promise...');
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
    };

    // 🔧 OPTIONAL: Add more MongoDB connection options here
    // Example: Add authentication, SSL, etc.
    // const opts = {
    //   bufferCommands: false,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   ssl: true,
    //   sslValidate: false,
    // };

    console.log('🔧 MongoDB connection options:', opts);

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
        console.log('🔗 Connection state:', mongoose.connection.readyState);
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
        console.error('🔍 Connection details:', {
          uri: MONGODB_URI ? 'Set (hidden for security)' : 'Not set',
          error: error.name,
          code: error.code,
          message: error.message
        });
        throw error;
      });
  }

  try {
    console.log('⏳ Waiting for MongoDB connection...');
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connection established and cached');
    return cached.conn;
  } catch (e) {
    console.error('❌ Failed to establish MongoDB connection:', e.message);
    cached.promise = null;
    throw e;
  }
}

export default connectDB; 