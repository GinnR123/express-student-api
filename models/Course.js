const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    credits: { type: Number, default: 3, min: 1 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);
