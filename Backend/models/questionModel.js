const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    maxScore: { type: Number, required: true },
    totalQuestions: { type: Number }, 
    passingScore: { type: Number } 
});

module.exports = mongoose.model('Question', QuestionSchema);
