const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    courseLevel: {
        type: String,
        enum: ["Beginner", "Medium", "Advance"]

    },
    coursePrice: {
        type: Number
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    courseDuration: {
        type: String,
        required: true
    },
    category:{
       type: String
    },
    courseDesc: {
        type: String,
        required: true
    },
    coursePic: {
        id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    enrolledUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'

        }
    ],


}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
