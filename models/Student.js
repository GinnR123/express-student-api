const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  isActive: Boolean,
  // Embedded one-to-one: the Cloudinary image from the Lesson 7 upload route.
  avatar: {
    url: String,
    publicId: String,
  },
});

module.exports = mongoose.model("Student", studentSchema);
