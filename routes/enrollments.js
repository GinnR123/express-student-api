const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");
const requireAuth = require("../middleware/auth");

// GET /api/enrollments
// Without populate() this returns raw ObjectIds for "student" and "course".
// populate() with field selection swaps them for the data the frontend needs.
router.get("/", requireAuth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email")
      .populate("course", "title code credits")
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/enrollments  { student, course, status?, grade? }
router.post("/", requireAuth, async (req, res) => {
  try {
    const { student, course, status, grade } = req.body;

    const [studentExists, courseExists] = await Promise.all([
      Student.exists({ _id: student }),
      Course.exists({ _id: course }),
    ]);
    if (!studentExists) return res.status(404).json({ error: "Student not found" });
    if (!courseExists) return res.status(404).json({ error: "Course not found" });

    const enrollment = await Enrollment.create({ student, course, status, grade });
    res.status(201).json(enrollment);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Student is already enrolled in this course" });
    }
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
