const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Quiz = require('../../models/Quiz');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate new quiz
router.post('/generate', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });

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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const quizData = JSON.parse(completion.choices[0].message.content);
    
    const quiz = new Quiz({
      userId: req.user.id,
      topic,
      questions: quizData.questions
    });

    await quiz.save();
    
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
    res.status(500).json({ error: 'Failed to generate quiz' });
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