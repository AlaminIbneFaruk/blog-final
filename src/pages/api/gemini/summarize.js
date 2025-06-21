// 🤖 GEMINI API INTEGRATION - CONTENT SUMMARIZATION
// This API route generates summaries for blog posts using Google's Gemini AI
// 🔧 SETUP REQUIRED: Get your Gemini API key from https://makersuite.google.com/app/apikey

export default async function handler(req, res) {
  // 🔒 METHOD VALIDATION
  // Only allow POST requests for summarization
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // 📝 REQUEST VALIDATION
    // Extract content from request body
    const { content, maxLength = 150 } = req.body;

    // ⚠️ CONTENT VALIDATION
    // Ensure content is provided for summarization
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // 🔧 CONTENT LENGTH VALIDATION
    if (content.length < 20) {
      return res.status(400).json({ 
        message: 'Content must be at least 20 characters long for summarization' 
      });
    }

    if (content.length > 50000) {
      return res.status(400).json({ 
        message: 'Content too long for summarization (max 50,000 characters)' 
      });
    }

    // 🤖 SUMMARIZATION
    // Call Gemini API to generate summary
    const summary = await generateSummaryWithGemini(content, maxLength);

    return res.status(200).json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// 🤖 GEMINI API INTEGRATION FUNCTION
// This function calls the actual Gemini API to generate summaries
async function generateSummaryWithGemini(content, maxLength) {
  // 🔑 API KEY SETUP
  // Get your Gemini API key from environment variables
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  // ⚠️ API KEY VALIDATION
  // Check if API key is configured
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not found in environment variables');
    // Fall back to basic summarization
    return generateBasicSummary(content, maxLength);
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
            text: `Generate a concise summary of this blog post content in ${maxLength} characters or less. Focus on the main points and key takeaways. Return only the summary, no explanations:\n\n${content}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
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
    const summary = generatedText.trim();

    console.log('🤖 Gemini generated summary:', summary);
    return summary;
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fall back to basic summarization on API error
    return generateBasicSummary(content, maxLength);
  }
}

// 🔧 BASIC SUMMARIZATION (FALLBACK)
// Simple text truncation when Gemini API is not available
function generateBasicSummary(content, maxLength) {
  // Remove extra whitespace and newlines
  const cleanContent = content.replace(/\s+/g, ' ').trim();
  
  // If content is already short enough, return as is
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Truncate to maxLength and add ellipsis
  const truncated = cleanContent.substring(0, maxLength - 3);
  
  // Try to end at a complete word
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) { // Only break at word if it's not too early
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
} 