const express = require("express");
const bcrypt = require("bcryptjs");
const User  = require("../models/userModel");
const { generateToken } = require("../utils/generateToken.js");
const isAuthenticated = require("../middleware/isAuthenticated");
const requireAdmin = require("../middleware/requireAdmin");
const router = express.Router();

router.get("/check/:email", async (req, res) => {
  console.log('Checking user for email:', req.params.email); 
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.json({ exists: true },user);
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/allusers', isAuthenticated, requireAdmin, async(req,res)=>{
   try {
    const data=await User.find({role:'student'})
    res.status(200).json({
        data
    })
   } catch (error) {
 res.json({
    message:error.message
 })   
   }
})

router.get("/registration-options", async (_, res) => {
    try {
        const adminExists = await User.exists({ role: "admin" });
        res.status(200).json({ adminRegistrationOpen: !adminExists });
    } catch (error) {
        res.status(500).json({ message: "Unable to load registration options." });
    }
});

router.get("/profile", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.id).select("name email role photoUrl address mobileNumber techStack bio");
        if (!user) return res.status(404).json({ message: "User not found." });
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ message: "Unable to load profile." });
    }
});

router.patch("/profile", isAuthenticated, async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        if (!name) return res.status(400).json({ message: "Name is required." });

        const techStack = Array.isArray(req.body.techStack)
            ? req.body.techStack
            : String(req.body.techStack || "").split(",");
        const profile = {
            name,
            address: String(req.body.address || "").trim(),
            mobileNumber: String(req.body.mobileNumber || "").trim(),
            techStack: techStack.map((item) => String(item).trim()).filter(Boolean).slice(0, 20),
            bio: String(req.body.bio || "").trim(),
        };

        const user = await User.findByIdAndUpdate(req.id, { $set: profile }, { new: true, runValidators: true })
            .select("name email role photoUrl address mobileNumber techStack bio");
        if (!user) return res.status(404).json({ message: "User not found." });
        return res.status(200).json({ success: true, message: "Profile updated successfully.", user });
    } catch (error) {
        return res.status(500).json({ message: "Unable to update profile." });
    }
});
router.post("/complete-course", async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({ message: "User ID and Course ID are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Add course to completedCourses if not already present
        if (!user.completedCourses.includes(courseId)) {
            user.completedCourses.push(courseId);
            await user.save();
        }

        res.status(200).json({ message: "Course marked as completed.", completedCourses: user.completedCourses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});

router.post('/', async (req,res) => {
    try {
        const { name, email, role, photoUrl } = req.body;
      
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ message: 'User already exists' });
        } 

        user = new User({
            name,
            email,
            role,
            photoUrl
          });
          
          await user.save();
          
          res.json({ success: true, user });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log("Request body:", req.body);

        if (!name || !email || !password) {
            console.log("Missing fields");
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const user = await User.findOne({ email });
        console.log("User lookup:", user);

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully");

        const normalizedRole = role || "student";
        if (!["admin", "student", "instructor"].includes(normalizedRole)) {
            return res.status(400).json({
                success: false,
                message: "Role must be admin, student, or instructor."
            });
        }

        if (normalizedRole === "admin") {
            await User.init();
            const adminExists = await User.exists({ role: "admin" });
            if (adminExists) {
                return res.status(403).json({
                    success: false,
                    message: "An administrator account already exists."
                });
            }
        }

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: normalizedRole,
            ...(normalizedRole === "admin" ? { adminSlot: "primary" } : {})
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully."
        });
    } catch (error) {
        if (error?.code === 11000 && role === "admin") {
            return res.status(403).json({
                success: false,
                message: "An administrator account already exists."
            });
        }
        console.log("Error in register:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }

        // Check if user.password is defined
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "User password is missing"
            });
        }

        // Compare the provided password with the stored hash
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }

        // Generate token and send response
        generateToken(res, user, `Welcome back ${user.name}`);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        });
    }
};
const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        });
    }
};
router.get("/course/:userId/", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("enrolledCourses");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ enrolledCourses: user.enrolledCourses });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  router.get("/courseCompleted/:userId/", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("completedCourses");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ completedCourses: user.completedCourses });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
