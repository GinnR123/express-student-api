// Inserts sample data into your Atlas database so the endpoints have real data.
// Run from the project root:  node scripts/seed.js
// Safe to run more than once (it upserts instead of duplicating).
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const students = [
  { name: "Alice", email: "alice@example.com", age: 20 },
  { name: "Bob", email: "bob@example.com", age: 22 },
  { name: "Charlie", email: "charlie@example.com", age: 21 },
  { name: "Diana", email: "diana@example.com", age: 23 },
  { name: "Evan", email: "evan@example.com", age: 20 },
];

const courses = [
  { code: "WEB101", title: "Intro to Web Development", credits: 3 },
  { code: "DB201", title: "Databases", credits: 3 },
  { code: "JS301", title: "Advanced JavaScript", credits: 4 },
];

// [student email, course code, status, grade]
const enrollments = [
  ["alice@example.com", "WEB101", "completed", 92],
  ["bob@example.com", "WEB101", "completed", 78],
  ["charlie@example.com", "WEB101", "completed", 85],
  ["diana@example.com", "WEB101", "enrolled"],
  ["alice@example.com", "DB201", "completed", 88],
  ["bob@example.com", "DB201", "completed", 95],
  ["evan@example.com", "DB201", "completed", 70],
  ["charlie@example.com", "DB201", "dropped"],
  ["diana@example.com", "JS301", "completed", 90],
  ["evan@example.com", "JS301", "enrolled"],
  ["alice@example.com", "JS301", "enrolled"],
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const studentIds = {};
  for (const s of students) {
    // $setOnInsert keeps any students you already have (e.g. Bob, Charlie) untouched
    const doc = await Student.findOneAndUpdate(
      { email: s.email },
      { $setOnInsert: { ...s, isActive: true } },
      { upsert: true, returnDocument: "after" },
    );
    studentIds[s.email] = doc._id;
  }

  const courseIds = {};
  for (const c of courses) {
    const doc = await Course.findOneAndUpdate(
      { code: c.code },
      { $setOnInsert: c },
      { upsert: true, returnDocument: "after" },
    );
    courseIds[c.code] = doc._id;
  }

  for (const [email, code, status, grade] of enrollments) {
    const set = { status };
    if (grade !== undefined) set.grade = grade;
    await Enrollment.updateOne(
      { student: studentIds[email], course: courseIds[code] },
      { $set: set, $setOnInsert: { enrolledAt: new Date() } },
      { upsert: true },
    );
  }

  console.log(
    `Seed complete: ${await Student.countDocuments()} students, ` +
      `${await Course.countDocuments()} courses, ` +
      `${await Enrollment.countDocuments()} enrollments`,
  );
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
