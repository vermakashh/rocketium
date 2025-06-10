const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const canvasController = require("../controllers/canvasController");

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.post("/init", canvasController.initCanvas);
router.post("/add", canvasController.addElement);
router.get("/export", canvasController.exportPDF);
router.post("/upload", upload.single("image"), canvasController.uploadImage);

module.exports = router;
