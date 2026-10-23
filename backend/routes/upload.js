const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const baseName = (path.basename(file.originalname, ext) || 'marble_product').replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `marble_${baseName}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) are allowed.'));
    }
  }
});

// POST /api/upload - Accepts single or multiple images
router.post('/', authenticateToken, requireAdmin, upload.any(), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No photo selected from gallery.' });
    }

    const fileUrls = req.files.map(f => `/uploads/${f.filename}`);

    res.json({
      success: true,
      message: 'Photo uploaded successfully from gallery!',
      url: fileUrls[0],
      urls: fileUrls,
      filename: req.files[0].filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error uploading gallery photo.' });
  }
});

module.exports = router;
