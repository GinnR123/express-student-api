const mongoose = require("mongoose");

// Join collection for the Student <-> Course many-to-many relationship.
// It holds metadata (status, grade, enrolledAt) that belongs to the pair.
const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  status: {
    type: String,
    enum: ["enrolled", "completed", "dropped"],
    default: "enrolled",
  },
  grade: { type: Number, min: 0, max: 100 },
  enrolledAt: { type: Date, default: Date.now },
});

// A student can enroll in a given course only once.
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
// Supports the $match stage of the stats aggregation.
enrollmentSchema.index({ status: 1 });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
