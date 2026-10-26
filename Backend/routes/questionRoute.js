const express = require('express');
const router = express.Router();
const Question = require('../models/questionModel.js');
const QuizAttempt = require('../models/quizeattempt.js');

// Add new question
router.post('/add', async (req, res) => {
    const { courseId, userId, question, options, correctAnswer, maxScore, totalQuestions, passingScore } = req.body;

    try {
        const newQuestion = new Question({ 
            courseId, 
            userId, 
            question, 
            options, 
            correctAnswer, 
            maxScore, 
            totalQuestions, 
            passingScore 
        });

        await newQuestion.save();
        res.status(201).json({ 
            message: 'Question added successfully', 
            question: newQuestion 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all questions for a course
router.get('/:courseId', async (req, res) => {
    try {
        const questions = await Question.find({ courseId: req.params.courseId });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a question
router.delete('/delete/:id', async (req, res) => {
    try {
        const questionId = req.params.id;
        await Question.findByIdAndDelete(questionId);
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Submit Quiz
router.post('/submit-quiz', async (req, res) => {
    const { userId, courseId, answers } = req.body;
    try {
        const questions = await Question.find({ courseId });
        let score = 0;
        let passingScore = 0;

        questions.forEach(q => {
            if (answers[q._id] === q.correctAnswer) {
                score += q.maxScore;
            }
            passingScore = q.passingScore; 
        });

        const quizAttempt = new QuizAttempt({ userId, courseId, score });
        await quizAttempt.save();

        res.json({ 
            message: 'Quiz submitted', 
            score, 
            passingScore, 
            passed: score >= passingScore 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





router.get("/quiz-result/:userId/:courseId", async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        
        const attempt = await QuizAttempt.findOne({ userId, courseId });
        const questions = await Question.find({ courseId });

        if (!attempt || questions.length === 0) {
            return res.json({ score: 0, passingScore: 0, passed: false }); 
        }

        const score = attempt.score;
        const passingScore = questions[0].passingScore;

        res.json({ score, passingScore, passed: score >= passingScore }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





//certificate generation


module.exports = router;
