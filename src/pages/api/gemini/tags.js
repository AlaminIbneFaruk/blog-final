// 🤖 GEMINI API INTEGRATION
// This API route generates tags for blog posts using Google's Gemini AI
// 🔧 SETUP REQUIRED: Get your Gemini API key from https://makersuite.google.com/app/apikey

export default async function handler(req, res) {
  // 🔒 METHOD VALIDATION
  // Only allow POST requests for tag generation
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // 📝 REQUEST VALIDATION
    // Extract content from request body
    const { content } = req.body;

    // ⚠️ CONTENT VALIDATION
    // Ensure content is provided for tag generation
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // 🔧 OPTIONAL: Add content length validation
    if (content.length < 10) {
      return res.status(400).json({ 
        message: 'Content must be at least 10 characters long for tag generation' 
      });
    }

    // 🔧 OPTIONAL: Add content length limit
    if (content.length > 10000) {
      return res.status(400).json({ 
        message: 'Content too long for tag generation (max 10,000 characters)' 
      });
    }

    // 🤖 TAG GENERATION
    // Call Gemini API to generate tags
    const suggestedTags = await generateTagsWithGemini(content);

    return res.status(200).json({ tags: suggestedTags });
  } catch (error) {
    console.error('Error generating tags:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// 🤖 GEMINI API INTEGRATION FUNCTION
// This function calls the actual Gemini API to generate tags
async function generateTagsWithGemini(content) {
  // 🔑 API KEY SETUP
  // Get your Gemini API key from environment variables
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  // ⚠️ API KEY VALIDATION
  // Check if API key is configured
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not found in environment variables');
    // Fall back to basic tag generation
    return generateBasicTags(content);
  }

  try {
    // 🤖 ACTUAL GEMINI API CALL
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate 5 relevant tags for this blog post content. Return only the tags separated by commas, no explanations. Make sure tags are relevant to the content and useful for SEO:\n\n${content}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 100,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    const tags = generatedText
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0 && tag.length <= 20)
      .slice(0, 5); // Return max 5 tags

    console.log('🤖 Gemini generated tags:', tags);
    return tags;
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fall back to basic tag generation on API error
    return generateBasicTags(content);
  }
}

// 🔧 BASIC TAG GENERATION (FALLBACK)
// Simple keyword-based tag generation when Gemini API is not available
function generateBasicTags(content) {
  // 📚 COMMON BLOG TAGS
  // Add or modify these tags based on your blog's topics
  const commonTags = [
    'technology', 'programming', 'web-development', 'javascript', 
    'react', 'nextjs', 'tutorial', 'tips', 'coding', 'software',
    'design', 'ui', 'ux', 'frontend', 'backend', 'database',
    'api', 'testing', 'deployment', 'performance', 'security',
    'mobile', 'responsive', 'accessibility', 'seo', 'marketing',
    'ai', 'machine-learning', 'data-science', 'cloud', 'devops'
  ];
  
  // 🔍 KEYWORD EXTRACTION
  // Simple keyword matching (you can improve this algorithm)
  const words = content.toLowerCase().split(/\s+/);
  const suggestedTags = [];
  
  // 🏷️ TAG MATCHING
  // Check if any common tags appear in the content
  commonTags.forEach(tag => {
    if (words.some(word => word.includes(tag) || tag.includes(word))) {
      suggestedTags.push(tag);
    }
  });
  
  // 🔧 ENHANCED: Extract keywords using frequency analysis
  const keywords = extractKeywords(content);
  suggestedTags.push(...keywords);
  
  // 📊 RETURN TOP TAGS
  // Return up to 5 most relevant tags
  return [...new Set(suggestedTags)].slice(0, 5);
}

// 🔧 ENHANCED TAG GENERATION
// Extract keywords using frequency analysis
function extractKeywords(content) {
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && word.length < 15);
  
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([word]) => word);
}

// 🔧 OPTIONAL: ENHANCED TAG GENERATION
// You can add more sophisticated tag generation methods here

// Example: Use a pre-trained model for tag generation
// async function generateTagsWithModel(content) {
//   // Implement with libraries like natural, compromise, etc.
//   // This would require additional dependencies
// } 