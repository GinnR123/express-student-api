const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const requireAuth = require("../middleware/auth");

// GET /api/stats/courses
// Top 5 courses by average grade, using only completed enrollments.
router.get("/courses", requireAuth, async (req, res) => {
  try {
    const stats = await Enrollment.aggregate([
      // 1. Filter first so later stages only process the documents we need
      { $match: { status: "completed", grade: { $ne: null } } },

      // 2. One result per course
      {
        $group: {
          _id: "$course",
          completedCount: { $sum: 1 },
          averageGrade: { $avg: "$grade" },
          highestGrade: { $max: "$grade" },
        },
      },

      // 3. Join the course details (collection name is the pluralized model name)
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },

      // 4. Shape the output
      {
        $project: {
          _id: 0,
          courseId: "$_id",
          code: "$course.code",
          title: "$course.title",
          completedCount: 1,
          averageGrade: { $round: ["$averageGrade", 1] },
          highestGrade: 1,
        },
      },

      // 5. Best courses first, top 5 only
      { $sort: { averageGrade: -1 } },
      { $limit: 5 },
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
