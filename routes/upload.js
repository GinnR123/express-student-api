const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");
const requireAuth = require("../middleware/auth");

router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // upload_stream is used because the file is a buffer in memory, not on disk.
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "lesson7_uploads" },
        (error, result) => (error ? reject(error) : resolve(result)),
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- STRETCH CHALLENGE (optional): delete an upload ----
// Send the publicId with "/" encoded as %2F, e.g.
// DELETE /api/upload/lesson7_uploads%2Fabc123
router.delete("/:publicId", requireAuth, async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.publicId);

    if (result.result !== "ok") {
      return res.status(404).json({ error: "Image not found" });
    }

    res.json({ message: "Image deleted successfully", publicId: req.params.publicId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
