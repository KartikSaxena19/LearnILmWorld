import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

// 1. GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// 2. POST (Create) a new course 
router.post("/", async (req, res) => {
  try {
    const DEFAULT_USER_ID = "65a9f1234567890abcdef123"


    const newCourse = new Course({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      videoUrl: req.body.videoUrl,
      pdfUrl: req.body.pdfUrl,
      createdBy: req.user ? req.user._id : DEFAULT_USER_ID
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(500).json({ message: "Error creating course" });
  }
});


// GET Single Course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course details" });
  }
});

export default router;