const express = require('express');
const Certificate = require('../models/certificateModel');
const router = express.Router();
const Course = require('../models/courseModel');
const User=require('../models/userModel')


router.post('/', async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({ message: 'User ID and Course ID are required' });
        }

        let certificate = await Certificate.findOne({ userId, courseId });

        if (!certificate) {
            certificate = new Certificate({ userId, courseId });
            await certificate.save();
        }
        const user = await User.findById(userId).select('name email');
        const course = await Course.findById(courseId).select('courseName');

        if (!user || !course) {
            return res.status(404).json({ message: 'User or Course not found' });
        }

        res.status(200).json({ certificate, user, course });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});



module.exports = router;
