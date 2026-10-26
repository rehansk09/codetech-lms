const express = require('express');
const { upload, uploadMediaToCloudinary } = require('../utils/cloudinary');
const router = express.Router();
const Course = require('../models/courseModel');
const User=require('../models/userModel')
const Lecture = require('../models/lessonModel');
const isAuthenticated = require('../middleware/isAuthenticated');
const requireAdmin = require('../middleware/requireAdmin');

const requireInstructor = async (req, res, next) => {
    const user = await User.findById(req.id).select('role');
    if (!user || user.role !== 'instructor') {
        return res.status(403).json({ message: 'Instructor access is required.' });
    }
    next();
};

// Fetch all courses
router.get("/", async (req, res) => {
    try {
        const data = await Course.find({}).
        populate('creator');
        res.status(200).json({
            message: "All Courses",
            data
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch courses", error: error.message });
    }
});
router.get('/dashboard', isAuthenticated, requireAdmin, async (req, res) => {
    try {
      const students = await User.countDocuments({ role: 'student' });
      const instructors = await User.countDocuments({ role: 'instructor' });
  
      console.log(students, instructors);
  
      const popularCourses = await Course.aggregate([
        {
          $project: {
            courseName: 1,
            courseLevel: 1,
            coursePrice: 1,
            enrolledUserCount: { $size: "$enrolledUsers" }, 
          }
        },
        {
          $sort: { enrolledUserCount: -1 } 
        },
        {
          $limit: 5 
        }
      ]);
  
      res.json({
        students,
        instructors,
        popularCourses
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });

// Fetch specific course
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Course ID is required" });

        const data = await Course.findById(id);
        if (!data) return res.status(404).json({ message: "Course not found" });

        res.status(200).json({
            message: "Specific Course",
            data
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch course", error: error.message });
    }
});

// Fetch Instructor Courses
router.get("/instructor/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Instructor ID is required" });

        const courses = await Course.find({ creator: id });

        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found for this instructor" });
        }

        res.status(200).json({
            message: "Instructor's courses fetched successfully",
            courses
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch courses", error: error.message });
    }
})


// Add new course
router.post("/add", isAuthenticated, requireInstructor, upload.single('file'), async (req, res) => {
    try {
        const { courseName, courseLevel, coursePrice, category, courseDuration, courseDesc } = req.body;
        if (!courseName || !courseDuration || !courseDesc) {
            return res.status(400).json({ message: "All fields are required" });
        }
 

        if (!req.file) return res.status(400).json({ message: "Course image is required" });

        const coursePic = req.file.path;
        const img_URL = await uploadMediaToCloudinary(coursePic);
        if (!img_URL?.public_id || !img_URL?.secure_url) {
            return res.status(502).json({ message: "Course image upload failed. Please try again." });
        }

        const data = await Course.create({
            courseName,
            courseLevel,    
            coursePrice,
            creator: req.id,
            category,
            courseDuration,
            courseDesc,
            coursePic: {
                id: img_URL.public_id,
                url: img_URL.secure_url
            }
        });

        const savedData = await data.save();
        res.status(200).json({
            message: "Course Added",
            courseId: savedData._id,
            courseDetails: savedData,
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to add Course: " + error.message
        });
    }
});

// Modify course info
router.post("/edit/:id", upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { courseName, courseLevel, coursePrice, creator, courseDuration, courseDesc } = req.body;
        if (!id || !courseName || !courseDuration || !courseDesc) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.file) return res.status(400).json({ message: "Course image is required" });

        const coursePic = req.file.path;
        const img_URL = await uploadMediaToCloudinary(coursePic);
        if (!img_URL?.public_id || !img_URL?.secure_url) {
            return res.status(502).json({ message: "Course image upload failed. Please try again." });
        }

        const data = await Course.findByIdAndUpdate(
            id,
            {
                courseName,
                courseLevel,
                coursePrice,
                creator,
                courseDuration,
                courseDesc,
                coursePic: {
                    id: img_URL.public_id,
                    url: img_URL.secure_url
                }
            },
            { new: true }
        );

        if (!data) return res.status(404).json({ message: "Course not found" });

        res.status(200).json({
            message: "Course Edited",
            data
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to edit Course: " + error.message
        });
    }
});
// Delete Course
router.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Lecture.deleteMany({ course: id });
      const course = await Course.deleteOne({ _id: id });
      if (course.deletedCount === 0) {
        return res.status(404).json({
          message: "Course not found",
        });
      }
  
      res.status(200).json({
        message: "Course removed successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error in removing course",
        error: error.message,
      });
    }
  });
  

// Add video lessons
router.post('/:id/add_lessons', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, isPreview } = req.body;

        if (!id || !title) {
            return res.status(400).json({ message: "Course ID and title are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Lesson video is required" });
        }

        const videoPath = req.file.path;
        const vid_URL = await uploadMediaToCloudinary(videoPath);

        if (!vid_URL?.secure_url || !vid_URL?.public_id) {
            return res.status(500).json({ message: "Failed to upload video" });
        }

        const newLesson = {
            id: vid_URL.public_id,
            title,
            video_URL: vid_URL.secure_url,
            isPreview
        };

        let lecture = await Lecture.findOne({ course: id });
        if (!lecture) {
            lecture = new Lecture({
                course: id,
                lessons: [newLesson]
            });
        } else {
            lecture.lessons.push(newLesson);
        }

        await lecture.save();
        res.status(200).json({ message: 'Lesson added', lecture });

    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: 'Error adding lesson', error });
    }
});


router.get('/instructors/revenue', isAuthenticated, requireAdmin, async (req, res) => {
    try {
       
        const instructorsRevenue = await Course.aggregate([
            {
                $project: {
                    creator: 1,
                    courseRevenue: {
                        $multiply: [{ $size: "$enrolledUsers" }, "$coursePrice"],
                    },totalStudents: { $size: "$enrolledUsers" },
                },
            },
            {
                $group: {
                    _id: "$creator",
                    totalRevenue: { $sum: "$courseRevenue" },
                    totalStudents: { $sum: "$totalStudents" },
                },
            },
        ]);

        for (let instructor of instructorsRevenue) {
            const user = await User.findById(instructor._id);
            instructor.userInfo = user ? { name: user.name, email: user.email } : null;
        }

        res.status(200).json({ success: true, data: instructorsRevenue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

//Intructor dashboard info
router.get('/total-students-revenue/:id', async (req, res) => {
    try {
      const {id} = req.params;
      const courses = await Course.find({ creator: id }).populate('creator');
      const courseInfo=courses[0].creator
      let totalStudents = 0;
      let totalRevenue = 0;
  
      courses.forEach((course) => {
        totalStudents += course.enrolledUsers.length;
        totalRevenue += course.coursePrice * course.enrolledUsers.length;
      });
  console.log(courseInfo)
      res.status(200).json({
        totalStudents,
        totalRevenue,
        courseInfo
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  router.get('/instructors/:instructorId/courses', isAuthenticated, requireAdmin, async (req, res) => {
    try {
        const { instructorId } = req.params;

        const courses = await Course.find({ creator: instructorId });

     
        if (courses.length === 0) {
            return res.status(404).json({ success: false, message: "No courses found for this instructor." });
        }

        const coursesWithRevenueAndStudents = courses.map(course => {
            const totalStudents = course.enrolledUsers.length; 
            const courseRevenue = totalStudents * course.coursePrice; 

            return {
                courseName: course.courseName,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseDuration: course.courseDuration,
                courseDesc: course.courseDesc,
                totalStudents, 
                totalRevenue: courseRevenue,  
            };
        });

        res.status(200).json({
            success: true,
            data: coursesWithRevenueAndStudents
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


  

module.exports = router;
