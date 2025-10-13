const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is required');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Generate educational content
router.post('/generate', async (req, res) => {
  try {
    const { technology } = req.body;
    if (!technology) return res.status(400).json({ error: 'Technology is required' });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const prompt = `Create a comprehensive, detailed educational guide about ${technology}. 
    
    Structure the content as follows:
    1. Introduction and Overview
    2. Key Concepts and Features
    3. Getting Started / Installation
    4. Core Fundamentals
    5. Best Practices
    6. Common Use Cases
    7. Advanced Topics
    8. Learning Resources and Next Steps
    
    Make it detailed, accurate, and suitable for someone who wants to learn ${technology} from scratch to an intermediate level. 
    Use clear explanations, practical examples, and actionable advice. 
    Write in a conversational, engaging tone that makes complex topics accessible.
    Aim for approximately 1500-2000 words of comprehensive content.`;

    console.log('Generating content for technology:', technology);
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    console.log('Content generated successfully');
    res.set('Content-Type', 'text/plain');
    res.send(content);
  } catch (error) {
    console.error('Content generation error:', error);
    if (error.message?.includes('quota')) {
      res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
    } else if (error.message?.includes('API key')) {
      res.status(401).json({ error: 'Invalid API key configuration' });
    } else {
      res.status(500).json({ error: 'Failed to generate content. Please try again.' });
    }
  }
});

module.exports = router;