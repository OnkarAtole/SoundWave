const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getUploadSignature,
    uploadSong,
    getSongs,
    getSong,
    deleteSong,
    searchSongs
} = require('../controllers/songController');

// Signature route for direct upload to Cloudinary from Frontend
router.get("/signature", protect, admin, getUploadSignature);

// Save song metadata (already uploaded to Cloudinary on frontend)
router.post("/", protect, admin, uploadSong);

router.get("/", getSongs);
router.get("/search", searchSongs);
router.get("/:id", getSong);
router.delete("/:id", protect, admin, deleteSong);

module.exports = router;