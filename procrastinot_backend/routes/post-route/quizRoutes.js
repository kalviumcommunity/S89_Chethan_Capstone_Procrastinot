const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Quiz = require('../../models/Quiz');

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate new quiz
router.post('/generate', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const prompt = `Create a 5-question multiple choice quiz about "${topic}". 
    Return ONLY a valid JSON object with this structure:
    {
      "questions": [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0
        }
      ]
    }
    Make questions engaging and educational. correctAnswer should be the index (0-3) of the correct option.`;

    console.log('Generating quiz for topic:', topic);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    });

    const responseContent = completion.choices[0].message.content;
    console.log('OpenAI response:', responseContent);
    
    let quizData;
    try {
      quizData = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return res.status(500).json({ error: 'Invalid response from AI service' });
    }

    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== 5) {
      console.error('Invalid quiz structure:', quizData);
      return res.status(500).json({ error: 'Invalid quiz structure received' });
    }
    
    const quiz = new Quiz({
      userId: req.user.id,
      topic,
      questions: quizData.questions
    });

    await quiz.save();
    console.log('Quiz saved successfully:', quiz._id);
    
    // Return quiz without correct answers for frontend
    const safeQuiz = {
      _id: quiz._id,
      topic: quiz.topic,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options
      }))
    };

    res.json(safeQuiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    if (error.code === 'insufficient_quota') {
      res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
    } else if (error.code === 'invalid_api_key') {
      res.status(401).json({ error: 'Invalid API key configuration' });
    } else {
      res.status(500).json({ error: 'Failed to generate quiz. Please try again.' });
    }
  }
});

// Submit quiz answers
router.post('/:id/submit', async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (quiz.completed) return res.status(400).json({ error: 'Quiz already completed' });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    quiz.userAnswers = answers;
    quiz.score = score;
    quiz.completed = true;
    quiz.completedAt = new Date();
    
    await quiz.save();

    res.json({
      score,
      total: quiz.questions.length,
      results: quiz.questions.map((q, i) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: answers[i],
        correct: answers[i] === q.correctAnswer
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;