const express = require('express');
const { deleteMediaFromCloudinary } = require('../utils/cloudinary');
const router = express.Router();
const Course = require('../models/courseModel');
const Lecture = require('../models/lessonModel');

// Fetch a course and its lessons. A newly created course is valid even without lessons.
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "creator",
      select: "name email photoUrl",
    });
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    const lectures = await Lecture.find({ course: course._id });
    res.status(200).json({
      message: 'Course details fetched successfully',
      course,
      lectures,
      instructor: course.creator,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch course details', error: error.message });
  }
});

// Fetch all videos and highlight a specific one
router.get("/lessons/:id", async (req, res) => {
  try {
    const lecture = await Lecture.findOne({ "lessons._id": req.params.id }, { "lessons.$": 1 });
    if (!lecture) return res.status(404).json({ message: 'Lesson not found.' });
    const allLectures = await Lecture.find({ course: lecture.course });
    res.status(200).json({
      message: 'Videos with specific video highlighted',
      allLectures,
      playingLecture: lecture,
    });
  } catch (error) {
    res.status(400).json({ message: 'Unable to fetch video: ' + error.message });
  }
});

router.delete("/delete-lesson/:lectureId/:lessonId", async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    const lessonIndex = lecture.lessons.findIndex((lesson) => lesson.id === req.params.lessonId);
    if (lessonIndex === -1) return res.status(404).json({ message: "Lesson not found in the lecture" });

    await deleteMediaFromCloudinary(lecture.lessons[lessonIndex].id);
    lecture.lessons.splice(lessonIndex, 1);
    await lecture.save();
    res.status(200).json({ message: "Lesson removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in removing lesson: " + error.message });
  }
});

module.exports = router;
